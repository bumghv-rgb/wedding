// 1. Inisialisasi AOS & Data (Ambil dari LocalStorage)
AOS.init({ duration: 1000, once: true });
let wishesData = JSON.parse(localStorage.getItem('weddingWishes')) || [];

// --- FUNGSI UPDATE TAMPILAN (STATISTIK) ---
function updateDisplay() {
    // Reset hitungan
    let totalOrangHadir = 0;
    let totalTamuTidakHadir = 0;

    wishesData.forEach(wish => {
        if (wish.kehadiran === 'Hadir') {
            // Kita jumlahkan total orang yang dibawa (pasti angka)
            totalOrangHadir += parseInt(wish.jumlah || 1);
        } else {
            // Kalau tidak hadir, hitung per kepala/input
            totalTamuTidakHadir++;
        }
    });

    // Update Angka ke Layar
    const hadirEl = document.getElementById('count-hadir');
    const tidakEl = document.getElementById('count-tidak');
    
    if (hadirEl) hadirEl.innerText = totalOrangHadir;
    if (tidakEl) tidakEl.innerText = totalTamuTidakHadir;
}

// 2. Fungsi Tombol Buka Undangan
function startWedding() {
    const song = document.getElementById("song");
    const overlay = document.getElementById("overlay");
    
    if (song) {
        song.play().catch(error => console.log("Autoplay dicegah browser:", error));
    }
    
    overlay.style.transform = "translateY(-100%)";
    document.body.style.overflow = "auto";
    document.getElementById("music-box").style.display = "block";
    
    setTimeout(() => {
        overlay.style.display = "none";
    }, 1200);
}

// 3. Fungsi Play/Pause Musik
function toggleMusic() {
    const song = document.getElementById("song");
    const mBtn = document.getElementById("m-btn");
    if (song.paused) {
        song.play();
        mBtn.innerText = "⏸";
    } else {
        song.pause();
        mBtn.innerText = "🎵";
    }
}

// 4. Handler Kirim Form RSVP
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ambil value dari form
        const nama = document.getElementById('input-nama').value;
        const alamat = document.getElementById('input-alamat').value; // Input baru
        const hadir = document.getElementById('input-kehadiran').value;
        const jumlah = document.getElementById('input-jumlah').value; // Input baru
        const ucapan = document.getElementById('input-ucapan').value;
        const waktu = new Date().toLocaleString('id-ID');

        // Susun data baru
        const dataBaru = { 
            nama, 
            alamat, 
            kehadiran: hadir, 
            jumlah: hadir === 'Hadir' ? jumlah : 0, 
            ucapan, 
            waktu 
        };

        // Simpan ke LocalStorage
        wishesData.push(dataBaru);
        localStorage.setItem('weddingWishes', JSON.stringify(wishesData));

        // Logika Barcode & Feedback
        if (hadir === 'Hadir') {
            // QR Code berisi data Nama, Alamat, dan Jumlah
            const isiQR = `${nama}, ${alamat}, ${jumlah}, ${ucapan}`;
    
    const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(isiQR)}`;
    
    document.getElementById('qrcode-area').innerHTML = `<img src="${urlQR}" style="width:180px;" alt="QR Code Tamu">`;
    document.getElementById('qr-name-display').innerText = nama;
    document.getElementById('qr-modal').style.display = 'flex';
        } else {
            alert(`Terima kasih ${nama}, pesan kamu sudah kami terima!`);
        }

        rsvpForm.reset();
        updateDisplay(); // Refresh angka di layar
    });
}

// 5. Fungsi Pelengkap (Tutup Modal & Copy Rekening)
function closeModal() { 
    document.getElementById('qr-modal').style.display = 'none'; 
}

function copyText(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Nomor rekening berhasil disalin: " + text);
    });
}

// 6. Logika Reset Data (Klik Judul Wishes 5x - Buat Admin)
let clickCount = 0;
document.getElementById('reset-trigger')?.addEventListener('click', function() {
    clickCount++;
    if (clickCount === 5) {
        const password = prompt("Masukkan kode akses untuk reset data:");
        if (password === 'admin123') {
            if (confirm("Hapus semua data statistik?")) {
                localStorage.removeItem('weddingWishes');
                location.reload();
            }
        }
        clickCount = 0;
    }
    setTimeout(() => { clickCount = 0; }, 3000);
});

// 7. Countdown Timer (Target: 30 Mei 2026)
function updateCountdown() {
    const weddingDate = new Date("May 30, 2026 08:00:00").getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    if (daysEl) {
        daysEl.innerText = d < 10 ? "0" + d : d;
        document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
        document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
        document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
    }

    if (distance < 0) {
        clearInterval(countdownInterval);
        const timerElement = document.getElementById("timer");
        if (timerElement) timerElement.innerHTML = "<h3>Acara Sedang Berlangsung!</h3>";
    }
}

// Jalankan interval & inisialisasi awal
const countdownInterval = setInterval(updateCountdown, 1000);
updateDisplay();
updateCountdown();