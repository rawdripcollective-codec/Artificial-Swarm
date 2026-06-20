/**
 * Artificial Swarm v3 - Workflow Graph Visualization
 * DAG visualization and mission command center
 */

class WorkflowVisualizer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.nodes = [];
    this.edges = [];
    this.padding = 50;
    this.nodeRadius = 40;
    this.nodeSpacing = 150;
  }

  initialize(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  addNode(id, name, agent) {
    const index = this.nodes.length;
    this.nodes.push({
      id,
      name,
      agent,
      x: this.padding + (index % 3) * this.nodeSpacing,
      y: this.padding + Math.floor(index / 3) * this.nodeSpacing,
      status: 'pending'
    });
  }

  addEdge(fromId, toId) {
    this.edges.push({ from: fromId, to: toId });
  }

  getNodeByPosition(x, y) {
    return this.nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < this.nodeRadius;
    });
  }

  updateNodeStatus(id, status) {
    const node = this.nodes.find(n => n.id === id);
    if (node) {
      node.status = status;
    }
  }

  draw() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.fillStyle = '#050508';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw edges
    this.drawEdges();
    
    // Draw nodes
    this.drawNodes();
  }

  drawEdges() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);

    this.edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        // Draw arrow
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx);
        
        // Line from node to node
        this.ctx.beginPath();
        this.ctx.moveTo(
          fromNode.x + Math.cos(angle) * this.nodeRadius,
          fromNode.y + Math.sin(angle) * this.nodeRadius
        );
        this.ctx.lineTo(
          toNode.x - Math.cos(angle) * this.nodeRadius,
          toNode.y - Math.sin(angle) * this.nodeRadius
        );
        this.ctx.stroke();
        
        // Arrow head
        const arrowSize = 10;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.moveTo(toNode.x - Math.cos(angle) * this.nodeRadius, toNode.y - Math.sin(angle) * this.nodeRadius);
        this.ctx.lineTo(toNode.x - Math.cos(angle - Math.PI / 6) * arrowSize, toNode.y - Math.sin(angle - Math.PI / 6) * arrowSize);
        this.ctx.lineTo(toNode.x - Math.cos(angle + Math.PI / 6) * arrowSize, toNode.y - Math.sin(angle + Math.PI / 6) * arrowSize);
        this.ctx.fill();
      }
    });
    
    this.ctx.setLineDash([]);
  }

  drawNodes() {
    this.nodes.forEach(node => {
      const statusColors = {
        'pending': '#888899',
        'running': '#00f2ff',
        'completed': '#00ff88',
        'failed': '#ff4444'
      };
      
      const color = statusColors[node.status] || '#888899';
      
      // Node circle
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = 0.2;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Node border
      this.ctx.globalAlpha = 1;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // Status indicator
      if (node.status === 'running') {
        this.ctx.fillStyle = color;
        const pulseRadius = this.nodeRadius + 10;
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
      
      // Node label
      this.ctx.fillStyle = color;
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(node.name, node.x, node.y);
    });
  }

  export() {
    return {
      nodes: this.nodes,
      edges: this.edges
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WorkflowVisualizer };
}