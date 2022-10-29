import { useEffect, useRef } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scene as BabylonScene } from '@babylonjs/core/scene';
import { Tools } from '@babylonjs/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';

import { GridMaterial } from '@babylonjs/materials/grid/gridMaterial';
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
		
		const material = new GridMaterial('grid', scene);
		const sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);
		sphere.position.y = 2;
		sphere.material = material;

		const ground = CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene);
		ground.material = material;

		engine.runRenderLoop(() => scene.render());
	}, [sceneCanvasRef]);

	return (
		<canvas id='scene-canvas' ref={sceneCanvasRef}></canvas>
	);
};