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

const playBtn = document.getElementById('playBtn');
const selectorSection = document.getElementById('selectorSection');
const closeBtn = document.getElementById('closeBtn');
const countryList = document.getElementById('countryList');
const countryResult = document.getElementById('countryResult');
const countryName = document.getElementById('countryName');
const flag = document.getElementById('flag');

function openSelector() {
  selectorSection.classList.remove('hidden');
  renderCountries();
}

function closeSelector() {
  selectorSection.classList.add('hidden');
  countryResult.classList.add('hidden');
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

    button.addEventListener('click', () => {
      flag.textContent = country.flag;
      countryName.textContent = country.name;
      countryResult.classList.remove('hidden');
    });

    countryList.appendChild(button);
  });
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
