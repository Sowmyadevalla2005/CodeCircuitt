const galleryGrid = document.getElementById('gallery-grid');
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const span = document.getElementsByClassName('close')[0];

// Sample image data (replace with your own images)
const images = [
    { src: 'travel_gallery/travel 1.jpeg', caption: 'Beautiful Sunset' },
    { src: 'travel_gallery/download.jpeg', caption: 'Mountain View' },
    { src: 'travel_gallery/travel 3.jpeg', caption: 'Cityscape at Night' },
    { src: 'travel_gallery/travel 2.webp', caption: 'Tropical Beach' },
    { src: 'travel_gallery/travel 4.jpeg', caption: 'Forest Path' }
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