const packingList = [
    {
        category: "Clothes",
        items: [
            { description: "T-shirts", packed: false },
            { description: "Pants", packed: false },
            { description: "Socks", packed: false },
            { description: "Underwear", packed: false },
            { description: "Jacket", packed: false }
        ]
    },
    {
        category: "Toiletries",
        items: [
            { description: "Toothbrush", packed: false },
            { description: "Toothpaste", packed: false },
            { description: "Shampoo", packed: false },
            { description: "Soap", packed: false },
            { description: "Sunscreen", packed: false }
        ]
    },
    {
        category: "Electronics",
        items: [
            { description: "Phone Charger", packed: false },
            { description: "Portable Charger", packed: false },
            { description: "Headphones", packed: false }
        ]
    },
    {
        category: "Documents",
        items: [
            { description: "Passport", packed: false },
            { description: "Tickets", packed: false },
            { description: "ID", packed: false },
            { description: "Hotel Confirmation", packed: false }
        ]
    }
];

// Load saved packing list from local storage or use default
let savedPackingList = JSON.parse(localStorage.getItem('packingList'));

if (savedPackingList) {
    // Simple check if saved data structure is compatible, otherwise use default
    if (Array.isArray(savedPackingList) && savedPackingList.every(cat => cat.hasOwnProperty('category') && Array.isArray(cat.items) && cat.items.every(item => item.hasOwnProperty('description') && item.hasOwnProperty('packed')))) {
        packingList = savedPackingList;
    } else {
        console.warn("Saved packing list structure incompatible, using default.");
    }
} else {
    // Save default list if no saved list exists
    localStorage.setItem('packingList', JSON.stringify(packingList));
}

const categoriesContainer = document.getElementById('categories');
const newItemDescriptionInput = document.getElementById('new-item-description');
const newItemCategorySelect = document.getElementById('new-item-category');
const addItemButton = document.getElementById('add-item-btn');

// Function to save packing list to local storage
function savePackingList() {
    localStorage.setItem('packingList', JSON.stringify(packingList));
}

function renderChecklist() {
    categoriesContainer.innerHTML = ''; // Clear previous content

    packingList.forEach(categoryData => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = categoryData.category;
        categoryDiv.appendChild(categoryTitle);

        const itemList = document.createElement('ul');
        itemList.classList.add('item-list');

        categoryData.items.forEach((item, itemIndex) => {
            const itemLi = document.createElement('li');
            itemLi.classList.add('item');
            if (item.packed) {
                itemLi.classList.add('packed');
            }

            // Item description span
            const itemDescriptionSpan = document.createElement('span');
            itemDescriptionSpan.textContent = item.description;
            itemDescriptionSpan.classList.add('item-description');
            itemLi.appendChild(itemDescriptionSpan);

            // Remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-item-btn');
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent item click when removing
                removeItem(categoryData.category, itemIndex);
            });
            itemLi.appendChild(removeButton);

            itemLi.addEventListener('click', () => {
                togglePacked(categoryData.category, itemIndex);
            });
            itemList.appendChild(itemLi);
        });

        categoryDiv.appendChild(itemList);
        categoriesContainer.appendChild(categoryDiv);
    });
}

// Function to toggle packed status
function togglePacked(category, itemIndex) {
    const categoryData = packingList.find(cat => cat.category === category);
    if (categoryData && categoryData.items[itemIndex]) {
        categoryData.items[itemIndex].packed = !categoryData.items[itemIndex].packed;
        savePackingList();
        renderChecklist();
    }
}

// Function to add a new item
function addItem() {
    const description = newItemDescriptionInput.value.trim();
    const category = newItemCategorySelect.value;

    if (description === '') {
        alert('Please enter an item description.');
        return;
    }

    const categoryData = packingList.find(cat => cat.category === category);

    if (categoryData) {
        categoryData.items.push({ description: description, packed: false });
        savePackingList();
        renderChecklist();
        newItemDescriptionInput.value = ''; // Clear input field
    } else {
        alert('Invalid category selected.');
    }
}

// Function to remove an item
function removeItem(category, itemIndex) {
     const categoryData = packingList.find(cat => cat.category === category);
     if (categoryData && categoryData.items[itemIndex]) {
         categoryData.items.splice(itemIndex, 1);
         savePackingList();
         renderChecklist();
     }
}

// Add event listener to the add button
addItemButton.addEventListener('click', addItem);

// Allow adding item by pressing Enter in the description input
newItemDescriptionInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

// Initial render
renderChecklist(); 