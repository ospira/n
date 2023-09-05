import { SpriteComponent } from "./SpriteComponent";

export class PhysicsBodyComponent {
    constructor(scene, data, entity) {
        this.scene = scene
        this.data = data
        this.entity = entity
        
        const sprite = this.entity.getComponent(SpriteComponent).sprite
        scene.physics.add.existing(sprite)

        sprite.body.setSize(sprite.width, sprite.height);
        sprite.body.updateBounds();

        if (data.collideWorldBounds) {
            sprite.body.collideWorldBounds = true;
        }

        }
}
  