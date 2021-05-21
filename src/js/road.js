import * as THREE from "https://cdn.skypack.dev/three";

import { math } from "./libs/helpers/math.js";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";

export const road = (() => {
  class Road {
    constructor(params) {
      this.params = params;
      var mapStrips = THREE.ImageUtils.loadTexture(
        "resources/textures/road/strips.jpg"
      );
      mapStrips.wrapS = mapStrips.wrapT = THREE.RepeatWrapping;
      mapStrips.magFilter = THREE.NearestFilter;
      mapStrips.repeat.set(1, 512);

      this.generateRoad(
        this.params.ROAD_LENGTH,
        this.params.ROAD_WIDTH,
        this.params.CENTER_WIDTH,
        new THREE.MeshPhongMaterial({
          color: 0x222222,
          ambient: 0x222222,
          specular: 0x222222,
          perPixel: true,
        }),
        new THREE.MeshPhongMaterial({
          color: 0xffee00,
          ambient: 0xffee00,
          specular: 0xffee00,
          map: mapStrips,
          perPixel: true,
          alphaTest: 0.5,
        })
      );
    }

    generateRoad(
      roadLength,
      roadWidth,
      centerWidth,
      materialRoad,
      materialCenter
    ) {
      this.groundGeo = new THREE.PlaneBufferGeometry(roadWidth, roadLength);
      this.centerGeo = new THREE.PlaneBufferGeometry(centerWidth, roadLength);

      this.ground = new THREE.Mesh(this.groundGeo, materialRoad);
      this.center = new THREE.Mesh(this.centerGeo, materialCenter);

      this.ground.receiveShadow = true;
      this.center.receiveShadow = true;

      this.ground.position.y = 0.1;
      this.ground.rotation.x = -Math.PI / 2;
      this.center.position.y = 0.1;
      this.center.rotation.x = -Math.PI / 2;

      this.params.scene.add(this.ground);
      this.params.scene.add(this.center);
    }
  }
  return { Road: Road };
})();
