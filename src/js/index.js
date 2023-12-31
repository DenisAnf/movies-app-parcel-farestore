import { createView } from "./view.js";
import { createModel } from "./model.js";
import { createStorage } from "./storage.js";
import {
   LIMIT_LENGTH_FILM_NAME,
   REG_SPACES_PUNСTUATION_MARKS,
   STORAGE_LABEL_MOVIES,
} from "./constants.js";

const filmNameNode = document.querySelector("#filmName");
const filmAddButton = document.querySelector("#filmAddButton");
const filmErrorNode = document.querySelector("#filmError");

let initialMoviesIds = [];
let initialMoviesById = {};

const view = createView(
   "#movies__list",
   handleClickMovieChek,
   handleClickMovieDelete
);
const model = createModel(initialMoviesIds, initialMoviesById);
const storage = createStorage(STORAGE_LABEL_MOVIES);

const init = () => {
   storage.read().then((movies) => {
      model.setMovies(movies);

      view.render(model.getMovies());

      filmNameNode.focus();
   });
};
init();

const validation = () => {
   const filmFromUser = filmNameNode.value;
   const lengthFilmFromUser = filmFromUser.length;
   const filmFromUserWithoutSpace = filmFromUser.replace(
      REG_SPACES_PUNСTUATION_MARKS,
      ""
   );
   const lengthFilmFromUserWithoutSpace = filmFromUserWithoutSpace.length;

   if (!filmFromUser || lengthFilmFromUserWithoutSpace == 0) {
      filmErrorNode.textContent = "Введите правильно название фильма";
      filmNameNode.focus();
      return true;
   }

   if (lengthFilmFromUser > LIMIT_LENGTH_FILM_NAME) {
      filmErrorNode.textContent = `Не бывает фильмов длинее 130 символов (${lengthFilmFromUser}/${LIMIT_LENGTH_FILM_NAME})`;
      filmNameNode.focus();
      return true;
   }

   filmErrorNode.textContent = "";
   return false;
};

const addMovieHandler = () => {
   if (validation()) return;

   const movie = model.createMovie(filmNameNode.value);

   storage.push(movie);

   model.addMovie(movie);

   view.render(model.getMovies());

   filmNameNode.value = "";
};

const addMovieByEnter = (event) => {
   if (event.keyCode === 13) {
      event.preventDefault();
      addMovieHandler();
   }
};

function handleClickMovieChek(id) {
   model.toggleCheckMovie(id);

   storage.update(model.getMovie(id));
}

function handleClickMovieDelete(id) {
   model.deleteMovie(id);

   storage.delete(id);

   view.render(model.getMovies());
}

filmAddButton.addEventListener("click", addMovieHandler);
filmNameNode.addEventListener("keydown", addMovieByEnter);
