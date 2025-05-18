const itemDescriptionInput = document.getElementById('item-description');
const itemCostInput = document.getElementById('item-cost');
const addItemButton = document.getElementById('add-item-btn');
const budgetItemsList = document.getElementById('budget-items-list');
const totalCostSpan = document.getElementById('total-cost');

// Load saved budget items from local storage
let budgetItems = JSON.parse(localStorage.getItem('vacationBudget')) || [];

// Function to save budget items to local storage
function saveBudgetItems() {
    localStorage.setItem('vacationBudget', JSON.stringify(budgetItems));
}

// Function to render the budget items list and update the total
function renderBudget() {
    budgetItemsList.innerHTML = ''; // Clear previous content
    let total = 0;

    budgetItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.description}</span>
            <span>$${item.cost.toFixed(2)}</span>
        `;
        budgetItemsList.appendChild(listItem);
        total += item.cost;
    });

    totalCostSpan.textContent = total.toFixed(2);
}

// Function to add a new budget item
function addItem() {
    const description = itemDescriptionInput.value.trim();
    const cost = parseFloat(itemCostInput.value);

    if (description === '' || isNaN(cost) || cost < 0) {
        alert('Please enter a valid description and cost.');
        return;
    }

    const newItem = {
        description: description,
        cost: cost
    };

    budgetItems.push(newItem);
    saveBudgetItems();
    renderBudget();

    // Clear input fields
    itemDescriptionInput.value = '';
    itemCostInput.value = '';
}

// Add event listener to the add button
addItemButton.addEventListener('click', addItem);

// Allow adding item by pressing Enter in input fields
itemDescriptionInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

itemCostInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

// Initial render of the budget
renderBudget(); 