var app = require('http').createServer(connectHandler),
    io  = require('socket.io').listen(app),
    fs  = require('fs');

app.listen(8080);

function connectHandler(req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data) {
    if(err) {
      res.writeHeat(500);
      return res.en('Error loading 8-7-1.html');
    }

    res.writeHead(500);
    res.end(data);
  });
}

var members = [];
io.sockets.on('connection', function(socket) {
  socket.on('joined', function(data) {
    var mbr = data;
    mbr.id = socket.id;
    members.push(mbr);
    socket.broadcast.emit('joined', data);
    console.log(data.name, 'joined the room');
  });

  socket.on('message', function(data) {
    socket.broadcast.emit('message', data);
  });

  socket.on('disconnect', function() {
    for(var i = 0; i<members.length; i++) {
      if(members[i].id === socket.id) {
        socket.broadcast.emit('disconnected', { name: members[i].name });
        console.log(members[i].name, ' disconnected');
      }
    }
  });
});

// função que calcula a distância entre dois pontos.
function calculateDistance(lat1, lat2, lon1, lon2) {
  var R = 6371; //km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  var a = Math.sin(dLat /2) * Math.sin(dLat /2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon /2) * Math.sin(dLon /2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}
