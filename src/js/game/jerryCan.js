import * as THREE from "https://cdn.skypack.dev/three";
import {
	AnimationClip,
	AnimationMixer,
	VectorKeyframeTrack,
} from "../../node_modules/three/build/three.module.js";

export const jerryCan = (() => {
	class JerryCan {
		constructor(params) {
			this.params = params;
			this.values = [];
			this.times = [];
			this.loadModel();
			this.initAnimation(this.params.pos);
		}

		updateKFTrack(newZ) {
			this.values = [0, 0.8, newZ, 0, 1, newZ, 0, 1.2, newZ];

			const bounceKF = new VectorKeyframeTrack(
				".position",
				this.times,
				this.values
			);

			this.playAnimation(bounceKF);
		}

		playAnimation(KFTrack) {
			const bounceClip = new AnimationClip("bounce", -1, [KFTrack]);

			this.bounceMixer = new AnimationMixer(this.jerryCanModel);

			const bounceAction = this.bounceMixer.clipAction(bounceClip);

			bounceAction.play();
		}

		initAnimation() {
			this.times = [0, 2, 4];
			this.values = [
				0,
				0.5,
				this.params.pos,
				0,
				1.5,
				this.params.pos,
				0,
				2.5,
				this.params.pos,
			];

			const bounceKF = new VectorKeyframeTrack(
				".position",
				this.times,
				this.values
			);

			this.playAnimation(bounceKF);
		}

		loadModel() {
			const modelGeometry = new THREE.BoxGeometry(1, 1, 0.5);

			const structureMaterial = new THREE.MeshPhongMaterial({
				color: 0x4b4b4b,
			});

			const jerryCan = new THREE.Mesh(modelGeometry, structureMaterial);
			jerryCan.name = "jerryCan";

			jerryCan.position.z = -4;
			jerryCan.position.y = 1;

			this.jerryCanModel = jerryCan;

			this.params.scene.add(this.jerryCanModel);
		}

		tick(delta) {
			this.bounceMixer.update(delta);
		}
	}
	return {
		JerryCan: JerryCan,
	};
})();
