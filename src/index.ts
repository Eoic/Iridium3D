import * as THREE from 'three';
import { SceneManager } from './core/scene-manager';
import './styles.scss';



const sceneManager = new SceneManager();
const geometry =  new THREE.SphereBufferGeometry(1, 10, 10)
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00, flatShading: true } );
const cube = new THREE.Mesh( geometry, material );
const cube1 = new THREE.Mesh( geometry, material );
cube.position.set(1, 0, 0);
cube1.renderOrder = 10000;


sceneManager.camera.position.set(10, 10, 10);

const axes = new THREE.AxesHelper(500);
sceneManager.addObject(cube);
sceneManager.addObject(cube1);
sceneManager.addObject(axes);

// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { LuminanceFormat, Mesh, Plane, PlaneHelper, Vector2, Vector3 } from 'three';
// import { CustomMouseEvent, EventManager, EventPayload } from './core/event-manager';
// import { Physics } from './core/physics';
// import './extensions/raycasting';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
// scene.background = new THREE.Color(0x2F2F2F);

// geometry.computeVertexNormals();

// const light = new THREE.PointLight(0xffffff, 1, 300);
// // scene.add(new THREE.AmbientLight(0xffffff, 0.1));
// const controls = new OrbitControls(camera, renderer.domElement);
// const plane = new PlaneHelper(new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3(0)), 500, 0xfafafa)
// cube.geometry.computeVertexNormals();
// scene.add(cube);

// const cube1 = new THREE.Mesh( geometry, material );
// cube1.position.set(10, 0, 0)
// scene.add(cube1)

// const cube2 = new THREE.Mesh( geometry, material );
// cube2.position.set(0, 0, 10)
// scene.add(cube2)

// scene.add(new THREE.AxesHelper(500));
// scene.add(plane)
// scene.add(light);
// camera.position.z = 5;
// camera.add(light)
// scene.add(camera)

// console.log(scene.children);





// window.addEventListener('resize', () => {
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
// });

// const animate = function () {
//     requestAnimationFrame( animate );

//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render( scene, camera );
//     controls.update();

//     // light.position.copy(camera.position)
// };


// renderer.domElement.addEventListener('click', (event: MouseEvent) => {
//     const normalizedPosition = new Vector2(
//         (event.clientX / window.innerWidth) * 2 - 1,
//         -(event.clientY / window.innerHeight) * 2 + 1
//     );
    
//     const eventPayload = new EventPayload<MouseEvent, CustomMouseEvent>(event, { normalizedPosition });
//     EventManager.dispatch('click', eventPayload);
// });

// EventManager.on('click', (data: EventPayload<MouseEvent, CustomMouseEvent> | undefined) => {
//     if (!data || !data.customData) return;

//     const result = Physics.getFirstIntersection(scene.children, camera, data.customData.normalizedPosition);
//     console.log(result);
// });

// animate();