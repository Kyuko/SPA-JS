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
        <h1 class="title">Contact Me</h1>
        <form id="contact-form">
            <div class="form-group">
                <label for="name">Imię:</label>
                <input type="text" id="name" name="name" required>
                <span class="error" id="name-error"></span>
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <span class="error" id="email-error"></span>
            </div>

            <div class="form-group">
                <label for="message">Wiadomość:</label>
                <textarea id="message" name="message" required></textarea>
                <span class="error" id="message-error"></span>
            </div>

            <!-- CAPTCHA -->
            <div class="form-group">
                <label for="captcha">Solve this: <span id="captcha-question"></span></label>
                <input type="number" id="captcha" name="captcha" required>
                <span class="error" id="captcha-error"></span>
            </div>

            <button type="submit">Send</button>
        </form>
    `;

    initializeContactForm();
}

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const captchaQuestion = document.getElementById('captcha-question');

    // Generate a basic math CAPTCHA
    const captcha = generateCaptcha();
    captchaQuestion.textContent = `${captcha.num1} + ${captcha.num2}`;
    const captchaSolution = captcha.solution;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Clear previous errors
        clearErrors();

        // Form input values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const captchaInput = document.getElementById('captcha').value.trim();

        let isValid = true;

        // Validation checks
        if (name === "") {
            displayError('name-error', "Name is required.");
            isValid = false;
        }

        if (!validateEmail(email)) {
            displayError('email-error', "Please enter a valid email address.");
            isValid = false;
        }

        if (message === "") {
            displayError('message-error', "Message cannot be empty.");
            isValid = false;
        }

        if (captchaInput === "" || parseInt(captchaInput) !== captchaSolution) {
            displayError('captcha-error', "CAPTCHA is incorrect.");
            isValid = false;
        }

        if (isValid) {
            alert("Form submitted successfully!");
            form.reset(); // Reset the form
            // Optionally send form data to a server here
        }
    });
}

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, solution: num1 + num2 };
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = "");
}
 
function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div id="gallery" class="gallery-container"></div>
 <      <div id="image-modal" class="modal">
            <span class="close-modal">&times;</span>
            <img class="modal-content" id="modal-image">
            <div id="caption"></div>
        </div>
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