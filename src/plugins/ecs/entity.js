export class Entity {

  constructor(prefab) {
    this.prefab = prefab
    this.components = [];
  }

  getComponent(componentClass){
    const foundComponent = this.components.find(component => {
      return component instanceof componentClass;
    });

    if (foundComponent) {
      return foundComponent;
    }
  }

  hasComponent(componentClass){
    return this.components.some(component => {
        return component instanceof componentClass;
    });
  }
}