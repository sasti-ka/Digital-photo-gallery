const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Photo = require('./models/Photo');
const Album = require('./models/Album');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
  try {
    await User.deleteMany();
    await Photo.deleteMany();
    await Album.deleteMany();

    const adminUser = {
      name: 'Admin User',
      email: 'admin@photovault.demo',
      password: 'password123', // Will be hashed by pre-save middleware
      role: 'admin',
      bio: 'System Administrator for Demo'
    };

    const regularUsers = Array.from({ length: 4 }).map((_, i) => ({
      name: `Demo User ${i + 1}`,
      email: `user${i + 1}@photovault.demo`,
      password: 'password123',
      role: 'user',
      bio: `I am a demo user ${i + 1}`
    }));

    const usersToCreate = [adminUser, ...regularUsers];
    const createdUsers = [];
    for (const u of usersToCreate) {
      const createdUser = await User.create(u);
      createdUsers.push(createdUser);
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Photo.deleteMany();
    await Album.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
