import * as THREE from 'three';
import './styles.scss';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Plane, PlaneHelper, Vector3 } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color(0x2F2F2F);

const geometry =  new THREE.SphereBufferGeometry(1, 5, 5)
geometry.computeVertexNormals();
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00, flatShading: true } );
const light = new THREE.DirectionalLight(0xffffff, 1);

const cube = new THREE.Mesh( geometry, material );
const controls = new OrbitControls(camera, renderer.domElement);
const plane = new PlaneHelper(new Plane().setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3(0)), 500)
cube.geometry.computeVertexNormals();
scene.add( cube );
scene.add(new THREE.AxesHelper(500));
scene.add(plane)
// light.position.set(1, 1, 0);
scene.add(light);

camera.position.z = 5;


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
    controls.update();
};


animate();