// Inisialisasi AOS
AOS.init({ duration: 1000, once: true });

// Fungsi Buka Undangan
function startWedding() {
    const song = document.getElementById("song");
    const overlay = document.getElementById("overlay");
    
    if (song) {
        song.play().catch(e => console.log("Autoplay blocked"));
    }
    
    overlay.style.transform = "translateY(-100%)";
    document.body.style.overflow = "auto";
    document.getElementById("music-box").style.display = "block";
    
    setTimeout(() => { overlay.style.display = "none"; }, 1200);
}

// Kontrol Musik (Update Fix)
function toggleMusic() {
    const song = document.getElementById("song");
    const mBtn = document.getElementById("m-btn");
    
    if (song.paused) {
        song.play();
        mBtn.innerHTML = "⏸"; // Muncul lagi pas diputar
    } else {
        song.pause();
        mBtn.innerHTML = "▶"; // Berubah jadi play pas di-pause
    }
}


// RSVP Handler
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nama = document.getElementById('input-nama').value;
        const alamat = document.getElementById('input-alamat').value;
        const hadir = document.getElementById('input-kehadiran').value;
        const jumlah = document.getElementById('input-jumlah').value;
        
        if (hadir === 'Hadir') {
            const isiQR = `Tamu: ${nama} | Alamat: ${alamat} | Porsi: ${jumlah}`;
            const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(isiQR)}`;
            
            document.getElementById('qrcode-area').innerHTML = `<img src="${urlQR}" style="width:180px;">`;
            document.getElementById('qr-name-display').innerText = nama;
            document.getElementById('qr-modal').style.display = 'flex';
        } else {
            alert(`Terima kasih ${nama}, konfirmasi anda telah kami terima.`);
        }
        rsvpForm.reset();
    });
}

// Modal & Copy
function closeModal() { document.getElementById('qr-modal').style.display = 'none'; }

function copyText(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => alert("Berhasil disalin: " + text));
}



// Countdown
const weddingDate = new Date("May 30, 2026 08:00:00").getTime();
setInterval(function() {
    const now = new Date().getTime();
    const dist = weddingDate - now;
    
    const d = Math.floor(dist / (1000 * 60 * 60 * 24));
    const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((dist % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d < 10 ? "0"+d : d;
    document.getElementById("hours").innerText = h < 10 ? "0"+h : h;
    document.getElementById("minutes").innerText = m < 10 ? "0"+m : m;
    document.getElementById("seconds").innerText = s < 10 ? "0"+s : s;
}, 1000);
