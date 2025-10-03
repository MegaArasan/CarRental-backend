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

    // Insert sample offers
    const offers = [
      {
        title: 'Weekend Special',
        description: 'Book SUVs on weekends and get 20% off',
        discountType: 'percentage',
        discountValue: 20,
        carId: null,
        minDays: 2,
        promoCode: null,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // valid for 30 days
        isActive: true
      },
      {
        title: 'Flat ₹500 OFF',
        description: 'Save ₹500 on any sedan booking',
        discountType: 'flat',
        discountValue: 500,
        carId: null,
        minDays: 1,
        promoCode: null,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 15)),
        isActive: true
      },
      {
        title: 'Promo Code WELCOME10',
        description: 'Get 10% off on your first booking with code WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        carId: null,
        minDays: 0,
        promoCode: 'WELCOME10',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
        isActive: true
      }
    ];

    await Offer.insertMany(offers);
    console.log('✅ Offers seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding offers:', err);
    process.exit(1);
  }
};

seedOffers();
