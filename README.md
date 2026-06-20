# Artificial Swarm 💠

**Agentic AI Incubator - A futuristic dashboard for managing autonomous AI ventures**

## Overview

Artificial Swarm is an innovative web-based platform designed to orchestrate and manage autonomous AI agent swarms. Each "venture" represents an independent AI system capable of performing autonomous tasks, generating revenue, and evolving through simulated agent teams.

## Features

✨ **Core Capabilities:**
- 🤖 **Autonomous Venture Deployment** - Initialize AI swarms with custom objectives and budgets
- 📊 **Real-Time Monitoring** - Track progress, revenue, and agent status in real-time
- 👥 **Agent Roles** - CEO, CTO, CMO, and CFO roles with activation/deactivation states
- 💰 **Revenue Simulation** - Watch your ventures generate simulated revenue autonomously
- 📝 **Task Logging** - Live activity logs showing venture operations
- 🎨 **Futuristic UI** - Cyberpunk-inspired design with glassmorphism effects
- 💾 **Local Persistence** - All venture data saved to browser LocalStorage

## Quick Start

### Option 1: Live Demo
Visit the live GitHub Pages deployment:
[Artificial Swarm Live Demo](https://rawdripcollective-codec.github.io/Artificial-Swarm/)

### Option 2: Local Development
1. Clone the repository:
```bash
git clone https://github.com/rawdripcollective-codec/Artificial-Swarm.git
cd Artificial-Swarm
```

2. Open `index.html` in your browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Or simply double-click the file
```

## How to Use

### Deploying a Swarm

1. Click the **"➕ DEPLOY SWARM"** button
2. Choose from pre-built templates:
   - **DeFi Arb** - Cross-chain liquidity arbitrage
   - **SEO Engine** - High-converting ad copy generation
   - **Trend Hunter** - Satellite imagery monitoring for environmental threats
   - **Auto-Dev** - Autonomous bug bounty and PR generation

3. Or create a custom venture:
   - Enter a unique venture name
   - Define the core objective
   - Set an autonomous budget
   - Select deployment time

4. Click **"CONFIRM DEPLOYMENT"** to activate

### Monitoring Ventures

Each venture card displays:
- **Venture Title & Objective** - What the AI is tasked with
- **Status Badge** - Current operational state
- **Revenue & Time** - Current earnings and deployment time
- **Agent Grid** - 4 team members with status indicators (green dot = active)
- **Progress Bar** - Completion percentage with gradient fill
- **Task Log** - Real-time activity feed

### Global Statistics

Top-right header shows:
- 🤖 **Total Active Agents** - Sum of all active agents across ventures
- 💎 **Total Revenue** - Cumulative earnings from all ventures

### Reset

Click the **"🧹"** button to reset all ventures and start fresh.

## Technical Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: CSS3 with CSS Variables and Glassmorphism
- **Storage**: Browser LocalStorage API
- **Design**: Responsive grid layout with Flexbox

## Architecture

```
index.html
├── HTML Structure
├── CSS Styling (embedded)
│   ├── Theme Variables
│   ├── Component Styles
│   └── Responsive Media Queries
└── JavaScript (embedded)
    ├── Data Management
    ├── UI Rendering
    ├── Simulation Engine
    └── Event Handlers
```

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Deep Blue-Black | `#050508` |
| Card Background | Dark Navy | `#11111a` |
| Primary Accent | Cyan | `#00f2ff` |
| Secondary Accent | Purple | `#7000ff` |
| Success | Neon Green | `#00ff88` |
| Warning | Orange | `#ffaa00` |
| Danger | Red | `#ff4444` |

## Data Persistence

Venture data is automatically saved to LocalStorage under the key `ARTIFICIAL_SWARM_V2`. Each venture object contains:

```javascript
{
  id: timestamp,
  name: string,
  goal: string,
  budget: number,
  time: string,
  progress: number (0-100),
  status: string,
  revenue: number,
  agents: Array<{role, icon, active}>,
  logs: Array<string>
}
```

## Simulation Engine

The dashboard includes an autonomous simulation that:
- Updates venture progress every 3 seconds
- Randomly activates/deactivates agents
- Generates simulated revenue
- Adds task logs with realistic operations

To customize simulation:
- Edit the `startGlobalSimulation()` function
- Adjust the interval (currently 3000ms)
- Modify progress increment and revenue generation

## Future Enhancements

🚀 Planned features:
- Multi-platform deployment strategies
- Real API integration for actual revenue generation
- Advanced analytics dashboard
- Export venture metrics to CSV
- Dark/Light theme toggle
- Multi-language support
- Venture pausing/resuming
- Agent skill trees and upgrades

## License

MIT License - Feel free to fork, modify, and deploy!

## Contributing

Contributions welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## Contact

Created by **rawdripcollective-codec**  
GitHub: [@rawdripcollective-codec](https://github.com/rawdripcollective-codec)

---

**"Expanding the frontier of autonomous intelligence, one swarm at a time." 🌌**