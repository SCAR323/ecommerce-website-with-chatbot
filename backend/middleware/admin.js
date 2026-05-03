const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(401).json({ msg: "Not authorized as an admin" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Server error checking admin status" });
    }
};
