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
app.listen(3001);
app.get('/',function(req,res){
    
        var name=req.cookies['usename']
        // console.log(name)
        if (name==undefined){
          res.render('index')}
        else{
          var act=req.cookies['dob']
          var cur=parseInt(new Date().getFullYear());
          var yr=parseInt(act.substring(0,5))
          var max=3;
          var i=cur-yr
          if (i%10>5){
            i+=(10-i%10);
          }
          else{
            i-=i%10;
          }
          var age=i+'-'+max+'.png'
        res.render('homepage',{name:req.cookies['username'],phone:req.cookies['phone'],address:req.cookies['address'],email:req.cookies['usename'],age:age})}
    
  
})
app.get('/homepage',function(req,res){
    
  var name=req.cookies['usename']
  // console.log(name)
  if (name==undefined){
    res.render('index')}
  else{
    var act=req.cookies['dob']
    var cur=parseInt(new Date().getFullYear());
    var yr=parseInt(act.substring(0,5))
    var max=3;
    var i=cur-yr
    if (i%10>5){
      i+=(10-i%10);
    }
    else{
      i-=i%10;
    }
    var age=i+'-'+max+'.png'
  res.render('homepage',{name:req.cookies['username'],phone:req.cookies['phone'],address:req.cookies['address'],email:req.cookies['usename'],age:age})}


})
app.post('/homepage',async (req,res)=>{
    var usename=req.body.uname;
    var password=req.body.pass;
    var usename1=usename
    usename1=usename1.replace('@','-')
    usename1=usename1.replace('.','-')
    
        try{
       await firebase.auth().signInWithEmailAndPassword(usename, password)
       
        
        var db=admin.database()
        var ref = db.ref('users');
        ref.child(usename1).once("value",function(data){
            // console.log(data.val())
            res.cookie('usename',usename)
            res.cookie('address',data.val().address)
            res.cookie('username',data.val().username)
            res.cookie('phone',data.val().phone)
            res.cookie('dob',data.val().dob)
            var act=data.val().dob
            var cur=parseInt(new Date().getFullYear());
            var yr=parseInt(act.substring(0,5))
            var max=3;
            var i=cur-yr
            if (i%10>5){
              i+=(10-i%10);
            }
            else{
              i-=i%10;
            }
            var age=i+'-'+max+'.png'
            console.log(age)
        res.render('homepage',{name:data.val().username,phone:data.val().phone,address:data.val().address,email:usename,age:age})
        })}
        catch(err){
          res.redirect('/')
        }
        })
        


app.post('/logout',function(req,res){
  res.clearCookie('usename')
  res.redirect("/")
})
app.get('/create',function(req,res){
  res.render('create',{modal:false})
})
app.post('/upload',function(req,res){
  
  var x=parseInt(Math.random()*10).toString()
  
  x+=parseInt(Math.random()*10).toString()
  x+=parseInt(Math.random()*10).toString()
  x+=parseInt(Math.random()*10).toString()
  console.log(x)
  var email=req.body.email
  var db = admin.database();
  var ref = db.ref('users');
  var email1=email
  email1=email1.replace('@','-')
  email1=email1.replace('.','-')
ref.child(email1).once("value",function(data){
    if (data.val()!==null){
      return res.redirect("/")
    }
    else{
      res.cookie('usename',req.body.email)
  res.cookie('address',req.body.address)
  res.cookie('username',req.body.name)
  res.cookie('phone',req.body.phone)
  res.cookie('dob',req.body.dob)
  res.cookie('occupation',req.body.occupation)
  res.cookie('password',req.body.pass)
  res.cookie('mari',req.body.mari)
  res.cookie('education',req.body.education)
  var mailOptions = {
    from: 'samplewebinar2020@gmail.com',
    to: req.body.email,
    subject: 'OTP',
    text: 'your otp is '+x
  };
  transporter.sendMail(mailOptions,function(error,info){
    console.log(error)
    if (error){
      res.redirect('/')
    }
    else{
      res.cookie('otp',(parseInt(x)+9999).toString())
      res.render('create',{modal:true})
    }
  })
}
})})
app.post('/register',function(req,res){
  var otp=req.body.otp;
  console.log(otp)
  console.log(req.cookies['otp'])
  if (parseInt(otp)==(parseInt(req.cookies['otp'])-9999)){
  var usename=req.cookies['username'];
  var education=req.cookies['education'];
  var married=req.cookies['mari'];
  var phone=req.cookies['phone'];
  var email=req.cookies['usename'];
  var dob=req.cookies['dob'];
  var address=req.cookies['address'];
  var occupation=req.cookies['occupation'];
  var password=req.cookies['password'];
  
  res.clearCookie('education')
  res.clearCookie('mari')
 
  res.clearCookie('occupation')
  res.clearCookie('password')
  var email1=email
  email1=email1.replace('@','-')
  email1=email1.replace('.','-')

  var db=admin.database()
      var ref = db.ref();
      var userref=ref.child('users')
      
      userref.child(email1).set({
          "email":email,
          "username":usename,
          "education":education,
          "married":married,
          "phone":phone,
          "occupation":occupation,
          "address":address,
          "dob":dob
          
      })
      
        var x=firebase.auth().createUserWithEmailAndPassword(email, password).then(function(record){
          res.redirect('/')
        })
        
      
      
     



}



else{
  res.clearCookie('dob')
  res.clearCookie('usename')
  res.clearCookie('address')
  res.clearCookie('username')
  res.clearCookie('phone')
  res.redirect('/')
}
})

