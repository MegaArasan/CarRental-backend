const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
require('dotenv/config.js');

const MONGO_URL = process.env.MONGO_URL;
const email = process.env.ADMIN_EMAIL;

async function loadAdmin() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      await User.deleteOne({ email: email });
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);
    const adminUser = [
      {
        username: 'Admin',
        email,
        phoneno: 9999999999,
        address: 'xxx, yyy, zzz',
        role: 'admin',
        password: hashedPassword
      }
    ];

    const user = await User.insertMany(adminUser);
    console.log('Admin user created successfully');
    console.log(user);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
    console.log('Mongo db connection is closed');
  }
}

loadAdmin();
