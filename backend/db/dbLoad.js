const mongoose = require('mongoose');
const connectDB = require('./connection');
const User = require('./userModel');
const { Photo, Comment } = require('./photoModel');
const SchemaInfo = require('./schemaInfo');

const loadData = async () => {
  console.log('Starting to load data...');
  await connectDB();
  console.log('Connected to MongoDB');

  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Photo.deleteMany({});
  await SchemaInfo.deleteMany({});

  const users = [
    {
      login_name: 'user1',
      password: 'pass1',
      first_name: 'John',
      last_name: 'Doe',
      location: 'Hanoi',
      description: 'Photographer',
      occupation: 'Freelancer',
    },
  ];

  const photos = [
    {
      file_name: 'Photo1.jpg',
      user_id: null,
      date_time: new Date(),
      comments: [],
    },

  ];

  const schemaInfo = { __v: 0, load_date_time: new Date().toISOString() };

  try {
    console.log('Inserting users...');
    const insertedUsers = await User.insertMany(users);
    console.log('Users inserted:', insertedUsers);

    photos[0].user_id = insertedUsers[0]._id;
    console.log('Inserting photos...');
    await Photo.insertMany(photos);
    console.log('Photos inserted');

    console.log('Inserting schema info...');
    await SchemaInfo.create(schemaInfo);
    console.log('Database loaded successfully');
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    console.log('Closing MongoDB connection');
    mongoose.connection.close();
  }
};

loadData();