const localstrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userbase = require('./../models/users');
const mongoose = require('mongoose');

module.exports = function(passport){
    passport.use(
        new localstrategy({usernameField:'email'},(email,password,done)=>{
            //match user
            userbase.findOne({email:email}).then(user =>{
                if(!user){
                    return done(null,false,{message:'This Email Is Not Registered'});
                }

                //match password
                bcrypt.compare(password,user.password,(err,match)=>{
                    if(match){
                        return done(null,user);
                    }else{
                        return done(null,false,{message:'Password Incorrect'})
                    }
                })
            }).catch(err=>console.log(err));
        })
    );
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done)=>{
        userbase.findById(id,(err, user)=>{
          done(err, user);
        });
    }); 
}
