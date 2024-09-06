// Video elementini tanlang
const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');

// Kamera oqimini olish
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error('Xato:', error);
        });
}

// Surat olish funksiyasi
function takePicture() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    console.log('Rasm olish: ', imageData);
    // Yuborish uchun Telegram API ga integratsiya qilish mumkin
}

// Tugmani bosganingizda surat olish
captureBtn.addEventListener('click', () => {
    takePicture();
});

// Kamera ishga tushirish
startCamera();
