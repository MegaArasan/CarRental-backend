const ErrorResponse = require('../errors/errorResponse');
const Offers = require('../models/offerModel');

const getOffers = async () => {
  const now = new Date();
  const offers = await Offers.find({
    isActive: true,
    startDate: {
      $lte: now
    },
    endDate: {
      $gte: now
    }
  });
  return offers;
};

const findOffer = async (carId, rentalDays, promoCode, bookingAmount) => {
  const now = new Date();

  const conditions = [
    { isActive: true },
    { startDate: { $lte: now } },
    { endDate: { $gte: now } },
    { minDays: { $lte: rentalDays } }
  ];

  if (carId) {
    conditions.push({ $or: [{ carId: null }, { carId }] });
  }

  if (promoCode) {
    conditions.push({ $or: [{ promoCode: null }, { promoCode }] });
  }

  const offers = await Offers.find({ $and: conditions });

  if (!offers.length) {
    throw new ErrorResponse(404, 'No valid offer found');
  }

  // Pick offer that gives maximum discount
  const bestOffer = offers.reduce((best, current) => {
    const bestDiscount = applyOffer(bookingAmount, best) - bookingAmount;
    const currentDiscount = applyOffer(bookingAmount, current) - bookingAmount;
    return currentDiscount < bestDiscount ? current : best;
  });

  return bestOffer;
};

const applyOffer = (bookingAmount, offer) => {
  let discount = 0;
  if (offer.discountType === 'percentage') {
    discount = bookingAmount * (offer.discountValue / 100);
  } else if (offer.discountType === 'flat') {
    discount = offer.discountValue;
  } else {
    throw new ErrorResponse(400, 'Unknown discount type');
  }

  if (discount < 0) {
    discount = 0;
  }
  if (discount > bookingAmount) {
    discount = bookingAmount;
  }

  return bookingAmount - discount;
};

module.exports = { getOffers, findOffer, applyOffer };
