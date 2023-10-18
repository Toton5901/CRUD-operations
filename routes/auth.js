const express = require('express');
const router = express.Router();

module.exports = (dbConnection , bcrypt) => {

  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.post('/register', (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    dbConnection.query('SELECT * FROM users WHERE email = ?',
    [email],
    (err, results) => {
      if(err) {
        throw err;
      }
      if(results.length > 0) {
        res.render('register', {
          error: "Email already exists"
        });
      }

      else if(password !== passwordConfirm) {
        res.render('register',{
          error_password: "Password didn't match!"
        });
      }
      else{
        dbConnection.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          (err, results) => {
            if (err) console.log(err);
            res.redirect('/login');
          }
        );
      }
    });

          
    
  });

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    dbConnection.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          const match = bcrypt.compareSync(password, results[0].password);
          if (match) {
            req.session.user = results[0];
            res.redirect('/dashboard');
          } else {
            res.render('login',{
              error: "Email or Password is incorrect"
            });
          }
        } else {
          res.redirect('/login');
        }
      }
    );
  });



  router.get('/dashboard', (req, res) => {
    if (req.session.user) {
      dbConnection.query('SELECT * FROM tbl_students', (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        console.log(rows);
        res.render('dashboard', { user: req.session.user, students: rows });
      });
    } else {
      res.redirect('/login');
    }
  });
  

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/login');
    });
  });



  return router;
};
