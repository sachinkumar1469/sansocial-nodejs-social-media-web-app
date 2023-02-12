

module.exports = (req,res,next)=>{
    res.locals.flash = {
        "success":req.flash("success"),
        "warning":req.flash("warning"),
        "error":req.flash("error"),
    }
    next();
}