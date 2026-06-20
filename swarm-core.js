/**
 * Artificial Swarm v3 - Core Engine
 * Agent Operating System Foundation
 */

class SwarmCore {
  constructor() {
    this.ventures = new Map();
    this.agents = new Map();
    this.taskQueue = [];
    this.scheduler = null;
    this.memory = new MemorySystem();
    this.workflowEngine = new WorkflowEngine();
    this.init();
  }

  init() {
    console.log('[SWARM] Initializing Artificial Swarm v3 Core Engine');
    this.scheduler = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.taskQueue.forEach(task => {
      if (task.status === 'pending') {
        this.executeTask(task);
      }
    });
  }

  createVenture(config) {
    const venture = new Venture(config);
    this.ventures.set(venture.id, venture);
    this.memory.store('venture_created', { id: venture.id, config });
    return venture;
  }

  deployAgent(ventureId, agentType) {
    const agent = AgentFactory.create(agentType);
    agent.ventureId = ventureId;
    this.agents.set(agent.id, agent);
    const venture = this.ventures.get(ventureId);
    if (venture) {
      venture.swarm.agents.push(agent.id);
    }
    return agent;
  }

  async executeTask(task) {
    task.status = 'running';
    task.startedAt = new Date();

    try {
      const agent = this.agents.get(task.assignedAgent);
      if (!agent) throw new Error('Agent not found');

      const result = await agent.execute(task);
      task.status = 'completed';
      task.result = result;

      const venture = this.ventures.get(task.ventureId);
      if (venture) {
        venture.swarm.completedTasks.push(task.id);
        venture.analytics.tasksCompleted++;
      }

      this.memory.store('task_completed', { taskId: task.id, result });
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      const venture = this.ventures.get(task.ventureId);
      if (venture) {
        venture.swarm.failedTasks.push(task.id);
      }
      this.memory.store('task_failed', { taskId: task.id, error: error.message });
    }
  }

  getVentureStatus(ventureId) {
    const venture = this.ventures.get(ventureId);
    return venture ? venture.getStatus() : null;
  }

  shutdown() {
    clearInterval(this.scheduler);
    console.log('[SWARM] Artificial Swarm Core Engine shutdown');
  }
}

/**
 * Venture - Core autonomous project
 */
class Venture {
  constructor(config) {
    this.id = crypto.randomUUID();
    this.metadata = {
      name: config.name || 'Unnamed Venture',
      objective: config.objective || '',
      createdAt: new Date().toISOString(),
      owner: config.owner || 'system'
    };

    this.status = {
      phase: 'planning', // planning → research → execution → optimization → complete
      progress: 0,
      health: 100,
      confidence: 0.95
    };

    this.budget = {
      maxTokens: config.maxTokens || 500000,
      maxSpend: config.maxSpend || 100,
      currentSpend: 0
    };

    this.swarm = {
      agents: [],
      activeTasks: [],
      completedTasks: [],
      failedTasks: []
    };

    this.memory = {
      shortTerm: [],
      longTerm: [],
      vectorStore: []
    };

    this.analytics = {
      revenue: 0,
      roi: 0,
      tasksCompleted: 0
    };

    this.workflowDAG = [];
  }

  getStatus() {
    return {
      id: this.id,
      metadata: this.metadata,
      status: this.status,
      analytics: this.analytics,
      agentCount: this.swarm.agents.length,
      taskCount: this.swarm.activeTasks.length
    };
  }

  updatePhase(newPhase) {
    this.status.phase = newPhase;
    this.status.progress = this.calculateProgress();
  }

  calculateProgress() {
    const phases = ['planning', 'research', 'execution', 'optimization', 'complete'];
    const phaseIndex = phases.indexOf(this.status.phase);
    return Math.round((phaseIndex / phases.length) * 100);
  }
}

/**
 * Agent Factory - Specialized agent creation
 */
const AgentFactory = {
  types: {
    strategist: StrategistAgent,
    researcher: ResearcherAgent,
    builder: BuilderAgent,
    validator: ValidatorAgent,
    operator: OperatorAgent
  },

  create(type, config = {}) {
    const AgentClass = this.types[type];
    if (!AgentClass) throw new Error(`Unknown agent type: ${type}`);
    return new AgentClass(config);
  }
};

/**
 * Base Agent Class
 */
class BaseAgent {
  constructor(type, config) {
    this.id = crypto.randomUUID();
    this.type = type;
    this.role = config.role || type;
    this.model = config.model || 'gpt-4';
    this.status = 'idle'; // idle → thinking → executing → complete
    this.ventureId = null;
    this.taskHistory = [];
    this.memory = [];
    this.tools = [];
  }

  async execute(task) {
    this.status = 'thinking';
    console.log(`[${this.role}] Executing: ${task.description}`);

    // Simulate agent thinking and execution
    await new Promise(resolve => setTimeout(resolve, 500));

    this.status = 'complete';
    this.taskHistory.push(task.id);

    return {
      agentId: this.id,
      taskId: task.id,
      result: `Completed by ${this.role}`,
      timestamp: new Date().toISOString()
    };
  }

  addMemory(entry) {
    this.memory.push({
      timestamp: new Date().toISOString(),
      content: entry
    });
  }
}

/**
 * Specialized Agents
 */
class StrategistAgent extends BaseAgent {
  constructor(config) {
    super('strategist', config);
    this.role = 'Strategic Planner';
    this.capabilities = ['mission_planning', 'goal_decomposition', 'prioritization', 'decision_making'];
  }

