const countries = [
  { name: 'México', flag: '🇲🇽', lat: 23.63, lon: -102.55 },
  { name: 'Argentina', flag: '🇦🇷', lat: -38.42, lon: -63.62 },
  { name: 'Brasil', flag: '🇧🇷', lat: -14.24, lon: -51.93 },
  { name: 'España', flag: '🇪🇸', lat: 40.46, lon: -3.75 },
  { name: 'Francia', flag: '🇫🇷', lat: 46.23, lon: 2.21 },
  { name: 'Alemania', flag: '🇩🇪', lat: 51.17, lon: 10.45 },
  { name: 'Italia', flag: '🇮🇹', lat: 41.87, lon: 12.57 },
  { name: 'Canadá', flag: '🇨🇦', lat: 56.13, lon: -106.35 },
  { name: 'Estados Unidos', flag: '🇺🇸', lat: 37.09, lon: -95.71 },
  { name: 'Reino Unido', flag: '🇬🇧', lat: 55.38, lon: -3.44 },
  { name: 'Japón', flag: '🇯🇵', lat: 36.2, lon: 138.25 },
  { name: 'Colombia', flag: '🇨🇴', lat: 4.71, lon: -74.07 },
  { name: 'Perú', flag: '🇵🇪', lat: -9.19, lon: -75.02 },
  { name: 'Australia', flag: '🇦🇺', lat: -25.27, lon: 133.78 },
  { name: 'Sudáfrica', flag: '🇿🇦', lat: -30.56, lon: 22.94 }
];

const playBtn = document.getElementById('playBtn');
const selectorSection = document.getElementById('selectorSection');
const closeBtn = document.getElementById('closeBtn');
const countryList = document.getElementById('countryList');
const countryResult = document.getElementById('countryResult');
const countryName = document.getElementById('countryName');
const flag = document.getElementById('flag');
const globeContainer = document.getElementById('globeContainer');

let globeRenderer;
let globeScene;
let globeCamera;
let globe;
let markerSphere;
let markerRing;
let rotationId = null;
let currentCountry = null;

function openSelector() {
  selectorSection.classList.remove('hidden');
  renderCountries();
}

function closeSelector() {
  selectorSection.classList.add('hidden');
  countryResult.classList.add('hidden');
}

function selectCountry(country) {
  currentCountry = country;
  flag.textContent = country.flag;
  countryName.textContent = country.name;
  countryResult.classList.remove('hidden');
  selectorSection.classList.add('hidden');
  initializeGlobe();
  updateMarker(country);
}

function renderCountries() {
  countryList.innerHTML = '';

  countries.forEach((country) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'country-item';
    button.innerHTML = `
      <span class="country-flag">${country.flag}</span>
      <span class="country-name">${country.name}</span>
    `;

    button.addEventListener('click', () => selectCountry(country));
    countryList.appendChild(button);
  });
}

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

function buildGlobeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f3f3f3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(17, 17, 17, 0.18)';
  ctx.lineWidth = 1;

  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((lat + 90) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  for (let lon = 0; lon <= 360; lon += 30) {
    const x = (lon / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

function initializeGlobe() {
  if (!window.THREE) return;

  if (!globeRenderer) {
    globeScene = new THREE.Scene();
    globeCamera = new THREE.PerspectiveCamera(45, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
    globeCamera.position.z = 5;

    globeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    globeRenderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globeContainer.appendChild(globeRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    globeScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.4);
    pointLight.position.set(5, 3, 5);
    globeScene.add(pointLight);

    const globeGeometry = new THREE.SphereGeometry(1.75, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: buildGlobeTexture(),
      metalness: 0.08,
      roughness: 0.85,
      transparent: true,
      opacity: 1
    });

    globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeScene.add(globe);

    const wireframe = new THREE.Mesh(
      globeGeometry,
      new THREE.MeshBasicMaterial({ color: '#111111', wireframe: true, transparent: true, opacity: 0.25 })
    );
    globeScene.add(wireframe);

    markerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 20, 20),
      new THREE.MeshBasicMaterial({ color: '#111111' })
    );
    markerSphere.visible = false;
    globeScene.add(markerSphere);

    const ringGeometry = new THREE.TorusGeometry(0.18, 0.012, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: '#111111' });
    markerRing = new THREE.Mesh(ringGeometry, ringMaterial);
    markerRing.visible = false;
    markerRing.rotation.x = Math.PI / 2;
    globeScene.add(markerRing);

    const orbitControls = new THREE.OrbitControls(globeCamera, globeRenderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.enablePan = false;
    orbitControls.enableZoom = false;
    orbitControls.rotateSpeed = 0.7;
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 0.9;
    orbitControls.minPolarAngle = Math.PI / 2.2;
    orbitControls.maxPolarAngle = Math.PI / 1.8;

    const animate = () => {
      rotationId = requestAnimationFrame(animate);
      if (globe) {
        globe.rotation.y += 0.003;
      }
      orbitControls.update();
      globeRenderer.render(globeScene, globeCamera);
    };

    animate();
  }
}

function updateMarker(country) {
  if (!markerSphere || !markerRing || !country || !globe) return;

  const position = latLonToVector3(country.lat, country.lon, 1.82);
  markerSphere.position.copy(position);
  markerSphere.visible = true;

  const ringPosition = position.clone().normalize().multiplyScalar(1.95);
  markerRing.position.copy(ringPosition);
  markerRing.lookAt(new THREE.Vector3(0, 0, 0));
  markerRing.visible = true;
}

playBtn.addEventListener('click', openSelector);
closeBtn.addEventListener('click', closeSelector);

let pointerStart = null;

function handlePointerDown(event) {
  if (event.target.closest('button')) {
    return;
  }

  pointerStart = {
    x: event.clientX,
    y: event.clientY
  };
}

function handlePointerUp(event) {
  if (!pointerStart) return;

  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  const isVertical = Math.abs(dy) > Math.abs(dx);

  if (!isVertical || Math.abs(dy) < 50) {
    pointerStart = null;
    return;
  }

  if (selectorSection.classList.contains('hidden')) {
    if (dy > 0) {
      openSelector();
    }
  } else {
    if (dy < 0) {
      closeSelector();
    }
  }

  pointerStart = null;
}

window.addEventListener('pointerdown', handlePointerDown, { passive: true });
window.addEventListener('pointerup', handlePointerUp, { passive: true });

window.addEventListener('resize', () => {
  if (!globeRenderer || !globeCamera) return;
  const width = globeContainer.clientWidth;
  const height = globeContainer.clientHeight;
  globeCamera.aspect = width / height;
  globeCamera.updateProjectionMatrix();
  globeRenderer.setSize(width, height);
});
