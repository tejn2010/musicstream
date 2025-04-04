const socket = io();

// DOM Elements
const roomInput = document.getElementById("room");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const audioFileInput = document.getElementById("audioFile");
const uploadBtn = document.getElementById("uploadBtn");
const audioPlayer = document.getElementById("audioPlayer");

// Join Room
joinRoomBtn.addEventListener("click", () => {
    const room = roomInput.value.trim();
    if (room) {
        socket.emit("joinRoom", room);
        alert(`Joined room: ${room}`);
    }
});

// Upload and Stream Audio
uploadBtn.addEventListener("click", () => {
    const file = audioFileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const audioData = event.target.result;
            const room = roomInput.value.trim();

            if (room) {
                socket.emit("streamAudio", { room, audioChunk: audioData });
                alert("Audio is being streamed!");
            } else {
                alert("Please join a room first!");
            }
        };

        reader.readAsArrayBuffer(file); // Read file as binary data
    } else {
        alert("Please select a file first!");
    }
});

// Receive and Play Audio
socket.on("receiveAudio", (audioChunk) => {
    const blob = new Blob([audioChunk], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audioPlayer.src = url;
    audioPlayer.play();
});

fetch('https://your-backend.onrender.com/upload', {
  method: 'POST',
  body: formData
})
