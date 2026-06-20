/**
 * Artificial Swarm v3 - Task Scheduler
 * Manages task queues, priorities, and execution scheduling
 */

class TaskScheduler {
  constructor() {
    this.queue = [];
    this.executing = [];
    this.completed = [];
    this.failed = [];
    this.maxConcurrent = 3;
    this.isRunning = false;
  }

  enqueue(task) {
    task.id = task.id || `task_${Date.now()}`;
    task.priority = task.priority || 5;
    task.status = 'queued';
    task.createdAt = new Date().toISOString();
    
    this.queue.push(task);
    this.sortByPriority();
    return task.id;
  }

  sortByPriority() {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  async process(agent) {
    if (this.queue.length === 0) return;
    if (this.executing.length >= this.maxConcurrent) return;

    const task = this.queue.shift();
    task.status = 'executing';
    task.startedAt = new Date().toISOString();
    
    this.executing.push(task);

    try {
      const result = await agent.execute(task);
      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date().toISOString();
      
      this.completed.push(task);
      this.executing = this.executing.filter(t => t.id !== task.id);
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      task.failedAt = new Date().toISOString();
      
      this.failed.push(task);
      this.executing = this.executing.filter(t => t.id !== task.id);
    }
  }

  async start(agents) {
    this.isRunning = true;
    
    while (this.isRunning && (this.queue.length > 0 || this.executing.length > 0)) {
      const agentList = Object.values(agents);
      for (const agent of agentList) {
        if (this.queue.length > 0) {
          this.process(agent).catch(err => console.error('Task processing error:', err));
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.isRunning = false;
  }

  pause() {
    this.isRunning = false;
  }

  getStats() {
    return {
      queued: this.queue.length,
      executing: this.executing.length,
      completed: this.completed.length,
      failed: this.failed.length,
      total: this.queue.length + this.executing.length + this.completed.length + this.failed.length
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TaskScheduler };
}