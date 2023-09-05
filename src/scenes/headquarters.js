import { AstronautPrefab } from "../prefabs/AstronautPrefab" 
import { SpriteComponent } from "../components/SpriteComponent"
import { PlayerWalkingSystem } from "../systems/PlayerWalkingSystem"
import { ZoneSystem } from "../systems/ZoneSystem"

export class Headquarters extends Phaser.Scene {
    constructor(){
        super("headquarters")
        this.systems = [
            PlayerWalkingSystem,
            // PlayerTextOnExploreSystem,
            ZoneSystem,
        ]
    }

    create() {
        this.tileManager.load("headquarters")

        this.ECSManager.systems.registerSystems(this.systems);
        this.ECSManager.start();

        let x = 0;
        let y = 0;
        const width = this.tileManager.map.width * 48; // all tilesheets are 48 x 48
        const height = this.tileManager.map.height * 48;  // all tilesheets are 48 x 48

        if (width < window.innerWidth) {
            x = x - (window.innerWidth - width) / 2;
        }

        if (height < window.innerHeight) {
            y = y - (window.innerHeight - height) / 2;
        }

        this.physics.world.setBounds(0, 0, width, height);
        this.cameras.main.setBounds(x, y, width, height);
        const playerSpawnCoordinates = this.tileManager.getMarker('playerSpawn')
        const astronaut = this.ECSManager.entities.createEntityFromPrefab(AstronautPrefab, null, playerSpawnCoordinates['x'], playerSpawnCoordinates['y'])
        const playerSprite = astronaut.getComponent(SpriteComponent).sprite

        this.cameras.main.startFollow(playerSprite, true);
        // one collision layer so ok
        this.physics.add.collider(playerSprite, this.tileManager.tileLayers.find(layer => layer.layer.properties.find(layerProperty => layerProperty.name === 'collides' && layerProperty.value)));
        this.cameras.main.fadeIn(500);
        
      }
}