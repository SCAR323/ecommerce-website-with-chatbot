const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://project:nypQBIRZgMZDAWtG@cluster0.66emzlp.mongodb.net/sonic_hub?retryWrites=true&w=majority')
  .then(async () => {
    try {
        const res = await User.deleteMany({ email: { $in: ['hardik0708chaudhar@gmail.com', 'ayushsinghbhandari2@gmail.com', 'abc@gmail.com'] } });
        console.log('Deleted users count:', res.deletedCount);
    } catch(err) {
        console.error('Error:', err.message);
    } finally {
        mongoose.disconnect();
    }
  });
