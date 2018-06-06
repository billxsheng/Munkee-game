var socket = io(); 

socket.on('connect', () => {
    console.log('Connected to the server');
});