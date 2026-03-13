const mongoose = require('mongoose');
const Offer = require('../models/offerModel.js');
require('dotenv/config.js');

const MONGO_URL = process.env.MONGO_URL;

const seedOffers = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL);

    // Clear old data
    await Offer.deleteMany({});
    // Create sample offers
    const now = new Date();

    const offers = [
      {
        title: 'Weekend Special',
        description: 'Book SUVs on weekends and get 20% off!',
        discountType: 'percentage',
        discountValue: 20,
        carIds: [], // Empty → applies to all SUV cars via filter in service logic
        isGlobal: false,
        minDays: 2,
        promoCode: null,
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
        isActive: true
      },
      {
        title: 'Flat ₹500 OFF on Sedans',
        description: 'Get ₹500 off on all sedan bookings.',
        discountType: 'flat',
        discountValue: 500,
        carIds: [], // Later you can assign specific sedan car ObjectIds
        isGlobal: false,
        minDays: 1,
        promoCode: null,
        startDate: now,
        endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'Global Launch Offer — WELCOME10',
        description: 'Get 10% off on your first booking with code WELCOME10.',
        discountType: 'percentage',
        discountValue: 10,
        carIds: [], // Empty because global
        isGlobal: true,
        minDays: 0,
        promoCode: 'WELCOME10',
        startDate: now,
        endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];

    await Offer.insertMany(offers);
    console.log('✅ Offers seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding offers:', err);
    process.exit(1);
  }
};

seedOffers();