app.get('/payment',function(req,res){
  res.render('payment',{modal:false,max:1000000})
})
app.get('/loans',function(req,res){
  if (req.cookies['usename']==undefined){
    res.redirect('/')
  }
  else{
    var db=admin.database()
    var ref = db.ref('users');
    var id=req.cookies['usename']
    id=id.replace('@','-')
    id=id.replace('.','-')
    try{
    ref.child(id).child('loans').once("value",function(data){
      console.log(data.val())
      res.render('loans',{loans:data.val(),msg:null})
    })}
    catch(err){
    res.render('loans',{loans:null,msg:"No loans yet! Select any loans to Apply!"})
    }
  }
})
app.get('/enquiry',function(req,res){
  if(req.cookies['usename']==undefined){
    res.redirect('/')
  }
  else{
    res.render('enquiry',{msg:null})
  }
})
app.post('/send',function(req,res){
  var date=req.body.date;
  var time=req.body.time;
  var text=req.body.text;
  var mailOptions = {
    from: 'samplewebinar2020@gmail.com',
    to: req.cookies['usename'],
    subject: 'Thank you for scheduling a enquiry',
    text: 'your meeting is Scheduled on '+date+' by '+time+"\n Text we recieved from you : "+text
  };
  transporter.sendMail(mailOptions,function(error,info){
    console.log(error)
    if (error){
      res.render('enquiry',{msg:"Cannot Send retry after some time"})
    }
    else{
      res.redirect('/')
    }
  })
})
app.post('/pay',function(req,res){
  var db=admin.database()
  var ref = db.ref('users');
  var id=req.cookies['usename']
  var accno=req.body.accno
  var amount=req.body.amount
  var cardno=req.body.cardno
  var cvv=req.body.cvv

  id=id.replace('@','-')
  id=id.replace('.','-')
var lid=req.cookies['id']

try{
ref.child(id).child('account').child(accno).once("value",function(data){
  console.log(data.val())
var bal=data.val().balance
var card=data.val().cards
var vari=card.split('-')
var cardnum=vari[0]
var cvv1=vari[1]


bal=parseInt(bal.substring(0,bal.length-3))
if(amount<=bal && cvv1===cvv && cardno===cardnum){
  res.cookie('accno',accno)
  res.cookie('amount',amount)
  res.cookie('bal',bal)
  var x=parseInt(Math.random()*10).toString()
  x+=parseInt(Math.random()*10).toString()
  x+=parseInt(Math.random()*10).toString()
  x+=parseInt(Math.random()*10).toString()
  console.log(x)
  var mailOptions = {
    from: 'samplewebinar2020@gmail.com',
    to: req.cookies['usename'],
    subject: 'OTP',
    text: 'your otp is '+x
  };
  transporter.sendMail(mailOptions,function(error,info){
    console.log(error)
    if (error){
      res.render('/')
    }
    else{
      res.cookie('otp',(parseInt(x)+9999).toString())
      res.render('payment',{modal:true,max:1000000})
    }
  })
}
else{
  res.redirect('/')
}

})}
catch(err){
  res.redirect('/')
}

})
app.post('/check',function(req,res){
  var otp=req.body.otp;
  console.log(otp)
  console.log(req.cookies['otp'])
  if (parseInt(otp)==(parseInt(req.cookies['otp'])-9999) && req.body.amount==req.cookies['amount']){
    res.clearCookie('otp')  
    var accno=req.cookies['accno']
    var db = admin.database();
var ref = db.ref();
var userref=ref.child('users')
var final=req.cookies['bal']-req.cookies['amount']
var tot=final.toString()+'INR'
var dt=new Date()
var uname=req.cookies['usename']
uname=uname.replace('@','-')
uname=uname.replace('.','-')
userref.child(uname).child('account').child(accno).update({
    
    balance:tot,
   
})
if(!isNaN(req.cookies['id'])){
  var loantot=req.cookies['rem']-req.cookies['amount']
var loantot=loantot.toString()+'INR'
userref.child(uname).child('loans').child(req.cookies['id']).update({
    
  remaining:loantot,
 
})

}


else{
  var loantot=parseInt(req.cookies['rem'])+parseInt(req.cookies['amount'])
  var loantot=loantot.toString()+'INR'
  userref.child(uname).child('investments').child(req.cookies['id']).update({
    
    amount:loantot,
   
  })
}
userref.child(uname).child('payments').once("value",function(data){
  var x=0
  for(var i in data.val()){
    x+=1
  }
  x+=1
  console.log(x)
  var typex=""
  if(isNaN(req.cookies['id'])){
    typex="Loan"
  }
  else{
    typex="Investment"
  }
  userref.child(uname).child('payments').child("pid"+x).update({
    
    accountdebited:req.cookies['accno'],
    amount:req.cookies['amount']+'INR',
    date:dt.toUTCString(),
    type:typex,
    typeId:req.cookies['id']
   
  })
    
  
 


    var mailOptions = {
      from: 'samplewebinar2020@gmail.com',
      to: req.cookies['usename'],
      subject: 'Payment Sucessful',
      text: 'your payment for Rs'+req.body.amount+" is succesful"
    };
    transporter.sendMail(mailOptions,function(error,info){
      console.log(error)
      if (error){
        res.redirect('/')
      }
      else{
       
        res.redirect('/')
      }
    })
  })
  }
  else{
    res.clearCookie('otp') 
    res.redirect('/')
  }
})

