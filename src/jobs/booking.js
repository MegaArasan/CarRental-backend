const cron = require('node-cron');

const Booking = require('../../src/models/bookingModel');

cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    console.log(now)
    try {
        const expired = await Booking.find({
            status: 'pending',
            expiresAt: {$lt: now}
        })
        console.log(expired)
        for (const booking of expired) {
            booking.status = 'cancelled';
            await booking.save();
            console.log("Cancelled expired booking")
        }
    } catch (e) {
        console.log(e)
    }
})