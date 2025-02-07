// 📂 controllers/courseController.js
const { insertDocument, validateCourse } = require("../utils/helpers");

const createCourse = async (req, res) => {
  const { courseCode, courseName, instructor, schedule } = req.body;

  const courseError = validateCourse(courseCode, courseName, instructor, schedule);
  if (courseError) return res.status(400).json({ error: courseError });

  try {
    const courseId = await insertDocument(req.db, "courses", req.body);
    res.status(201).json({ message: "✅ Course created", id: courseId });
  } catch (error) {
    res.status(500).json({ error: "❌ Course creation failed" });
  }
};

module.exports = { createCourse };
