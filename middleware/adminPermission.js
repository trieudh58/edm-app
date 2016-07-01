module.exports = function (req, res, next) {
    var isAdmin = req.user.isAdmin;
    if (!isAdmin) {
        res.status(403).json({
            success: false,
            message: 'Permission denied.'
        });
    }
    else {
        next();
    }
};