app.post('/payment',function(req,res){
  var db=admin.database()
  var ref = db.ref('users');
  var id=req.cookies['usename']
  id=id.replace('@','-')
  id=id.replace('.','-')
var lid=req.body.id;
res.cookie('id',lid)
if (!isNaN(lid)){
ref.child(id).child('loans').child(lid.toString()).once("value",function(data){
var rem=data.val().remaining
rem=rem.substring(0,rem.length-3)
rem=rem.replace(',','')
console.log(parseInt(rem))
res.cookie('rem',rem)
res.render('payment',{modal:false,max:rem})
})}
else{
  ref.child(id).child('investments').child(lid.toString()).once("value",function(data){
    var rem=data.val().amount
rem=rem.substring(0,rem.length-3)
rem=rem.replace(',','')
console.log(parseInt(rem))
res.cookie('rem',rem)
    res.render('payment',{modal:false,max:1000000})
  
  })
}

})

app.get('/investment',function(req,res){
  if (req.cookies['usename']==undefined){
    res.redirect('/')
  }
  else{
    var db=admin.database()
    var ref = db.ref('users');
    var id=req.cookies['usename']
    id=id.replace('@','-')
    id=id.replace('.','-')
    try{
    ref.child(id).child('investments').once("value",function(data){
      console.log(data.val())
      res.render('investment',{investments:data.val(),msg:null})
    })}
    catch(err){
    res.render('investment',{investments:null,msg:"No Investments yet! Make New Investments!"})
    }
  }
})

app.get('/hispay',function(req,res){
  if (req.cookies['usename']==undefined){
    res.render('/')
  }
  else{
    var db=admin.database()
    var ref = db.ref('users');
    var id=req.cookies['usename']
    id=id.replace('@','-')
    id=id.replace('.','-')
    try{
    ref.child(id).child('payments').once("value",function(data){
      console.log(data.val())
      var x=0
      for (var i in data.val()){
        x+=1
      }
      res.render('hispay',{pays:data.val(),msg:null,count:x})
    })}
    catch(err){
    res.render('hispay',{pays:null,msg:"No loans yet! Select any loans to Apply!",count:null})
    }
  }
})

app.get('/accounts',function(req,res){
  if (req.cookies['usename']==undefined){
    res.render('/')
  }
  else{
    var db=admin.database()
    var ref = db.ref('users');
    var id=req.cookies['usename']
    id=id.replace('@','-')
    id=id.replace('.','-')
    try{
    ref.child(id).child('account').once("value",function(data){
      console.log(data.val())
      var x=0
      for (var i in data.val()){
        x+=1
      }
      res.render('accounts',{accounts:data.val(),msg:null,count:x})
    })}
    catch(err){
    res.render('accounts',{accounts:null,msg:"No loans yet! Select any loans to Apply!",count:null})
    }
  }
})