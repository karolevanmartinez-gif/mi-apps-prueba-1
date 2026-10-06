const countries = [
  { name: 'México', flag: '🇲🇽' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Brasil', flag: '🇧🇷' },
  { name: 'España', flag: '🇪🇸' },
  { name: 'Francia', flag: '🇫🇷' },
  { name: 'Alemania', flag: '🇩🇪' },
  { name: 'Italia', flag: '🇮🇹' },
  { name: 'Japón', flag: '🇯🇵' },
  { name: 'Corea del Sur', flag: '🇰🇷' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Canadá', flag: '🇨🇦' },
  { name: 'Estados Unidos', flag: '🇺🇸' },
  { name: 'Perú', flag: '🇵🇪' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Uruguay', flag: '🇺🇾' },
  { name: 'Paraguay', flag: '🇵🇾' },
  { name: 'Bolivia', flag: '🇧🇴' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Panamá', flag: '🇵🇦' },
  { name: 'Costa Rica', flag: '🇨🇷' },
  { name: 'Guatemala', flag: '🇬🇹' },
  { name: 'Honduras', flag: '🇭🇳' },
  { name: 'El Salvador', flag: '🇸🇻' },
  { name: 'Nicaragua', flag: '🇳🇮' },
  { name: 'Reino Unido', flag: '🇬🇧' },
  { name: 'Irlanda', flag: '🇮🇪' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Suecia', flag: '🇸🇪' },
  { name: 'Noruega', flag: '🇳🇴' },
  { name: 'Finlandia', flag: '🇫🇮' },
  { name: 'Dinamarca', flag: '🇩🇰' },
  { name: 'Holanda', flag: '🇳🇱' },
  { name: 'Bélgica', flag: '🇧🇪' },
  { name: 'Suiza', flag: '🇨🇭' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Nueva Zelanda', flag: '🇳🇿' },
  { name: 'Rusia', flag: '🇷🇺' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Turquía', flag: '🇹🇷' },
  { name: 'Egipto', flag: '🇪🇬' },
  { name: 'Sudáfrica', flag: '🇿🇦' },
  { name: 'Arabia Saudita', flag: '🇸🇦' },
  { name: 'Emiratos Árabes', flag: '🇦🇪' },
  { name: 'Marruecos', flag: '🇲🇦' },
  { name: 'Polonia', flag: '🇵🇱' },
  { name: 'Grecia', flag: '🇬🇷' },
  { name: 'Ucrania', flag: '🇺🇦' },
  { name: 'Hungría', flag: '🇭🇺' },
  { name: 'República Checa', flag: '🇨🇿' },
  { name: 'Cuba', flag: '🇨🇺' },
  { name: 'Dominicana', flag: '🇩🇴' },
  { name: 'Puerto Rico', flag: '🇵🇷' },
  { name: 'Japón', flag: '🇯🇵' }
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

let touchStartY = null;
let dragging = false;

function handleGestureStart(event) {
  const point = event.touches ? event.touches[0] : event;
  touchStartY = point.clientY;
  dragging = true;
}

function handleGestureEnd(event) {
  if (!dragging || touchStartY === null) return;

  const point = event.changedTouches ? event.changedTouches[0] : event;
  const deltaY = point.clientY - touchStartY;

  if (selectorSection.classList.contains('hidden')) {
    if (deltaY > 50) {
      openSelector();
    }
  } else {
    if (deltaY < -50) {
      closeSelector();
    }
  }

  dragging = false;
  touchStartY = null;
}

document.addEventListener('touchstart', handleGestureStart, { passive: true });
document.addEventListener('touchend', handleGestureEnd, { passive: true });

document.addEventListener('mousedown', handleGestureStart);
document.addEventListener('mouseup', handleGestureEnd);
