const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createDemoUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'admin@demo.com' });
    if (existingUser) {
      console.log('Demo user already exists');
      await mongoose.connection.close();
      return;
    }

    // Create demo user
    const demoUser = new User({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'demo123',
      role: 'admin'
    });

    await demoUser.save();
    console.log('Demo user created successfully!');
    console.log('Email: admin@demo.com');
    console.log('Password: demo123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating demo user:', error);
    process.exit(1);
  }
}

createDemoUser();
