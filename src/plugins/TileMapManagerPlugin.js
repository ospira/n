// import { BaseScene } from '../scenes/base-scene';
// // import { TiledUtil } from '../utilities/tiled-util';
// import { SpriteComponent } from '../components/sprite-component';
// import { ParallaxSprite } from "./parallax-sprite";
// import { DepthManager } from "../lib/depth-manager";
// import { ProgressionDocument } from '../persistence/progression/progression-document';
// import { AreaRegistrar } from '../registrars/area-registrar';
// import { BackgroundRegistrar } from '../registrars/background-registrar';

export class TileMapManagerPlugin extends Phaser.Plugins.ScenePlugin {

  // private background?: ParallaxSprite;

  constructor(scene, pluginManager) {
    super(scene, pluginManager);

    this.map = {}

    this.tileSets = [];
    this.tileLayers = [];
    this.objects = {};
    this.markers = {};
    this.zones = {};
  }

  load(key) {
    // this.currentAreaKey = key;
    // const area = AreaRegistrar.getArea(key);
    this.tileSets = [];
    this.tileLayers = [];
    this.objects = {};

    // this.createBackground(this.map.properties);
    this.map = this.scene.make.tilemap({ key: key });
    this.createTileSets(this.map.tilesets.map((tileset) => tileset.name));
    this.createTileLayers(this.map.layers.map((layer) => { return {name: layer.name, tileset: this.mapTileSetToLayer(layer.name)}}));
    // this.createEntities(this.map.objects.map(layer => layer.name));

    this.loadMarkers();
    this.loadZones();
  }

  unload() {
    this.objects = {};
    this.markers = {};
    this.zones = {};

    this.tileLayers.forEach(layer => layer.destroy());
    this.tileLayers = [];
    this.tileSets = [];

    if (this.map) {
      this.map.destroy();
    }

    if (this.background) {
      this.background.destroy();
    }
  }

  getTileSet(name) {
    return this.tileSets.find(tileSet => tileSet.name === name);
  }

  getTileLayer(name) {
    return this.tileLayers.find(layer => layer.layer.name === name);
  }

  getZone(name) {
    return this.zones[name];
  }

  getMarker(name){
    return this.markers[name]
  }

  loadMarkers() {
    const objectLayer = this.map.objects.find(layer => layer.name === "Markers")
    objectLayer.objects.forEach(object => {
          this.markers[object.name] = {
            x: object.x,
            y: object.y,
          };
    });
  }

  loadZones() {
    const objectLayer = this.map.objects.find(layer => layer.name === "Zones")
    objectLayer.objects.forEach(object => {
        this.zones[object.name] = {
          shape: new Phaser.Geom.Rectangle(object.x, object.y, object.width, object.height),
          data: object.properties
        };
    });
  }

  createTileSets(tilesetNames) {
    tilesetNames.forEach(tilesetName => {
      const tileSet = this.map.addTilesetImage(tilesetName, tilesetName);
      this.tileSets.push(tileSet)
    });
  }

  createTileLayers(layerObjects) {
    console.log({layerObjects})
    const width = this.map.width * 48; // all tilesheets are 48 x 48
    const height = this.map.height * 48;  // all tilesheets are 48 x 48
    layerObjects.forEach(layerObject => {
    // if(layerObject.name !== 'Background2'){
       const layer = this.map.createLayer(
        layerObject.name, 
        this.getTileSet(layerObject.tileset),
        0,
        0,
      );
      console.log(layerObject.name,  {layer})
      const layerProperties = layer.layer.properties;
      layerProperties.forEach(layerProperty=>{
        if (layerProperty.name === 'collides' && layerProperty.value) {
          layer.forEachTile((tile) => {
            tile.setCollision(true, true, true, true, false);
          }, this, 0, 0, layer.width, layer.height, { isNotEmpty: true });
          layer.calculateFacesWithin(0, 0, layer.width, layer.height);
          layer.setDepth(0);
        }
  
      // layer.setDepth(DepthManager.depthFor(layerProperties.depth));
      })
  
      this.tileLayers.push(layer);
    // }
    });
  }

  // asteroids??
  
  //  createEntities(layerNames) {
  //   layerNames.forEach(layerName => {
  //     const layer = this.map.getObjectLayer(layerName);
  //     // const layerProperties = TiledUtil.normalizeProperties(layer.properties);
  //     const tiledObjects = layer.objects;
  
  //     this.objects[layerName] = [];
  
  //     const scene = this.scene;
  //     tiledObjects.forEach((tiledObject) => {
  //       let entity = null;
  
  //       if (tiledObject.type) {
  //         const properties = {
  //           ...tiledObject.properties,
  //           name: tiledObject.name
  //         };

  //         entity = scene.ECSManager.entities.createEntityFromPrefab(prefab, properties, null, tiledObject.x, tiledObject.y);
  //         this.objects[layerName].push(entity);
  //       }
  //     }); 
  //   });
  // }

  mapTileSetToLayer(layerName) {
    const dataObject = {
      "ObjectBackground":"interiornasaobjects",
      "Background": "interiornasafloors",
      "Background2": "background2",
      "BackgroundBlueLaunch": "interiornasafloors",
      "BackgroundBlueFinalLaunch": "interiornasafloors",
    }
    return dataObject[layerName]
  }


// createBackground(properties) {
//     if (properties.backgroundSet) {
//       const layerNames = BackgroundRegistrar.getBackgroundSet(properties.backgroundSet);
//       const layersConfig: ParallaxSprite.LayersConfig = layerNames.map(layerName => { return { key: layerName } });

//       this.background = (this.scene.add as any).parallaxSprite(layersConfig, DepthManager.depthFor('parallax')) as ParallaxSprite;
//       this.background.scrollWithCamera(this.scene.cameras.main);
//     } else if (properties.backgroundColor) {
//       this.scene.cameras.main.setBackgroundColor(`#${properties.backgroundColor}`)
//     }
//   }
}
