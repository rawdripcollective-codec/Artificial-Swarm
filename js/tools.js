/**
 * Artificial Swarm v3 - Tool Registry
 * Dynamic tool management and capability discovery
 */

class ToolRegistry {
  constructor() {
    this.tools = [];
    this.categories = [
      'browser',
      'github',
      'notion',
      'slack',
      'email',
      'database',
      'cloud',
      'filesystem',
      'search',
      'ocr',
      'image-analysis'
    ];
  }

  registerTool(toolConfig) {
    const tool = {
      id: toolConfig.id || `tool_${Date.now()}`,
      name: toolConfig.name,
      category: toolConfig.category,
      description: toolConfig.description,
      permissions: toolConfig.permissions || [],
      enabled: toolConfig.enabled !== false,
      version: toolConfig.version || '1.0.0',
      dependencies: toolConfig.dependencies || [],
      executor: toolConfig.executor
    };
    
    this.tools.push(tool);
    return tool.id;
  }

  getToolsByCategory(category) {
    return this.tools.filter(t => t.category === category && t.enabled);
  }

  getTool(id) {
    return this.tools.find(t => t.id === id);
  }

  enableTool(id) {
    const tool = this.getTool(id);
    if (tool) tool.enabled = true;
  }

  disableTool(id) {
    const tool = this.getTool(id);
    if (tool) tool.enabled = false;
  }

  async executeTool(toolId, input) {
    const tool = this.getTool(toolId);
    if (!tool || !tool.enabled) {
      throw new Error(`Tool ${toolId} not found or disabled`);
    }
    
    try {
      if (tool.executor) {
        return await tool.executor(input);
      }
      return { success: true, result: `Tool ${tool.name} executed` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  export() {
    return {
      totalTools: this.tools.length,
      enabledTools: this.tools.filter(t => t.enabled).length,
      toolsByCategory: this.categories.map(cat => ({
        category: cat,
        count: this.getToolsByCategory(cat).length
      }))
    };
  }
}

// Pre-configured tool templates
const TOOL_TEMPLATES = {
  BROWSER_TOOLS: [
    {
      id: 'browser-fetch',
      name: 'HTTP Fetch',
      category: 'browser',
      description: 'Fetch URLs and retrieve content',
      permissions: ['read:network']
    },
    {
      id: 'browser-dom',
      name: 'DOM Parser',
      category: 'browser',
      description: 'Parse and navigate DOM structures',
      permissions: ['read:dom']
    }
  ],
  
  GITHUB_TOOLS: [
    {
      id: 'github-api',
      name: 'GitHub API',
      category: 'github',
      description: 'Interact with GitHub repositories',
      permissions: ['read:repos', 'write:repos']
    },
    {
      id: 'github-search',
      name: 'GitHub Search',
      category: 'github',
      description: 'Search GitHub code and issues',
      permissions: ['read:search']
    }
  ],
  
  SEARCH_TOOLS: [
    {
      id: 'web-search',
      name: 'Web Search',
      category: 'search',
      description: 'Search the internet',
      permissions: ['read:search']
    },
    {
      id: 'news-search',
      name: 'News Search',
      category: 'search',
      description: 'Search news and headlines',
      permissions: ['read:search']
    }
  ]
};

function createToolRegistry(templates = []) {
  const registry = new ToolRegistry();
  templates.forEach(toolList => {
    Object.values(toolList).forEach(tool => {
      registry.registerTool(tool);
    });
  });
  return registry;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ToolRegistry,
    TOOL_TEMPLATES,
    createToolRegistry
  };
}