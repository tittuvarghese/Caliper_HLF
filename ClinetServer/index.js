let net = require('net');

let server = net.createServer(function(socket) {
	socket.write('Echo Server\r\n');
	socket.pipe(socket);

  socket.on('data', function(data) {
    console.log(data.toString('hex'));
    socket.write('Again server');
    socket.pipe(socket);
  });

  socket.on('error', function(err) {
     console.log(err)
  });

});

server.listen(10025, '0.0.0.0');
