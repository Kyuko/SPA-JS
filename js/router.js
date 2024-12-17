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

async function LoadGalleryImages() {
    const gallery = document.querySelector('#gallery');

    // Assume images are named sequentially as image1.jpg, image2.jpg, etc.
    const imageCount = 9; // Total 9 images for 3x3 grid
    const imageUrls = Array.from({ length: imageCount }, (_, i) => `images/image${i + 1}.jpg`);

    imageUrls.forEach((url, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-container');
        
        const img = document.createElement('img');
        img.alt = `Gallery Image ${index + 1}`;
        img.classList.add('lazy');

        imgContainer.appendChild(img);
        gallery.appendChild(imgContainer);

        // Fetch and load the image asynchronously as a Blob
        loadImageAsBlob(url, img);
    });
}

async function loadImageAsBlob(url, imgElement) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        imgElement.src = objectURL; // Assign Blob URL to the img element
        imgElement.classList.remove('lazy');
    } catch (error) {
        console.error("Error loading image:", error);
        imgElement.alt = "Image failed to load";
    }
}

function observeLazyImages() {
    const lazyImages = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Replace with actual src
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
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