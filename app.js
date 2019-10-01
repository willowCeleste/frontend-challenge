let express = require('express');
let app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static('src'));

app.listen(app.get('port'), function() {
   console.log("Node app is running at localhost:" + app.get('port'))
 })