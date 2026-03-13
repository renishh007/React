const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/expensetracker';
  try {
    const conn = await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  family: 4
});
    console.log(
      `mongoDB connected : ${conn.connection.host}`.cyan.underline.bold,
    );
  } catch (error) {
    // MongoDB is not available (e.g., not installed/running locally or Atlas not reachable).
    // We keep the server running using an in-memory store so the app remains usable.
    console.error('MongoDB connection error:', error.message);

    global.useInMemoryDB = true;
    global.inMemoryTransactions = global.inMemoryTransactions || [];

    console.warn('MongoDB not available; running with in-memory fallback storage. Data will not persist after restart.');
  }
};

module.exports = connectDB;