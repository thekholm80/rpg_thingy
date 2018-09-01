class Level {
  constructor(level) {
    const {
      map,
      mobs,
      chests,
      playerLocation,
      wall,
      floor
    } = require(`../Maps/${ level }.js`);

    this.map = map;
    this.mobs = mobs
    this.chests = chests;
    this.playerLocation = playerLocation;
    this.wall = wall;
    this.floor = floor;
  }
}

export default Level;
