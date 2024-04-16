import * as THREE from "three";
import { OrbitControls, Wireframe } from "three/examples/jsm/Addons.js";
import * as dat from "dat.gui";
import * as TWEEN from "@tweenjs/tween.js";
import { log } from "three/examples/jsm/nodes/Nodes.js";

// Set up the scene, camera, and renderer

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);

// ----> Cube <-----

var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

scene.add(cube);

// ----> Cylinder <-----

var cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

scene.add(cylinder);

// ----> Icosphere <-----

var icoSphereGeometry = new THREE.IcosahedronGeometry(0.5, 0);
var icoSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var icoSphere = new THREE.Mesh(icoSphereGeometry, icoSphereMaterial);
scene.add(icoSphere);

// Position objects

cube.position.x = -3;
icoSphere.position.x = 3;

// Create GUI
var gui = new dat.GUI();

// Parameters
var options = {
  cube: { width: 1, height: 1, depth: 1 },
  cylinder: { diameter: 1, height: 1 },
  icoSphere: { diameter: 1, subdivisions: 0 },
  wireframe: false,
};

// Cube controls
var cubeFolder = gui.addFolder("Cube");
cubeFolder.add(options.cube, "width", 0.1, 2).onChange(function (value) {
  cube.scale.x = value;
});
cubeFolder.add(options.cube, "height", 0.1, 2).onChange(function (value) {
  cube.scale.y = value;
});
cubeFolder.add(options.cube, "depth", 0.1, 2).onChange(function (value) {
  cube.scale.z = value;
});

// Cylinder controls
var cylinderFolder = gui.addFolder("Cylinder");
cylinderFolder
  .add(options.cylinder, "diameter", 0.1, 2)
  .onChange(function (value) {
    cylinder.scale.x = value;
    cylinder.scale.z = value;
  });
cylinderFolder
  .add(options.cylinder, "height", 0.1, 2)
  .onChange(function (value) {
    cylinder.scale.y = value;
  });

// Icosphere controls
var icoSphereFolder = gui.addFolder("IcoSphere");
const icosphereParams = { diameter: 1, subdivisions: 1 };
const icosphereDiameterController = icoSphereFolder
  .add(icosphereParams, "diameter", 0.1, 2.0)
  .name("Diameter");
const icosphereSubdivisionsController = icoSphereFolder
  .add(icosphereParams, "subdivisions", 1, 10)
  .step(1)
  .name("Subdivisions");

// Update IcoSphere geometry based on GUI input
icosphereDiameterController.onChange((value) => {
  updateIcoSphereGeometry();
});
icosphereSubdivisionsController.onChange((value) => {
  updateIcoSphereGeometry();
});

function updateIcoSphereGeometry() {
  const newGeometry = new THREE.IcosahedronGeometry(
    icosphereParams.diameter / 2,
    icosphereParams.subdivisions
  );
  icoSphere.geometry.dispose();
  icoSphere.geometry = newGeometry;
}

// Set up raycaster
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// Function to animate the camera towards the target position
function animateCamera(targetPosition, target) {
  var startPosition = camera.position.clone();
  var startTarget = camera
    .getWorldDirection(new THREE.Vector3())
    .multiplyScalar(10)
    .add(startPosition);

  new TWEEN.Tween(camera.position)
    .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function () {
      camera.lookAt(target);
    })
    .start();

  new TWEEN.Tween(
    camera
      .getWorldDirection(new THREE.Vector3())
      .multiplyScalar(10)
      .add(startPosition)
  )
    .to(target, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function () {
      camera.lookAt(target);
    })
    .start();
}

// Function to handle mouse click
function onMouseClick(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children, true);

  // Check if the ray intersects with any object
  if (intersects.length > 0) {
    // Get the first intersected object (closest to the camera)
    var selectedObject = intersects[0].object;
    if (selectedObject === cube) {
      cube.position.x = 0;
      cylinder.position.x = 3;
      icoSphere.position.x = 4;
      cubeFolder.open();
    } else if (selectedObject === cylinder) {
      cube.position.x = -3;
      selectedObject.position.x = 0;
      icoSphere.position.x = 3;
      cubeFolder.close();
      cylinderFolder.open();
    } else if (selectedObject === icoSphere) {
      cube.position.x = -3;
      cylinder.position.x = 3;
      selectedObject.position.x = 0;
      cubeFolder.close();
      cylinderFolder.close();
      icoSphereFolder.open();
    }

    // Calculate target position
    var target = selectedObject.position.clone();

    // Calculate camera position
    var cameraDistance =
      (selectedObject.geometry.boundingSphere.radius * 2) /
      Math.tan((Math.PI * camera.fov) / 320);
    var cameraPosition = target
      .clone()
      .add(new THREE.Vector3(0, 0, cameraDistance));

    // Animate camera towards the object
    animateCamera(cameraPosition, target);
  }
}
// Add event listener for mouse click
window.addEventListener("click", onMouseClick, false);

orbit.update();

// Set up the camera

camera.position.set(0, 0, 5);
camera.lookAt(scene.position);


// Render loop
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  
  renderer.render(scene, camera);
}
animate();
