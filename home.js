document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById('navbar');
    const apiKey = '253fb7a594190c76fbbd7e73f3464d8b';
    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTNmYjdhNTk0MTkwYzc2ZmJiZDdlNzNmMzQ2NGQ4YiIsIm5iZiI6MTcyNTI1NDc2MC4xNjI4NDUsInN1YiI6IjY2Y2Y1M2Y0NGVkNmM3Y2I0ZWEwYTgxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VhtTDmeAkIHhHqjX3W4dNK6l-xSiaZWChiXAHX8fUtI';
    const apiBaseURL = 'https://api.themoviedb.org/3';
    const imgBaseURL = 'https://image.tmdb.org/t/p/original';
    const API_KEY = 'AIzaSyDhzAO-nRc-oNlbJiNBbfio74Rf1A2W99s'; // Replace with your YouTube API key

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
        movieItem.innerHTML = `
            <img src="${imgBaseURL}${movie.poster_path}" alt="${movie.title}" />
            <button class="play-button" style="display:none;">▶ Play</button>
        `;

        // Store the movie title in a data attribute for easy access
        movieItem.dataset.title = movie.title;

        // Event Listeners
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
            <button class="play-trailer-button">▶</button>
        `;
        movieItem.appendChild(detailsCard);

        // Show play button
        const playButton = movieItem.querySelector('.play-button');
        playButton.style.display = 'block';

        // Attach event to play button
        const playTrailerButton = detailsCard.querySelector('.play-trailer-button');
        playTrailerButton.addEventListener('click', async () => {
            const videoId = await searchTrailer(movie.title);
            displayTrailer(videoId);
        });
    }

    // Hide movie details card
    function hideMovieDetails(movieItem) {
        const detailsCard = movieItem.querySelector('.movie-details-card');
        if (detailsCard) movieItem.removeChild(detailsCard);

        // Hide play button
        const playButton = movieItem.querySelector('.play-button');
        playButton.style.display = 'none';
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

    // Search for a movie trailer on YouTube
    async function searchTrailer(movieTitle) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${API_KEY}&q=${encodeURIComponent(movieTitle)}+trailer`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].id.videoId; // Return the first video ID
        } else {
            console.error('No trailer found for:', movieTitle);
            return null;
        }
    }

    // Display the trailer in the trailer container
    function displayTrailer(videoId) {
        if (videoId) {
            const trailerContainer = document.getElementById('trailer-container');
            trailerContainer.innerHTML = `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            `;
        }
    }

    // Attach event listeners for the watchlist buttons
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
});
