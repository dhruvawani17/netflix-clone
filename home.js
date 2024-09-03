document.addEventListener("DOMContentLoaded", () => {
    // Initialize Constants
    const navbar = document.getElementById('navbar');
    const apiKey = '253fb7a594190c76fbbd7e73f3464d8b';
    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTNmYjdhNTk0MTkwYzc2ZmJiZDdlNzNmMzQ2NGQ4YiIsIm5iZiI6MTcyNTI1NDc2MC4xNjI4NDUsInN1YiI6IjY2Y2Y1M2Y0NGVkNmM3Y2I0ZWEwYTgxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VhtTDmeAkIHhHqjX3W4dNK6l-xSiaZWChiXAHX8fUtI';
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
    fetchMovies('/discover/movie?with_genres=35', 'animated-slider');
    fetchMovies('/movie/upcoming', 'upcoming-slider');
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
            <button class="add-to-watchlist">+</button>
        `;
        movieItem.appendChild(detailsCard);
        attachWatchlistButtonEvent();
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

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value;
        if (query) {
            fetch(`${apiBaseURL}/search/movie?query=${query}&api_key=${apiKey}`, getFetchOptions())
                .then(response => response.json())
                .then(data => {
                    const resultsContainer = document.getElementById('search-results');
                    resultsContainer.innerHTML = ''; // Clear previous results
                    data.results.forEach(movie => {
                        const resultItem = createMovieItem(movie);
                        resultsContainer.appendChild(resultItem);
                    });
                })
                .catch(error => console.error('Error searching movies:', error));
        }
    });

    // Attach event listeners
    function attachWatchlistButtonEvent() {
        document.querySelectorAll('.add-to-watchlist').forEach(button => {
            button.addEventListener('click', (event) => {
                const movieTitle = button.parentElement.querySelector('h3').textContent;
                addToWatchlist(movieTitle);
            });
        });
    }

    // Add movie to watchlist
    function addToWatchlist(title) {
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        if (!watchlist.includes(title)) {
            watchlist.push(title);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
        }
    }
});
