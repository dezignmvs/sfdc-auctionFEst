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

// Sync Auction Active status
function initAuctionActiveGate() {
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        db.collection('config').doc('festData').onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.isAuctionActive === false) {
                    showAuctionOfflineScreen(data.name || 'Festival');
                } else {
                    hideAuctionOfflineScreen();
                }
            }
        }, err => console.warn("Failed to sync auction status:", err));
    }
}

function showAuctionOfflineScreen(festName) {
    let overlay = document.getElementById('auction-offline-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'auction-offline-overlay';
        overlay.className = 'hacker-offline-screen';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#050805;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#39FF14;font-family:Courier New, Courier, monospace;text-align:center;padding:20px;overflow:hidden;';
        
        // Inject style sheet
        const style = document.createElement('style');
        style.id = 'auction-offline-style';
        style.innerHTML = `
            @keyframes hacker-slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
            #matrix-canvas-auction {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                opacity: 0.75;
            }
            .hacker-card {
                background: rgba(5, 8, 5, 0.9) !important;
                border: 2px solid #39FF14 !important;
                border-radius: 4px !important;
                padding: 40px 30px !important;
                max-width: 440px !important;
                width: calc(100% - 32px) !important;
                text-align: center !important;
                box-shadow: 0 0 30px rgba(57, 255, 20, 0.3) !important;
                animation: hacker-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both !important;
                position: relative !important;
                z-index: 10 !important;
                color: #39FF14 !important;
            }
            .hacker-icon {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: rgba(57, 255, 20, 0.1);
                color: #39FF14;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px auto;
                border: 1px solid #39FF14;
                text-shadow: 0 0 5px rgba(57, 255, 20, 0.5);
                font-size: 24px;
            }
            .hacker-status {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(57, 255, 20, 0.05);
                border: 1px solid rgba(57, 255, 20, 0.3);
                border-radius: 4px;
                padding: 4px 12px;
                margin-bottom: 16px;
            }
            .hacker-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #39FF14;
                box-shadow: 0 0 8px #39FF14;
            }
            .hacker-btn-link {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 10px 18px;
                background: transparent;
                color: #39FF14 !important;
                border: 2px solid #39FF14;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
                margin-top: 24px;
                text-decoration: none;
                width: 100%;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .hacker-btn-link:hover {
                background: #39FF14 !important;
                color: #050805 !important;
                box-shadow: 0 0 15px rgba(57, 255, 20, 0.5);
            }
        `;
        document.head.appendChild(style);

        let canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas-auction';
        overlay.appendChild(canvas);

        let hackerCard = document.createElement('div');
        hackerCard.className = 'hacker-card';
        hackerCard.innerHTML = `
            <div class="hacker-icon">☠</div>
            <div class="hacker-status">
                <div class="hacker-dot"></div>
                <span style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">AUCTION_LOCKOUT</span>
            </div>
            <h1 style="font-size:22px;font-weight:700;color:#39FF14;margin:0 0 8px;line-height:1.2;letter-spacing:-0.02em;text-shadow: 0 0 8px rgba(57, 255, 20, 0.6);">
                [ YOU HAVE BEEN HACKED! ]
            </h1>
            <p style="font-size:13px;color:#88ff88;line-height:1.5;margin:0 0 20px;max-width:320px;margin-left:auto;margin-right:auto;">
                The live player auction bidding panel has been shut down by system administrator root override.
            </p>
            <div style="background:#000;border:1px solid #1a331a;padding:12px;border-radius:4px;text-align:left;font-size:12px;line-height:1.5;color:#39FF14;margin-bottom:16px;font-family:monospace;">
                <div>auction@control:~# STATUS: DEACTIVATED</div>
                <div>auction@control:~# LIVE_BIDDING: suspended</div>
                <div>auction@control:~# SYNC: port_80_restricted</div>
                <div style="display:inline-block;">auction@control:~# </div>
            </div>
        `;
        overlay.appendChild(hackerCard);
        document.body.appendChild(overlay);

        // Initialize Matrix rain animation
        let ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ☠⚡⚠☣🕷";
        const charArray = characters.split("");
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        for (let x = 0; x < columns; x++) drops[x] = 1;
        
        function draw() {
            ctx.fillStyle = 'rgba(5, 8, 5, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#39FF14';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        window.auctionMatrixInterval = setInterval(draw, 33);
        window.auctionMatrixResizeHandler = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', window.auctionMatrixResizeHandler);
    }
}

function hideAuctionOfflineScreen() {
    let overlay = document.getElementById('auction-offline-overlay');
    if (overlay) {
        overlay.remove();
    }
    const style = document.getElementById('auction-offline-style');
    if (style) style.remove();
    
    if (window.auctionMatrixInterval) {
        clearInterval(window.auctionMatrixInterval);
        window.auctionMatrixInterval = null;
    }
    if (window.auctionMatrixResizeHandler) {
        window.removeEventListener('resize', window.auctionMatrixResizeHandler);
        window.auctionMatrixResizeHandler = null;
    }
}

// Initialise Theme & Auction Gate on load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAuctionActiveGate();
});
