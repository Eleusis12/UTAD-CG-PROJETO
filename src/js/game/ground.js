import * as THREE from "https://cdn.skypack.dev/three";

export const ground = (() => {
  class Ground {
    constructor(params) {
      this.params = params;
      this.initialize();
    }

    initialize() {
      var groundAmbOcclusion = new THREE.TextureLoader().load(
        "resources/ground/Ground_Wet_Rocks_002_ambientOcclusion.jpg"
      );
      var groundNormalTexture = new THREE.TextureLoader().load(
        "resources/ground/Ground_Wet_Rocks_002_normal.jpg"
      );
      var groundBaseTexture = new THREE.TextureLoader().load(
        "resources/ground/Ground_Wet_Rocks_002_basecolor.jpg"
      );
      var groundHeightTexture = new THREE.TextureLoader().load(
        "resources/ground/Ground_Wet_Rocks_002_height.png"
      );
      var groundRoughNessTexture = new THREE.TextureLoader().load(
        "resources/ground/Ground_Wet_Rocks_002_roughness.jpg"
      );

      groundAmbOcclusion.wrapS = groundAmbOcclusion.wrapT =
        THREE.RepeatWrapping;
      groundAmbOcclusion.repeat.set(2000, 2000);
      groundAmbOcclusion.encoding = THREE.sRGBEncoding;

      groundNormalTexture.wrapS = groundNormalTexture.wrapT =
        THREE.RepeatWrapping;
      groundNormalTexture.repeat.set(2000, 2000);
      groundNormalTexture.encoding = THREE.sRGBEncoding;

      groundBaseTexture.wrapS = groundBaseTexture.wrapT = THREE.RepeatWrapping;
      groundBaseTexture.repeat.set(2000, 2000);
      groundBaseTexture.encoding = THREE.sRGBEncoding;

      groundHeightTexture.wrapS = groundHeightTexture.wrapT =
        THREE.RepeatWrapping;
      groundHeightTexture.repeat.set(2000, 2000);
      groundHeightTexture.encoding = THREE.sRGBEncoding;

      groundRoughNessTexture.wrapS = groundRoughNessTexture.wrapT =
        THREE.RepeatWrapping;
      groundRoughNessTexture.repeat.set(2000, 2000);
      groundRoughNessTexture.encoding = THREE.sRGBEncoding;

      var groundMaterial = new THREE.MeshStandardMaterial({
        map: groundBaseTexture,
        aoMap: groundAmbOcclusion,
        normalMap: groundNormalTexture,
        displacementMap: groundHeightTexture,
        roughnessMap: groundRoughNessTexture,
      });

      console.log(groundMaterial);

      var mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10000, 10000),
        groundMaterial
      );
      mesh.position.y = -0.2;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      this.params.scene.add(mesh);
    }
  }
  return { Ground: Ground };
})();
