// admin do something -> auth middleware (is admin log in? if yes) -> next
// MIDDLEWARE
const isAuthAdmin = (req, res, next) => {
    try {
        if (req.session.isAuthAdmin){
            next();
        } else {
            res.status(401).json({msg: "Not Authorized!"});
        }
    } catch (error) {
        res.status(500).json({msg: error});
    }  
}

module.exports = isAuthAdmin;