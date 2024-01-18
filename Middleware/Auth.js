const isLoggedin = async(req, res, next)=>{
    if(req.isAuthenticated()) return next()
    return res.json({error: "Login sesion expired, Kindly re-login to continue"})
}

const isAdmin = async(req, res, next)=>{
    if(req.isAuthenticated() && req.user.userType === "admin") return next()
    return res.json({error: "You are not authorized"})
}

const isVerified = async(req, res) =>{
    if(req.isAuthenticated() && !req.user.isVerify) return next()
    return res.json({error: "User verified!!!"})
}

module.exports = {isLoggedin, isAdmin, isVerified}