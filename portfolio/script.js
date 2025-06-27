// Typing Animation
document.addEventListener("DOMContentLoaded", function () {
    const text = "Ritu Saini";
    const typedTextSpan = document.getElementById("typed-text");
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            typedTextSpan.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 150);
        }
    }

    // Start typing animation with a slight delay
    setTimeout(type, 500);
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Animate project cards on hover
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add a simple loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
