export const login = (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin') {
    // In a real app, you'd use JWT here. For this request, we'll return a success flag.
    res.json({ success: true, token: 'admin-token-123', user: 'Admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};
