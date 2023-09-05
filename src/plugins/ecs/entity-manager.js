import { Entity } from './entity';

export class EntityManager {
  constructor(scene) {
    this.scene = scene

    this.entitiesById = {};
    this.entities = [];
  }

  createEntityFromPrefab(prefab, depth, x, y) {
    const scene = this.scene;

    const propertiesMap = {
      x,
      y,
      depth,
    };

    const entity = new Entity(prefab)

    prefab.components.forEach((component)=>{
      const componentForEntity = new component.component(scene, {
        ...component.data,
        ...propertiesMap,
      }, entity);

      entity.components.push(componentForEntity)
    })

    this.entitiesById[entity.id] = entity;
    this.entities.push(entity);

    return entity
  }

  getEntityById(id) {
    return this.entitiesById[id];
  }

  getEntities(identifier) {
    return this.getEntitiesByComponent(identifier);
  }

  destroy() {
    this.entities.forEach(entity => {
      entity.components.forEach(component => component.destroy());
    });

    this.entitiesById = {};
    this.entities = [];
  }

  getEntitiesByComponent(component) {
    return this.entities.filter(entity => {
      return entity.hasComponent(component);
    });
  }

  // private getEntitiesByType(type: string) {
  //   return this.entities.filter(entity => entity.type === type);
  // }

}
