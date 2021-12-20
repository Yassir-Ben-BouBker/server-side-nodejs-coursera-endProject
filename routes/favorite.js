const express = require('express');
const mongoose = require('mongoose');

const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');


const favoriteRouter = express.Router();
favoriteRouter.use(express.json());


favoriteRouter.route('/')
.get(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
    console.log("user " + req.user)
    Favorite.findOne({ user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
    .then((favorite) => {
        if(favorite != null)
        {
            // To see the dishe exist
            req.body.map(item => {
                if(favorite.dishes.find(x => x._id == item._id) === undefined)
                {
                    favorite.dishes.push(item._id);
                }
            });
            favorite.save()
            .then((favorite) => {
                Favorite.findById(favorite._id)
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })      
            }, (err) => next(err));
        }else
        {

            // create a js object with the needed data
            let list = {};
            let lookup = {};
            list.user = req.user._id;
            list.dishes = [];
            // To see the dishe exist
            req.body.map(item => {
                var id = item._id;
                if (!(id in lookup)) {
                    lookup[id] = 1;
                    list.dishes.push(id);
                }
            });

            Favorite.create(list)
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err) => next(err))
            .catch((err) => next(err));
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOneAndRemove({ user: req.user._id})
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    },(err) => next(err))
    .catch((err) => next(err));  
});


favoriteRouter.route('/:dishId')
.get(cors.corsWithOptions,authenticate.verifyUser,  (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorite');
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})

.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
    .then((favorite) => {
        if(favorite != null)
        {
            if(favorite.dishes.find(x => x._id == req.params.dishId) === undefined)
            {
                favorite.dishes.push(req.params.dishId);
            }
            favorite.save()
            .then((favorite) => {
                Favorite.findById(favorite._id)
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })      
            }, (err) => next(err));
        }else
        {
        console.log('--- null' );

            let list = {};
            list.user = req.user._id;
            list.dishes = [];
            list.dishes.push(req.params.dishId);

            Favorite.create(list)
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err) => next(err))
            .catch((err) => next(err));
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id})
    .then((favorite) => {
        let index = -1;
            // To see the dishe exist and return the index
        favorite.dishes.find(function(item, i){
            if(item == req.params.dishId) {
            index = i;  
            return i;
            }
        });
            // delete by using the array index
        if (index != -1) {
            favorite.dishes.splice(index,1)
        }
        favorite.save()
        .then((favorite) => {
            Favorite.findById(favorite._id)
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);  
            })               
        }, (err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err)); 
});





module.exports = favoriteRouter;