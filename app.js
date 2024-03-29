const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const User = require('./models/user');

// CRUD Operations

app.post('/users', (req, res) => {
    const { name, email, age, contact } = req.body;
    const user = new User({ name, email, age, contact });
    user.save((err, savedUser) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json(savedUser);
        }
    });
});

app.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(users);
        }
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    User.findByIdAndUpdate(id, req.body, { new: true }, (err, updatedUser) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(updatedUser);
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    User.findByIdAndDelete(id, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(204).send();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
