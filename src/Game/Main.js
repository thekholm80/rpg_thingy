import Level from './Level';
import SpriteLoader from './SpriteLoader';
// import GameDisplay from './Renderers/GameDisplay';

class Main {
  constructor() {
    // canvases
    const gameCanvas = document.querySelector('#game');
    const hudCanvas = document.querySelector('#hud');
    const actionsCanvas = document.querySelector('#actions');

    // contexts
    this.gameContext = gameCanvas.getContext('2d');
    this.hudContext = hudCanvas.getContext('2d');
    this.actionsContext = actionsCanvas.getContext('2d');

    this.gameLevel = '1-1';
    this.level = new Level(this.gameLevel);
    this.player = 'mage'; // this will be changed when player is built
    this.target = '';

    this.spriteLoader = new SpriteLoader(this.gameContext);

    this.listenForKeys();
    this.listenForClicks(hudCanvas);
    this.drawScreen();
  }

  listenForKeys() {
    const clickHandler = event => {
      this.handleKeyPress(event.keyCode);
    }
    window.removeEventListener('keydown', clickHandler);
    window.addEventListener('keydown', clickHandler);
  }

  listenForClicks(canvas) {
    let { processClick } = this;
    processClick = processClick.bind(this);

    function clickHandler(event) {
      const rect = this.getBoundingClientRect();
      // magic by Ben
      const coords = {
        x: Math.round(((event.clientX - rect.left) - 25) / 50) - 8,
        y: Math.round(((event.clientY - rect.top) - 25) / 50) -5,
        spawnX: Math.round(((event.clientX - rect.left) - 25) / 50) * 50,
        spawnY: Math.round(((event.clientY - rect.top) - 25) / 50) * 50
      }
      processClick(coords);
    }

    canvas.onclick = clickHandler;
  }

  processClick({ x, y, spawnX, spawnY }) {
    const { level: { playerLocation, map } } = this;
    const lookUp = `${ playerLocation.x + x },${ playerLocation.y + y }`;

    // if (this.target) this.target = '';  // update this once clicking is sorted out
    console.log(lookUp, map[lookUp]);
    if (map.hasOwnProperty(lookUp) && map[lookUp] !== 'floor') {
      this.targetSprite(spawnX, spawnY);
    }
    console.log(x, y);
  }

  drawScreen() {
    this.drawGameArea();
    this.drawHud();
  }

  drawHud() {
    const { hudContext } = this;

    hudContext.clearRect(0, 0, 150, 100);
    hudContext.clearRect(650, 0, 800, 100);

    // background
    hudContext.fillStyle = 'rgba(100, 100, 100, 0.75)';
    hudContext.fillRect(0, 0, 150, 100);
    hudContext.fillRect(650, 0, 800, 100);

    hudContext.fillStyle = '#121212';

    // bar outlines
    hudContext.strokeRect(5, 20, 135, 20);
    hudContext.strokeRect(5, 65, 135, 20);
  }

  drawGameArea() {
    const { gameContext, level: { map, playerLocation, wall, floor } } = this;

    gameContext.clearRect(0, 0, 800, 500);

    for (let x = -8; x < 9; x++) {
      for (let y = -5; y < 5; y++) {
        const currentLocation = `${ playerLocation.x + x },${ playerLocation.y + y }`;
        const spawnX = 400 + (x * 50);
        const spawnY = 250 + (y * 50);

        if (map.hasOwnProperty(currentLocation)) {
          // everything marked on map gets a floor tile
          this.spriteLoader.load(spawnX, spawnY, floor);

          if (map[currentLocation] !== 'floor' && map[currentLocation] !== 'player') {
            // anything not floor gets another sprite on top
            this.spriteLoader.load(spawnX, spawnY, map[currentLocation]);
          }

          if (map[currentLocation] === 'player') {
            // add the player
            this.spriteLoader.load(spawnX, spawnY, this.player);
          }
        } else {
          this.spriteLoader.load(spawnX, spawnY, wall);
        }
      }
    }
  }

  handleKeyPress(keyCode) {
    switch (keyCode) {  
      // move left
      case 65:  // 'a'
      case 37:  // left arrow
        this.move(`${ this.level.playerLocation.x - 1 },${ this.level.playerLocation.y }`);
        break;

      // move up
      case 87:  // 'w'
      case 38:  // up arrow
        this.move(`${ this.level.playerLocation.x },${ this.level.playerLocation.y - 1 }`);
        break;

      // move right
      case 68:  // 'd'
      case 39:  // right arrow
        this.move(`${ this.level.playerLocation.x + 1 },${ this.level.playerLocation.y }`);
        break;

      // move down
      case 83:  // 's'
      case 40:  // down arrow
        this.move(`${ this.level.playerLocation.x },${ this.level.playerLocation.y + 1 }`);
        break;

      // target self
      case 192: // '`'
        this.targetSprite(400, 250);
        break;

      default:
        break;
    }
  }

  targetSprite(x, y) {
    this.spriteLoader.load(x, y, 'target_ring');
    this.target = 'player';
  }

  move(newLocation) {
    const { level: { map, playerLocation } } = this;
    const keys = Object.keys(map);

    if (!keys.includes(newLocation)) return;

    map[`${ playerLocation.x },${ playerLocation.y }`] = 'floor';
    playerLocation.x = +newLocation.split(',')[0];
    playerLocation.y = +newLocation.split(',')[1];
    map[newLocation] = 'player';

    this.drawScreen();
  }
}

export default Main;
