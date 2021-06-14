import * as THREE from "https://cdn.skypack.dev/three";

export const carHeadLight = (() => {
	class HeadLight {
		constructor(params) {
			this.params = params;

			console.log(this.params);

			this.InitializeHeadlight(
				this.params.car,
				this.params.shift,
				this.params.name
			);
		}

		InitializeHeadlight(base, shift, name_) {
			this.bulb = new THREE.Mesh(
				new THREE.SphereGeometry(0.5, 5, 5),
				new THREE.MeshBasicMaterial()
			);
			this.bulb.scale.setScalar(0.1);
			this.bulb.position.set(shift, 0.6, -1.9);
			base.add(this.bulb);
			this.light = new THREE.SpotLight(
				0xffffff, // cor
				10, // intensidade
				10, // Máxima Distância
				THREE.Math.degToRad(40), // ANgulo
				0.25 // Penumbra
			);
			this.light.name = name_;
			this.light.position.set(shift, 0.6, -1.9);
			base.add(this.light);
			this.lightTarget = new THREE.Object3D();
			this.lightTarget.position.set(shift, 0.6, -1.9 - 0.1);
			base.add(this.lightTarget);
			this.light.target = this.lightTarget;
		}
	}
	return { HeadLight: HeadLight };
})();
