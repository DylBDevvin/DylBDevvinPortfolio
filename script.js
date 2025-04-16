const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {

        // Get the target section's ID from the data-target attribute
        const targetId = button.getAttribute('data-target');

        // Remove the 'active' class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add the 'active' class to the clicked button
        button.classList.add('active');

        // Hide all tab content sections
        tabContents.forEach(content => content.classList.remove('active'));

        // Show the tab content that matches the clicked button's target
        const activeSection = document.getElementById(targetId);
        activeSection.classList.add('active');

        // Remove the animate-in class from all project cards in the active section (reset for reanimation)
        const projectCards = activeSection.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.classList.remove('animate-in');
            // Force reflow to reset the animation (optional but can help when switching quickly)
            void card.offsetWidth;
            // Add the animate-in class to trigger the animation
            card.classList.add('animate-in');
        });
    });
});

// ---------------------------------------------------------
// Lightbox Functionality 
// ---------------------------------------------------------
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');

lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default anchor behavior
        const fullImgSrc = this.getAttribute('href'); // Get the full-size image URL
        lightboxImage.src = fullImgSrc; // Set the lightbox image source
        lightboxOverlay.style.display = 'flex'; // Show the overlay
    });
});

lightboxOverlay.addEventListener('click', function() {
    lightboxOverlay.style.display = 'none';
});


// Animate on load!!!

document.addEventListener('DOMContentLoaded', () => {
    // Identify the active tab-content on load (default is Game Dev)
    const activeSection = document.querySelector('.tab-content.active');
    if (activeSection) {
        // Select all project cards within the active section
        const projectCards = activeSection.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            // Remove the class first to reset (in case of caching)
            card.classList.remove('animate-in');
            // Force a browser reflow to reset the animation state
            void card.offsetWidth;
            // Add the class to trigger the slide-in animation
            card.classList.add('animate-in');
        });
    }
});

