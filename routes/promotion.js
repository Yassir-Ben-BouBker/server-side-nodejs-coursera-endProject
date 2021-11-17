const express = require('express');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(express.json());


promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));    
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotiones');
})
.delete((req, res, next) => {
    /**
     * Promotions.remove({})
     */
    Promotions.deleteMany({}) // I am using mongoose V6
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));        res.end('Deleting all promotiones ??-??');
});


promoRouter.route('/:promId')
.get((req,res,next) => {
    Promotions.findById(req.params.promId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotiones/'+ req.params.promId);
})
.put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promId, {$set: req.body}, { new:true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;
