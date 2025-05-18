const countdownDisplay = document.getElementById('countdown-display');
const tripDateInput = document.getElementById('trip-date');
const plannerDaysContainer = document.getElementById('planner-days');

// Load saved trip date and notes from local storage
const savedTripDate = localStorage.getItem('tripDate');
const savedNotes = JSON.parse(localStorage.getItem('tripNotes')) || {};

if (savedTripDate) {
    tripDateInput.value = savedTripDate;
    startCountdown(savedTripDate);
    renderPlanner(savedTripDate);
} else {
    // If no saved date, render planner starting from today and start countdown to today
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    renderPlanner(todayString);
    startCountdown(todayString); // Also start the countdown to today's date
}

// Function to update the countdown display
function updateCountdown(tripDate) {
    const now = new Date().getTime();
    const tripTime = new Date(tripDate).getTime();
    const timeDifference = tripTime - now;

    if (timeDifference < 0) {
        countdownDisplay.innerHTML = "Trip has started!";
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    countdownDisplay.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Function to start the countdown interval
let countdownInterval = null; // Initialize to null
function startCountdown(tripDate) {
    clearInterval(countdownInterval); // Clear any existing interval
    updateCountdown(tripDate);
    countdownInterval = setInterval(() => {
        updateCountdown(tripDate);
    }, 1000);
}

// Function to render the daily planner
function renderPlanner(tripDateString) {
    plannerDaysContainer.innerHTML = ''; // Clear previous content

    const tripDate = new Date(tripDateString);
    tripDate.setHours(0, 0, 0, 0); // Normalize trip date

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    // Determine the start and end dates for the planner display
    const startDate = new Date(Math.min(today.getTime(), tripDate.getTime()));
    startDate.setHours(0, 0, 0, 0); // Ensure start date is normalized
    
    const endDate = new Date(Math.max(today.getTime(), tripDate.getTime()));
    endDate.setHours(0, 0, 0, 0); // Ensure end date is normalized

    console.log('Rendering planner from', startDate, 'to', endDate); // Log start and end dates

    let currentDate = new Date(startDate);

    while (currentDate.getTime() <= endDate.getTime()) { // Compare using getTime()
        console.log('Processing date:', currentDate); // Log current date in loop
        const dayEntryDiv = document.createElement('div');
        dayEntryDiv.classList.add('day-entry');
        dayEntryDiv.dataset.date = currentDate.toISOString().split('T')[0]; // Add data attribute for date

        const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        const dayTitle = document.createElement('h3');
        dayTitle.textContent = currentDate.toDateString(); // Display full date
        dayEntryDiv.appendChild(dayTitle);

        const notesTextarea = document.createElement('textarea');
        notesTextarea.placeholder = 'Add notes for this day...';
        notesTextarea.readOnly = true; // Make textarea read-only by default
        // Load saved note for this date
        if (savedNotes[dateString]) {
            notesTextarea.value = savedNotes[dateString];
        }
        
        dayEntryDiv.appendChild(notesTextarea);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('day-actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.dataset.date = dateString; // Add data attribute for date
        actionsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.dataset.date = dateString; // Add data attribute for date
        actionsDiv.appendChild(deleteButton);

        dayEntryDiv.appendChild(actionsDiv);
        plannerDaysContainer.appendChild(dayEntryDiv); // This is where the element is added
        console.log('Appended day entry for', dateString); // Log after appending

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    attachPlannerEventListeners(); // Attach event listeners after rendering
}

// Function to attach event listeners for planner actions
function attachPlannerEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const date = this.dataset.date;
            const dayEntry = this.closest('.day-entry');
            const notesTextarea = dayEntry.querySelector('textarea');

            if (notesTextarea.readOnly) {
                notesTextarea.readOnly = false;
                this.textContent = 'Save';
                notesTextarea.focus();
            } else {
                notesTextarea.readOnly = true;
                this.textContent = 'Edit';
                savedNotes[date] = notesTextarea.value;
                localStorage.setItem('tripNotes', JSON.stringify(savedNotes));
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const date = this.dataset.date;
            // Remove from savedNotes and local storage
            delete savedNotes[date];
            localStorage.setItem('tripNotes', JSON.stringify(savedNotes));
            // Remove from DOM
            this.closest('.day-entry').remove();
        });
    });

     // Save note on textarea input (keep existing functionality for live saving while editing)
     document.querySelectorAll('.day-entry textarea').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const dayEntry = e.target.closest('.day-entry');
            const dateString = dayEntry.dataset.date;
            savedNotes[dateString] = e.target.value;
            localStorage.setItem('tripNotes', JSON.stringify(savedNotes));
        });
    });
}

// Event listener for date input change
tripDateInput.addEventListener('change', (e) => {
    const newTripDate = e.target.value;
    localStorage.setItem('tripDate', newTripDate); // Save selected trip date
    startCountdown(newTripDate);
    renderPlanner(newTripDate);
}); 