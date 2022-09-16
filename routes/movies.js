const moviesRouter = require('express').Router();

const { createMovies, getMovies, deleteMovie } = require('../controllers/movie');
const { createMovieValidation, deleteMovieValidation } = require('../utils/joiValidation/joiValidation');

moviesRouter.post('/', createMovieValidation, createMovies);

moviesRouter.get('/', getMovies);

moviesRouter.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = moviesRouter;
