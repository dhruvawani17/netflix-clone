document.addEventListener("DOMContentLoaded", () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Access Token and API Key
    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTNmYjdhNTk0MTkwYzc2ZmJiZDdlNzNmMzQ2NGQ4YiIsIm5iZiI6MTcyNDkwNTMxMy44MzYwMjgsInN1YiI6IjY2Y2Y1M2Y0NGVkNmM3Y2I0ZWEwYTgxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zvWm3EvnY3bnPqDzrb7jM0TDaNgOuUUrRGCwA0nlpS4'; // Replace with your actual Access Token
    const apiKey = '253fb7a594190c76fbbd7e73f3464d8b'; // Replace with your actual API Key
    const apiBaseURL = 'https://api.themoviedb.org/3';
    const imgBaseURL = 'https://image.tmdb.org/t/p/original';

    // Fetch and display the featured movie
    function fetchFeaturedMovie() {
        fetch(`${apiBaseURL}/movie/popular?api_key=${apiKey}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(error => console.error('Error fetching featured movie:', error));
    }

    // Fetch movie data and populate sliders
    function fetchMovies(endpoint, sliderId) {
        fetch(`${apiBaseURL}${endpoint}?api_key=${apiKey}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then(response => response.json())
        .then(data => {
            const slider = document.getElementById(sliderId);
            data.results.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('movie-item');
                movieItem.innerHTML = `
                    <img src="${imgBaseURL}${movie.poster_path}" alt="${movie.title}" />
                `;
                movieItem.addEventListener('click', () => {
                    showTrailer(movie);
                });
                slider.appendChild(movieItem);
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
    }

    // Fetch different movie categories
    fetchMovies('/trending/all/day', 'trending-slider');
    fetchMovies('/movie/popular', 'popular-slider');
    fetchMovies('/discover/movie?with_genres=27', 'horror-slider'); // 27 is the genre ID for horror
    fetchMovies('/discover/movie?with_genres=18', 'drama-slider'); // 18 is the genre ID for drama
    fetchMovies('/discover/movie?with_genres=878', 'sci-fi-slider'); // 878 is the genre ID for sci-fi

    // Fetch and display the featured movie on page load
    fetchFeaturedMovie();

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
        fetch(`${apiBaseURL}/movie/${movieId}/videos?api_key=${apiKey}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
        .then(response => response.json())
        .then(data => {
            const trailerKey = data.results[0]?.key;
            if (trailerKey) {
                const trailerContainer = document.getElementById('trailer-container');
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
        })
        .catch(error => console.error('Error fetching trailer:', error));
    }

    // Close trailer card
    function closeTrailer() {
        const trailerContainer = document.getElementById('trailer-container');
        trailerContainer.style.display = 'none';
    }
});

// Scroll slider
function scrollSlider(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    if (direction === 'left') {
        slider.scrollBy({ left: -300, behavior: 'smooth' });
    } else if (direction === 'right') {
        slider.scrollBy({ left: 300, behavior: 'smooth' });
    }
}
