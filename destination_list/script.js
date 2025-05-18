// Load destinations from local storage or use a default list
let destinations = JSON.parse(localStorage.getItem('destinations')) || [
    { id: 1, name: 'Eiffel Tower, Paris, France', region: 'Europe' },
    { id: 2, name: 'Statue of Liberty, New York, USA', region: 'North America' },
    { id: 3, name: 'Great Wall of China, China', region: 'Asia' },
    { id: 4, name: 'Machu Picchu, Peru', region: 'South America' },
    { id: 5, name: 'Sydney Opera House, Australia', region: 'Oceania' },
    { id: 6, name: 'Pyramids of Giza, Egypt', region: 'Africa' }
];

const destinationList = document.getElementById('destination-list');
const regionFilter = document.getElementById('region-filter');
const searchInput = document.getElementById('search-destination');
const addDestinationForm = document.getElementById('add-destination-form');
const newDestinationNameInput = document.getElementById('new-destination-name');
const newDestinationRegionInput = document.getElementById('new-destination-region');

// Function to render destinations
function renderDestinations(destinationsToRender) {
    destinationList.innerHTML = '';
    if (destinationsToRender.length === 0) {
        destinationList.innerHTML = '<p>No destinations found.</p>';
        return;
    }
    destinationsToRender.forEach(destination => {
        const li = document.createElement('li');
        li.classList.add('destination-item');
        li.innerHTML = `
            <h3>${destination.name}</h3>
            <p>Region: ${destination.region}</p>
            <button class="remove-btn" data-id="${destination.id}">Remove</button>
        `;
        destinationList.appendChild(li);
    });
    attachRemoveEventListeners();
}

// Function to save destinations to local storage
function saveDestinations() {
    localStorage.setItem('destinations', JSON.stringify(destinations));
}

// Function to attach remove event listeners
function attachRemoveEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const idToRemove = parseInt(this.dataset.id);
            destinations = destinations.filter(dest => dest.id !== idToRemove);
            saveDestinations();
            renderDestinations(filterAndSearchDestinations());
        });
    });
}

// Function to filter and search destinations
function filterAndSearchDestinations() {
    const selectedRegion = regionFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    return destinations.filter(destination => {
        const regionMatch = selectedRegion === 'all' || destination.region === selectedRegion;
        const searchMatch = destination.name.toLowerCase().includes(searchTerm) || destination.region.toLowerCase().includes(searchTerm);
        return regionMatch && searchMatch;
    });
}

// Event listener for region filter
regionFilter.addEventListener('change', () => {
    renderDestinations(filterAndSearchDestinations());
});

// Event listener for search input
searchInput.addEventListener('input', () => {
    renderDestinations(filterAndSearchDestinations());
});

// Event listener for add destination form submission
addDestinationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = newDestinationNameInput.value.trim();
    const region = newDestinationRegionInput.value;

    if (name && region) {
        const newDestination = {
            id: Date.now(), // Simple unique ID
            name: name,
            region: region
        };
        destinations.push(newDestination);
        saveDestinations();
        newDestinationNameInput.value = '';
        newDestinationRegionInput.value = '';
        renderDestinations(filterAndSearchDestinations());
    } else {
        alert('Please enter both destination name and select a region.');
    }
});

// Initial render
renderDestinations(destinations); 