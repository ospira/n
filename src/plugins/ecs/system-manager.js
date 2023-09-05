export class SystemManager {
  constructor(scene) {
    this.scene = scene;

    this.systems = [];
  }

  start(entityManager) {
    this.systems.forEach(system => {
      if (system.start) {
        system.start(entityManager);
      }
    })
  }

  stop(entityManager) {
    this.systems.forEach(system => {
      if (system.stop) {
        system.stop(entityManager);
      }
    })
  }

  update(entityManager) {
    this.systems.forEach(system => {
      if (system.update) {
        system.update(entityManager);
      }
    });
  }

  destroy() {
    this.systems.forEach(system => {
      if (system.destroy) {
        system.destroy();
      }
    });
    
    this.systems = [];
  }

  registerSystems(systemsList) {
    systemsList.forEach((klass) => {
      this.systems.push(new klass(this.scene));
    });
  }

  removeSystems(systemsList) {
    const systemsToRemove = this.systems.filter(system => systemsList.some(klass => system instanceof klass));

    systemsToRemove.forEach(system => {
      if (system.stop) system.stop(this.scene.phecs.phEntities);
      if (system.destroy) system.destroy();
    });

    this.systems = this.systems.filter(system => !systemsToRemove.includes(system));
  }
}
