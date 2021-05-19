import * as THREE from "https://cdn.skypack.dev/three";

export const ground = (() => {
  class Ground {
    constructor(params) {
      this.params = params;
      this.initialize();
    }

    initialize() {
      // Inicialização do ground
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20000, 20000, 10, 10),
        new THREE.MeshStandardMaterial({
          color: 0x808080,
        })
      );
      ground.castShadow = false;
      ground.receiveShadow = true;
      ground.rotation.x = -Math.PI / 2;
      this.params.scene.add(ground);
    }
  }
  return { Ground: Ground };
})();
