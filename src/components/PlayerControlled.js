import { SpriteComponent } from "./SpriteComponent";

export class PlayerControlled {
    constructor(scene, data, entity) {
        this.scene = scene
        this.data = data
        this.entity = entity

        this.keyCodes = {
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        }

       this.keyObjects = {}

       for (const [key, value] of Object.entries(this.keyCodes)) {
        this.keyObjects[key] = this.scene.input.keyboard.addKey(value)
      }
    }
    update(){
        const sprite = this.entity.getComponent(SpriteComponent).sprite
        const speed = 500;
        if (!sprite) {
        return;
        }
        if (this.scene.input.keyboard.checkDown(this.keyObjects.left, 100)) {
        sprite.body.setVelocity(-speed, 0);
        sprite.anims.play("sprite-side", true);
        sprite.scaleX = -1.0;
        sprite.body.offset.x = 16;
        } else if (this.scene.input.keyboard.checkDown(this.keyObjects.right, 100)) {
        sprite.anims.play("sprite-side", true);
        sprite.body.setVelocity(speed, 0);
        sprite.scaleX = 1.0;
        sprite.body.offset.x = 0;
        } else if (this.scene.input.keyboard.checkDown(this.keyObjects.down, 100)) {
        sprite.anims.play("sprite-down", true);
        sprite.body.setVelocity(0, speed);
        } else if (this.scene.input.keyboard.checkDown(this.keyObjects.up, 100)) {
        sprite.anims.play("sprite-up", true);
        sprite.body.setVelocity(0, -speed);
        } else {
        sprite.anims.play("sprite-idle");
        sprite.body.setVelocity(0, 0);
        }
        }
}
  