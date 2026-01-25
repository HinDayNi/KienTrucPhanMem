const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "default_secret";

app.post("/login", (req, res) => {
  const user = { id: 1, username: "hien" };

  const accessToken = jwt.sign(user, SECRET, { expiresIn: "1h" });

  res.json({ accessToken });
});

app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Hello", user: req.user });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000, () => console.log("JWT API running on 3000"));
