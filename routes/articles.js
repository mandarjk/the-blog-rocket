const express = require('express');
const router = express.Router();
router.use(express.urlencoded({extended:false}));
const mongoose = require('mongoose');
const userbase = require('./../models/users');
const article = require('./../models/article');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const {ensureAuthenticated} = require('./../passport/auth');


router.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
//use flash
router.use(flash());
router.use((req,res,next)=> {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
});


mongoose.connect('mongodb://localhost/blog').then(()=>console.log('connected'));


router.post('/users',async(req,res)=>{
    
    //check password
    const password = req.body.password;
    if(password.length<8){
        req.flash('error_msg','Enter Password With 8 Characters');
        return res.redirect('/sign');
    }else{
        //check  email
        const email = req.body.email;
        userbase.findOne({email:email}).then(user=>{
            if(user){
                req.flash('error_msg','Already register Email!');
                return res.redirect('/sign');
            }  
        });
    }

    const hashpassword = await bcrypt.hash(req.body.password,10);
    
    var ubase = new userbase({
        name: req.body.fname,
        email: req.body.email,
        password: hashpassword,
        date: new Date() 
    });
    
    try{
        //console.log(ubase);
        await ubase.save();
        req.flash('success_msg','You are Register Successfully  Now Login');
        res.redirect('/sign');
    }catch(e){

    }
});

router.post('/verify',(req,res,next)=>{
    //login handle
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/sign',
        failureFlash: true
    })(req,res,next);    
});

router.post('/posts',async (req,res)=>{
    //charcter in body check = 160
    var txt = req.body.mbody;
    txt = txt.substring(0,160);
    var text = txt.substring(0,90);
    //console.log(text.length);
    var text2 = txt.substring(90);
    //console.log(text2.length);
    var textarray = [text,text2]
    var textbody =textarray.join("\n");

    //charcter in title check = 50
    var titletxt = req.body.title;
    titletxt = titletxt.substring(0,50);

    var art = new article({
        name:req.user.name,
        email:req.user.email,
        date:new Date(),
        title:titletxt,
        body:textbody
    });
    try{
        //console.log(art);
        await art.save();
        req.flash('success_msg','Successfully posted');
        res.redirect('/feed');
    }catch(e){
        console.log(e);
    }
});


//delete post
router.get('/delete/:id',async(req,res)=>{
    const user = await article.find({_id:req.params.id});
    article.deleteOne({ _id: req.params.id },(err)=>{
        if(err) console.log(err);
        //console.log("Successful deletion");
    });
    req.flash('success_msg','Successful deletion')
    res.redirect('/edit');
});

//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/sign');
})

module.exports = router;
