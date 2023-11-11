let jwt = require('jsonwebtoken');
const secretKey = process.env.secretKeyJWT;
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        if (decoded.role !== '1') {
            res.status(403).json({ message: 'not access' });
            return;
        }
        // req.user = decoded.user;
        next();
    });
}

module.exports = authenticateToken