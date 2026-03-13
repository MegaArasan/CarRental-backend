const Joi = require('joi');

const exploreFilterSchema = Joi.object({
  type: Joi.string()
    .valid('Hatchback', 'Sedan', 'SUV', 'Luxury', 'MUV')
    .optional()
    .label('Car Type'),

  minPrice: Joi.number().min(0).optional().label('Minimum Price'),

  maxPrice: Joi.number().min(0).greater(Joi.ref('minPrice')).optional().label('Maximum Price'),

  search: Joi.string().trim().max(50).optional().label('Search'),

  page: Joi.number().integer().min(1).default(1).label('Page Number'),

  limit: Joi.number().integer().min(1).max(100).default(10).label('Page Limit')
}).unknown(false);

module.exports = { exploreFilterSchema };
