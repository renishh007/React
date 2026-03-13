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
    console.error('MongoDB connection failed:', error);
    // if the atlas URI failed and we're not already using localhost, try local
    if (uri.includes('mongodb+srv') && uri !== 'mongodb://localhost:27017/expensetracker') {
      console.warn('Attempting fallback to local MongoDB instance...');
      try {
        const fallback = await mongoose.connect('mongodb://localhost:27017/expensetracker', {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(
          `mongoDB connected to local instance : ${fallback.connection.host}`.cyan.underline.bold,
        );
        return;
      } catch (err2) {
        console.error('Local MongoDB connection also failed:', err2);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;