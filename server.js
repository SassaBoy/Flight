const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Flight = require('./models/flight'); // Import the model
const countriesList = require('countries-list');
const Passenger = require('./models/passenger'); // Replace with the correct path to your passenger model file
const stripe = require('stripe')('sk_test_51LR1x5CpKfBwRd6DgVkTIRsG3LHd5qH2XDSQIo6YuDn8WkUw9xhtiVFrP3iZpvR5aY1waGkyRlqkjH6FzL23rQPn00RLDOcxrU');
require('dotenv').config();



mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Database Connected');
});

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Endpoint to get the list of countries
// Endpoint to get the list of countries
// Endpoint to get the list of countries
app.get('/countries', (req, res) => {
    const countryNames = Object.values(countriesList.countries).map(country => country.name);
    res.json(countryNames);
  });

  app.post('/passenger-details', async (req, res) => {
    // Capture form data
    const { passengerName, email, phoneNumber, dateOfBirth } = req.body;

    try {
        // Create a new passenger document
        const passenger = new Passenger({
            passengerName,
            email,
            phoneNumber,
            dateOfBirth,
        });

        // Save passenger details to the database
        await passenger.save();

        // Redirect to a payment page (replace '/payment' with your actual payment page URL)
        res.redirect('/payment');
    } catch (error) {
        console.error(error);
        // Handle errors as needed
        res.status(500).send('An error occurred while processing your request.');
    }
});

  
app.post('/process-payment', async (req, res) => {
    
        // Get the token from the request body
        const amount = req.body.amount;
        const token = req.body.stripeToken;
    
        stripe.charges.create({
            amount: amount * 100, // Stripe requires the amount in cents
            currency: 'usd',
            description: 'Payment for Flight Ticket',
            source: token,

        // Handle successful payment (e.g., send a confirmation email)
      
    } ).then(() => {
        // Payment successful, send email and redirect
        // Use nodemailer to send an email with the ticket details

        // Redirect to a thank you page
        res.redirect('/success');
    }).catch(err => {
        console.error(err);
        res.send('<h1>Payment Failed</h1><p>Please try again.</p><script>setTimeout(function() { window.location.href = "/"; }, 3000);</script>');
    });
});

 app.get('/payment', (req, res) => {
    res.render('payment');
  });

  app.get('/success', (req, res) => {
    res.render('success');
  });

 app.get('/', (req, res) => {
    res.render('index');
  });
  app.get('/contact', (req, res) => {
    res.render('contact');
  });
  app.get('/payment', (req, res) => {
    res.render('payment');
  });

  app.get('/passenger', (req, res) => {
    res.render('passenger');
  });
  app.post('/flights', async (req, res) => {
    try {
      // Extract all the fields from the request body
      const { from, to, departureDate, returnDate, tripType } = req.body;
  
      // Create a single flight document with all the fields
      const flight = new Flight({
        from,
        to,
        departureDate,
        returnDate,
        tripType,
      });
  
      // Save the single flight document to the database
      await flight.save();
  
      res.redirect('/passenger');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});