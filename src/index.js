import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { ECSManagerPlugin } from "./plugins/ECSManagerPlugin";
import { TileMapManagerPlugin } from "./plugins/TileMapManagerPlugin";
import { Preload } from "./scenes/preload"
import { Headquarters } from "./scenes/headquarters";
import { Launch } from "./scenes/launch";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [
    Preload,
    Headquarters, 
    Launch
  ],
  plugins: {
    scene: [
      {
        key: "ECSManagerPlugin",
        plugin: ECSManagerPlugin,
        mapping: 'ECSManager',
      },
      {
        key: "rexUI",
        plugin: RexUIPlugin,
        mapping: "rexUI",
      },
      {
        key: 'TileMapManagerPlugin',
        plugin: TileMapManagerPlugin,
        mapping: 'tileManager',
      },
    ],
  },
  physics: {
    default: 'arcade',
  }
};

new Phaser.Game(config);
