// Add event listener for when the page has finished loading

// Get references to DOM elements
let input = document.getElementById("input");
let btn = document.querySelector("input[type=button]");
let show = document.querySelector(".show");
let genres = document.getElementById("genre");
let loader = document.querySelector(".custom-loader");
let next = document.getElementById("next");
let previous = document.getElementById("prev");
let page = document.getElementById("page");
let genre = genres.querySelector('.active').id;
document.addEventListener('DOMContentLoaded', getMovies(genre, page));

// Add event listener to the "next" button
next.addEventListener('click', () => {
  page.innerText++;
  next.style.cssText = 'pointer-events: auto;opacity: 1;';
  previous.style.cssText = 'pointer-events: auto;opacity: 1;';
  let genre = document.querySelector('.active').id
  getMovies(genre, page);
});

// Add event listener to the "previous" button
previous.addEventListener('click', () => {
  if (page.innerText > 1) {
    page.innerText--;
    previous.style.cssText = 'pointer-events: auto;opacity: 1;';
    next.style.cssText = 'pointer-events: auto;opacity: 1;';
    let genre = document.querySelector('.active').id
    getMovies(genre, page);
  } else {
    previous.style.cssText = 'pointer-events: none;opacity: 0.7;';
  }
});

// Add event listener to the "genres" button
genres.addEventListener('click', (e) => {
  if (e.target.classList.contains('active')) {
    e.target.classList.remove('active');
    e.target.querySelector('span').style.display = 'none';
    let genre = ''
    getMovies(genre, page);
  } else {
    const previouslyActive = genres.querySelector('.active');
    if (previouslyActive) {
      previouslyActive.classList.remove('active');
      previouslyActive.querySelector('span').style.display = 'none';
    }
    e.target.classList.add('active');
    e.target.querySelector('span').style.display = 'block';
    let genre = e.target.id;
    getMovies(genre, page);
  }
});

// Define the getMovies function
async function getMovies(genre, page = 1) {
  try {
    // Show the loader
    loader.style.display = 'block';
    show.innerHTML = '';
    // Check if the genre is in correct format 
    // console.log(genre)
    if (genre == 'all') {
      genre = ''
    }
    // Build the API URL
    let filter = genre ? `&type=${genre}` : '';
    let x = input.value ? input.value.trim() : 'avengers';
    const searchInput = x + filter;
    const query = `?s=${searchInput}&page=${page}`;
    const api_key = `http://www.omdbapi.com/${query}&i=tt3896198&apikey=3ea760a1`
    // Fetch data from the API
    let moviesData = await fetch(api_key);
    // Convert the data to JSON
    let movies = await moviesData.json();
    // Check if there are any movies
    let output = "";
    // Do not show the "next" button if the current page is the last page
    if (page.innerText == Math.ceil(movies.totalResults / 10)) {
      next.style.cssText = 'pointer-events: none;opacity: 0.7;';
    }
    // console.log(movies)
    movies.Search.forEach((movie) => {
      if (movie.Poster == "N/A") {
        movie.Poster = "./giphy.webp"
      }

      output += `
        <div class="movieContainer">
          <div class="movieContent">
            <div class="movieImg">
            <img src="${movie.Poster}" alt="Movie Poster" onerror="this.onerror=null; this.src='./giphy.webp';">
            </div>
            <div class="movieInfo">
              <h3>${movie.Title}</h3>
              <p><span style="font-weight: bold;">Year: </span>${movie.Year}</p>
              <p><span style="font-weight: bold;">Type: </span>${movie.Type}</p>
              <p><span style="font-weight: bold;">IMDB ID: </span>${movie.imdbID}</p>
            </div>
          </div>
        </div>
        `;


    });
    show.innerHTML = output;
    loader.style.display = 'none';

  } catch (error) {
    // console.log(error.message);
    loader.style.display = 'none';
    show.innerHTML = `<p><img src="./error.svg" id="error"/></p>`;
  }
}
// Add event listener to the input field
let timeout;
input.addEventListener('input', () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => getMovies(), 2000);
});

