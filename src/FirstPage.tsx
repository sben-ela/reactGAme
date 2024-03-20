
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xF40A0A);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.50, 5000 );
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0xffffff, 0); 
renderer.setSize( window.innerWidth, window.innerHeight );
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 50;
controls.maxDistance = 500;
document.body.appendChild( renderer.domElement );
controls.update()



let textMesh : THREE.Mesh;
function FirstPage(){
  // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // const cube = new THREE.Mesh( geometry, material );
  // scene.add( cube );

  const loader = new FontLoader();
  const gltfLoader = new GLTFLoader();

  gltfLoader.load('button.glb', function(gltf : any){
    const object = gltf.scene;
    object.scale.set(50, 50, 50);
    object.rotation.x = Math.PI / 2;
    object.position.y = 100;
    scene.add(object);
  })
  loader.load('Madimi One_Regular.json', function (font) {
    const geometry = new TextGeometry('Ping Pong', {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    });


    textMesh = new THREE.Mesh(geometry, [
      new THREE.MeshPhongMaterial({ color: 0x2BE911 }),
      new THREE.MeshPhongMaterial({ color: 0x7F50B })
    ]);
    
    textMesh.castShadow = true;
    textMesh.position.y = 0;
    textMesh.position.z = 0;
    textMesh.position.x = -100;
    textMesh.scale.set(0.5, 0.5, 0.5);
    scene.add(textMesh);
    
  });
  
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
  camera.position.z = 179;
  camera.position.x = 31;
  camera.position.y = 60;

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(50000, 50000), new THREE.MeshPhongMaterial({color : 0xF40A0A, side : THREE.DoubleSide}));
  plane.rotation.x = -Math.PI / 2;
  plane.scale.set(4, 4, 4);
  plane.receiveShadow = true;
  scene.add(plane);
  function animate() {
    if (textMesh) {
      // textMesh.rotation.y += 0.05;
      // textMesh.rotation.x += 0.03;
    }
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  }
  
  animate();
  
}

export default FirstPage;