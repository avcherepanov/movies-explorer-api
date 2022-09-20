const moviesRouter = require('express').Router();

const { createMovie, getMovies, deleteMovie } = require('../controllers/movie');
const { createMovieValidation, deleteMovieValidation } = require('../utils/joiValidation/joiValidation');

moviesRouter.post('/', createMovieValidation, createMovie);

moviesRouter.get('/', getMovies);

moviesRouter.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = moviesRouter;
