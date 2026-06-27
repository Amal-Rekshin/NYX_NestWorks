require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log("Connected to MongoDB");
        const props = await Property.find({}).sort('-createdAt');
        console.log("Found properties:", props.length);
    } catch(e) {
        console.error("Query Error", e);
    }
    process.exit();
}).catch(e => {
    console.error("Connect Error", e);
    process.exit();
});
