const {
  getOffers,
  findOffer,
  applyOffer,
  createOffer,
  updateOffer,
  deleteOffer
} = require('../services/offers.service');

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

// Create offer
const create = async (req, res, next) => {
  try {
    const offer = await createOffer(req.body);
    return res.status(201).json({ success: true, offer });
  } catch (error) {
    next(error);
  }
};

// Update offer
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const offer = await updateOffer(id, data);
    return res.status(200).json({ success: true, data: offer._doc });
  } catch (error) {
    next(error);
  }
};

// Delete offer
const offerDelete = async (req, res, next) => {
  try {
    await deleteOffer(req.params.id);
    return res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { get, apply, create, update, offerDelete };
