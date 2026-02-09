# Prisoner's Dilemma Tournament

A competitive tournament platform for testing game theory strategies in the classic Prisoner's Dilemma. Write your own strategy in JavaScript, battle against built-in and community strategies, and climb the leaderboard.

**🚀 [Try it live!](https://repeated-prisoners-dilemna.vercel.app/)**

## What is This?

This is an interactive web application that lets you:
- **Write custom strategies** in JavaScript to play the iterated Prisoner's Dilemma
- **Compete in tournaments** where your strategy plays 200 rounds against every other strategy
- **Analyze results** with multiple scoring modes and detailed match visualizations
- **Share strategies** via URL encoding to challenge others

## Features

### 🎮 Strategy Editor
- **CodeMirror integration** with JavaScript syntax highlighting and One Dark theme
- **Multiple built-in strategy templates**

### 🏆 Scoring Modes
Choose how to rank strategies:
<todo>

### 📊 Real-time Tournament
- **Round-robin format**: Every strategy plays every other strategy

### 📈 Results & Analytics
- **Live leaderboard** showing top 20 strategies with stats (W/L/T record)
- **Detailed match results** for your strategy against each opponent
- **Match visualization** with round-by-round playback
- **Performance insights** identifying which strategies you beat/lost to
- **Strategy code viewing** - click any strategy to see its implementation

### 🔗 Sharing
- **URL encoding** to share your strategy with others
- **One-click copying** to clipboard
- **Automatic loading** of shared strategies from URL parameters

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd repeated_prisoners_dilemna

# Install dependencies
npm install
```

### Development

```sh
# Start development server
npm run dev

# Or open in browser automatically
npm run dev -- --open
```


## Future Enhancements

See [MVP.md](./MVP.md) for the full roadmap, including:

- **Evolution Mode**: Strategies reproduce based on performance, population dynamics
- **Meta-Gaming**: Private strategies, 1v1 challenges, strategy lineage trees
- **Advanced Formats**: Multi-player games, noisy channels, incomplete information
- **Backend Integration**: Firebase/Supabase for global leaderboard persistence

## Performance Notes

- Tournaments run entirely in-browser (no server required)
- Event loop yielding every 10 matches prevents UI freezing
- With 20 strategies: 190 matches × 200 rounds = 38,000 total rounds
- Typically completes in under 2 seconds on modern hardware

## Contributing

Contributions welcome! Areas for improvement:
- Additional built-in strategy templates
- Enhanced visualization options
- Performance optimizations for large tournaments
- Mobile responsive design improvements

## License

This project is open source. See repository for license details.

## Credits

Built with SvelteKit as an exploration of emergent game theory strategies through crowdsourced competition.
