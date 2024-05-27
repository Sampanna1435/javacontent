import './style.css';
import * as THREE from "three";
import GUI from 'lil-gui';
import Stats from 'stats-js';

console.log(THREE);

// UI Debugging
const gui = new GUI();

// FPS Debugging
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/*--------------------
Required Elements
--------------------*/

// Get canvas
const canvas = document.querySelector(".webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 2, 15);
scene.add(camera);

// Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

/*--------------------
Add Objects
--------------------*/

// Material
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

// UI Debugging
gui.addColor(material, "color");
gui.add(material, "metalness", 0, 1, 0.001);
gui.add(material, "roughness", 0, 1, 0.001);

// Pyramid Geometry
const pyramidGeometry = new THREE.ConeGeometry(1, 2, 4);
const pyramid = new THREE.Mesh(pyramidGeometry, material);
scene.add(pyramid);

// Star Geometry
const createStarGeometry = (radius, points, innerRadius) => {
  const shape = new THREE.Shape();
  const angleStep = (Math.PI * 2) / points;

  for (let i = 0; i < points; i++) {
    const outerAngle = i * angleStep;
    const innerAngle = outerAngle + angleStep / 2;

    const x0 = Math.cos(outerAngle) * radius;
    const y0 = Math.sin(outerAngle) * radius;
    const x1 = Math.cos(innerAngle) * innerRadius;
    const y1 = Math.sin(innerAngle) * innerRadius;

    if (i === 0) {
      shape.moveTo(x0, y0);
    } else {
      shape.lineTo(x0, y0);
    }

    shape.lineTo(x1, y1);
  }

  shape.closePath();
  const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
};

const starGeometry = createStarGeometry(0.5, 5, 0.2);
const star = new THREE.Mesh(starGeometry, material);
scene.add(star);

// Torus (3D Circle) Geometry
const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
const torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);

// Cylinder Geometry
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const cylinder = new THREE.Mesh(cylinderGeometry, material);
scene.add(cylinder);

// Set initial positions
pyramid.position.set(-4, 0, 0);
star.position.set(-2, 0, 0);
torus.position.set(0, 0, 0);
cylinder.position.set(2, 0, 0);

/*--------------------
Add Particles
--------------------*/

const bufferGeometry = new THREE.BufferGeometry();
const count = 700;
const vertices = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 10;
}

bufferGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);

const pointMaterial = new THREE.PointsMaterial({
  size: 0.025,
  sizeAttenuation: true,
  color: 0x000000,
});

const particles = new THREE.Points(bufferGeometry, pointMaterial);
scene.add(particles);

/*--------------------
Event Handling
--------------------*/

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// Mouse interaction
const cursor = {
  x: 0,
  y: 0,
};

// Adding distance tracking
const dist = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = 0.5 - e.clientY / sizes.height;
});

// Animation
const animate = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();

  // Rotate objects
  pyramid.rotation.x += 0.01;
  pyramid.rotation.y += 0.01;

  star.rotation.x += 0.01;
  star.rotation.y += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  cylinder.rotation.x += 0.01;
  cylinder.rotation.y += 0.01;

  // Move objects randomly
  pyramid.position.x += (Math.random() - 0.5) * 0.01;
  pyramid.position.y += (Math.random() - 0.5) * 0.01;
  pyramid.position.z += (Math.random() - 0.5) * 0.01;

  star.position.x += (Math.random() - 0.5) * 0.01;
  star.position.y += (Math.random() - 0.5) * 0.01;
  star.position.z += (Math.random() - 0.5) * 0.01;

  torus.position.x += (Math.random() - 0.5) * 0.01;
  torus.position.y += (Math.random() - 0.5) * 0.01;
  torus.position.z += (Math.random() - 0.5) * 0.01;

  cylinder.position.x += (Math.random() - 0.5) * 0.01;
  cylinder.position.y += (Math.random() - 0.5) * 0.01;
  cylinder.position.z += (Math.random() - 0.5) * 0.01;

  // Move camera based on mouse
  dist.x += (cursor.x - dist.x) * 0.01;
  dist.y += (cursor.y - dist.y) * 0.01;
  camera.position.x = dist.x;
  camera.position.y = dist.y;

  requestAnimationFrame(animate);
};

animate();