  async execute(task) {
    this.status = 'thinking';
    console.log(`[${this.role}] Planning mission: ${task.description}`);
    
    // Decompose mission into subtasks
    const plan = {
      missionId: task.id,
      phases: ['research', 'planning', 'execution', 'validation'],
      subtasks: [],
      estimatedDuration: '48 hours'
    };

    await new Promise(resolve => setTimeout(resolve, 800));
    this.status = 'complete';
    return plan;
  }
}

class ResearcherAgent extends BaseAgent {
  constructor(config) {
    super('researcher', config);
    this.role = 'Research Analyst';
    this.capabilities = ['internet_search', 'competitor_analysis', 'data_collection', 'trend_discovery'];
  }

  async execute(task) {
    this.status = 'thinking';
    console.log(`[${this.role}] Researching: ${task.description}`);
    
    const research = {
      query: task.description,
      sources: [],
      findings: [],
      confidence: 0.87
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    this.status = 'complete';
    return research;
  }
}

class BuilderAgent extends BaseAgent {
  constructor(config) {
    super('builder', config);
    this.role = 'Solution Builder';
    this.capabilities = ['code_generation', 'document_creation', 'automation_creation'];
  }

  async execute(task) {
    this.status = 'thinking';
    console.log(`[${this.role}] Building: ${task.description}`);
    
    const solution = {
      type: 'solution',
      artifacts: [],
      code: [],
      documentation: []
    };

    await new Promise(resolve => setTimeout(resolve, 1200));
    this.status = 'complete';
    return solution;
  }
}

class ValidatorAgent extends BaseAgent {
  constructor(config) {
    super('validator', config);
    this.role = 'Quality Validator';
    this.capabilities = ['fact_checking', 'quality_assurance', 'error_detection', 'risk_analysis'];
  }

  async execute(task) {
    this.status = 'thinking';
    console.log(`[${this.role}] Validating: ${task.description}`);
    
    const validation = {
      passed: true,
      errors: [],
      warnings: [],
      confidence: 0.95
    };

    await new Promise(resolve => setTimeout(resolve, 600));
    this.status = 'complete';
    return validation;
  }
}

class OperatorAgent extends BaseAgent {
  constructor(config) {
    super('operator', config);
    this.role = 'Workflow Operator';
    this.capabilities = ['task_execution', 'workflow_management', 'api_orchestration'];
  }

  async execute(task) {
    this.status = 'thinking';
    console.log(`[${this.role}] Executing workflow: ${task.description}`);
    
    const execution = {
      status: 'success',
      operations: [],
      metrics: {}
    };

    await new Promise(resolve => setTimeout(resolve, 700));
    this.status = 'complete';
    return execution;
  }
}

/**
 * Workflow Engine - DAG execution
 */
class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.executionHistory = [];
  }

  createWorkflow(config) {
    const workflow = {
      id: crypto.randomUUID(),
      name: config.name,
      nodes: config.nodes || [],
      edges: config.edges || [],
      status: 'created'
    };
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async executeWorkflow(workflowId, context = {}) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    console.log(`[WORKFLOW] Executing: ${workflow.name}`);
    workflow.status = 'running';

    const execution = {
      workflowId,
      startTime: new Date(),
      nodeResults: {},
      status: 'running'
    };

    try {
      for (const node of workflow.nodes) {
        execution.nodeResults[node.id] = await this.executeNode(node, context);
      }
      execution.status = 'completed';
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
    }

    execution.endTime = new Date();
    this.executionHistory.push(execution);
    workflow.status = 'idle';
    return execution;
  }

  async executeNode(node, context) {
    console.log(`[NODE] Executing: ${node.type}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { nodeId: node.id, status: 'completed' };
  }
}

/**
 * Memory System - Short-term, long-term, and embeddings
 */
class MemorySystem {
  constructor() {
    this.shortTerm = [];
    this.longTerm = [];
    this.embeddings = new Map();
    this.maxShortTermSize = 1000;
  }

  store(category, data) {
    const entry = {
      id: crypto.randomUUID(),
      category,
      data,
      timestamp: new Date().toISOString()
    };

    this.shortTerm.push(entry);

    if (this.shortTerm.length > this.maxShortTermSize) {
      const toArchive = this.shortTerm.shift();
      this.longTerm.push(toArchive);
    }

    return entry;
  }

  recall(category, limit = 10) {
    return this.shortTerm
      .filter(entry => entry.category === category)
      .slice(-limit);
  }

  archiveToLongTerm() {
    const threshold = new Date(Date.now() - 3600000); // 1 hour ago
    const toArchive = this.shortTerm.filter(e => new Date(e.timestamp) < threshold);
    this.shortTerm = this.shortTerm.filter(e => new Date(e.timestamp) >= threshold);
    this.longTerm.push(...toArchive);
    return toArchive.length;
  }

  getStats() {
    return {
      shortTermSize: this.shortTerm.length,
      longTermSize: this.longTerm.length,
      categories: [...new Set(this.shortTerm.map(e => e.category))]
    };
  }
}

/**
 * Task System
 */
class Task {
  constructor(config) {
    this.id = crypto.randomUUID();
    this.ventureId = config.ventureId;
    this.description = config.description;
    this.assignedAgent = config.assignedAgent;
    this.status = 'pending'; // pending → running → completed/failed
    this.priority = config.priority || 'normal';
    this.dependencies = config.dependencies || [];
    this.createdAt = new Date();
    this.startedAt = null;
    this.completedAt = null;
    this.result = null;
    this.error = null;
  }

  getDuration() {
    if (!this.startedAt || !this.completedAt) return null;
    return this.completedAt - this.startedAt;
  }
}

/**
 * Global Swarm Instance
 */
const SWARM = new SwarmCore();

// Export for use in UI
window.SwarmCore = SwarmCore;
window.Venture = Venture;
window.Task = Task;
window.AgentFactory = AgentFactory;
window.SWARM = SWARM;