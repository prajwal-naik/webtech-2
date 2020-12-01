var admin = require("firebase-admin");

var serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webtech-9a6c8.firebaseio.com"
});
var db = admin.database();
var ref = db.ref();
var userref=ref.child('users')
var name='adityasreeram99-gmail-com'

