const Car = require("../../src/models/carsModel");

const getCars = async (req, res, next) => {
    try {
        const cars = await Car.find();
        res.status(200).json({data: cars});
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getCars
}