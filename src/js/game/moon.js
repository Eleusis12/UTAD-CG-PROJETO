import * as THREE from "https://cdn.skypack.dev/three";

export const moon = (() => {
	class Moon {
		constructor(params) {
			this.params = params;
			this.initialize();
		}

		initialize() {
			// LIGHTS

			const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
			hemiLight.color.setHSL(0.6, 1, 0.6);
			hemiLight.groundColor.setHSL(0.095, 1, 0.75);
			hemiLight.position.set(0, 50, 0);
			this.params.scene.add(hemiLight);

			const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
			this.params.scene.add(hemiLightHelper);

			//

			const dirLight = new THREE.DirectionalLight(0xffffff, 1);
			//direction light color
			//dirLight.color.setHSL(0.1, 1, 0.95);
			dirLight.color.setHSL(0, 0, 0);
			dirLight.position.set(-1, 1.75, 1);
			dirLight.position.multiplyScalar(30);
			dirLight.name = "dirLight";
			this.params.scene.add(dirLight);

			dirLight.castShadow = true;

			dirLight.shadow.mapSize.width = 2048;
			dirLight.shadow.mapSize.height = 2048;

			const d = 50;

			dirLight.shadow.camera.left = -d;
			dirLight.shadow.camera.right = d;
			dirLight.shadow.camera.top = d;
			dirLight.shadow.camera.bottom = -d;

			dirLight.shadow.camera.far = 3500;
			dirLight.shadow.bias = -0.0001;
		}
	}
	return { Moon: Moon };
})();
