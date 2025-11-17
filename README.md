# Pikachu Matching Game

A classic tile-matching puzzle game inspired by the popular Pikachu game, built from scratch using JavaScript and Cocos2d-html5 framework. This project represents my first complete game development journey—from initial concept and asset sourcing to full implementation.

[![Game Demo](https://github.com/phutruonnttn/Game_Pikachu/assets/45969976/62948638-fd60-456b-a1af-81f79de52574)](https://github.com/phutruonnttn/Game_Pikachu/assets/45969976/62948638-fd60-456b-a1af-81f79de52574)

## 🎮 Overview

Pikachu Matching Game is a tile-matching puzzle where players connect pairs of identical Pokemon tiles by drawing paths with up to 3 turns. The goal is to clear all tiles from the board before time runs out. The game features multiple difficulty levels and dynamic board movement effects that add strategic depth to the classic matching gameplay.

## ✨ Features

### Game Modes
- **Easy Mode**: 8×8 grid with 8 Pokemon types (8 of each type)
- **Normal Mode**: 10×10 grid with 25 Pokemon types (4 of each type)
- **Hard Mode**: 12×12 grid with 36 Pokemon types (4 of each type)

### Board Movement Effects
The game includes 8 different board movement patterns that activate after each successful match:
- **Static Board**: No movement (classic mode)
- **Move Up**: All tiles shift upward
- **Move Down**: All tiles shift downward
- **Move Right**: All tiles shift right
- **Move Left**: All tiles shift left
- **Split Top/Bottom**: Board splits vertically, top moves up, bottom moves down
- **Split Right/Left**: Board splits horizontally, right moves right, left moves left
- **Converge Top/Bottom**: Top and bottom sections converge toward center
- **Converge Right/Left**: Left and right sections converge toward center

### Game Features
- ⏱️ **60-second timer** with visual progress bar
- 💡 **Hint system** to help players find valid matches
- 🎵 **Background music** and sound effects
- 🎨 **Smooth animations** for tile connections and removals
- 🏆 **Victory and Game Over** screens
- ⚙️ **Customizable settings** (sound, difficulty, board movement)
- 📱 **Responsive design** that adapts to different screen sizes

## 🛠️ Technology Stack

- **JavaScript**: Core game logic and implementation
- **Cocos2d-html5**: Game engine and rendering framework
- **HTML5 Canvas**: Graphics rendering
- **Web Audio API**: Sound effects and background music

## 📁 Project Structure

```
Game_Pikachu/
├── src/                    # Source code
│   ├── Board.js           # Game board logic and pathfinding
│   ├── BoardView.js       # Visual representation of the board
│   ├── GameLayerPokemon.js # Main game layer
│   ├── GameConfig.js      # Game configuration and constants
│   ├── GameControlMenu.js # In-game menu controls
│   ├── SysMenu.js         # Main menu system
│   ├── SettingsLayer.js   # Settings and configuration UI
│   ├── AboutLayer.js      # About screen
│   ├── GameVictory.js     # Victory screen
│   ├── GameOver.js        # Game over screen
│   ├── Effect.js          # Visual effects
│   ├── Resource.js        # Resource loading
│   └── Queue.js           # Queue data structure for BFS
├── res/                   # Game assets
│   ├── Music/            # Audio files (MP3, OGG, WAV)
│   ├── pokemon-*.plist    # Sprite sheets
│   ├── pokemon*.png       # Pokemon tile images
│   └── ...               # UI elements and backgrounds
├── frameworks/            # Cocos2d-html5 framework
├── main.js               # Game entry point
├── index.html            # HTML entry point
└── project.json          # Project configuration
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Running the Game

1. **Clone the repository**
   ```bash
   git clone https://github.com/phutruonnttn/Game_Pikachu.git
   cd Game_Pikachu
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser, or
   - Use a local web server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Navigate to `http://localhost:8000` in your browser

3. **Play the game**
   - Click "New Game" from the main menu
   - Select your preferred difficulty and board movement mode in Settings
   - Match Pokemon tiles by clicking on pairs that can be connected with up to 3 turns
   - Clear all tiles before the timer runs out!

## 🎯 How to Play

1. **Objective**: Clear all Pokemon tiles from the board by matching pairs
2. **Matching Rules**:
   - Click on a Pokemon tile to select it
   - Click on another tile of the same type to attempt a match
   - Tiles can be connected with a path that has **1 to 3 turns**
   - The path must not be blocked by other tiles
3. **Hints**: Click the "HINT" button to highlight a valid match
4. **Time Limit**: You have 60 seconds to clear the board
5. **Board Movement**: After each successful match, the board may shift according to your selected movement mode

## 🔧 Game Mechanics

### Pathfinding Algorithm
The game uses a **Breadth-First Search (BFS)** algorithm to:
- Find valid paths between matching tiles
- Validate connections with 1-3 turns maximum
- Generate hints for players
- Check if a solvable board state exists

### Board Generation
- Randomly generates boards ensuring at least one valid solution exists
- Automatically regenerates if no solution is found
- Maintains balanced distribution of Pokemon types

### Connection Validation
The `canConnect()` function uses an optimized algorithm that:
- Checks horizontal and vertical line connections
- Validates path length (2-4 segments)
- Ensures paths aren't blocked by other tiles
- Supports both static and dynamic board states

## 🎨 Assets

All game assets including:
- 48 unique Pokemon tile sprites
- Background music: "River Flows In You"
- Sound effects for button clicks, tile selection, and removal
- UI elements and menu graphics

*Note: Assets were carefully sourced and integrated as part of the development process.*

## 🎓 Development Notes

This project represents my **first complete game development experience**, covering the entire development lifecycle:

1. **Concept & Design**: Cloning and adapting the classic Pikachu matching game
2. **Asset Sourcing**: Finding and integrating appropriate graphics and audio
3. **Implementation**: Building game logic, pathfinding, and UI systems
4. **Polish**: Adding animations, effects, and user experience enhancements

### Key Learning Areas
- Game state management
- Pathfinding algorithms (BFS)
- Sprite animation and effects
- Audio integration
- User interface design
- Game loop and timing systems

## 📝 Configuration

Game settings can be modified in `src/GameConfig.js`:
- Difficulty levels (grid size, Pokemon types)
- Board movement patterns
- Animation durations
- Sound volume
- Timer countdown duration

## 🐛 Known Issues / Future Improvements

- Optimization of `updatePreSumArraysAfterMove()` function for better performance with moving boards
- Potential enhancement of connection validation using hash maps for O(1) lookups
- Additional game modes or power-ups
- Leaderboard system
- Mobile app version

## 📄 License

This project is developed for educational and personal purposes. Please respect the licenses of the Cocos2d-html5 framework and any third-party assets used.

## 👤 Author

**Nguyen Phu Truong**

This is my first game project, developed from initial concept to completion. The project demonstrates skills in JavaScript game development, algorithm implementation, and game design.

---

**Enjoy playing!** 🎮✨
