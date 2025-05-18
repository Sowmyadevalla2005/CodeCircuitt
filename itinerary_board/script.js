const itineraryBoard = document.getElementById('itinerary-board');

// Sample itinerary data
let itinerary = [
    {
        day: "Day 1",
        activities: [
            { id: 1, description: "Arrive and Check-in" },
            { id: 2, description: "Explore Local Area" },
            { id: 3, description: "Dinner at Restaurant" }
        ]
    },
    {
        day: "Day 2",
        activities: [
            { id: 4, description: "Visit Museum" },
            { id: 5, description: "Lunch in the Park" },
            { id: 6, description: "Evening Show" }
        ]
    }
    // Add more days and activities as needed
];

// Function to render the itinerary board
function renderItinerary() {
    itineraryBoard.innerHTML = ''; // Clear previous content

    itinerary.forEach((dayData, dayIndex) => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-entry');
        dayDiv.dataset.dayIndex = dayIndex; // Store day index

        const dayTitle = document.createElement('h3');
        dayTitle.textContent = dayData.day;
        dayDiv.appendChild(dayTitle);

        const activityList = document.createElement('ul');
        activityList.classList.add('activity-list');
        activityList.addEventListener('dragover', allowDrop);
        activityList.addEventListener('drop', dropActivity);

        dayData.activities.forEach((activity, activityIndex) => {
            const activityItem = document.createElement('li');
            activityItem.classList.add('activity-item');
            activityItem.textContent = activity.description;
            activityItem.setAttribute('draggable', true);
            activityItem.dataset.activityId = activity.id;
            activityItem.dataset.dayIndex = dayIndex;
            activityItem.dataset.activityIndex = activityIndex;

            activityItem.addEventListener('dragstart', dragStartActivity);

            activityList.appendChild(activityItem);
        });

        dayDiv.appendChild(activityList);
        itineraryBoard.appendChild(dayDiv);
    });
}

// Allow dropping
function allowDrop(event) {
    event.preventDefault();
}

// Handle drag start for activities
function dragStartActivity(event) {
    event.dataTransfer.setData('text/plain', JSON.stringify({
        id: event.target.dataset.activityId,
        dayIndex: event.target.dataset.dayIndex,
        activityIndex: event.target.dataset.activityIndex
    }));
    // Add a class for styling the element being dragged (optional)
    setTimeout(() => {
        event.target.classList.add('dragging');
    }, 0);
}

// Handle drop for activities
function dropActivity(event) {
    event.preventDefault();
    const draggedActivityData = JSON.parse(event.dataTransfer.getData('text/plain'));
    const targetElement = event.target.closest('.activity-item') || event.target.closest('.activity-list');

    if (!targetElement) return; // No valid drop target

    const oldDayIndex = parseInt(draggedActivityData.dayIndex);
    const oldActivityIndex = parseInt(draggedActivityData.activityIndex);

    // Get the activity data being dragged
    const [draggedActivity] = itinerary[oldDayIndex].activities.splice(oldActivityIndex, 1);

    let newDayIndex, newActivityIndex;

    if (targetElement.classList.contains('activity-item')) {
        // Dropped onto another activity item
        newDayIndex = parseInt(targetElement.dataset.dayIndex);
        // Determine the index based on whether dropping before or after the target
        const targetRect = targetElement.getBoundingClientRect();
        const offset = event.clientY - targetRect.top;
        const targetActivityIndex = parseInt(targetElement.dataset.activityIndex);

        if (offset < targetRect.height / 2) {
            // Dropped before the target activity
            newActivityIndex = targetActivityIndex;
        } else {
            // Dropped after the target activity
            newActivityIndex = targetActivityIndex + 1;
        }
         // Adjust index if dropping within the same day before the original position
         if (oldDayIndex === newDayIndex && newActivityIndex > oldActivityIndex) {
             newActivityIndex--;
         }

    } else if (targetElement.classList.contains('activity-list')) {
        // Dropped onto an empty activity list (a day with no activities)
        newDayIndex = parseInt(targetElement.parentElement.dataset.dayIndex);
        newActivityIndex = itinerary[newDayIndex].activities.length; // Add to the end of the list
    } else {
         // Dropped onto the day container itself
         newDayIndex = parseInt(targetElement.dataset.dayIndex);
         newActivityIndex = itinerary[newDayIndex].activities.length; // Add to the end of the list
    }

    // Insert the dragged activity into the new position
    itinerary[newDayIndex].activities.splice(newActivityIndex, 0, draggedActivity);

    renderItinerary(); // Re-render the itinerary
    // Remove the dragging class from the original element (needed if not re-rendering everything)
     const draggedElement = document.querySelector('.dragging');
     if (draggedElement) {
         draggedElement.classList.remove('dragging');
     }
}

// Initial render
renderItinerary();

// Optional: Save/Load itinerary data to/from local storage
// This would require adding save/load functions and calling them appropriately. 