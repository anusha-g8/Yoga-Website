export const login = (req, res) => {
  const { username, password } = req.body;
  
  const adminUser = (process.env.ADMIN_USER || 'admin').toLowerCase().trim();
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';
  const adminToken = process.env.ADMIN_TOKEN || 'admin-token-123';

  if (username && username.toLowerCase().trim() === adminUser && password === adminPass) {
    res.json({ success: true, token: adminToken, user: 'Admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};
