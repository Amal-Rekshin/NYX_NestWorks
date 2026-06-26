// seed.js - Populate MongoDB with dummy data
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');
const Lead = require('./models/Lead');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing collections (optional)
    await User.deleteMany({});
    await Property.deleteMany({});
    await Lead.deleteMany({});

    // Sample users
    const usersData = [
      { name: 'Alice', email: 'alice@example.com', password: 'password123', role: 'admin', phone: '1234567890' },
      { name: 'Bob', email: 'bob@example.com', password: 'password123', role: 'user', phone: '0987654321' },
      { name: 'Carol', email: 'carol@example.com', password: 'password123', role: 'user', phone: '1112223333' },
      { name: 'Dave', email: 'dave@example.com', password: 'password123', role: 'user', phone: '2223334444' },
      { name: 'Eve', email: 'eve@example.com', password: 'password123', role: 'admin', phone: '3334445555' },
      { name: 'Frank', email: 'frank@example.com', password: 'password123', role: 'user', phone: '4445556666' },
      { name: 'Grace', email: 'grace@example.com', password: 'password123', role: 'user', phone: '5556667777' },
      { name: 'Heidi', email: 'heidi@example.com', password: 'password123', role: 'user', phone: '6667778888' },
      { name: 'Ivan', email: 'ivan@example.com', password: 'password123', role: 'user', phone: '7778889999' },
      { name: 'Judy', email: 'judy@example.com', password: 'password123', role: 'admin', phone: '8889990000' },
      { name: 'Mallory', email: 'mallory@example.com', password: 'password123', role: 'user', phone: '9990001111' },
      { name: 'Oscar', email: 'oscar@example.com', password: 'password123', role: 'user', phone: '0001112222' }
    ];
    const users = await Promise.all(usersData.map((u) => User.create(u)));
    console.log('Inserted users');

    // Sample properties
    const properties = await Property.insertMany([
  // Construction
  {
    title: 'Cozy Cottage',
    category: 'construction',
    description: 'A beautiful cottage in the countryside with spacious garden.',
    price: 250000,
    location: 'Countryside',
    areaSqft: 1500,
    bedrooms: 3,
    bathrooms: 2,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80'],
    isFeatured: true,
  },
  {
    title: 'Rustic Farmhouse',
    category: 'construction',
    description: 'Traditional farmhouse with modern amenities and large land.',
    price: 320000,
    location: 'Rural Valley',
    areaSqft: 2000,
    bedrooms: 4,
    bathrooms: 3,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'],
    isFeatured: false,
  },
  {
    title: 'Mountain Cabin',
    category: 'construction',
    description: 'Cozy cabin nestled in the mountains, perfect for retreats.',
    price: 210000,
    location: 'High Peaks',
    areaSqft: 1200,
    bedrooms: 2,
    bathrooms: 1,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=765&q=80', 'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'],
    isFeatured: false,
  },
  // Sales
  {
    title: 'Modern Apartment',
    category: 'sales',
    description: 'A sleek downtown apartment with city views.',
    price: 450000,
    location: 'City Center',
    areaSqft: 900,
    bedrooms: 2,
    bathrooms: 1,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1502672260266-1c15293036e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'],
    isFeatured: false,
  },
  {
    title: 'Luxury Villa',
    category: 'sales',
    description: 'Spacious villa with private pool and garden.',
    price: 950000,
    location: 'Uptown',
    areaSqft: 3500,
    bedrooms: 5,
    bathrooms: 4,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80', 'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'],
    isFeatured: true,
  },
  {
    title: 'Beach House',
    category: 'sales',
    description: 'Oceanfront property with panoramic sea views.',
    price: 750000,
    location: 'Coastal Shore',
    areaSqft: 2800,
    bedrooms: 4,
    bathrooms: 3,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'],
    isFeatured: false,
  },
  {
    title: 'Downtown Loft',
    category: 'sales',
    description: 'Open-plan loft in the heart of the financial district.',
    price: 620000,
    location: 'Financial District',
    areaSqft: 1800,
    bedrooms: 3,
    bathrooms: 2,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'],
    isFeatured: false,
  },
  {
    title: 'Suburban Home',
    category: 'sales',
    description: 'Family-friendly home in a quiet suburb.',
    price: 410000,
    location: 'Suburbia',
    areaSqft: 2200,
    bedrooms: 4,
    bathrooms: 2,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'],
    isFeatured: false,
  },
  {
    title: 'Penthouse Suite',
    category: 'sales',
    description: 'Top-floor penthouse with skyline panorama.',
    price: 1200000,
    location: 'Skyline Tower',
    areaSqft: 4000,
    bedrooms: 4,
    bathrooms: 4,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80'],
    isFeatured: true,
  },
  // Plans
  {
    title: 'Eco-friendly Bungalow',
    category: 'plans',
    description: 'Energy-efficient bungalow design with solar panels.',
    price: 300000,
    location: 'Greenfield',
    areaSqft: 1600,
    bedrooms: 3,
    bathrooms: 2,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1503694978374-8a2fa686963a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1631&q=80'],
    isFeatured: false,
  },
  {
    title: 'Urban Studio',
    category: 'plans',
    description: 'Compact studio layout ideal for city living.',
    price: 180000,
    location: 'Metro City',
    areaSqft: 600,
    bedrooms: 1,
    bathrooms: 1,
    status: 'available',
    images: ['https://images.unsplash.com/photo-1536895058696-a69b1c7ba34d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', 'https://images.unsplash.com/photo-1541888087425-ce81df821949?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'],
    isFeatured: false,
  },
]);
    console.log('Inserted properties');

    // Sample leads
    await Lead.insertMany([
      {
        name: 'Charlie',
        email: 'charlie@example.com',
        phone: '5551112222',
        message: 'Interested in the Cozy Cottage.',
        propertyId: properties[0]._id,
        status: 'new',
      },
      {
        name: 'Dana',
        email: 'dana@example.com',
        phone: '5553334444',
        message: 'Looking for a modern apartment.',
        propertyId: properties[1]._id,
        status: 'new',
      },
      {
        name: 'Evan',
        email: 'evan@example.com',
        phone: '5555556666',
        message: 'Inquiring about the Luxury Villa.',
        propertyId: properties[4]._id,
        status: 'new',
      },
      {
        name: 'Fiona',
        email: 'fiona@example.com',
        phone: '5557778888',
        message: 'Love the Beach House view.',
        propertyId: properties[5]._id,
        status: 'new',
      },
      {
        name: 'George',
        email: 'george@example.com',
        phone: '5559990000',
        message: 'Interested in the Downtown Loft.',
        propertyId: properties[6]._id,
        status: 'new',
      },
      {
        name: 'Hannah',
        email: 'hannah@example.com',
        phone: '5551113333',
        message: 'Looking for a Suburban Home for family.',
        propertyId: properties[7]._id,
        status: 'new',
      },
      {
        name: 'Ian',
        email: 'ian@example.com',
        phone: '5552224444',
        message: 'Considering the Penthouse Suite.',
        propertyId: properties[8]._id,
        status: 'new',
      },
      {
        name: 'Jenna',
        email: 'jenna@example.com',
        phone: '5553335555',
        message: 'Interested in the Eco-friendly Bungalow.',
        propertyId: properties[9]._id,
        status: 'new',
      },
      {
        name: 'Kyle',
        email: 'kyle@example.com',
        phone: '5554446666',
        message: 'Looking at the Urban Studio.',
        propertyId: properties[10]._id,
        status: 'new',
      },
      {
        name: 'Laura',
        email: 'laura@example.com',
        phone: '5555557777',
        message: 'Want details on the Rustic Farmhouse.',
        propertyId: properties[1]._id,
        status: 'new',
      },
      {
        name: 'Mike',
        email: 'mike@example.com',
        phone: '5556668888',
        message: 'Interested in the Mountain Cabin.',
        propertyId: properties[2]._id,
        status: 'new',
      },
    ]);
    console.log('Inserted leads');

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
