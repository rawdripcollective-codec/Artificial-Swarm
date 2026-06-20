/**
 * One-time migration: Nexus Swarm -> Artificial Swarm
 * Copies legacy localStorage + IndexedDB data (saved under the old app
 * name) into the new storage keys. Safe to leave in permanently — it's
 * a no-op once migration has run once on a given browser.
 */
(function migrateLegacyStorage() {
  const OLD_LS_KEY = 'NEXUS_SWARM_V2';
  const NEW_LS_KEY = 'ARTIFICIAL_SWARM_V2';
  const OLD_DB_NAME = 'NexusSwarm';
  const NEW_DB_NAME = 'ArtificialSwarm';
  const DB_VERSION = 1;
  const MIGRATION_FLAG = 'ARTIFICIAL_SWARM_MIGRATED_V1';

  // Mirrors the schema in js/persistence.js's PersistenceManager
  const STORE_SCHEMA = {
    ventures: { indexes: [] },
    agents: { indexes: [] },
    tasks: { indexes: ['ventureId', 'status'] },
    logs: { indexes: ['timestamp', 'ventureId'] },
    documents: { indexes: [] },
    memory: { indexes: ['type', 'category'] }
  };

  function migrateLocalStorage() {
    if (localStorage.getItem(NEW_LS_KEY)) return; // new data already exists
    const oldData = localStorage.getItem(OLD_LS_KEY);
    if (oldData) {
      localStorage.setItem(NEW_LS_KEY, oldData);
      console.log('[migrate] localStorage copied:', OLD_LS_KEY, '->', NEW_LS_KEY);
    }
  }

  function dbExists(name) {
    return new Promise((resolve) => {
      let existed = true;
      const req = indexedDB.open(name);
      req.onupgradeneeded = () => { existed = false; };
      req.onsuccess = () => {
        req.result.close();
        if (!existed) indexedDB.deleteDatabase(name); // undo accidental creation
        resolve(existed);
      };
      req.onerror = () => resolve(false);
    });
  }

  function openOld(name, version) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(name, version);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function openNewWithSchema(name, version) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(name, version);
      req.onupgradeneeded = (event) => {
        const db = event.target.result;
        Object.entries(STORE_SCHEMA).forEach(([storeName, { indexes }]) => {
          if (db.objectStoreNames.contains(storeName)) return;
          const store = db.createObjectStore(storeName, { keyPath: 'id' });
          indexes.forEach((idx) => store.createIndex(idx, idx, { unique: false }));
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function getAll(db, storeName) {
    return new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains(storeName)) return resolve([]);
      const tx = db.transaction([storeName], 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function putAll(db, storeName, items) {
    return new Promise((resolve, reject) => {
      if (!items.length) return resolve();
      const tx = db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach((item) => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function migrateIndexedDB() {
    const oldExists = await dbExists(OLD_DB_NAME);
    if (!oldExists) return;

    const oldDb = await openOld(OLD_DB_NAME, DB_VERSION);
    const newDb = await openNewWithSchema(NEW_DB_NAME, DB_VERSION);

    for (const storeName of Object.keys(STORE_SCHEMA)) {
      const items = await getAll(oldDb, storeName);
      await putAll(newDb, storeName, items);
      if (items.length) {
        console.log(`[migrate] IndexedDB "${storeName}": copied ${items.length} item(s)`);
      }
    }

    oldDb.close();
    newDb.close();
  }

  async function run() {
    if (localStorage.getItem(MIGRATION_FLAG)) return;
    try {
      migrateLocalStorage();
      await migrateIndexedDB();
      localStorage.setItem(MIGRATION_FLAG, 'true');
    } catch (err) {
      console.error('[migrate] Migration failed, will retry next load:', err);
    }
  }

  run();
})();
