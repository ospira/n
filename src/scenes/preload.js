export class Preload extends Phaser.Scene {
    constructor(){
        super("preload")
    }

    preload() {
        

        // layer/tileset images - remember ONE tileset per layer
        this.load.image('interiornasafloors',  'src/assets/tilemaps/level1/interiornasafloors.png');
        this.load.image('interiornasaobjects', 'src/assets/tilemaps/level1/interiornasaobjects.png');
        this.load.image('background2', 'src/assets/tilemaps/level1/background2.png');

        // tilemaps
        this.load.tilemapTiledJSON('headquarters', 'src/assets/tilemaps/level1/level1.json');


    }

    create() {
        this.scene.start("headquarters");
    }
}