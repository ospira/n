import { EntityManager } from './ecs/entity-manager';
import { SystemManager } from './ecs/system-manager';

export class ECSManagerPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
    
    this.entities = new EntityManager(scene);
    this.systems = new SystemManager(scene);
  }

  start() {
    this.systems.start(this.entities);
    this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.update, this);
  }

  stop() {
    this.systems.stop(this.entities);
    this.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.update, this);
  }

  update() {
    this.systems.update(this.entities);
  }

  destroy() {
    this.entities.destroy();
  }

  reset() {
    this.stop();
    this.destroy();
  }

  shutdown() {
    this.stop();
    this.destroy();
    this.systems.destroy();
  }
}
