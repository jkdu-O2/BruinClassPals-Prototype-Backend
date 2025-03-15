// 📂 config/db.js
const { MongoClient } = require("mongodb");

const uri = "REDACTED API KEY";
const client = new MongoClient(uri);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client.db("university_portal");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
