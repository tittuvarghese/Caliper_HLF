let net = require('net');

let client = new net.Socket();
client.connect(10024, '127.0.0.1', function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.write('Hello, server! Love, Client.');
	client.destroy();
});

client.on('close', function() {
	console.log('Connection closed');
});
