const travelTypeSelect = document.getElementById('travel-type');
const phraseList = document.getElementById('phrase-list');

// Predefined phrases based on travel type (add more languages/phrases as needed)
const phrases = {
    basic: [
        "Hello - Hola",
        "Goodbye - Adiós",
        "Please - Por favor",
        "Thank you - Gracias",
        "Excuse me - Disculpe",
        "Yes - Sí",
        "No - No"
    ],
    dining: [
        "A table for one/two - Una mesa para uno/dos",
        "Can I see the menu? - ¿Puedo ver el menú?",
        "I would like to order... - Quisiera pedir...",
        "The bill, please - La cuenta, por favor",
        "Is service included? - ¿Está incluido el servicio?"
    ],
    transportation: [
        "Where is the bus station? - ¿Dónde está la estación de autobuses?",
        "A ticket to..., please - Un billete para..., por favor",
        "How much is this? - ¿Cuánto cuesta esto?",
        "Stop here, please - Pare aquí, por favor"
    ],
    emergencies: [
        "Help! - ¡Ayuda!",
        "Call a doctor! - ¡Llame a un médico!",
        "Call the police! - ¡Llame a la policía!",
        "I am lost - Estoy perdido/a"
    ]
};

// Function to render phrases based on selected type
function renderPhrases(type) {
    phraseList.innerHTML = ''; // Clear previous content
    const selectedPhrases = phrases[type] || [];

    selectedPhrases.forEach(phrase => {
        const listItem = document.createElement('li');
        listItem.textContent = phrase;
        phraseList.appendChild(listItem);
    });
}

// Event listener for travel type change
travelTypeSelect.addEventListener('change', (e) => {
    renderPhrases(e.target.value);
});

// Initial render based on default selected value
renderPhrases(travelTypeSelect.value); 