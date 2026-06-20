/**
 * Artificial Swarm v3 - Core Venture Schema
 * Defines the enhanced venture structure with agent swarms, memory, and workflow capabilities
 */

class Venture {
  constructor(config = {}) {
    this.id = crypto.randomUUID?.() || `venture_${Date.now()}`;
    
    this.metadata = {
      name: config.name || 'Unnamed Venture',
      objective: config.objective || '',
      createdAt: new Date().toISOString(),
      owner: config.owner || 'system'
    };

    this.status = {
      phase: 'planning',
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
      revenue: config.budget || 0,
      roi: 0,
      tasksCompleted: 0,
      agentActions: 0
    };

    this.workflow = {
      graph: [],
      currentNode: null,
      executionHistory: []
    };
  }

  addAgent(agent) {
    this.swarm.agents.push(agent);
    return agent.id;
  }

  getAgent(roleOrId) {
    return this.swarm.agents.find(a => a.role === roleOrId || a.id === roleOrId);
  }

  addTask(task) {
    task.id = task.id || `task_${Date.now()}`;
    task.createdAt = new Date().toISOString();
    task.status = 'pending';
    this.swarm.activeTasks.push(task);
    return task.id;
  }

  updateTaskStatus(taskId, status, result = null) {
    const task = this.swarm.activeTasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.result = result;
      task.completedAt = new Date().toISOString();
      
      if (status === 'completed') {
        this.swarm.completedTasks.push(task);
        this.swarm.activeTasks = this.swarm.activeTasks.filter(t => t.id !== taskId);
        this.analytics.tasksCompleted++;
        this.status.progress = Math.min(100, this.status.progress + 5);
      } else if (status === 'failed') {
        this.swarm.failedTasks.push(task);
        this.swarm.activeTasks = this.swarm.activeTasks.filter(t => t.id !== taskId);
      }
    }
    return task;
  }

  addMemory(type, content) {
    const memoryEntry = {
      id: `mem_${Date.now()}`,
      type,
      content,
      timestamp: new Date().toISOString()
    };

    if (type === 'short-term') {
      this.memory.shortTerm.push(memoryEntry);
      if (this.memory.shortTerm.length > 100) {
        this.memory.shortTerm.shift();
      }
    } else if (type === 'long-term') {
      this.memory.longTerm.push(memoryEntry);
    }

    return memoryEntry.id;
  }

  recordAction(agentId, action, details) {
    const actionLog = {
      timestamp: new Date().toISOString(),
      agentId,
      action,
      details
    };
    this.memory.shortTerm.push(actionLog);
    this.analytics.agentActions++;
    return actionLog;
  }

  setWorkflowGraph(nodes) {
    this.workflow.graph = nodes;
  }

  moveToNextPhase() {
    const phases = ['planning', 'research', 'execution', 'optimization', 'complete'];
    const currentIndex = phases.indexOf(this.status.phase);
    if (currentIndex < phases.length - 1) {
      this.status.phase = phases[currentIndex + 1];
      this.status.progress = Math.floor((currentIndex + 1) / phases.length * 100);
    }
  }

  export() {
    return {
      id: this.id,
      metadata: this.metadata,
      status: this.status,
      budget: this.budget,
      swarm: {
        agentCount: this.swarm.agents.length,
        activeTasks: this.swarm.activeTasks.length,
        completedTasks: this.swarm.completedTasks.length,
        failedTasks: this.swarm.failedTasks.length
      },
      analytics: this.analytics,
      workflow: this.workflow
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Venture;
}