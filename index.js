const fetchData = async searchTerm => {
  const respose = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "87c8fe40",
      s: searchTerm
    }
  });
  if (respose.data.Error) {
    return [];
  }
  return respose.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultWrapper = document.querySelector(".results");

const onInput = async e => {
  const movies = await fetchData(e.target.value);

  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src="${imgSrc}"/>
    <h1>${movie.Title}</h1>
    `;

    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie);
    });

    // Adding to the DOM
    resultWrapper.appendChild(option);
  }
};
input.addEventListener("input", debounce(onInput, 100));

document.addEventListener("click", e => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

const onMovieSelect = async movie => {
  const respose = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "87c8fe40",
      i: movie.imdbID
    }
  });
  document.getElementById("summary").innerHTML = movieTemplate(respose.data);
};

const movieTemplate = movieDetails => {
  return `
  <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}" alt="${movieDetails.Title}" />
        </p>
      </figure>
      <div class="media content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
