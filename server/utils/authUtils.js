const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).send('Invalid token');
        } else {
          req.data = decoded; 
          next();
        }
      });
    } else {
      res.status(401).send('Unauthorized');
    }
  };

  module.exports = {
    authenticateJWT
}