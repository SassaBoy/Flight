const mongoose = require('mongoose');

// Define a schema for your flight details
const flightSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    departureDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    tripType: {
        type: String,
        enum: ['round', 'one-way'],
        required: true,
    },
});

// Create a model using the schema
const Flight = mongoose.model('Flight', flightSchema);

// Export the model
module.exports = Flight;
