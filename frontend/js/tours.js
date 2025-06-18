// Tour Data
const allTours = [
    {
        id: 1,
        name: "Arang Kel Adventure",
        duration: "4 Days",
        price: 24999,
        image: "./images/arang kel.jpg",
        description: "Discover the hidden gem of Arang Kel, known for its pristine beauty and peaceful atmosphere.",
        season: "summer",
        highlights: [
            "Visit Arang Kel Village",
            "Experience local culture",
            "Enjoy mountain views",
            "Trek through beautiful trails"
        ]
    },
    {
        id: 2,
        name: "Kumrat Valley Trek",
        duration: "6 Days",
        price: 34999,
        image: "./images/kumrat2.jpg",
        description: "Embark on an exciting trek through the beautiful Kumrat Valley with its lush forests and waterfalls.",
        season: "summer",
        highlights: [
            "Visit Kumrat Valley",
            "Experience local culture",
            "Enjoy scenic views",
            "Trek through beautiful trails"
        ]
    },
    {
        id: 3,
        name: "Naran Valley Escape",
        duration: "5 Days",
        price: 29999,
        image: "./images/naran.jpg",
        description: "Experience the stunning beauty of Naran Valley with its crystal clear lakes and majestic mountains.",
        season: "summer",
        highlights: [
            "Visit Lake Saiful Muluk",
            "Explore Lulusar Lake",
            "Enjoy mountain trekking",
            "Experience local cuisine"
        ]
    }
];

// Display Tours
function displayTours(tours) {
    const tourGrid = document.querySelector('.tour-grid');
    tourGrid.innerHTML = '';

    if (!tours || tours.length === 0) {
        tourGrid.innerHTML = `
            <div class="no-tours">
                <h3>No tours found matching your criteria</h3>
                <p>Try adjusting your filters or contact us for a custom tour package.</p>
            </div>
        `;
        return;
    }

    tours.forEach(tour => {
        const tourCard = document.createElement('div');
        tourCard.className = 'tour-card';
        tourCard.innerHTML = `
            <div class="tour-image-container">
                <img src="${tour.image}" alt="${tour.name}" class="tour-image">
            </div>
            <div class="tour-content">
                <h3 class="tour-title">${tour.name}</h3>
                <div class="tour-info">
                    <span>${tour.duration}</span>
                    <span class="tour-price">PKR ${tour.price.toLocaleString()}</span>
                </div>
                <p>${tour.description}</p>
                <div class="tour-highlights">
                    <h4>Highlights:</h4>
                    <ul>
                        ${tour.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
                <a href="tour-details.html?id=${tour.id}" class="btn btn-primary">View Details</a>
            </div>
        `;
        tourGrid.appendChild(tourCard);
    });
}

// Filter Tours
function filterTours() {
    const duration = document.getElementById('duration').value;
    const price = document.getElementById('price').value;
    const season = document.getElementById('season').value;

    let filteredTours = allTours;

    if (duration) {
        const [min, max] = duration.split('-').map(Number);
        filteredTours = filteredTours.filter(tour => {
            const tourDuration = parseInt(tour.duration);
            return tourDuration >= min && (!max || tourDuration <= max);
        });
    }

    if (price) {
        const [min, max] = price.split('-').map(Number);
        filteredTours = filteredTours.filter(tour => {
            return tour.price >= min && (!max || tour.price <= max);
        });
    }

    if (season) {
        filteredTours = filteredTours.filter(tour => tour.season === season);
    }

    displayTours(filteredTours);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Display all tours initially
    displayTours(allTours);

    // Add event listeners to filters
    document.getElementById('duration').addEventListener('change', filterTours);
    document.getElementById('price').addEventListener('change', filterTours);
    document.getElementById('season').addEventListener('change', filterTours);
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 