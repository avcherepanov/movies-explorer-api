const Movie = require('../models/movie');

const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const RightsError = require('../utils/errors/RightsError');
const ServerError = require('../utils/errors/ServerError');

const {
  errorIncorrectDataText, errorServerText, errorRigthText, errorNotFoundFilmText,
} = require('../configs/constants');

module.exports.getMovies = (req, res, next) => {
  const ownerMovie = req.user._id;

  Movie.find({ ownerMovie })
    .then((movies) => {
      res.status(Statuses.ok).send(movies);
    })
    .catch(() => {
      next(new ServerError(errorServerText);
    });
};

module.exports.createMovie = (req, res, next) => {
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
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errorIncorrectDataText));
        return;
      }
      next(err);
    });
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
        next(new BadRequest(errorIncorrectDataText));
        return;
      }
      next(err);
    });
};
