const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

module.exports = (dbConnection, bcrypt) => {

    const upload = multer({ dest: 'public/images/' });

    router.post('/dashboard', upload.single('image'), (req, res) => {
        const { LastName, FirstName, MiddleName, Age, Gender } = req.body;
        const Picture = req.file ? req.file.filename : null;

        dbConnection.query('INSERT INTO tbl_students (Lastname, FirstName, MiddleName, Age, Gender, image) VALUES (?, ?, ?, ?, ?, ?)',
            [LastName, FirstName, MiddleName, Age, Gender, Picture],
            (err) => {
                if (err) console.log(err);
                res.redirect('/dashboard');
            });
    });

    router.get('/edit/:id', (req, res) => {
        const id = req.params.id;
        dbConnection.query('SELECT * FROM tbl_students where id = ?',
            [id],
            (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.render('edit', {
                        student: result[0]
                    })
                }
            });
    });

    const upload2 = multer({ dest: 'public/images/' });
    router.post('/update', upload2.single('image'), (req, res) => {
        const { LastName, FirstName, MiddleName, Age, Gender, id } = req.body;

        let updateQuery = `
            UPDATE tbl_students
            SET LastName = ?, FirstName = ?, MiddleName = ?, Age = ?, Gender = ?
            WHERE id = ?
        `;
        let queryParams = [LastName, FirstName, MiddleName, Age, Gender, id];

        if (req.file) {
            updateQuery = `
                UPDATE tbl_students
                SET LastName = ?, FirstName = ?, MiddleName = ?, Age = ?, Gender = ?, image = ?
                WHERE id = ?
            `;
            queryParams = [LastName, FirstName, MiddleName, Age, Gender, req.file.filename, id];
        }

        dbConnection.query(updateQuery, queryParams, (err, result) => {
            if (err) {
                throw err;
            }
            console.log('Student details updated');
            res.redirect('/dashboard');
        });
    });

    router.get('/delete/:id', (req, res) => {
        const id = req.params.id;
        dbConnection.query('DELETE FROM tbl_students where id = ?',
            [id],
            (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/dashboard')
                }
            });
    });

    return router;
};
