const express = require('express');
const app = express();
const router = require('./routes/articles');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const userbase = require('./models/users');
const article = require('./models/article');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const { notAuthenticated } = require('./passport/auth');
const {ensureAuthenticated} = require('./passport/auth');
//const pass = require('./passport/passconfig');
//pass(passport);
//or
require('./passport/passconfig')(passport);


mongoose.connect('mongodb://localhost/blog').then(()=>console.log('connected'));


app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req,res,next)=> {

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
});

app.use(express.urlencoded({extended:false}));
app.use('/articles',router);
app.set('view engine','ejs');
app.use('/css',express.static('css'));


//index
app.get('/',notAuthenticated,async(req,res)=>{
    const user = await article.find().sort({date:'descending'});
    res.render('feed', {user:user});
});

//about
app.get('/about',(req,res)=>{
    res.render('about');
});

//signin
app.get('/sign',notAuthenticated,(req,res)=>{
    res.render('sign');
});

//feed
app.get('/feed',async (req,res)=>{
    const user = await article.find().sort({date:'descending'});
    res.render('feed', {user:user});
});

//dashboard
app.get('/dashboard',ensureAuthenticated,async(req,res)=>{ 
    res.render('uindex',{user:req.user});
    
});
   

//edit post
app.get('/edit',ensureAuthenticated,async(req,res)=>{
    const user = await article.find({email:req.user.email}).sort({date:'descending'});
    res.render('edit',{user:user});
});


app.listen(8080,()=>console.log("server running"));