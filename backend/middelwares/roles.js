const isAgent = async (req, res, next) => {
  try {
    // Check User collection first (admin can also access agent routes)
    let user = await User.findById(req.user.id);
    if (user && (user.role === 'agent' || user.role === 'admin')) {
      req.user.role = user.role;
      return next();
    }
    // Check Agent collection
    const agent = await Agent.findById(req.user.id);
    if (agent && agent.role === 'agent') {
      req.user.role = 'agent';
      return next();
    }
    res.status(403).json({ message: 'Access denied. Agent role required.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error checking role' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      req.user.role = user.role;
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error checking role' });
  }
};

module.exports={
    isAdmin,
    isAgent
}