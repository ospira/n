import { PlayerControlled } from '../components/PlayerControlled';

export class PlayerWalkingSystem {
  update(allEntities) {
    const entities = allEntities.getEntities(PlayerControlled);
    for (let entity of entities) {
      entity.getComponent(PlayerControlled).update();
    };
  }
}
