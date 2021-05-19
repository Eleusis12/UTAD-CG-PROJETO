import * as THREE from "https://cdn.skypack.dev/three";

import { math } from "./libs/helpers/math.js";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";

export const background = (() => {
  class BackgroundCloud {
    constructor(params) {
      this.params = params;
      this.position = new THREE.Vector3();
      this.quaternion = new THREE.Quaternion();
      this.scale = 1.0;
      this.mesh = null;

      this.loadModel();
    }

    loadModel() {
      const loader = new GLTFLoader();
      loader.setPath("/resources/Clouds/GLTF/");
      var self = this;
      loader.load("Cloud" + math.rand_int(1, 3) + ".glb", (glb) => {
        self.mesh = glb.scene;
        self.params.scene.add(self.mesh);

        self.position.x = math.rand_range(0, 2000);
        self.position.y = math.rand_range(100, 200);
        self.position.z = math.rand_range(500, -1000);
        self.scale = math.rand_range(10, 20);

        const q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          math.rand_range(0, 360)
        );
        self.quaternion.copy(q);

        self.mesh.traverse((c) => {
          if (c.geometry) {
            c.geometry.computeBoundingBox();
          }

          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }

          for (let m of materials) {
            if (m) {
              m.specular = new THREE.Color(0x000000);
              m.emissive = new THREE.Color(0xc0c0c0);
            }
          }
          c.castShadow = true;
          c.receiveShadow = true;
        });
      });
    }

    update(timeElapsed) {
      if (!this.mesh) {
        return;
      }

      this.position.x -= timeElapsed * 10;
      if (this.position.x < -100) {
        this.position.x = math.rand_range(2000, 3000);
      }

      this.mesh.position.copy(this.position);
      this.mesh.quaternion.copy(this.quaternion);
      this.mesh.scale.setScalar(this.scale);
    }
  }

  class BackgroundCrap {
    constructor(params) {
      this.params = params;
      this.position = new THREE.Vector3();
      this.quaternion = new THREE.Quaternion();
      this.scale = 1.0;
      this.mesh = null;

      this.loadModel();
    }

    loadModel() {
      const assets = [
        ["SmallPalmTree.glb", "PalmTree.png", 3],
        ["BigPalmTree.glb", "PalmTree.png", 5],
        ["Skull.glb", "Ground.png", 1],
        ["Pyramid.glb", "Ground.png", 40],
        ["Monument.glb", "Ground.png", 10],
        ["Cactus1.glb", "Ground.png", 5],
        ["Cactus2.glb", "Ground.png", 5],
        ["Cactus3.glb", "Ground.png", 5],
      ];
      const [asset, textureName, scale] =
        assets[math.rand_int(0, assets.length - 1)];

      const texLoader = new THREE.TextureLoader();
      const texture = texLoader.load(
        "resources/DesertPack/Blend/Textures/" + textureName
      );
      texture.encoding = THREE.sRGBEncoding;

      const loader = new GLTFLoader();
      loader.setPath("resources/DesertPack/GLTF/");
      loader.load(asset, (glb) => {
        this.mesh = glb.scene;
        console.log(this.params.scene);
        this.params.scene.add(this.mesh);

        this.position.x = math.rand_range(0, 2000);
        this.position.z = math.rand_range(500, -1000);
        this.scale = scale;

        const q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          math.rand_range(0, 360)
        );
        this.quaternion.copy(q);

        this.mesh.traverse((c) => {
          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }

          for (let m of materials) {
            if (m) {
              if (texture) {
                m.map = texture;
              }
              m.specular = new THREE.Color(0x000000);
            }
          }
          c.castShadow = true;
          c.receiveShadow = true;
        });
      });
    }

    update(timeElapsed) {
      if (!this.mesh) {
        return;
      }

      this.position.x -= timeElapsed * 10;
      if (this.position.x < -100) {
        this.position.x = math.rand_range(2000, 3000);
      }

      this.mesh.position.copy(this.position);
      this.mesh.quaternion.copy(this.quaternion);
      this.mesh.scale.setScalar(this.scale);
    }
  }

  class Background {
    constructor(params) {
      this.params = params;
      this.clouds = [];
      this.crap = [];

      this.spawnClouds();
      this.spawnCrap();
    }

    spawnClouds() {
      for (let i = 0; i < 25; ++i) {
        const cloud = new BackgroundCloud(this.params);

        this.clouds.push(cloud);
      }
    }

    spawnCrap() {
      for (let i = 0; i < 50; ++i) {
        const crap = new BackgroundCrap(this.params);

        this.crap.push(crap);
      }
    }

    update(timeElapsed) {
      for (let c of this.clouds) {
        c.update(timeElapsed);
      }
      for (let c of this.crap) {
        c.update(timeElapsed);
      }
    }
  }

  return {
    Background: Background,
  };
})();
