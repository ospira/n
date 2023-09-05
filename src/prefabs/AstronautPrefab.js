import { SpriteComponent } from "../components/SpriteComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { PlayerControlled } from "../components/PlayerControlled";
import { ReactsToZones } from "../components/ReactsToZones";

export const AstronautPrefab = {
  components: [
    {
        component: SpriteComponent,
        data: {
          texture: "astronaut-core",
        }
    },
    {
        component: PhysicsBodyComponent,
        data: {
          collideWorldBounds: true,
        }
    },
    {
      component: PlayerControlled,
    },
    {
        component: ReactsToZones,
    },
  ]
}
