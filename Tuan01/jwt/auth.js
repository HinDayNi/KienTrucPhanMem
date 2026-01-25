const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
(async () => {
  const hash = await bcrypt.hash("123456", 10);
  console.log("Hash new:", hash);
})();

const app = express();
app.use(express.json());

// ================= SECRET KEYS =================
const ACCESS_SECRET = "ACCESS_SECRET_KEY_DEMO";
const REFRESH_SECRET = "REFRESH_SECRET_KEY_DEMO";
let refreshTokens = [];

// ================= FAKE USER DB =================
const users = [
  {
    id: 1,
    username: "hien",
    password: "$2b$10$tc6aa3JahnEYYJjOmJG3/eAA.Nm371xt.93GPXfjLtLZvRa9gHfvi" // 123456
  }
];

// ================= HELPER FUNCTIONS =================
function generateAccessToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, ACCESS_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
  const token = jwt.sign({ id: user.id, username: user.username }, REFRESH_SECRET, { expiresIn: "7d" });
  refreshTokens.push(token);
  return token;
}

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  console.log("Body Received:", req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  console.log("DB password:", user.password);
  console.log("Input password:", password);
  console.log("Password Check:", valid);

  if (!valid) return res.status(400).json({ error: "Invalid password" });

  return res.json({
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  });
});

// ================= PROTECTED API =================
app.get("/profile", (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Authorization header missing" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token format invalid" });

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token expired or invalid" });
    return res.json({ message: "Hello", user });
  });
});

// ================= REFRESH TOKEN =================
app.post("/refresh", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: "Refresh token required" });
  if (!refreshTokens.includes(token)) return res.status(403).json({ error: "Invalid refresh token" });

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Refresh token expired" });
    const newAccess = generateAccessToken(user);
    return res.json({ accessToken: newAccess });
  });
});

// ================= LOGOUT =================
app.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.json({ message: "Logged out" });
});

// ================= START SERVER =================
app.listen(3000, () => console.log("JWT server running on port 3000"));
