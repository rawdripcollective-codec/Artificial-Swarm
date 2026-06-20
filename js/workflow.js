/**
 * Artificial Swarm v3 - Workflow Engine
 * DAG-based workflow execution with parallel tasks, retries, and branching
 */

class WorkflowNode {
  constructor(config) {
    this.id = config.id || `node_${Date.now()}`;
    this.name = config.name || 'Unnamed Node';
    this.type = config.type || 'task';
    this.dependsOn = config.dependsOn || [];
    this.agent = config.agent || null;
    this.status = 'pending';
    this.result = null;
    this.retries = 0;
    this.maxRetries = config.maxRetries || 3;
  }

  canExecute(completedNodes) {
    return this.dependsOn.every(depId => completedNodes.includes(depId));
  }
}

class WorkflowGraph {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.executionOrder = [];
    this.status = 'idle';
  }

  addNode(node) {
    this.nodes.push(node);
    return node.id;
  }

  addEdge(fromId, toId) {
    this.edges.push({ from: fromId, to: toId });
  }

  getExecutionOrder() {
    const visited = new Set();
    const order = [];

    const visit = (nodeId, visiting = new Set()) => {
      if (visited.has(nodeId)) return;
      if (visiting.has(nodeId)) throw new Error('Circular dependency detected');

      visiting.add(nodeId);
      const node = this.nodes.find(n => n.id === nodeId);
      
      if (node) {
        node.dependsOn.forEach(depId => visit(depId, visiting));
      }
      
      visiting.delete(nodeId);
      visited.add(nodeId);
      order.push(nodeId);
    };

    this.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        visit(node.id);
      }
    });

    this.executionOrder = order;
    return order;
  }

  async execute(agents) {
    this.status = 'running';
    const completedNodes = [];
    const results = {};
    const startTime = Date.now();

    try {
      for (const nodeId of this.executionOrder) {
        const node = this.nodes.find(n => n.id === nodeId);
        
        if (!node.canExecute(completedNodes)) {
          continue;
        }

        node.status = 'running';
        let retry = 0;
        let success = false;

        while (retry < node.maxRetries && !success) {
          try {
            if (node.agent && agents[node.agent]) {
              const result = await agents[node.agent].execute({ description: node.name });
              node.result = result;
              node.status = 'completed';
              results[nodeId] = result;
              success = true;
            } else {
              node.status = 'completed';
              results[nodeId] = { success: true, result: 'Node executed' };
              success = true;
            }
          } catch (error) {
            retry++;
            node.retries = retry;
            if (retry >= node.maxRetries) {
              node.status = 'failed';
              results[nodeId] = { success: false, error: error.message };
            }
          }
        }

        if (node.status === 'completed' || node.status === 'failed') {
          completedNodes.push(nodeId);
        }
      }

      this.status = 'completed';
      return {
        success: true,
        results,
        duration: Date.now() - startTime,
        executedNodes: completedNodes.length,
        totalNodes: this.nodes.length
      };
    } catch (error) {
      this.status = 'failed';
      return {
        success: false,
        error: error.message,
        results,
        duration: Date.now() - startTime
      };
    }
  }
}

const WORKFLOW_TEMPLATES = {
  STANDARD_MISSION: [
    new WorkflowNode({ id: 'plan', name: 'Mission Planning', agent: 'strategist' }),
    new WorkflowNode({ id: 'research', name: 'Research', agent: 'researcher', dependsOn: ['plan'] }),
    new WorkflowNode({ id: 'build', name: 'Build Solution', agent: 'builder', dependsOn: ['research'] }),
    new WorkflowNode({ id: 'validate', name: 'Validate', agent: 'validator', dependsOn: ['build'] }),
    new WorkflowNode({ id: 'deploy', name: 'Deploy', agent: 'operator', dependsOn: ['validate'] })
  ],
  PARALLEL_EXECUTION: [
    new WorkflowNode({ id: 'init', name: 'Initialize', agent: 'strategist' }),
    new WorkflowNode({ id: 'research1', name: 'Research Stream 1', agent: 'researcher', dependsOn: ['init'] }),
    new WorkflowNode({ id: 'research2', name: 'Research Stream 2', agent: 'researcher', dependsOn: ['init'] }),
    new WorkflowNode({ id: 'consolidate', name: 'Consolidate', agent: 'strategist', dependsOn: ['research1', 'research2'] })
  ]
};

function createWorkflow(template = 'STANDARD_MISSION') {
  const graph = new WorkflowGraph();
  const nodes = WORKFLOW_TEMPLATES[template] || WORKFLOW_TEMPLATES.STANDARD_MISSION;
  nodes.forEach(node => graph.addNode(node));
  return graph;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WorkflowNode,
    WorkflowGraph,
    WORKFLOW_TEMPLATES,
    createWorkflow
  };
}