const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  // ...get fields...
  let rest = await Restaurant.findOne({ email: req.body.email });
  if (rest) return res.status(400).json({ error: "Email already exists" });

  const hashed = await bcrypt.hash(req.body.password, 10);
  rest = new Restaurant({ ...req.body, password: hashed });
  await rest.save();
  res.json(rest);
});