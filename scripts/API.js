document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '033c585a718b7764f03b5f569b5a7d33';
  const apiUrl = 'https://api.themoviedb.org/3/search/movie';
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const moviesContainer = document.getElementById('movies');
  const paginationContainer = document.getElementById('pagination');
  const spinner = document.getElementById('spinner');

  let currentPage = 1;
  let currentQuery = '';

  async function fetchMovies(query, page = 1) {
    try {
      spinner.style.display = 'block';
      const response = await fetch(`${apiUrl}?api_key=${apiKey}&query=${query}&page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      spinner.style.display = 'none';
      return data;
    } catch (error) {
      spinner.style.display = 'none';
      console.error(error);
      alert('An error occurred while fetching data. Please try again.');
    }
  }

  function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    if (movies.length === 0) {
      moviesContainer.innerHTML = '<p>No movies found. Try a different search term.</p>';
      return;
    }
    movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');

      const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://placehold.co/200x300?text=No+Image';

      movieElement.innerHTML = `
        <img src="${posterPath}" alt="${movie.title}">
        <div class="info">
          <h3>${movie.title}</h3>
          <p>${movie.overview || 'No overview available.'}</p>
          <p><strong>Rating:</strong> ${movie.vote_average || 'N/A'}</p>
          <p><strong>Release Date:</strong> ${movie.release_date || 'Unknown'}</p>
        </div>
      `;

      moviesContainer.appendChild(movieElement);
    });
  }

  function setupPagination(totalPages) {
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      if (i === currentPage) {
        button.style.backgroundColor = '#0056b3';
      }
      button.addEventListener('click', () => {
        currentPage = i;
        searchMovies(currentQuery, currentPage);
      });
      paginationContainer.appendChild(button);
    }
  }

  async function searchMovies(query, page = 1) {
    const data = await fetchMovies(query, page);
    if (data && data.results) {
      displayMovies(data.results);
      setupPagination(data.total_pages);
    }
  }

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      currentQuery = query;
      currentPage = 1;
      searchMovies(query, currentPage);
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        currentQuery = query;
        currentPage = 1;
        searchMovies(query, currentPage);
      }
    }
  });
});
