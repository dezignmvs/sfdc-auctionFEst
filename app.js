// Firebase Configuration & Initialization
const firebaseConfig = {
    apiKey: "AIzaSyCKA0k_9UgoJX_RBgEsIeNdiW2w0Okko1o",
    authDomain: "festie-s1u2h3.firebaseapp.com",
    projectId: "festie-s1u2h3",
    storageBucket: "festie-s1u2h3.firebasestorage.app",
    messagingSenderId: "794049194885",
    appId: "1:794049194885:web:8f75f0df4c15cde15eb2ec"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
db.settings({ experimentalForceLongPolling: true });

// Force Light Theme (matching dashboard.html)
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('auction-theme', 'light');
}

// Global Toast Messages using standard notification design
function showAuctionToast(msg, isSuccess = true) {
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: `<b>${isSuccess ? '✅' : '🔔'}</b> ${msg}`,
            duration: 2500,
            gravity: "top",
            position: "right",
            style: {
                background: "#fff",
                color: "#333",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
                borderRadius: "1rem",
                border: "1px solid #eaeaea",
                padding: "12px 24px",
                fontSize: "13px",
                fontWeight: "600",
                fontFamily: "'Inter', sans-serif"
            },
            escapeMarkup: false
        }).showToast();
    } else {
        alert(msg);
    }
}

// Initialise Theme on load
document.addEventListener('DOMContentLoaded', initTheme);
