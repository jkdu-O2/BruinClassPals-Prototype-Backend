// 📂 utils/validation.js
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const hashPassword = (password) => bcrypt.hash(password, 10);

const insertDocument = async (db, collection, data) => {
  return Array.isArray(data)
    ? (await db.collection(collection).insertMany(data)).insertedIds
    : (await db.collection(collection).insertOne(data)).insertedId;
};

const getTimestamp = () => new Date().toLocaleString('en-US', {
  timeZone: 'America/Los_Angeles',
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
});

const validateEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@(g\.ucla\.edu|ucla\.edu)$/.test(email)
    ? null
    : "❌ Invalid UCLA email.";
};

const validatePassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)
    ? null
    : "❌ Password must be at least eight characters long and include at least one uppercase letter and special character.";
};

const validateUsername = (username) => {
  if (username.length < 4) return "❌ Username must be at least 4 characters long.";
  if (/[^a-zA-Z0-9_-]/.test(username)) return "❌ Username can only contain letters, numbers, underscores (_), and hyphens (-).";
  if (/(_-)|(-_)/.test(username)) return "❌ Underscore (_) and hyphen (-) cannot be next to each other.";
  return null;
};

const validateCourse = (courseCode, courseName, instructor, schedule) => {
  if (!courseCode || courseCode.trim() === "") return "❌ Course code is required and cannot be empty or whitespace.";
  if (!courseName || courseName.trim() === "") return "❌ Course name is required and cannot be empty or whitespace.";
  if (!instructor || instructor.trim() === "") return "❌ Instructor name is required and cannot be empty or whitespace.";

  if (!schedule ||
    !Array.isArray(schedule.days) ||
    schedule.days.length === 0 ||
    schedule.days.some(day => !day || day.trim() === "") ||
    !schedule.time || schedule.time.trim() === ""
  ) {
    return "❌ Course schedule must include valid days and time, not empty or whitespace.";
  }
  return null;
};

const validatePost = async (db, subject, content, userId) => {
  if (!subject || subject.trim() === "") return "❌ Subject is required and cannot be empty or whitespace.";
  if (!content || content.trim() === "") return "❌ Content is required and cannot be empty or whitespace.";

  const userExists = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!userExists) return "❌ User ID does not exist.";

  return null;
};

module.exports = {
  hashPassword,
  insertDocument,
  getTimestamp,
  validateEmail,
  validatePassword,
  validateUsername,
  validateCourse,
  validatePost
};
