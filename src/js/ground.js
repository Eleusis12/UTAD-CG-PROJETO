import * as THREE from "https://cdn.skypack.dev/three";
import { road } from "./road.js";

export const ground = (() => {
  class Ground {
    constructor(params) {
      this.params = params;
      this.initialize();
    }

    initialize() {
      const texture = new THREE.TextureLoader().load(
        "resources/textures/photos_2015_09_18_fst_345jhh0ja3i.jpg"
      );

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10000, 10000);
      texture.encoding = THREE.sRGBEncoding;

      var groundMaterial = new THREE.MeshStandardMaterial({
        map: texture,
      });

      var mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10000, 10000),
        groundMaterial
      );
      mesh.position.y = 0.0;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      this.params.scene.add(mesh);

      // Agora vamos adicionar a a via da estrada ao chão

      this.road = new road.Road({
        scene: this.params.scene,
        ROAD_LENGTH: 10000,
        ROAD_WIDTH: 7,
        CENTER_WIDTH: 0.12,
      });
    }
  }
  return { Ground: Ground };
})();
