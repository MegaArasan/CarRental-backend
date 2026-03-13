const ErrorResponse = require('../errors/errorResponse');
const Offers = require('../models/offerModel');

/**
 * Get all active offers (currently valid)
 */
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
  }).lean();
  return offers;
};

/**
 * Find the best applicable offer for a booking
 * @param {String} carId - selected car ID
 * @param {Number} rentalDays - number of days
 * @param {String} promoCode - optional promo code
 * @param {Number} bookingAmount - total amount before discount
 */
const findOffer = async (carId, rentalDays, promoCode, bookingAmount) => {
  const now = new Date();

  const conditions = [
    { isActive: true },
    { startDate: { $lte: now } },
    { endDate: { $gte: now } },
    { minDays: { $lte: rentalDays } }
  ];

  // Car-specific or global offer
  if (carId) {
    conditions.push({ $or: [{ carId: null }, { carId }] });
  }

  // Promo code check
  if (promoCode) {
    conditions.push({ $or: [{ promoCode: null }, { promoCode }] });
  }

  const offers = await Offers.find({ $and: conditions }).lean();

  if (!offers.length) {
    throw new ErrorResponse(404, 'No valid offer found');
  }

  // Pick the offer giving maximum discount
  let bestOffer = offers[0];
  let maxDiscount = bookingAmount - applyOffer(bookingAmount, bestOffer);

  for (let i = 1; i < offers.length; i++) {
    const currentDiscount = bookingAmount - applyOffer(bookingAmount, offers[i]);
    if (currentDiscount > maxDiscount) {
      maxDiscount = currentDiscount;
      bestOffer = offers[i];
    }
  }

  return bestOffer;
};

const applyOffer = (bookingAmount, offer) => {
  if (!offer) {
    return bookingAmount;
  }

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

const createOffer = async (data) => {
  if (!data.isGlobal && (!data.carIds || data.carIds.length === 0)) {
    throw new ErrorResponse(400, 'Either mark offer as global or provide carIds');
  }
  const result = await Offers.create(data);
  return result;
};

const updateOffer = async (id, data) => {
  const offer = await Offers.findById(id);
  if (!offer) {
    throw new ErrorResponse(400, 'Offer not found');
  }

  Object.keys(data).forEach((key) => {
    offer[key] = data[key];
  });

  await offer.save();
  return offer;
};

const deleteOffer = async (id) => {
  const offer = await Offers.findById(id);
  if (!offer) {
    throw new ErrorResponse(400, 'Offer not found');
  }
  await offer.deleteOne();
  return true;
};

module.exports = { getOffers, findOffer, applyOffer, createOffer, updateOffer, deleteOffer };
