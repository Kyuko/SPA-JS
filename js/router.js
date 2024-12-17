let pageUrls = {  
    about: '/index.html?about',  
    contact:'/index.html?contact',
    gallery: '/index.html?gallery'  
}; 
 
function OnStartUp() {      
    popStateHandler();  
} 
 
OnStartUp(); 
 
document.querySelector('#about-link').addEventListener('click', (event) => {      
    let stateObj = { page: 'about' };  
    document.title = 'About';  
    history.pushState(stateObj, "about", "?about");  
    RenderAboutPage();  
}); 
 
document.querySelector('#contact-link').addEventListener('click', (event) => {      
    let stateObj = { page: 'contact' };  
    document.title = 'Contact';  
    history.pushState(stateObj, "contact", "?contact");  
    RenderContactPage();  
}); 

document.querySelector('#gallery-link').addEventListener('click', () => {
    let stateObj = { page: 'gallery' };  
    document.title = 'Gallery';  
    history.pushState(stateObj, "gallery", "?gallery");  
    RenderGalleryPage();  
});
 
function RenderAboutPage() {      
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">About Me</h1> 
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`; 
} 
 
function RenderContactPage() {      
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">Contact with me</h1> 
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`; 
} 
 
function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div id="gallery" class="gallery-container"></div>
    `;
    LoadGalleryImages();
}

function LoadGalleryImages() {
    const gallery = document.querySelector('#gallery');
    const imageCount = 9; // Total 9 images for 3x3 grid

    const imageUrls = Array.from({ length: imageCount }, (_, i) => `images/image${i + 1}.jpg`);

    // Add placeholders for lazy images
    imageUrls.forEach((url, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-container');

        const img = document.createElement('img');
        img.dataset.src = url; // Store the image path in data-src
        img.alt = `Gallery Image ${index + 1}`;
        img.classList.add('lazy');

        img.addEventListener('click', () => openModal(url, img.alt)); // Add click event to open modal

        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);
    });

    observeLazyImages();
}

function observeLazyImages() {
    const lazyImages = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const blobURL = await fetchImageAsBlob(img.dataset.src);
                img.src = blobURL; // Set the image src to the Blob URL
                img.classList.remove('lazy'); // Remove lazy class
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

async function fetchImageAsBlob(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Image load failed:', error);
        return ''; // Empty fallback
    }
}

// Modal functionality
function openModal(imageSrc, imageAlt) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');

    modal.style.display = "block";
    modalImage.src = imageSrc;
    captionText.innerHTML = imageAlt;

    // Close modal on clicking the "X" or outside
    const closeModal = document.querySelector('.close-modal');
    closeModal.onclick = () => modal.style.display = "none";

    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function popStateHandler() {  
    let loc = window.location.href.toString().split(window.location.host)[1];  
 
    if (loc === pageUrls.contact){ RenderContactPage(); } 
    if(loc === pageUrls.about){ RenderAboutPage(); } 
    if (loc === pageUrls.gallery) { RenderGalleryPage(); }
} 
 
window.onpopstate = popStateHandler;  

function RenderContactPage() {      
    document.querySelector('main').innerHTML = ` 
        <h1 class="title">Contact with me</h1> 
        <form id="contact-form"> 
            <label for="name">Name:</label> 
            <input type="text" id="name" name="name" required> 
            <label for="email">Email:</label> 
            <input type="email" id="email" name="email" required> 
            <label for="message">Message:</label> 
            <textarea id="message" name="message" required></textarea> 
            <button type="submit">Send</button> 
        </form>`; 
     
    document.getElementById('contact-form').addEventListener('submit', (event) => { 
        event.preventDefault(); 
        alert('Form submitted!'); 
}); 
}

document.getElementById('theme-toggle').addEventListener('click', () => { 
    document.body.classList.toggle('dark-mode'); 
}); 