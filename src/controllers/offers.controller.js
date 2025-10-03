const { getOffers, findOffer, applyOffer } = require('../services/offers.service');

const get = async (req, res, next) => {
  try {
    const data = await getOffers();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const apply = async (req, res, next) => {
  try {
    const { bookingAmount, carId, rentalDays, promoCode } = req.body;

    const offer = await findOffer(carId, rentalDays, promoCode, bookingAmount);

    if (!offer) {
      return res
        .status(200)
        .json({ success: true, data: { finalPrice: bookingAmount, applied: false } });
    }

    const finalPrice = applyOffer(bookingAmount, offer);
    const discount = bookingAmount - finalPrice;

    return res.status(200).json({
      success: true,
      data: {
        finalPrice,
        discount,
        applied: true,
        offer
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { get, apply };
