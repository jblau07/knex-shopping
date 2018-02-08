const express = require('express');
const knex = require('../knex/knex');
const router = express.Router();


router.get(`/:user_id`, (req, res) => {
  let userId = req.params.user_id;
  return knex.raw('SELECT * FROM users WHERE id = ?', [userId])
    .then(result => {
      if (result.rows.length) {
        return result
      } else {
        throw new Error('User id not found')
      }
    })
    .then(result => {
      return knex.raw(`SELECT products.* FROM cart INNER JOIN products ON 
  cart.products_id = products.id WHERE cart.user_id = ?`, [userId])
    })
    .then(result => {
      return res.json(result.rows);
    })
    .catch(err => {
      return res.status(404).json({
        message: err.message
      });
    });
});

router.post('/:user_id/:product_id', (req, res) => {
  let userId = req.params.user_id;
  let productId = req.params.product_id;

  if (!userId || !productId) {
    return res.status(400).json({
      message: 'Missing user ID or product ID'
    })
  }
  return knex.raw('SELECT * FROM users WHERE id = ?', [userId])
    .then(result => {
      console.log('user rows', result.rows)
      if (result.rows.length) {
        return result
      } else {
        throw new Error('User id not found')
      }
    })
    .then(result => {
      return knex.raw('SELECT * FROM products WHERE id = ?', [productId])
    })
    .then(result => {
      console.log('product rows', result.rows)
      if (result.rows.length) {
        return result
      } else {
        throw new Error('Product id not found')
      }
    })
    .then(result => {
      return knex.raw('INSERT INTO cart (user_id, products_id) VALUES (?,?) RETURNING *', [userId, productId])
    })
    .then(result => {
      return res.json({
        success: true
      })
    })
    .catch(err => {
      return res.status(404).json({
        message: err.message
      });
    })
})

router.delete(`/:user_id/:product_id`, (req, res) => {
  let userId = req.params.user_id;
  let productId = req.params.product_id;

  return knex.raw(`DELETE FROM cart WHERE user_id = ? AND products_id =?`, [userId, productId])

    .then(result => {
      if (result.rowCount !== 0)
        return res.json({ Success: true })
    })
    .catch(err => {
      return res.status(500).json({ message: err.message });
    })
});

module.exports = router;