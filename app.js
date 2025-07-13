// --- START OF FILE app.js ---

// DOM elements
const pokemonGrid = document.getElementById('pokemonGrid');
const searchInput = document.getElementById('searchInput');
const pokemonModal = document.getElementById('pokemonModal');
const modalCloseBtn = document.querySelector('.close-button');
const modalContent = document.getElementById('modalContent');
const loadingSpinner = document.getElementById('loadingSpinner'); // This now refers to the container div

let allPokemon = []; // To store all fetched Pokemon data

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEMON_COUNT = 151; // Fetch first 151 Pokemon (Gen 1) for simplicity

// Function to fetch a single Pokemon's data
async function fetchPokemon(id) {
    try {
        const response = await fetch(`${POKEMON_API_BASE_URL}${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching Pokemon ${id}:`, error);
        return null;
    }
}

// Function to fetch all Pokemon
async function fetchAllPokemon() {
    loadingSpinner.style.display = 'flex'; // Show spinner container (using flex for centering)
    for (let i = 1; i <= POKEMON_COUNT; i++) {
        const pokemonData = await fetchPokemon(i);
        if (pokemonData) {
            allPokemon.push(pokemonData);
            renderPokemonCard(pokemonData);
        }
    }
    loadingSpinner.style.display = 'none'; // Hide spinner container
}

// Function to render a single Pokemon card
function renderPokemonCard(pokemon) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.setAttribute('data-pokemon-id', pokemon.id);

    // Get the default front sprite
    const sprite = pokemon.sprites.front_default || 'https://via.placeholder.com/96x96?text=No+Image';

    pokemonCard.innerHTML = `
        <img src="${sprite}" alt="${pokemon.name}" class="pokemon-sprite">
        <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div>
        <h2 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <div class="pokemon-types">
            ${pokemon.types.map(typeInfo => `<span class="type ${typeInfo.type.name}">${typeInfo.type.name.toUpperCase()}</span>`).join('')}
        </div>
    `;

    pokemonCard.addEventListener('click', () => openPokemonModal(pokemon.id));
    pokemonGrid.appendChild(pokemonCard);
}

// Function to open the Pokemon detail modal
async function openPokemonModal(id) {
    modalContent.innerHTML = '<p>Loading Pokemon details...</p>'; // Show loading message
    pokemonModal.style.display = 'flex'; // Use flex for modal to center content

    const pokemon = allPokemon.find(p => p.id === id);

    if (!pokemon) {
        modalContent.innerHTML = '<p>Pokemon not found.</p>';
        return;
    }

    const shinySprite = pokemon.sprites.front_shiny || '';
    const backSprite = pokemon.sprites.back_default || '';

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} <span class="modal-id">#${String(pokemon.id).padStart(3, '0')}</span></h2>
            <div class="pokemon-types">
                ${pokemon.types.map(typeInfo => `<span class="type ${typeInfo.type.name}">${typeInfo.type.name.toUpperCase()}</span>`).join('')}
            </div>
        </div>
        <div class="modal-body">
            <div class="modal-sprites">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name} Default" class="modal-sprite">
                ${shinySprite ? `<img src="${shinySprite}" alt="${pokemon.name} Shiny" class="modal-sprite">` : ''}
                ${backSprite ? `<img src="${backSprite}" alt="${pokemon.name} Back" class="modal-sprite">` : ''}
            </div>
            <div class="modal-info">
                <h3>Stats:</h3>
                <ul>
                    ${pokemon.stats.map(statInfo => `<li><span>${statInfo.stat.name.replace('-', ' ')}:</span> <span>${statInfo.base_stat}</span></li>`).join('')}
                </ul>
                <h3>Abilities:</h3>
                <ul>
                    ${pokemon.abilities.map(abilityInfo => `<li>${abilityInfo.ability.name.replace('-', ' ')}</li>`).join('')}
                </ul>
                <h3>Height:</h3> <p>${(pokemon.height / 10).toFixed(1)} m</p>
                <h3>Weight:</h3> <p>${(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
        </div>
    `;
}

// Close modal function
modalCloseBtn.addEventListener('click', () => {
    pokemonModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === pokemonModal) {
        pokemonModal.style.display = 'none';
    }
});

// Search functionality
searchInput.addEventListener('keyup', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    pokemonGrid.innerHTML = ''; // Clear current grid

    const filteredPokemon = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm) ||
        String(pokemon.id).includes(searchTerm)
    );

    if (filteredPokemon.length === 0) {
        pokemonGrid.innerHTML = '<p class="no-results">No Pokemon found matching your search.</p>';
    } else {
        filteredPokemon.forEach(pokemon => renderPokemonCard(pokemon));
    }
});

// Initial fetch of all Pokemon
document.addEventListener('DOMContentLoaded', fetchAllPokemon);

// --- END OF FILE app.js ---