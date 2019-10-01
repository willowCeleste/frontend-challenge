let express = require('express');
let app = express();

app.use(express.static('src'));

let server = app.listen(3000, function(){
   var port = server.address().port;
   console.log('server running on ' + port);
});