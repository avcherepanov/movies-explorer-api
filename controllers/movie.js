const Movie = require('../models/movie');

const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const RightsError = require('../utils/errors/RightsError');

const {
  errorIncorrectDataText, errorDataText, errorRigthText, errorNotFoundFilmText,
} = require('../configs/constants');

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errorDataText));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({}).sort({ createdAt: -1 })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFound(errorNotFoundFilmText);
      }

      if (req.user._id.toString() !== movie.owner.toString()) {
        throw new RightsError(errorRigthText);
      }

      movie.remove()
        .then((movieDeleted) => {
          res.send(movieDeleted);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(errorDataText));
        return;
      }
      next(err);
    });
};
