const express = require('express');
const knex = require('../knex/knex');
const router = express.Router();

router.get('/', (req, res) => {
  
  return knex.raw('SELECT * FROM products')
    .then(result => {
        res.json(result.rows)
    // .catch(err => {
    //   return res.status(404).json({
    //     message: err.message
    //   })
    // })
})
})

router.get('/:product_id', (req, res) => {
  let id = req.params.product_id;
  return knex.raw('SELECT * FROM products WHERE id = ?', [id])
  .then(result => {
    console.log(result);
    if (result.rows.length) {
      res.json(result.rows[0])
        } else {
      throw new Error('Product not found')
    }
  })
  .catch(err => {
    res.status(404).json({message: err.message})
  })
})

router.post('/new', (req, res) => {
  let {
    title,
    description,
    inventory,
    price
  } = req.body;

return knex.raw('INSERT INTO products (title, description, inventory, price) VALUES (?,?,?,?) RETURNING *', [title, description, inventory, price])
.then(result => {
  res.json(result.rows[0])
})
.catch(result => {
  return res.status(400).json({message: 'Must POST all product fields'})
});
});

module.exports = router;
