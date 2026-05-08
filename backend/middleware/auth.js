const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Geçersiz token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin yetkisi gerekli' });
  }
  next();
};

const verifyRegionManager = (req, res, next) => {
  if (!['admin', 'region_manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Bölge sorumlusu yetkisi gerekli' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin, verifyRegionManager };