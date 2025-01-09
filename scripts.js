
// JavaScript for responsive navbar
const menuIcon = document.querySelector('.menu-icon span');
const navLinks = document.querySelector('.nav-links');
menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

// <!-- mapping the vendors and customers -->

// Initialize the map object and set its view to Soshanguve, Pretoria
var map = L.map('map').setView([-25.5416, 28.0992], 13); // Centered in Soshanguve

// Add a tile layer to the map (OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Coordinates for customers (blue markers)
var customerCoordinates = [
[-25.5400, 28.0950],
[-25.5420, 28.0980],
[-25.5435, 28.1010],
[-25.5440, 28.0965],
[-25.5410, 28.1000],
[-25.5430, 28.0945],
[-25.5425, 28.0905],
[-25.5415, 28.0890]
];

// Coordinates for vendors (green markers)
var vendorCoordinates = [
[-25.5390, 28.0920],
[-25.5405, 28.0935],

];

// Add blue markers for customers
customerCoordinates.forEach(coord => {
L.marker(coord, { icon: L.icon({
    iconUrl: './assets/markers/customer.jpg',
    iconSize: [30, 38], // Size of the marker
    iconAnchor: [15, 50], // Anchor point of the marker
    popupAnchor: [0, -50] // Popup position
}) })
.addTo(map)
.bindPopup("<b>Customer</b>");
});

// Add green markers for vendors
vendorCoordinates.forEach(coord => {
L.marker(coord, { icon: L.icon({
    iconUrl: './assets/markers/vendor.jpg',
    iconSize: [30, 38], // Size of the marker
    iconAnchor: [15, 50], // Anchor point of the marker
    popupAnchor: [0, -50] // Popup position
}) })
.addTo(map)
.bindPopup("<b>Vendor</b>");
});

// <!-- Add JavaScript to handle modal toggling -->

const signupModal = document.getElementById('signupModal');
const signinModal = document.getElementById('signinModal');
const signupBtn = document.querySelector('.btn-primary');
const openSignUp = document.getElementById('openSignUp');
const openSignIn = document.getElementById('openSignIn');
const closeBtns = document.querySelectorAll('.close-btn');

// Open Sign Up Modal
signupBtn.addEventListener('click', () => {
signupModal.style.display = 'block';
});

// Open Sign In Modal when "Sign Out" is clicked in navbar
document.querySelector('.sign-out').addEventListener('click', (e) => {
e.preventDefault();
signupModal.style.display = 'none';
signinModal.style.display = 'block';
});

// Open Sign In Modal
openSignIn.addEventListener('click', (e) => {
e.preventDefault();
signupModal.style.display = 'none';
signinModal.style.display = 'block';
});

// Switch to Sign Up Modal from Sign In
openSignUp.addEventListener('click', (e) => {
e.preventDefault();
signinModal.style.display = 'none';
signupModal.style.display = 'block';
});

// Close modals
closeBtns.forEach(btn => {
btn.addEventListener('click', () => {
signupModal.style.display = 'none';
signinModal.style.display = 'none';
});
});

// Close modals when clicking outside of modal
window.addEventListener('click', (e) => {
if (e.target === signupModal || e.target === signinModal) {
signupModal.style.display = 'none';
signinModal.style.display = 'none';
}
});
// for smooth scrolling to the map section
document.getElementById('openMap').addEventListener('click', function(e) {
e.preventDefault();  // Prevent default link behavior (navigation)

// Scroll smoothly to the map section
document.getElementById('map').scrollIntoView({
behavior: 'smooth'
});
});


