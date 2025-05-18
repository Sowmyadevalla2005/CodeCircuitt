const moodboardArea = document.getElementById('moodboard-area');
const stickerPalette = document.querySelector('.sticker-palette');

// Load saved stickers from local storage
const savedStickers = JSON.parse(localStorage.getItem('moodboardStickers')) || [];

// Save stickers to local storage
function saveStickers() {
    const stickersToSave = [];
    moodboardArea.querySelectorAll('.placed-sticker').forEach(stickerElement => {
        const stickerData = {
            type: stickerElement.dataset.type,
            left: stickerElement.style.left,
            top: stickerElement.style.top,
            width: stickerElement.style.width,
            height: stickerElement.style.height
        };

        if (stickerElement.dataset.type === 'text') {
            stickerData.content = stickerElement.textContent.trim();
        } else if (stickerElement.dataset.type === 'image') {
            const imgElement = stickerElement.querySelector('img');
            if (imgElement) stickerData.src = imgElement.src;
        }

        stickersToSave.push(stickerData);
    });
    localStorage.setItem('moodboardStickers', JSON.stringify(stickersToSave));
}

// Create a new sticker element
function createStickerElement(type, data = {}) {
    const stickerElement = document.createElement('div');
    stickerElement.classList.add('placed-sticker');
    stickerElement.dataset.type = type;
    stickerElement.style.left = data.left || '0px';
    stickerElement.style.top = data.top || '0px';
    if (data.width) stickerElement.style.width = data.width;
    if (data.height) stickerElement.style.height = data.height;

    // Content based on type
    if (type === 'text') {
        stickerElement.textContent = data.content || 'Double-click to Edit';
        stickerElement.addEventListener('dblclick', enableTextEditing);
        stickerElement.style.minWidth = '80px';
        stickerElement.style.minHeight = '30px';
        stickerElement.style.padding = '10px';
    } else if (type === 'image') {
        const imgElement = document.createElement('img');
        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '100%';
        const imageUrl = data.src || prompt('Enter Image URL:');
        if (imageUrl) {
            imgElement.src = imageUrl;
            stickerElement.appendChild(imgElement);
            stickerElement.dataset.src = imageUrl;
        } else {
            stickerElement.innerHTML = '<p>Image Needed</p>';
        }
        stickerElement.style.width = data.width || '100px';
        stickerElement.style.height = data.height || '100px';
    }

    // Add remove button
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-sticker-btn');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        stickerElement.remove();
        saveStickers();
    });
    stickerElement.appendChild(removeButton);

    // Add timestamp
    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.textContent = new Date().toLocaleString();
    stickerElement.appendChild(timestampDiv);

    // Draggable and resize handles
    stickerElement.setAttribute('draggable', true);
    stickerElement.addEventListener('dragstart', dragStartPlaced);

    if (type === 'text' || type === 'image') {
        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle');
        resizeHandle.addEventListener('mousedown', initResize);
        stickerElement.appendChild(resizeHandle);
    }

    return stickerElement;
}

// Render saved stickers
savedStickers.forEach(stickerData => {
    const stickerElement = createStickerElement(stickerData.type, stickerData);
    moodboardArea.appendChild(stickerElement);
});

// Drag and drop functions
function allowDrop(event) {
    event.preventDefault();
    moodboardArea.classList.add('drag-over');
}

function drop(event) {
    event.preventDefault();
    moodboardArea.classList.remove('drag-over');

    const dataType = event.dataTransfer.getData('text/plain');
    const offsetX = parseInt(event.dataTransfer.getData('offsetX'), 10);
    const offsetY = parseInt(event.dataTransfer.getData('offsetY'), 10);

    const moodboardRect = moodboardArea.getBoundingClientRect();
    let x = event.clientX - moodboardRect.left - offsetX;
    let y = event.clientY - moodboardRect.top - offsetY;

    const newSticker = createStickerElement(dataType);
    newSticker.style.left = x + 'px';
    newSticker.style.top = y + 'px';
    moodboardArea.appendChild(newSticker);

    saveStickers();
}

// Text editing
function enableTextEditing(event) {
    const stickerElement = event.target.closest('.placed-sticker');
    if (stickerElement && stickerElement.dataset.type === 'text') {
        stickerElement.classList.add('editing');
        stickerElement.setAttribute('contenteditable', true);
        stickerElement.focus();
        stickerElement.addEventListener('blur', disableTextEditing);
    }
}

function disableTextEditing(event) {
    const stickerElement = event.target;
    stickerElement.classList.remove('editing');
    stickerElement.removeAttribute('contenteditable');
    saveStickers();
}

// Resize functionality
let activeSticker = null;
let initialX, initialY, initialWidth, initialHeight;

function initResize(e) {
    activeSticker = e.target.parentElement;
    initialX = e.clientX;
    initialY = e.clientY;
    initialWidth = activeSticker.offsetWidth;
    initialHeight = activeSticker.offsetHeight;
    document.addEventListener('mousemove', resizeSticker);
    document.addEventListener('mouseup', stopResize);
    e.stopPropagation();
}

function resizeSticker(e) {
    if (activeSticker) {
        const dx = e.clientX - initialX;
        const dy = e.clientY - initialY;
        let newWidth = Math.max(50, initialWidth + dx);
        let newHeight = Math.max(50, initialHeight + dy);
        activeSticker.style.width = newWidth + 'px';
        activeSticker.style.height = newHeight + 'px';
    }
}

function stopResize() {
    document.removeEventListener('mousemove', resizeSticker);
    document.removeEventListener('mouseup', stopResize);
    saveStickers();
}

// Event listeners
moodboardArea.addEventListener('dragover', allowDrop);
moodboardArea.addEventListener('drop', drop);
stickerPalette.querySelectorAll('.sticker').forEach(sticker => {
    sticker.addEventListener('dragstart', dragStartPalette);
});

function dragStartPalette(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.type);
    event.dataTransfer.setData('offsetX', event.clientX - event.target.getBoundingClientRect().left);
    event.dataTransfer.setData('offsetY', event.clientY - event.target.getBoundingClientRect().top);
}

function dragStartPlaced(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.type);
    event.dataTransfer.setData('offsetX', event.clientX - event.target.getBoundingClientRect().left);
    event.dataTransfer.setData('offsetY', event.clientY - event.target.getBoundingClientRect().top);
    setTimeout(() => event.target.classList.add('dragging'), 0);
}

document.addEventListener('dragend', (event) => {
    const draggedElement = document.querySelector('.placed-sticker.dragging');
    if (draggedElement) draggedElement.classList.remove('dragging');
});