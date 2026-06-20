/**
 * Artificial Swarm v3 - IndexedDB Persistence Layer
 * Persistent storage for ventures, agents, tasks, and memories
 */

class PersistenceManager {
  constructor(dbName = 'ArtificialSwarm', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.stores = {
      ventures: 'id',
      agents: 'id',
      tasks: 'id',
      logs: 'id',
      documents: 'id',
      memory: 'id'
    };
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('ventures')) {
          db.createObjectStore('ventures', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('agents')) {
          db.createObjectStore('agents', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('ventureId', 'ventureId', { unique: false });
          taskStore.createIndex('status', 'status', { unique: false });
        }
        if (!db.objectStoreNames.contains('logs')) {
          const logStore = db.createObjectStore('logs', { keyPath: 'id' });
          logStore.createIndex('timestamp', 'timestamp', { unique: false });
          logStore.createIndex('ventureId', 'ventureId', { unique: false });
        }
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('memory')) {
          const memStore = db.createObjectStore('memory', { keyPath: 'id' });
          memStore.createIndex('type', 'type', { unique: false });
          memStore.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  async saveVenture(venture) {
    return this._write('ventures', 'put', venture.export());
  }

  async getVenture(ventureId) {
    return this._read('ventures', 'get', ventureId);
  }

  async getAllVentures() {
    return this._read('ventures', 'getAll');
  }

  async saveTask(task) {
    return this._write('tasks', 'put', task);
  }

  async getTasksByVenture(ventureId) {
    return this._readIndex('tasks', 'ventureId', ventureId);
  }

  async saveLog(logEntry) {
    const entry = {
      id: `log_${Date.now()}_${Math.random()}`,
      ...logEntry,
      timestamp: new Date().toISOString()
    };
    return this._write('logs', 'put', entry);
  }

  async getLogsByVenture(ventureId, limit = 100) {
    const logs = await this._readIndex('logs', 'ventureId', ventureId);
    return logs.slice(-limit);
  }

  async saveMemory(memory) {
    return this._write('memory', 'put', memory);
  }

  async getMemoriesByType(type) {
    return this._readIndex('memory', 'type', type);
  }

  async getMemoriesByCategory(category) {
    return this._readIndex('memory', 'category', category);
  }

  async saveDocument(document) {
    const doc = {
      id: document.id || `doc_${Date.now()}`,
      ...document,
      savedAt: new Date().toISOString()
    };
    return this._write('documents', 'put', doc);
  }

  async getDocument(docId) {
    return this._read('documents', 'get', docId);
  }

  async getAllDocuments() {
    return this._read('documents', 'getAll');
  }

  async deleteVenture(ventureId) {
    await this._write('ventures', 'delete', ventureId);
    const tasks = await this.getTasksByVenture(ventureId);
    for (const task of tasks) {
      await this._write('tasks', 'delete', task.id);
    }
    const logs = await this.getLogsByVenture(ventureId);
    for (const log of logs) {
      await this._write('logs', 'delete', log.id);
    }
  }

  async clearAllData() {
    for (const storeName of Object.keys(this.stores)) {
      await this._write(storeName, 'clear');
    }
  }

  async _write(storeName, method, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store[method](data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async _read(storeName, method, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = method === 'get' ? store.get(key) : store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async _readIndex(storeName, indexName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getStorageStats() {
    const stats = {};
    for (const storeName of Object.keys(this.stores)) {
      const items = await this._read(storeName, 'getAll');
      stats[storeName] = items.length;
    }
    return stats;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PersistenceManager };
}