const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('../../helpers/authorize');
const Role = require('../../helpers/role');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/:id', getById);
router.get('/username/:username', getByUsername);

// requires authenticated user
router.get('/current', authorize(), getCurrent);

// requires admin
router.get('/', authorize(Role.Admin), getAll);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'E-Mail or password incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByUsername(req, res, next) {
    userService.getByUsername(req.params.username)
        .then(user => (user ? res.json(user) : res.sendStatus(404)))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}