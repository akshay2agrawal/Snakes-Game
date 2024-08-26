# Snakes-Game

- The game invoves a snake character that can collect food. If food is collected, snake grows.
- The food appears at random positions on the playing field.
- If the snake goes beyond the playing field or it eats its own tail then it is GAME OVER.

![Alt text](/assets/game_img.png "Game Preview")

## Setup Instructions

### Requirements

Node, npm (node package manager)

### Installation

Install the necessary dependencies using npm

```bash
npm i
```

### Start the Development Server

```bash
npm start
```

## Usage

- The game starts on page load. It can be stopped anytime using the reset button.
- On Game over, the score resets and the game can be restarted by pressing space bar.
- The direction in which the snake moves can be changed using the arrow keys.
- High score is maintained via a text file through the Node server.
