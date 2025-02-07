// 📂 controllers/postController.js
const { ObjectId } = require("mongodb");
const { insertDocument, getTimestamp, validatePost } = require("../utils/helpers");

const createPost = async (req, res) => {
  const { subject, content, userId } = req.body;

  const postError = await validatePost(req.db, subject, content, userId);
  if (postError) return res.status(400).json({ error: postError });

  const timestamp = getTimestamp();

  try {
    const postId = await insertDocument(req.db, "posts", { subject, content, userId: new ObjectId(userId), timestamp });
    res.status(201).json({ message: "✅ Post created", id: postId });
  } catch (error) {
    res.status(500).json({ error: "❌ Post creation failed" });
  }
};

module.exports = { createPost };