const jwt = require('jsonwebtoken');
const User = require('../userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing.' });
    }

    try {
        const decoded = jwt.verify(token, 'andfdh');
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
