/**
 * PRIME STACK DEVELOPERS - CORE ENGINE
 * Features: Multi-instance auto-sliders, Manual Override, and Modal Synchronization.
 */

const projectData = {
    'ordering': {
        title: "Ordering System (MusuBinge)",
        desc: "A Java-driven web platform designed for high-concurrency order processing, featuring real-time status tracking and automated receipt generation.",
        images: ["image/project1.1.png", "image/project1.2.png", "image/project1.3.png", "image/project1.4.png", "image/project1.5.png"]
    },
    'cemetery': {
        title: "Cemetery Mapping System",
        desc: "A specialized geospatial database application for digital record-keeping, allowing administrators to map, search, and manage burial plots efficiently.",
        images: ["image/project2.1.png", "image/project2.2.png", "image/project2.3.png", "image/project2.4.png", "image/project2.5.png"]
    },
    'inventory': {
        title: "Inventory Management System",
        desc: "An enterprise-level stock control system featuring automated low-stock alerts, supplier tracking, and detailed SQL-based analytical reporting.",
        images: ["image/project3.1.png", "image/project3.2.png", "image/project3.3.png", "image/project3.4.png", "image/project3.5.png"]
    }
};

// Tracks active intervals for each slider (Card sliders and Modal sliders)
const sliderIntervals = new Map();

// --- SLIDER ENGINE ---

function setupAutoSlide(slider) {
    const imgs = slider.querySelectorAll('img');
    if (imgs.length <= 1) return;

    // Clear any existing timer for this specific element
    if (sliderIntervals.has(slider)) {
        clearInterval(sliderIntervals.get(slider));
    }

    const intervalId = setInterval(() => {
        moveSlide(slider, 1);
    }, 3500);

    sliderIntervals.set(slider, intervalId);
}

function moveSlide(slider, direction) {
    const imgs = slider.querySelectorAll('img');
    if (imgs.length <= 1) return;

    let currentIndex = Array.from(imgs).findIndex(img => img.classList.contains('active'));
    
    imgs[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + direction + imgs.length) % imgs.length;
    imgs[currentIndex].classList.add('active');
}

/**
 * Handle Manual Click
 * 1. Stops propagation so the modal doesn't open when clicking card arrows.
 * 2. Clears the auto-slide timer for THIS slider permanently.
 * 3. Switches the slider to manual-mode for CSS visibility.
 */
function changeSlide(event, direction) {
    event.stopPropagation(); 
    
    const slider = event.target.closest('.main-slider, .modal-slider');
    
    if (sliderIntervals.has(slider)) {
        clearInterval(sliderIntervals.get(slider));
        sliderIntervals.delete(slider);
        slider.classList.add('manual-mode'); // Shows arrows permanently via CSS
    }

    moveSlide(slider, direction);
}

// --- MODAL LOGIC ---

function openModal(id) {
    const data = projectData[id];
    const body = document.getElementById('modalBody');
    const modal = document.getElementById('projectModal');

    // Build Modal Content with Arrow Buttons
    body.innerHTML = `
        <h2 class="modal-title">${data.title}</h2>
        
        <div class="modal-slider" id="modal-slider-instance">
            <div class="slider-arrow prev" onclick="changeSlide(event, -1)">&#10094;</div>
            <div class="slider-arrow next" onclick="changeSlide(event, 1)">&#10095;</div>
            ${data.images.map((img, i) => `
                <img src="${img}" class="${i === 0 ? 'active' : ''}">
            `).join('')}
        </div>
        
        <div class="modal-info">
            <span class="modal-label">Technical Summary</span>
            <p class="modal-desc">${data.desc}</p>
        </div>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scroll

    // Start auto-slide for the modal instance
    const modalSlider = document.getElementById('modal-slider-instance');
    setupAutoSlide(modalSlider);
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    const modalSlider = document.getElementById('modal-slider-instance');

    // Clean up modal timer
    if (modalSlider && sliderIntervals.has(modalSlider)) {
        clearInterval(sliderIntervals.get(modalSlider));
        sliderIntervals.delete(modalSlider);
    }

    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// --- INITIALIZE ---

document.addEventListener("DOMContentLoaded", () => {
    // Init all project card sliders
    document.querySelectorAll('.main-slider').forEach(slider => {
        // Add arrows dynamically if not in HTML
        if (!slider.querySelector('.slider-arrow')) {
            slider.insertAdjacentHTML('afterbegin', `
                <div class="slider-arrow prev" onclick="changeSlide(event, -1)">&#10094;</div>
                <div class="slider-arrow next" onclick="changeSlide(event, 1)">&#10095;</div>
            `);
        }
        setupAutoSlide(slider);
    });
    
    // Reveal Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// Global click listener to close modal on backdrop click
window.onclick = (event) => {
    if (event.target == document.getElementById('projectModal')) closeModal();
};