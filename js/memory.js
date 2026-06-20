/**
 * Artificial Swarm v3 - Memory System
 * Provides short-term, long-term, and vector-based memory storage
 */

class MemoryStore {
  constructor() {
    this.shortTerm = [];
    this.longTerm = [];
    this.vectorStore = [];
    this.maxShortTerm = 100;
    this.maxLongTerm = 1000;
  }

  addShortTermMemory(content, metadata = {}) {
    const memory = {
      id: `stm_${Date.now()}`,
      content,
      metadata,
      timestamp: new Date().toISOString(),
      importance: metadata.importance || 5
    };
    
    this.shortTerm.push(memory);
    
    if (metadata.importance > 7) {
      this.promoteToLongTerm(memory);
    }
    
    while (this.shortTerm.length > this.maxShortTerm) {
      this.shortTerm.shift();
    }
    
    return memory.id;
  }

  addLongTermMemory(content, category = 'general', metadata = {}) {
    const memory = {
      id: `ltm_${Date.now()}`,
      content,
      category,
      metadata,
      timestamp: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      accessCount: 0
    };
    
    this.longTerm.push(memory);
    
    while (this.longTerm.length > this.maxLongTerm) {
      this.longTerm.sort((a, b) => a.accessCount - b.accessCount);
      this.longTerm.shift();
    }
    
    return memory.id;
  }

  promoteToLongTerm(memory) {
    this.addLongTermMemory(memory.content, 'promoted', { source: memory.id });
  }

  searchShortTerm(query) {
    return this.shortTerm.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchLongTerm(query, category = null) {
    let results = this.longTerm;
    
    if (category) {
      results = results.filter(m => m.category === category);
    }
    
    results = results.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );
    
    results.forEach(m => {
      m.accessCount++;
      m.lastAccessed = new Date().toISOString();
    });
    
    return results;
  }

  getRecent(count = 10) {
    return this.shortTerm.slice(-count).reverse();
  }

  getLongTermByCategory(category) {
    return this.longTerm.filter(m => m.category === category);
  }

  clear(type = 'all') {
    if (type === 'short-term' || type === 'all') {
      this.shortTerm = [];
    }
    if (type === 'long-term' || type === 'all') {
      this.longTerm = [];
    }
    if (type === 'vector' || type === 'all') {
      this.vectorStore = [];
    }
  }

  export() {
    return {
      shortTermCount: this.shortTerm.length,
      longTermCount: this.longTerm.length,
      shortTerm: this.shortTerm,
      longTerm: this.longTerm
    };
  }
}

const MEMORY_CATEGORIES = {
  DECISIONS: 'decisions',
  OBSERVATIONS: 'observations',
  LESSONS_LEARNED: 'lessonsLearned',
  ARTIFACTS: 'artifacts',
  CONVERSATIONS: 'conversations',
  TASK_RESULTS: 'taskResults',
  RESEARCH_FINDINGS: 'researchFindings'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MemoryStore,
    MEMORY_CATEGORIES
  };
}