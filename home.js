document.addEventListener("DOMContentLoaded", () => {
    // Initialize Constants
    const navbar = document.getElementById('navbar');
    const apiKey = '253fb7a594190c76fbbd7e73f3464d8by';
    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTNmYjdhNTk0MTkwYzc2ZmJiZDdlNzNmMzQ2NGQ4YiIsIm5iZiI6MTcyNDk4OTU0OC43NDI2NDYsInN1YiI6IjY2Y2Y1M2Y0NGVkNmM3Y2I0ZWEwYTgxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qaeaUM96dK8bV-o16cIw_vxBGY4J1m9bxzNQoM1Fknw';
    const apiBaseURL = 'https://api.themoviedb.org/3';
    const imgBaseURL = 'https://image.tmdb.org/t/p/original';

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Fetch and display the featured movie
    function fetchFeaturedMovie() {
        fetch(`${apiBaseURL}/movie/popular?api_key=${apiKey}`, getFetchOptions())
            .then(response => response.json())
            .then(data => displayFeaturedMovie(data))
            .catch(error => console.error('Error fetching featured movie:', error));
    }

    // Fetch movie data and populate sliders
    function fetchMovies(endpoint, sliderId) {
        fetch(`${apiBaseURL}${endpoint}?api_key=${apiKey}`, getFetchOptions())
            .then(response => response.json())
            .then(data => populateSlider(data, sliderId))
            .catch(error => console.error('Error fetching movies:', error));
    }

    // Fetch different movie categories
    fetchMovies('/trending/all/day', 'trending-slider');
    fetchMovies('/movie/popular', 'popular-slider');
    fetchMovies('/discover/movie?with_genres=27', 'horror-slider');
    fetchMovies('/discover/movie?with_genres=18', 'drama-slider');
    fetchMovies('/discover/movie?with_genres=878', 'sci-fi-slider');
    fetchMovies('/discover/movie?with_genres=80', 'crime-slider');
    fetchMovies('/discover/movie?with_genres=28', 'action-slider');

    fetchFeaturedMovie(); // Display the featured movie on page load

    // Display the featured movie on the main page
    function displayFeaturedMovie(data) {
        if (data.results && data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const featuredMovie = data.results[randomIndex];

            const featuredPoster = document.getElementById('featured-poster');
            const featuredTitle = document.getElementById('featured-title');
            const featuredOverview = document.getElementById('featured-overview');

            featuredPoster.src = `${imgBaseURL}${featuredMovie.backdrop_path}`;
            featuredTitle.textContent = featuredMovie.title;
            featuredOverview.textContent = featuredMovie.overview;
        } else {
            console.error('No movies found');
        }
    }

    // Populate movie sliders with data
    function populateSlider(data, sliderId) {
        const slider = document.getElementById(sliderId);
        data.results.forEach(movie => {
            const movieItem = createMovieItem(movie);
            slider.appendChild(movieItem);
        });
    }

    // Create a movie item for sliders
    function createMovieItem(movie) {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `<img src="${imgBaseURL}${movie.poster_path}" alt="${movie.title}" />`;

        movieItem.addEventListener('click', () => showTrailer(movie));
        movieItem.addEventListener('mouseenter', () => showMovieDetails(movieItem, movie));
        movieItem.addEventListener('mouseleave', () => hideMovieDetails(movieItem));

        return movieItem;
    }

    // Show movie details in card format
    function showMovieDetails(movieItem, movie) {
        const detailsCard = document.createElement('div');
        detailsCard.classList.add('movie-details-card');
        detailsCard.innerHTML = `
            <h3>${movie.title}</h3>
            <p><strong>Genre:</strong> ${getGenres(movie.genre_ids)}</p>
            <p>${movie.overview}</p>
        `;
        movieItem.appendChild(detailsCard);
    }

    // Hide movie details card
    function hideMovieDetails(movieItem) {
        const detailsCard = movieItem.querySelector('.movie-details-card');
        if (detailsCard) movieItem.removeChild(detailsCard);
    }

    // Utility to get genres by their IDs
    function getGenres(genreIds) {
        const genres = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
            99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
            27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
            10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
        };
        return genreIds.map(id => genres[id]).join(', ');
    }

    // Show trailer in card format
    function showTrailer(movie) {
        const trailerContainer = document.getElementById('trailer-container');
        trailerContainer.innerHTML = `
            <div class="movie-trailer-card">
                <h3>${movie.title}</h3>
                <p>${movie.overview}</p>
                <button class="play-btn" onclick="playTrailer('${movie.id}')">▶ Play Trailer</button>
                <button class="close-btn" onclick="closeTrailer()">✖ Close</button>
            </div>
        `;
        trailerContainer.style.display = 'flex';
    }

    // Play trailer
    function playTrailer(movieId) {
        fetch(`${apiBaseURL}/movie/${movieId}/videos?api_key=${apiKey}`, getFetchOptions())
            .then(response => response.json())
            .then(data => displayTrailer(data))
            .catch(error => console.error('Error fetching trailer:', error));
    }

    // Display trailer in card
    function displayTrailer(data) {
        const trailerContainer = document.getElementById('trailer-container');
        if (data.results.length > 0) {
            const trailerKey = data.results[0].key;
            trailerContainer.innerHTML = `
                <div class="movie-trailer-card">
                    <iframe src="https://www.youtube.com/embed/${trailerKey}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    <button class="close-btn" onclick="closeTrailer()">✖ Close</button>
                </div>
            `;
            trailerContainer.style.display = 'flex';
        } else {
            alert('Trailer not available.');
        }
    }

    // Close trailer card
    function closeTrailer() {
        const trailerContainer = document.getElementById('trailer-container');
        trailerContainer.style.display = 'none';
    }

    // Scroll slider function
    window.scrollSlider = function(sliderId, direction) {
        const slider = document.getElementById(sliderId);
        slider.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    };

    // Fetch options helper
    function getFetchOptions() {
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        };
    }

    // Search functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const mainContent = document.getElementById('main-content'); // The main content section
    const searchResultsSection = document.getElementById('search-results');
    const searchSlider = document.getElementById('search-slider');

    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query === '') return;

        // Clear previous search results
        searchSlider.innerHTML = '';

        // Hide the main content
        mainContent.style.display = 'none';

        // Fetch search results from API
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            const movies = data.results;

            if (movies.length > 0) {
                searchResultsSection.style.display = 'block';
                movies.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.classList.add('movie-item');
                    const moviePoster = movie.poster_path ? `${imgBaseURL}${movie.poster_path}` : 'path_to_default_image';
                    movieItem.innerHTML = `<img src="${moviePoster}" alt="${movie.title}" />`;

                    // Append movie item to the search results slider
                    searchSlider.appendChild(movieItem);
                });
            } else {
                searchSlider.innerHTML = '<p>No results found.</p>';
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    });
});

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTNmYjdhNTk0MTkwYzc2ZmJiZDdlNzNmMzQ2NGQ4YiIsIm5iZiI6MTcyNTEwNTM4MS4xODI4OTksInN1YiI6IjY2Y2Y1M2Y0NGVkNmM3Y2I0ZWEwYTgxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.z4E1z0JUbDPMVCR6G5rGOLWTms-Mah2z4KCE8XCFMj4'
    }
  };
  
  fetch('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
