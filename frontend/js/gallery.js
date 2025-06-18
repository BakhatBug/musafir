// Gallery Data
const galleryImages = [
    {
        id: 1,
        src: "images/gallery/hunza-valley.jpg",
        title: "Hunza Valley",
        description: "Panoramic view of the majestic Hunza Valley",
        category: "valleys"
    },
    {
        id: 2,
        src: "images/gallery/k2.jpg",
        title: "K2 Mountain",
        description: "The world's second-highest peak, K2",
        category: "mountains"
    },
    {
        id: 3,
        src: "images/gallery/attabad-lake.jpg",
        title: "Attabad Lake",
        description: "The stunning turquoise waters of Attabad Lake",
        category: "lakes"
    },
    {
        id: 4,
        src: "images/gallery/karimabad.jpg",
        title: "Karimabad",
        description: "Traditional architecture in Karimabad",
        category: "culture"
    },
    {
        id: 5,
        src: "images/gallery/nanga-parbat.jpg",
        title: "Nanga Parbat",
        description: "The Killer Mountain of Pakistan",
        category: "mountains"
    },
    {
        id: 6,
        src: "images/gallery/saiful-muluk.jpg",
        title: "Lake Saiful Muluk",
        description: "The crystal clear waters of Lake Saiful Muluk",
        category: "lakes"
    },
    {
        id: 7,
        src: "images/gallery/kalash-valley.jpg",
        title: "Kalash Valley",
        description: "Unique culture and traditions of Kalash Valley",
        category: "culture"
    },
    {
        id: 8,
        src: "images/gallery/deosai-plains.jpg",
        title: "Deosai Plains",
        description: "The Land of Giants in Northern Pakistan",
        category: "valleys"
    },
    {
        id: 9,
        src: "images/gallery/rakaposhi.jpg",
        title: "Rakaposhi",
        description: "The stunning Rakaposhi peak",
        category: "mountains"
    }
];

// Initialize Gallery
function initGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    // Display all images initially
    displayImages(galleryImages);

    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter images
            currentFilter = button.dataset.filter;
            const filteredImages = currentFilter === 'all' 
                ? galleryImages 
                : galleryImages.filter(img => img.category === currentFilter);
            
            displayImages(filteredImages);
        });
    });
}

// Display Images
function displayImages(images) {
    const galleryGrid = document.querySelector('.gallery-grid');
    galleryGrid.innerHTML = '';

    images.forEach(image => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${image.src}" alt="${image.title}">
            <div class="overlay">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </div>
        `;

        // Add click event for lightbox
        item.addEventListener('click', () => openLightbox(image));
        galleryGrid.appendChild(item);
    });
}

// Lightbox Functionality
let currentImageIndex = 0;

function openLightbox(image) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const filteredImages = document.querySelector('.filter-btn.active').dataset.filter === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === document.querySelector('.filter-btn.active').dataset.filter);

    currentImageIndex = filteredImages.findIndex(img => img.id === image.id);
    
    lightboxImg.src = image.src;
    lightboxCaption.innerHTML = `
        <h3>${image.title}</h3>
        <p>${image.description}</p>
    `;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const filteredImages = document.querySelector('.filter-btn.active').dataset.filter === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === document.querySelector('.filter-btn.active').dataset.filter);

    currentImageIndex = (currentImageIndex + direction + filteredImages.length) % filteredImages.length;
    openLightbox(filteredImages[currentImageIndex]);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initGallery();

    // Lightbox event listeners
    document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-nav.prev').addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.lightbox-nav.next').addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Close lightbox when clicking outside the image
    document.querySelector('.lightbox').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeLightbox();
    });
}); 