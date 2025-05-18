const galleryGrid = document.getElementById('gallery-grid');
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const span = document.getElementsByClassName('close')[0];

// Sample image data (replace with your own images)
const images = [
    { src: 'https://via.placeholder.com/300/FF5733/FFFFFF?text=Image+1', caption: 'Beautiful Sunset' },
    { src: 'https://via.placeholder.com/300/33FF57/FFFFFF?text=Image+2', caption: 'Mountain View' },
    { src: 'https://via.placeholder.com/300/3357FF/FFFFFF?text=Image+3', caption: 'Cityscape at Night' },
    { src: 'https://via.placeholder.com/300/F333FF/FFFFFF?text=Image+4', caption: 'Tropical Beach' },
    { src: 'https://via.placeholder.com/300/FFC300/FFFFFF?text=Image+5', caption: 'Forest Path' }
];

// Function to render gallery images
function renderGallery() {
    images.forEach(image => {
        const galleryItemDiv = document.createElement('div');
        galleryItemDiv.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.caption;

        img.onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }

        galleryItemDiv.appendChild(img);
        galleryGrid.appendChild(galleryItemDiv);
    });
}

// Close the modal when clicking on the close button
span.onclick = function() {
  modal.style.display = "none";
}

// Close the modal when clicking outside of the modal content
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Initial render of the gallery
renderGallery(); 