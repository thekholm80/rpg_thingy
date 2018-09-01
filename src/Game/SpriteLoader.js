class SpriteLoader {
  constructor(context) {
    this.context = context;
  }

  load(x, y, name) {
    const image = require(`../Images/${ name }.png`);
    const sprite = new Image();

    sprite.onload = () => {
      this.context.drawImage(sprite, x, y);
    }

    sprite.src = image;
  }
}

export default SpriteLoader;
