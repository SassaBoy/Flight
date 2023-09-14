const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    passengerName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
});

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;
