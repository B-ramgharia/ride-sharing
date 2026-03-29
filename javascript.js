function show(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function login() {
    show('location-screen');
    setTimeout(() => {
        initMap();
    }, 100);
}

function findRides() {
    show('ride-type-screen');
}

function confirmBooking() {
    show('track-driver-screen');
    setTimeout(() => {
        initDriverMap();
    }, 100);
}

function endTrip() {
    show('rating-screen');
}

function setRating(n) {
    document.querySelectorAll('.star').forEach((s, i) => {
        s.style.color = i < n ? '#f59e0b' : '#e5e7eb';
    });
}

function switchToDriver() {
    show('driver-login-screen');
}

function switchToCustomer() {
    show('login-screen');
}

function driverLogin() {
    show('driver-home-screen');
}

function goOnline() {
    show('driver-request-screen');
}

function acceptRide() {
    show('driver-trip-screen');
    setTimeout(() => {
        initDriverNavMap();
    }, 100);
}

function rejectRide() {
    show('driver-home-screen');
}

function arriveAtPickup() {
    alert('Arrived at pickup location.');
}

function startRide() {
    alert('Trip has started.');
}

function endDriverTrip() {
    alert('Trip ended successfully.');
    show('driver-home-screen');
}

let mapInstance = null;

// Fix Leaflet's default icon path issues when using CDN
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function initMap() {
    if (mapInstance) {
        mapInstance.remove();
    }
    mapInstance = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);
    L.marker([28.6139, 77.2090]).addTo(mapInstance).bindPopup('New Delhi');
    L.marker([12.9716, 77.5946]).addTo(mapInstance).bindPopup('Bengaluru');
    L.marker([19.0760, 72.8777]).addTo(mapInstance).bindPopup('Mumbai');
    L.marker([13.0827, 80.2707]).addTo(mapInstance).bindPopup('Chennai');
    L.marker([22.5726, 88.3639]).addTo(mapInstance).bindPopup('Kolkata');
}

function initDriverMap() {
    let dMap = L.map('driver-map').setView([12.9716, 77.5946], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(dMap);
    let carIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204000.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    L.marker([12.9750, 77.5900], {icon: carIcon}).addTo(dMap);
    L.marker([12.9716, 77.5946]).addTo(dMap);
}

function initDriverNavMap() {
    let nMap = L.map('driver-nav-map').setView([12.9716, 77.5946], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(nMap);
    let carIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3204/3204000.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    L.marker([12.9716, 77.5946], {icon: carIcon}).addTo(nMap);
    L.marker([12.9250, 77.5938]).addTo(nMap);
}

window.show = show;
window.login = login;
window.findRides = findRides;
window.confirmBooking = confirmBooking;
window.endTrip = endTrip;
window.setRating = setRating;
window.switchToDriver = switchToDriver;
window.switchToCustomer = switchToCustomer;
window.driverLogin = driverLogin;
window.goOnline = goOnline;
window.acceptRide = acceptRide;
window.rejectRide = rejectRide;
window.arriveAtPickup = arriveAtPickup;
window.startRide = startRide;
window.endDriverTrip = endDriverTrip;