// script.js
const socket = io();
const connection = new RTCMultiConnection();

connection.socketURL = '/';
connection.session = {
    video: true,
    audio: true
};

connection.onstream = (event) => {
    const video = document.createElement('video');
    video.srcObject = event.stream;
    video.autoplay = true;
    video.controls = true;
    document.getElementById('videos').appendChild(video);
};

connection.onstreamended = (event) => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        if (video.srcObject === event.stream) {
            video.remove();
        }
    });
};

connection.onmessage = (event) => {
    if (event.data === 'start') {
        connection.open('room1');
    }
};

socket.on('signal', (data) => {
    connection.processSignalingMessage(data);
});

connection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit('signal', event);
    }
};

connection.onmessage = (event) => {
    if (event.data) {
        connection.processSignalingMessage(event.data);
    }
};

// Start the connection when the page loads
window.onload = () => {
    connection.open('room1');
};
    