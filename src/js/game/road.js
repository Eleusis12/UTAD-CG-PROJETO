import * as THREE from "https://cdn.skypack.dev/three";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";

export const road = (() => {
  class Road {
    constructor(params) {
      this.params = params;

      this.generateRoad();
    }

    generateRoad() {
      // Importação das texturas
      var roadAmbOcclusion = new THREE.TextureLoader().load(
        "resources/road/Road_001_ambientOcclusion.jpg"
      );
      var roadNormalTexture = new THREE.TextureLoader().load(
        "resources/road/Road_001_normal.jpg"
      );
      var roadBaseTexture = new THREE.TextureLoader().load(
        "resources/road/Road_001_basecolor.jpg"
      );
      var roadHeightTexture = new THREE.TextureLoader().load(
        "resources/road/Road_001_height.png"
      );
      var roadRoughNessTexture = new THREE.TextureLoader().load(
        "resources/road/Road_001_roughness.jpg"
      );

      // // Pretendemos que a rua apenas se repita na ordenada

      roadAmbOcclusion.wrapS = THREE.ClampToEdgeWrapping;
      roadAmbOcclusion.wrapT = THREE.RepeatWrapping;
      roadAmbOcclusion.repeat.set(1, 1000);
      roadAmbOcclusion.encoding = THREE.sRGBEncoding;

      roadNormalTexture.wrapS = THREE.ClampToEdgeWrapping;
      roadNormalTexture.wrapT = THREE.RepeatWrapping;
      roadNormalTexture.repeat.set(1, 1000);
      roadNormalTexture.encoding = THREE.sRGBEncoding;

      roadBaseTexture.wrapS = THREE.ClampToEdgeWrapping;
      roadBaseTexture.wrapT = THREE.RepeatWrapping;
      roadBaseTexture.repeat.set(1, 1000);
      roadBaseTexture.encoding = THREE.sRGBEncoding;

      roadHeightTexture.wrapS = THREE.ClampToEdgeWrapping;
      roadHeightTexture.wrapT = THREE.RepeatWrapping;
      roadHeightTexture.repeat.set(1, 1000);
      roadHeightTexture.encoding = THREE.sRGBEncoding;

      roadRoughNessTexture.wrapS = THREE.ClampToEdgeWrapping;
      roadRoughNessTexture.wrapT = THREE.RepeatWrapping;
      roadRoughNessTexture.repeat.set(1, 1000);
      roadRoughNessTexture.encoding = THREE.sRGBEncoding;

      var roadMaterial = new THREE.MeshStandardMaterial({
        map: roadBaseTexture,
        aoMap: roadAmbOcclusion,
        normalMap: roadNormalTexture,
        displacementMap: roadHeightTexture,
        roughnessMap: roadRoughNessTexture,
      });

      var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(7, 10000, 5, 2000),
        roadMaterial
      );

      mesh.position.y = -0.5;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      this.params.scene.add(mesh);
    }
    // generateRoad(
    //   roadLength,
    //   roadWidth,
    //   centerWidth,
    //   materialRoad,
    //   materialCenter
    // ) {
    //   this.groundGeo = new THREE.PlaneBufferGeometry(roadWidth, roadLength);
    //   this.centerGeo = new THREE.PlaneBufferGeometry(centerWidth, roadLength);

    //   this.ground = new THREE.Mesh(this.groundGeo, materialRoad);
    //   this.center = new THREE.Mesh(this.centerGeo, materialCenter);

    //   this.ground.receiveShadow = true;
    //   this.center.receiveShadow = true;

    //   this.ground.position.y = 0.1;
    //   this.ground.rotation.x = -Math.PI / 2;
    //   this.center.position.y = 0.1;
    //   this.center.rotation.x = -Math.PI / 2;

    //   this.params.scene.add(this.ground);
    //   this.params.scene.add(this.center);
    // }
  }
  return { Road: Road };
})();
