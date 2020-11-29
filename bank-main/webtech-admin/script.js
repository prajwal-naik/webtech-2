var ex=require('express');
// var port=process.env.port || 8080
var nodemailer = require('nodemailer');
var admin = require("firebase-admin");
var serviceAccount = require("./service.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webtech-d78c1.firebaseio.com"
});
var cookieParser = require('cookie-parser');
var firebase=require('firebase')
const transporter = nodemailer.createTransport({
 service: 'gmail',
  
  auth: {
      user: 'qazw6029@gmail.com',
      pass: 'qazw@12345'
  }
});
var app=ex();
var firebaseConfig = {
  apiKey: "AIzaSyAYKesJq5efEJIkZ8vb-PcgPOIrmeTR9ps",
  authDomain: "webtech-d78c1.firebaseapp.com",
  databaseURL: "https://webtech-d78c1.firebaseio.com",
  projectId: "webtech-d78c1",
  storageBucket: "webtech-d78c1.appspot.com",
  messagingSenderId: "182659589031",
  appId: "1:182659589031:web:b5be55d34ef514d7a10c82",
  measurementId: "G-ELQ5WTRY7Z"
};

firebase.initializeApp(firebaseConfig);

var request = require('request');
app.use(ex.static('img'))
app.use(cookieParser());
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs')
// app.listen(process.env.PORT || 3000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   });
app.listen(3002);
app.get('/',function(req,res){
    if (req.cookies['username-admin']==undefined){
        res.render('index',{modal:true,msg:false})
    }
    else{
    res.render('index',{modal:false,msg:false})
    }
})

app.post('/login',function(req,res){
    if (req.body.username==="admin1" && req.body.password==="adminx"){
        res.cookie('username-admin',"admin1")
        res.render('index',{modal:false,msg:false})

    }
    else{
        res.render('index',{modal:true,msg:false})
    }
})
app.post('/logout',function(req,res){
    res.clearCookie('username-admin')
    res.redirect('/')
})
app.post('/validate',function(req,res){
    try{
        var db = admin.database();
var ref = db.ref();
var userref=ref.child('users')
var user=req.body.email
user=user.replace('.','-')
user=user.replace('@','-')
userref.child(user).once('value',function(data){
    if(data.val()==null){
        res.render('index',{modal:false,msg:true})
    }else{
        res.cookie('user',req.body.email)
    res.render('info',{modal1:false,modal2:false,modal3:false,modal4:false,modal5:false,modal6:false})
    }
})
    }
    catch(err){
        res.render('index',{modal:true,msg:true})
    }
})
app.post("/select",function(req,res){
    var x=req.body.button;
    if (x==="3"){
        res.render('info',{modal1:false,modal2:false,modal3:true,modal4:false,modal5:false,modal6:false})
    }
    else if(x==="2"){
        res.render('info',{modal1:false,modal2:true,modal3:false,modal4:false,modal5:false,modal6:false})
    }
    else if(x==="1"){
        res.render('info',{modal1:true,modal2:false,modal3:false,modal4:false,modal5:false,modal6:false})
    }
    else if (x==="4"){
        res.render('info',{modal1:false,modal2:false,modal3:false,modal4:true,modal5:false,modal6:false})
    }
    else if(x==="5"){
        res.render('info',{modal1:false,modal2:false,modal3:false,modal4:false,modal5:true,modal6:false})
    }
    else{
        res.render('info',{modal1:false,modal2:false,modal3:false,modal4:false,modal5:false,modal6:true})
    }

})

app.get('/validate',function(req,res){
    if(req.cookies['username-admin']===undefined){
        res.redirect('/')
    }
    else{
        res.render('info',{modal1:false,modal2:false,modal3:false,modal4:false,modal5:false,modal6:false})
    }
})

app.get('/login',function(req,res){
    if (req.cookies['username-admin']===undefined){
        res.redirect('/')
    }
    else{
        res.render('index',{modal:false,msg:false})
    }
})

app.post('/push',function(req,res){
    var user=req.cookies['user']
user=user.replace('.','-')
user=user.replace('@','-')
    var db = admin.database();
var ref = db.ref();
var userref=ref.child('users')
var comm=req.body.button
console.log(req.body)
    if (comm.substring(0,1)==="a"){
        if (comm.substring(1,2)==="l"){
            userref.child(user).child('loans').once('value',function(data){
                var x=0
                for (var i in data.val()){
                    x+=1
                }
                x+=1
                userref.child(user).child('loans').child(x.toString()).set(
                    {
                        "amount":req.body.amount+"INR",
                        "collatral":req.body.col,
                        "date":req.body.date,
                        "intrest":req.body.int+"%",
                        "reason":req.body.reason,
                        "remaining":req.body.amount+"INR",
                        "type":req.body.type
                    }
                )
                res.redirect('/validate')
            })
        }
        else if (req.body.button.substring(1,2)==="i"){
            userref.child(user).child('investments').once('value',function(data){
                var x=0
                for (var i in data.val()){
                    x+=1
                }
                x+=1
                var c=65+x-1
                var c=String.fromCharCode(c)
                userref.child(user).child('investments').child(c).set(
                    {
                        "amount":"0INR",
                        "base":req.body.base,
                        "date":req.body.date,
                        "duration":req.body.duration,
                        "type":req.body.type
                    }
                )
                res.redirect('/validate')
            })
        }
       else{
        userref.child(user).child('account').child(req.body.accno).set(
            {
                "balance":req.body.bal+"INR",
                        
                        "cards":req.body.cards,
                        "date":req.body.date,
                        "intrest":req.body.int+"%",
                        "proof":req.body.proof+"INR",
                        "type":req.body.type
            }
        )
        res.redirect('/validate')
        }

    }
    else{
        if (comm.substring(1,2)==="l"){
            console.log(req.body)
              
                userref.child(user).child('loans').child(req.body.loanid).update(
                    {
                        "amount":req.body.amount+"INR",
                        "collatral":req.body.col,
                        "date":req.body.date,
                        "intrest":req.body.int+"%",
                        "reason":req.body.reason,
                        "remaining":req.body.amount+"INR",
                        "type":req.body.type
                    }
                )
                res.redirect('/validate')
           
        }
        else if(comm.substring(1,2)==="i"){
            userref.child(user).child('investments').child(req.body.investid).update(
                {
                    "amount":"0INR",
                    "base":req.body.base,
                    "date":req.body.date,
                    "duration":req.body.duration,
                    "type":req.body.type
                }
            )
            res.redirect('/validate')
        }
        else{
            userref.child(user).child('account').child(req.body.accno).update(
                {
                    "balance":req.body.bal+"INR",
                            
                            "cards":req.body.cards,
                            "date":req.body.date,
                            "intrest":req.body.int+"%",
                            "proof":req.body.proof+"INR",
                            "type":req.body.type
                }
            )
            res.redirect('/validate')
        }
    }
})