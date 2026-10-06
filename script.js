const mapBtn = document.getElementById('mapBtn');
const mapContainer = document.getElementById('mapContainer');

let scene, camera, renderer, earth;
let isMapOpen = false;

function initEarth() {
  // Escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Cámara
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 2.5;

  // Renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mapContainer.appendChild(renderer.domElement);

  // Geometría de la Tierra
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // Canvas para textura
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Fondo océano
  ctx.fillStyle = '#1a5490';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tierra (continentes simplificados)
  ctx.fillStyle = '#2d8659';

  // América del Norte
  ctx.fillRect(0, 300, 200, 250);
  // América del Sur
  ctx.fillRect(150, 500, 150, 300);
  // Europa
  ctx.fillRect(700, 200, 200, 200);
  // África
  ctx.fillRect(800, 400, 250, 350);
  // Asia
  ctx.fillRect(1100, 100, 600, 400);
  // Australia
  ctx.fillRect(1600, 650, 200, 150);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.2
  });

  earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  // Luz
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 3, 5);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Evento de resize
  window.addEventListener('resize', onWindowResize);

  // Animación
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (earth) {
    earth.rotation.x += 0.0001;
    earth.rotation.y += 0.0005;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function closeMap() {
  mapContainer.style.display = 'none';
  mapBtn.style.display = 'block';
  isMapOpen = false;
  if (renderer) renderer.dispose();
}

mapBtn.addEventListener('click', () => {
  mapContainer.style.display = 'block';
  mapBtn.style.display = 'none';
  isMapOpen = true;

  // Limpiar si ya existe
  if (renderer) {
    mapContainer.innerHTML = '';
  }

  initEarth();

  // Botón de cerrar
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-map';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', closeMap);
  mapContainer.appendChild(closeBtn);
});
