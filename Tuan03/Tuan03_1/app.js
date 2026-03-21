const express = require('express');
const path = require('path');

const app = express();

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static file
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/composite', require('./routes/composite.route'));
app.use('/observer', require('./routes/observer.route'));
app.use('/adapter', require('./routes/adapter.route'));

app.get('/', (req, res) => {
    res.render('index');
});

module.exports = app;