const gateFilterInput = document.getElementById('gate-filter');
const gateListContainer = document.getElementById('gate-list');

// Sample gate and flight data (replace with more realistic data)
const gateData = [
    { gate: 'A1', flight: 'UA 123', destination: 'New York' },
    { gate: 'B2', flight: 'DL 456', destination: 'Atlanta' },
    { gate: 'A3', flight: 'AA 789', destination: 'Chicago' },
    { gate: 'C4', flight: 'SW 101', destination: 'Dallas' },
    { gate: 'B5', flight: 'UA 202', destination: 'Denver' },
    { gate: 'A1', flight: 'AA 303', destination: 'Miami' },
    { gate: 'C6', flight: 'DL 404', destination: 'Seattle' }
];

// Function to render the gate list
function renderGateList(filteredData) {
    gateListContainer.innerHTML = ''; // Clear previous content

    if (filteredData.length === 0) {
        gateListContainer.innerHTML = '<p>No gates found matching your filter.</p>';
        return;
    }

    filteredData.forEach(item => {
        const gateItemDiv = document.createElement('div');
        gateItemDiv.classList.add('gate-item');
        gateItemDiv.innerHTML = `
            <h3>Gate ${item.gate}</h3>
            <p>Flight: ${item.flight}</p>
            <p>Destination: ${item.destination}</p>
        `;
        gateListContainer.appendChild(gateItemDiv);
    });
}

// Function to handle filtering
function handleFilter() {
    const filterValue = gateFilterInput.value.toUpperCase();
    const filteredGates = gateData.filter(item => 
        item.gate.includes(filterValue) || 
        item.flight.toUpperCase().includes(filterValue) ||
        item.destination.toUpperCase().includes(filterValue)
    );
    renderGateList(filteredGates);
}

// Add event listener for input changes
gateFilterInput.addEventListener('input', handleFilter);

// Initial render of all gates
renderGateList(gateData); 