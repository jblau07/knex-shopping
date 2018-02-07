
const express = require('express');
const knex = require('./knex/knex.js');

const PORT = process.env.PORT || 3000;
const bodyParse = require('body-parser');

const cart = require('./routes/cart');
const products = require('./routes/products');
const users = require('./routes/users');

const app = express();

app.use(bodyParse.urlencoded({ extended: true }))

// app.get('/tasks', (req, res) => {
  // use the knex variable above to create dynamic queries
// });
app.use('/cart', cart);
app.use('/products', products);
app.use('/users', users);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});