const express = require('express');
const knex = require('../knex/knex');
const router = express.Router();

router.get('/', (req, res) => {

  return knex.raw('SELECT * FROM products')
    .then(result => {
      res.json(result.rows)
        .catch(err => {
          return res.status(500).json({
            message: 'Server Error'
          })
        })
    })
})

router.get('/:product_id', (req, res) => {
  let id = req.params.product_id;
  return knex.raw('SELECT * FROM products WHERE id = ?', [id])
    .then(result => {
      if (result.rows.length) {
        res.json(result.rows[0])
      } else {
        throw new Error('Product not found')
      }
    })
    .catch(err => {
      res.status(404).json({
        message: err.message
      })
    })
})

router.post('/new', (req, res) => {
  let {
    title,
    description,
    inventory,
    price
  } = req.body;

  if (!title || !description || !inventory || !price) {
    return res.status(400).json({
      message: 'Must POST all product fields'
    })
  }
  return knex.raw('INSERT INTO products (title, description, inventory, price) VALUES (?,?,?,?) RETURNING *', [title, description, inventory, price])
    .then(result => {
      return res.json(result.rows[0])
    })
    .catch(err => {
      return res.status(500).json({
        message: 'Server Error'
      })
    })
});

router.put('/:product_id', (req, res) => {
  let id = req.params.product_id;

  let {
    title,
    description,
    inventory,
    price
  } = req.body;

  return knex.raw('SELECT * FROM products WHERE id = ?', [id])
    .then(result => {
      if (result.rows.length) {
        return result
      } else {
        throw new Error(`Product ID not found`)
      }
    })
    .then(result => {
      return knex.raw('UPDATE products SET title = ?, description = ?, inventory = ?, price = ? WHERE id = ?', [title, description, inventory, price, id])
    })
    .then(result => {
      return res.json({
        message: `Product: ${id} has been updated`
      });
    })
    .catch(err => {
      return res.status(404).json({
        message: err.message
      });
    })
})

router.delete('/:product_id', (req, res) => {
  let id = req.params.product_id;

  return knex.raw('SELECT * FROM products WHERE id = ?', [id])
    .then(result => {
      console.log(result.rows.length);
      if (!result.rows.length) {
        throw new Error(`Product id: ${id} not found`)
      } else {
        return result
      }
    })
    .then(result => {
      return knex.raw('DELETE FROM products WHERE id = ?', [result.rows[0].id])
    })
    .then(result => {
      return res.json({message: `Product id: ${id} successfully deleted`})
    })
    .catch(err => {
      return res.status(404).json({
        message: err.message
      })
    })
})

module.exports = router;