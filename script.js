const countries = [
  { name: 'México', flag: '🇲🇽' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Brasil', flag: '🇧🇷' },
  { name: 'España', flag: '🇪🇸' },
  { name: 'Francia', flag: '🇫🇷' },
  { name: 'Alemania', flag: '🇩🇪' },
  { name: 'Italia', flag: '🇮🇹' },
  { name: 'Canadá', flag: '🇨🇦' },
  { name: 'Estados Unidos', flag: '🇺🇸' },
  { name: 'Reino Unido', flag: '🇬🇧' },
  { name: 'Japón', flag: '🇯🇵' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Perú', flag: '🇵🇪' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Sudáfrica', flag: '🇿🇦' }
];

const countryAliases = {
  'México': 'Mexico',
  'Estados Unidos': 'United States of America',
  'Canadá': 'Canada',
  'Brasil': 'Brazil',
  'Reino Unido': 'United Kingdom',
  'Corea del Sur': 'South Korea',
  'Sudáfrica': 'South Africa',
  'Holanda': 'Netherlands',
  'Turquía': 'Turkey',
  'Emiratos Árabes': 'United Arab Emirates',
  'República Checa': 'Czech Republic',
  'Arabia Saudita': 'Saudi Arabia',
  'Nueva Zelanda': 'New Zealand',
  'Dominicana': 'Dominican Republic'
};

const playBtn = document.getElementById('playBtn');
const selectorSection = document.getElementById('selectorSection');
const closeBtn = document.getElementById('closeBtn');
const countryList = document.getElementById('countryList');
const countryResult = document.getElementById('countryResult');
const countryName = document.getElementById('countryName');
const flag = document.getElementById('flag');

let currentCountry = null;
let mapInstance = null;
let worldLayer = null;
let geoJsonLoaded = false;

function normalizeName(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function getGeoCountryName(countryNameValue) {
  return countryAliases[countryNameValue] || countryNameValue;
}

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
  initializeMap();
  highlightSelectedCountry(country.name);
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

function initializeMap() {
  if (!window.L) return;

  if (!mapInstance) {
    mapInstance = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: false,
      minZoom: 2,
      maxZoom: 6
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 6,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);
  }

  if (!geoJsonLoaded) {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
      .then((response) => response.json())
      .then((geojson) => {
        geoJsonLoaded = true;
        worldLayer = L.geoJSON(geojson, {
          style: (feature) => {
            const selectedName = currentCountry ? getGeoCountryName(currentCountry.name) : null;
            const featureName = feature.properties && (feature.properties.name || feature.properties.NAME || '');
            const isSelected = selectedName && normalizeName(featureName) === normalizeName(selectedName);

            return {
              color: '#111111',
              weight: 0.8,
              opacity: 1,
              fillColor: isSelected ? '#111111' : '#f0f0f0',
              fillOpacity: isSelected ? 1 : 0.9
            };
          }
        }).addTo(mapInstance);

        if (currentCountry) {
          highlightSelectedCountry(currentCountry.name);
        }
      })
      .catch(() => {
        geoJsonLoaded = true;
      });
  }
}

function highlightSelectedCountry(countryNameValue) {
  if (!mapInstance || !worldLayer) return;

  const targetName = normalizeName(getGeoCountryName(countryNameValue));
  let matchedBounds = null;

  worldLayer.eachLayer((layer) => {
    const featureName = layer.feature && (layer.feature.properties && (layer.feature.properties.name || layer.feature.properties.NAME || ''));
    const currentName = normalizeName(featureName);
    const isSelected = currentName === targetName;

    if (layer.setStyle) {
      layer.setStyle({
        color: '#111111',
        weight: 1,
        opacity: 1,
        fillColor: isSelected ? '#111111' : '#f0f0f0',
        fillOpacity: isSelected ? 1 : 0.9
      });
    }

    if (isSelected && layer.getBounds) {
      matchedBounds = layer.getBounds();
    }
  });

  if (matchedBounds) {
    mapInstance.fitBounds(matchedBounds, { padding: [20, 20] });
  }
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
