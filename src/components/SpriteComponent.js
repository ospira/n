export class SpriteComponent {
    constructor(scene, data) {
      const { x = 0, y = 0, texture } = data;
      this.sprite = scene.add.sprite(x, y, texture, 0);
      this.sprite.y -= this.sprite.height * this.sprite.originY;
  
      if (data.scale) {
        this.sprite.setScale(data.scale);
      }
  
      if (data.depth) {
        this.sprite.setDepth(data.depth);
      }
    }
  
    destroy() {
      this.sprite.destroy();
  
      delete this.sprite;
    }
  }
  