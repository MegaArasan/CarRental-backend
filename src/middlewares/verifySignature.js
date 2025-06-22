const crypto = require('node:crypto');
const verifySignature = (req, res, next) => {
  const secret = process.env.RAZOR_SECRET;

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');
  console.log(req.headers);
  if (digest === req.headers['x-razorpay-signature']) {
    next();
  } else {
    return res.status(400).json({ msg: 'Invalid Razorpay signature' });
  }
};

module.exports = verifySignature;
