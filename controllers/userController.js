// 📂 controllers/userController.js
const { ObjectId } = require("mongodb");
const { hashPassword, insertDocument, validateEmail, validatePassword, validateUsername } = require("../utils/helpers");

const registerUser = async (req, res) => {
  const { email, password, username, major, bio, contactInfo } = req.body;

  const emailError = validateEmail(email);
  if (emailError) return res.status(400).json({ error: emailError });

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });

  const usernameError = validateUsername(username);
  if (usernameError) return res.status(400).json({ error: usernameError });

  try {
    const users = req.db.collection("users");
    if (await users.findOne({ email })) return res.status(409).json({ error: "❌ Email already registered." });
    if (await users.findOne({ username })) return res.status(409).json({ error: "❌ Username taken." });

    const hashedPassword = await hashPassword(password);
    const userId = await insertDocument(req.db, "users", { email, password: hashedPassword, username, major, bio, contactInfo });
    res.status(201).json({ message: "✅ User registered", id: userId });
  } catch (error) {
    res.status(500).json({ error: "❌ Registration failed" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "❌ Invalid User ID." });

    const result = await req.db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: "after" }
    );

    if (!result.value) return res.status(404).json({ error: "❌ User not found." });
    res.status(200).json({ message: "✅ User updated", updatedUser: result.value });
  } catch (error) {
    res.status(500).json({ error: "❌ Update failed" });
  }
};

module.exports = { registerUser, updateUser };