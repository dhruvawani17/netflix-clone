document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '253fb7a594190c76fbbd7e73f3464d8b';
    const apiUrl = 'https://api.themoviedb.org/3/';

    const featuredPoster = document.getElementById('featured-poster');
    const featuredTitle = document.getElementById('featured-title');
    const featuredOverview = document.getElementById('featured-overview');

    const trendingSlider = document.getElementById('trending-slider');
    const popularSlider = document.getElementById('popular-slider');
    const horrorSlider = document.getElementById('horror-slider');
    const dramaSlider = document.getElementById('drama-slider');
    const sciFiSlider = document.getElementById('sci-fi-slider');

    // Fetch and display the featured movie
    fetch(`${apiUrl}movie/popular?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const featuredMovie = data.results[Math.floor(Math.random() * data.results.length)];
        featuredPoster.src = `https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path}`;
        featuredTitle.textContent = featuredMovie.title;
        featuredOverview.textContent = featuredMovie.overview;

        // Populate sliders with different categories
        populateSlider(trendingSlider, 'trending');
        populateSlider(popularSlider, 'popular');
        populateSlider(horrorSlider, 'horror');
        populateSlider(dramaSlider, 'drama');
        populateSlider(sciFiSlider, 'science fiction');
    })
    .catch(error => console.error('Error fetching movies:', error));

    function populateSlider(slider, category) {
        let categoryUrl;
        switch (category) {
            case 'trending':
                categoryUrl = `${apiUrl}trending/movie/week?api_key=${apiKey}`;
                break;
            case 'popular':
                categoryUrl = `${apiUrl}movie/popular?api_key=${apiKey}`;
                break;
            case 'horror':
                categoryUrl = `${apiUrl}discover/movie?api_key=${apiKey}&with_genres=27`;
                break;
            case 'drama':
                categoryUrl = `${apiUrl}discover/movie?api_key=${apiKey}&with_genres=18`;
                break;
            case 'science fiction':
                categoryUrl = `${apiUrl}discover/movie?api_key=${apiKey}&with_genres=878`;
                break;
            default:
                categoryUrl = `${apiUrl}movie/popular?api_key=${apiKey}`;
        }

        fetch(categoryUrl)
        .then(response => response.json())
        .then(data => {
            slider.innerHTML = ''; // Clear previous items
            data.results.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('movie-item');
                
                const movieImage = document.createElement('img');
                movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                
                const movieTrailerCard = document.createElement('div');
                movieTrailerCard.classList.add('movie-trailer-card');
                movieTrailerCard.id = `trailer-${movie.id}`;

                movieItem.appendChild(movieImage);
                movieItem.appendChild(movieTrailerCard);
                slider.appendChild(movieItem);

                movieImage.addEventListener('click', () => {
                    playTrailer(movie.id, movieTrailerCard);
                });
            });
        })
        .catch(error => console.error('Error fetching movies:', error));
    }

    function playTrailer(movieId, trailerCard) {
        const trailerUrl = `${apiUrl}movie/${movieId}/videos?api_key=${apiKey}`;
        
        fetch(trailerUrl)
            .then(response => response.json())
            .then(data => {
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                if (trailer) {
                    const trailerVideo = document.createElement('iframe');
                    trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
                    trailerVideo.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    trailerVideo.allowFullscreen = true;

                    trailerCard.innerHTML = '';
                    trailerCard.appendChild(trailerVideo);
                    trailerCard.style.display = 'block';
                } else {
                    trailerCard.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching trailer:', error));
    }
});
