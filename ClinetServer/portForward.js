let net = require('net');

// parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
let addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;

let addr = {
    from: addrRegex.exec(process.argv[2]),
    to: addrRegex.exec(process.argv[3])
};

if (!addr.from || !addr.to) {
    console.log('Usage: <from> <to>');
    return;
}

console.log(addr.from);
console.log(addr.to);

net.createServer(function(from) {
    let to = net.createConnection({
        host: addr.to[2],
        port: addr.to[3]
    });
    from.pipe(to);
    to.pipe(from);
}).listen(addr.from[3], addr.from[2]);


// node portForward.js 10024 0.0.0.0:10025
