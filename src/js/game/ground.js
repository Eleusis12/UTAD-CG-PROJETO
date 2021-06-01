import * as THREE from "https://cdn.skypack.dev/three";
import { ImprovedNoise } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/math/ImprovedNoise.js";

export const ground = (() => {
  class Ground {
    constructor(params) {
      this.params = params;
      this.initialize();
    }

    initialize() {
      this.loadTextures();

      this.setupTexture(this.groundAmbOcclusion, 2, 2000);
      this.setupTexture(this.groundNormalTexture, 2, 2000);
      this.setupTexture(this.groundColorTexture, 2, 2000);
      this.setupTexture(this.groundHeightTexture, 2, 2000);
      this.setupTexture(this.groundRoughNessTexture, 2, 2000);

      var groundMaterial = new THREE.MeshStandardMaterial({
        map: this.groundColorTexture,
        aoMap: this.groundAmbOcclusion,
        normalMap: this.groundNormalTexture,
        displacementMap: this.groundHeightTexture,
        roughnessMap: this.groundRoughNessTexture,
      });

      // const data = this.generateHeight(20000, 20000);
      var geometryLand = new THREE.PlaneBufferGeometry(20, 20000, 100, 100);
      var geometryLandWithBumps = new THREE.PlaneBufferGeometry(
        500,
        20000,
        100,
        100
      );

      this.setupTexture(this.hillsColorTexture, 100, 4000);
      this.setupTexture(this.hillsAmbOcclusion, 100, 4000);
      this.setupTexture(this.hillsNormalTexture, 100, 4000);
      this.setupTexture(this.hillsHeightTexture, 100, 4000);
      this.setupTexture(this.hillsRoughNessTexture, 100, 4000);

      var hillsMaterial = new THREE.MeshStandardMaterial({
        map: this.hillsColorTexture,
        aoMap: this.hillsAmbOcclusion,
        normalMap: this.hillsNormalTexture,
        displacementMap: this.hillsHeightTexture,
        emissiveMap: this.hillsEmissiveTexture,
      });

      this.generateHeight(geometryLandWithBumps);

      // Meshes
      var mesh = new THREE.Mesh(geometryLandWithBumps, hillsMaterial);
      mesh.position.y = -10;
      mesh.position.x = -250;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      this.params.scene.add(mesh);

      var mesh = new THREE.Mesh(geometryLand, groundMaterial);
      mesh.position.y = -1;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      this.params.scene.add(mesh);
    }

    loadTextures() {
      // Texturas para o chão
      this.groundAmbOcclusion = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013715Z-001/Stylized_Stone_Floor_003_ambientOcclusion.jpg"
      );
      this.groundNormalTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013715Z-001/Stylized_Stone_Floor_003_normal.jpg"
      );
      this.groundColorTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013715Z-001/Stylized_Stone_Floor_003_basecolor.jpg"
      );
      this.groundHeightTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013715Z-001/Stylized_Stone_Floor_003_height.png"
      );
      this.groundRoughNessTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013715Z-001/Stylized_Stone_Floor_003_roughness.jpg"
      );

      // Texturas para o chão, das colinas que estão afastadas
      this.hillsAmbOcclusion = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013720Z-001/Grass_005_AmbientOcclusion.jpg"
      );
      this.hillsNormalTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013720Z-001/Grass_005_Normal.jpg"
      );
      this.hillsColorTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013720Z-001/Grass_005_BaseColor.jpg"
      );
      this.hillsHeightTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013720Z-001/Grass_005_Height.png"
      );
      this.hillsRoughNessTexture = new THREE.TextureLoader().load(
        "resources/ground/drive-download-20210601T013720Z-001/Grass_005_Roughness.jpg"
      );
    }
    setupTexture(texture, width, height) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(width, height);
      texture.encoding = THREE.sRGBEncoding;
    }
    generateHeight(geometry) {
      var pos = geometry.attributes.position;
      let center = new THREE.Vector3(0, 0, 0);
      var vec3 = new THREE.Vector3(); // re-use
      for (var i = 0, l = pos.count; i < l; i++) {
        vec3.fromBufferAttribute(pos, i);
        vec3.sub(center);

        var z = Math.cos(vec3.length()) * 10;

        pos.setZ(i, z);
      }

      pos.needsUpdate = true;
    }
  }
  return { Ground: Ground };
})();
