var socket = io(); 

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

socket.on('connect', () => {
    console.log('Connected to the server.');
    console.log(window.location.search);
    var query = parseQuery(window.location.search);
    console.log(query);
    socket.emit('join', query, () => {

    });
});

socket.on('p2Update', function(data) {
    document.getElementById('text-p1').textContent = data.name; 
});

