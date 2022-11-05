import { useEffect, useRef } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { Tools, Color3 } from '@babylonjs/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';

import { SimpleMaterial } from '@babylonjs/materials/simple/simpleMaterial';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';

export const Scene = () => {
	const sceneCanvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const engine = new Engine(sceneCanvasRef.current);
		const scene: BabylonScene = new BabylonScene(engine);
		const camera = new ArcRotateCamera('camera', Tools.ToRadians(90), Tools.ToRadians(65), 10, Vector3.Zero(), scene);
		camera.setTarget(Vector3.Zero());
		camera.attachControl(sceneCanvasRef.current, true);

		const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
		light.intensity = 0.7;
		
		const sphereMaterial = new SimpleMaterial('sphere', scene);
		const groundMaterial = new SimpleMaterial('ground', scene);
		const sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);
		sphere.position.y = 2;
		sphere.material = sphereMaterial;

		const ground = CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene);
		ground.material = groundMaterial;

		let time = 0;

		engine.runRenderLoop(() => {
			const r1 = Math.round(Math.abs(Math.sin(time / 60) * 200));
			const g1 = Math.round(Math.abs(Math.sin(time / 120) * 200));
			const b1 = Math.round(Math.abs(Math.sin(time / 180) * 200));
			const r2 = Math.round(Math.abs(Math.sin(time / 180) * 200));
			const g2 = Math.round(Math.abs(Math.sin(time / 120) * 200));
			const b2 = Math.round(Math.abs(Math.sin(time / 60) * 200));
			sphereMaterial.diffuseColor = Color3.FromInts(r1 + 55, g1 + 55, b1 + 55);
			groundMaterial.diffuseColor = Color3.FromInts(r2 + 55, g2 + 55, b2 + 55);
			time++;
			scene.render();
		});
	}, [sceneCanvasRef]);

	return (
		<canvas id='scene-canvas' ref={sceneCanvasRef}></canvas>
	);
};