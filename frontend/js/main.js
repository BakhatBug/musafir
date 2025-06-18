// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks.style.display = 'none';
        }
    });
});

// Sample Tour Data
const tours = [
    {
        id: 1,
        name: "Arang Kel Adventure",
        duration: "4 Days",
        price: "PKR 24,999",
        image: "images/arang kel.jpg",
        description: "Discover the hidden gem of Arang Kel, known for its pristine beauty and peaceful atmosphere."
    },
    {
        id: 2,
        name: "Kumrat Valley Trek",
        duration: "6 Days",
        price: "PKR 34,999",
        image: "images/kumrat2.jpg",
        description: "Embark on an exciting trek through the beautiful Kumrat Valley with its lush forests and waterfalls."
    },
    {
        id: 3,
        name: "Naran Valley Escape",
        duration: "5 Days",
        price: "PKR 29,999",
        image: "images/naran.jpg",
        description: "Experience the stunning beauty of Naran Valley with its crystal clear lakes and majestic mountains."
    }
];

// Populate Tour Grid
function populateTourGrid() {
    const tourGrid = document.querySelector('.tour-grid');
    if (!tourGrid) return;
    tourGrid.innerHTML = '';
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
                    <span class="tour-price">${tour.price}</span>
                </div>
                <p>${tour.description}</p>
                <a href="tours.html" class="btn btn-primary">View Details</a>
            </div>
        `;
        tourGrid.appendChild(tourCard);
    });
}

// Sample Testimonials
const testimonials = [
    {
        name: "Ahmed Khan",
        text: "An amazing experience! The tour guides were knowledgeable and the scenery was breathtaking.",
        rating: 5
    },
    {
        name: "Sara Malik",
        text: "Best decision to travel with this agency. Everything was well organized and the views were spectacular.",
        rating: 5
    },
    {
        name: "Usman Ali",
        text: "Professional service and unforgettable memories. Will definitely book again!",
        rating: 4
    }
];

// Populate Testimonials
function populateTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;

    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        testimonialCard.innerHTML = `
            <div class="rating">
                ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)}
            </div>
            <p>${testimonial.text}</p>
            <h4>${testimonial.name}</h4>
        `;
        testimonialSlider.appendChild(testimonialCard);
    });
}

// Form Validation
function validateBookingForm() {
    const form = document.querySelector('.booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const tour = form.querySelector('[name="tour"]').value;
        const date = form.querySelector('[name="date"]').value;
        const travelers = form.querySelector('[name="travelers"]').value;

        if (!tour || !date || !travelers) {
            alert('Please fill in all fields');
            return;
        }

        // Here you would typically send the data to your backend
        alert('Thank you for your booking! We will contact you shortly.');
        form.reset();
    });
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', function() {
    populateTourGrid();
    populateTestimonials();
    validateBookingForm();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.background = '#ffffff';
    }
}); 