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
  { name: 'Estados Unidos', flag: '🇺🇸' }
];

const playBtn = document.getElementById('playBtn');
const selectorSection = document.getElementById('selectorSection');
const closeBtn = document.getElementById('closeBtn');
const countryList = document.getElementById('countryList');
const countryResult = document.getElementById('countryResult');
const countryName = document.getElementById('countryName');
const flag = document.getElementById('flag');

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

playBtn.addEventListener('click', () => {
  selectorSection.classList.remove('hidden');
  renderCountries();
});

closeBtn.addEventListener('click', () => {
  selectorSection.classList.add('hidden');
  countryResult.classList.add('hidden');
});
