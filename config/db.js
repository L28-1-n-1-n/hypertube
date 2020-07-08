const mongoose = require('mongoose');
const config = require('config');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const db = process.env.mongoURI;
const connectDB = async () => {
  try {
    mongoose.set('useUnifiedTopology', true);

    await // Work around deprecated Server settings
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
