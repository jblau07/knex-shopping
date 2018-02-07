const express = require('express');
const knex = require('../knex/knex');
const router = express.Router();

router.post('/login', (req, res) => {
  let {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing email or password'
    });
  }
  email = email.toLowerCase();
  password = password;

  return knex.raw('SELECT users.email, users.password FROM users WHERE users.email = ?', [email])

    .then(result => {
      console.log(result);
      if (!result.rows.length) {
        throw new Error('User not found');
      } else if (password !== result.rows[0].password) {
        throw new Error('Incorrect password');
      } else {
        return res.json(result.rows[0]);
      }
    })
    .catch(err => {
      return res.status(400).json({message: err.message});
    });
});


router.post('/register', (req, res) => {

  let {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing email or password'
    });
  }
  email = email.toLowerCase();

  return knex.raw('SELECT users.email FROM users WHERE users.email = ?', [email])

    .then(result => {
      if (result.rows.length) {
        throw new Error('User already exists');
      } else {
        return result;
      }
    })
    .then(result => {
      return knex.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *`, [email, password]);
    })
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => {
      return res.status(400).json({
        message: err.message
      });
    });
});

module.exports = router;