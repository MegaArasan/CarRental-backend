const { getExploreData } = require('../services/explore.service');

const exploreData = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit
    };

    const data = await getExploreData(filters);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { exploreData };
