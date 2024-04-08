module.exports = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userData || !allowedRoles.includes(req.userData.role)) {
            return res.status(403).json({
                message: "You do not have the permission to access this route",
            });
        }
        next();
    }
}