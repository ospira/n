import { PlayerControlled } from '../components/PlayerControlled';
import { SpriteComponent } from '../components/SpriteComponent';
import { ReactsToZones } from '../components/ReactsToZones';

export class ZoneSystem {
    constructor(scene){
        this.scene = scene
    }
    update(allEntities) {
        const entities = allEntities.getEntities(PlayerControlled);
        for (let entity of entities) {
            const sprite = entity.getComponent(SpriteComponent).sprite
            for (const [zoneName, zoneData] of Object.entries(this.scene.tileManager.zones)) {
                if (Phaser.Geom.Rectangle.ContainsRect(zoneData.shape, sprite.getBounds())) {
                    entity.getComponent(ReactsToZones).react(zoneName)
                }
            };
        };
    }
}
