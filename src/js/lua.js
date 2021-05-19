import * as THREE from "https://cdn.skypack.dev/three";

export const lua = (() => {
  class Lua {
    constructor(params) {
      this.params = params;
      this.initialize();
    }

    initialize() {
      // Configuração da luz da lua
      let light = new THREE.DirectionalLight(0xffffff, 1.0);
      light.position.set(60, 100, 10);
      light.target.position.set(40, 0, 0);
      light.castShadow = true;
      light.shadow.bias = -0.001;
      light.shadow.mapSize.width = 4096;
      light.shadow.mapSize.height = 4096;
      light.shadow.camera.far = 200.0;
      light.shadow.camera.near = 1.0;
      light.shadow.camera.left = 50;
      light.shadow.camera.right = -50;
      light.shadow.camera.top = 50;
      light.shadow.camera.bottom = -50;
      this.params.scene.add(light);
    }
  }
  return { Lua: Lua };
})();
