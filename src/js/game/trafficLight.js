import * as THREE from "https://cdn.skypack.dev/three";
import {
	AnimationClip,
	AnimationMixer,
	NumberKeyframeTrack,
} from "../../node_modules/three/build/three.module.js";

export const trafficLight = (() => {
	class TrafficLight {
		constructor(params) {
			this.params = params;
			this.currentLight = 0;
			this.loadModel();
			this.initAnimation();

			this.lightBox_ = this.tlModel.getObjectByName("lightBox");
		}

		initAnimation() {
			const times = [0, 5, 8, 13];
			const valuesGreen = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			const valuesYellow = [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
			const valuesRed = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];

			const greenKF = new NumberKeyframeTrack(
				".material.color",
				times,
				valuesGreen,
				THREE.InterpolateDiscrete
			);
			const yellowKF = new NumberKeyframeTrack(
				".material.color",
				times,
				valuesYellow,
				THREE.InterpolateDiscrete
			);
			const redKF = new NumberKeyframeTrack(
				".material.color",
				times,
				valuesRed,
				THREE.InterpolateDiscrete
			);

			const greenClip = new AnimationClip("green", -1, [greenKF]);
			const yellowClip = new AnimationClip("yellow", -1, [yellowKF]);
			const redClip = new AnimationClip("red", -1, [redKF]);

			this.greenMixer = new AnimationMixer(
				this.tlModel.getObjectByName("greenLight", true)
			);
			this.yellowMixer = new AnimationMixer(
				this.tlModel.getObjectByName("yellowLight", true)
			);
			this.redMixer = new AnimationMixer(
				this.tlModel.getObjectByName("redLight", true)
			);

			const greenAction = this.greenMixer.clipAction(greenClip);
			const yellowAction = this.yellowMixer.clipAction(yellowClip);
			const redAction = this.redMixer.clipAction(redClip);

			greenAction.play();
			yellowAction.play();
			redAction.play();
		}

		loadModel() {
			const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5);
			const lightBoxGeometry = new THREE.BoxGeometry(0.3, 1, 0.5);

			const structureMaterial = new THREE.MeshPhongMaterial({
				color: 0x4b4b4b,
			});

			const pole = new THREE.Mesh(poleGeometry, structureMaterial);
			const lightBox = new THREE.Mesh(lightBoxGeometry, structureMaterial);
			lightBox.name = "lightBox";

			const redLight = new Light({
				name: "redLight",
				y: -0.3,
			}).lightMesh;

			const yellowLight = new Light({
				name: "yellowLight",
				y: 0,
			}).lightMesh;

			const greenLight = new Light({
				name: "greenLight",
				y: 0.3,
			}).lightMesh;

			greenLight.material.color.setHex(0x00ff00);

			lightBox.add(redLight);
			lightBox.add(yellowLight);
			lightBox.add(greenLight);

			pole.add(lightBox);
			lightBox.position.y = 3;

			pole.position.x = -3;

			this.tlModel = pole;

			this.params.scene.add(this.tlModel);
		}

		tick(delta) {
			this.greenMixer.update(delta);
			this.yellowMixer.update(delta);
			this.redMixer.update(delta);
		}
	}

	class Light {
		constructor(params) {
			this.lightMesh = new THREE.Mesh(
				new THREE.CircleGeometry(0.1, 20),
				new THREE.MeshPhongMaterial({ color: 0x000000 })
			);

			this.lightMesh.rotation.y = Math.PI / 2;
			this.lightMesh.position.x = 0.2;
			this.lightMesh.position.y = params.y;
			this.lightMesh.name = params.name;
		}
	}
	return {
		TrafficLight: TrafficLight,
	};
})();
