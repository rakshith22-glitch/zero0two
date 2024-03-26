import User from '../models/User.js';

export const checkAdmin = async (req, res, next) => {
  try {
    // Check if session contains user ID
    if (!req.session.userId) {
      throw new Error('No session found');
    }

    // Find the user based on the session's user ID
    const user = await User.findOne({ _id: req.session.userId });

    // If no user is found or the user is not an admin, deny access
    if (!user || user.role !== 'admin') {
      return res.status(403).send('Access denied.');
    }

    // Attach user to request object if needed later in the request lifecycle
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
