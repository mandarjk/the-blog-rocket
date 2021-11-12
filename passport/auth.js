module.exports = {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }

        req.flash('error','Please Login To view Resource');
        return res.redirect('/sign');
    },

    notAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return res.redirect('/dashboard');
        }
        next()
    }
}