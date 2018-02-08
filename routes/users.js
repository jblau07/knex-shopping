const express = require('express');
const knex = require('../knex/knex');
const router = express.Router();

router.get('/:user_id', (req, res) => {
  let id = req.params.user_id;
  // if(isNaN(id)){
  //   return res.status(400).json({message: 'Invalid URL'});
  // }
  return knex.raw('SELECT * FROM users WHERE users.id = ?', [id])
    .then(result => {
      if (result.rows.length) {
        res.json(result.rows[0])
      } else {
        throw new Error('User not found')
      }
    })
    .catch(err => {
      return res.status(404).json({
        message: err.message
      })
    })
})

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

  return knex.raw('SELECT * FROM users WHERE email = ?', [email])

    .then(result => {
      if (!result.rows.length) {
        throw new Error('User not found');
      } else if (password !== result.rows[0].password) {
        throw new Error('Incorrect password');
      } else {
        return res.json(result.rows[0]);
      }
    })
    .catch(err => {
      return res.status(400).json({
        message: err.message
      });
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

  return knex.raw('SELECT email FROM users WHERE email = ?', [email])

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
      return res.json(result.rows[0]);
    })
    .catch(err => {
      return res.status(400).json({
        message: err.message
      });
    });
});

router.put('/:user_id/forgot-password', (req, res) => {
  let id = req.params.user_id;
  let password = req.body.password;

  if (!password) {
    return res.status(400).json({
      message: 'Missing password'
    })
  }
  return knex.raw('SELECT * FROM users WHERE id = ?', [id])
    .then(result => {
      if (result.rows.length) {
        return result
      } else {
        throw new Error('User ID not found');
      }
    })
    .then(result => {
      return knex.raw('UPDATE users SET password = ? WHERE id = ?', [password, id])
    })
    .then(result => {
      return res.json({
        message: 'New password created'
      });
    })
    .catch(err => {
      return res.status(404).json({
        message: err.message
      });
    });
});

router.delete('/:user_id', (req, res) => {
  let id = req.params.user_id;
  return knex.raw('SELECT * from users WHERE id = ?', [id])
    .then(result => {
      if (!result.rows.length) {
        throw new Error('User ID not found')
      } else {
        return result
      }
    })
    .then(result => {
      return knex.raw('DELETE FROM users WHERE id = ?', [result.rows[0].id])
    })
    .then(result => {
      return res.json({
        message: `User id: ${id} successfully deleted`
      });
    })
    .catch(err => {
      return res.json({
        message: err.message
      });
    });
});

module.exports = router;