import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const App = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });
  const [genreOptions, setGenreOptions] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    genres : [],
    years: [],
    ratings: []
  });

  const fetchMovies = () => {
    setLoading(true);

    return fetch('http://localhost:8000/movies')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
        setFilterOptions({
          years: [...new Set(data.map(movie => movie.year))].sort(),
          ratings: [...new Set(data.map(movie => movie.rating))].sort((a, b) => a - b)
        });
        fetchGenres();
      });
  }

  const fetchGenres = () => {
    setLoading(true);
    return fetch('http://localhost:8000/genres')
      .then(response => response.json())
      .then(data => {
        //console.log("i miei generi",data)
        setFilterOptions(prev => ({
          ...prev,
          genres: data.map(genre => ({
              id: genre.id, 
              name: genre.name
          })).sort((a, b) => a.name.localeCompare(b.name))
        }));
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <Layout>
      <Heading />
      <Filters setFilters={setFilters} filterOptions={filterOptions} genreOptions={genreOptions} />
      <MovieList loading={loading} movies={movies} filters={filters} />
    </Layout>
  );
};

const Filters = ({ setFilters, filterOptions, genreOptions}) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setFilters(filters => ({ ...filters, year: parseInt(event.target.value, 10) }));
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
    setFilters(filters => ({ ...filters, rating: parseFloat(event.target.value) }));
  };

  const handleGenreChange = (event) => {
    const genreId = event.target.value;  // Nota: cambiato da event.target.key a event.target.value
    setSelectedGenre(genreId);
    fetchMoviesByGenre(genreId);
  };

  const resetFilters = () => {
    setSelectedYear('');
    setSelectedRating('');
    setSelectedGenre('');
    setFilters({ genre: '', year: '', rating: '' });
  };

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="flex space-x-2 mb-10">
      <select value={selectedGenre} onChange={handleGenreChange} className="px-4 py-2 border rounded">
        <option value="">Select Genre</option>
        {filterOptions.genres && filterOptions.genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
        ))}
      </select>
        <select value={selectedYear} onChange={handleYearChange} className="px-4 py-2 border rounded">
          <option value="">Select Year</option>
          {filterOptions.years && filterOptions.years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={selectedRating} onChange={handleRatingChange} className="px-4 py-2 border rounded">
          <option value="">Select Rating</option>
          {filterOptions.ratings && filterOptions.ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>
      <button onClick={resetFilters} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">
        Reset Filters
      </button>
    </div>
  );
};


const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = ({ loading, movies, filters }) => {
  if (loading) {
    return <div className="text-center"><Spinner size="xl" /></div>;
  }

  const filteredMovies = movies.filter(movie => {
    const { year, rating, genre } = filters;
    return (genre ? movie.genre === genre : true) &&
           (year ? movie.year === year : true) &&
           (rating ? movie.rating === rating : true);
    });

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {filteredMovies.map(movie => (
        <MovieItem key={movie.id} {...movie} />
      ))}
    </div>
  );
};

const MovieItem = props => {
  //console.log("props",props);
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
                <span>{props.year}</span>

                {props.rating
                  ? <Rating>
                      <Rating.Star />

                      <span className="ml-0.5">
                        {props.rating}
                      </span>
                    </Rating>
                  : null
                }
              </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
              color="light"
              size="xs"
              className="w-full"
              onClick={() => window.open(props.wikipediaUrl, '_blank')}
            >
              More
            </Button>
          : null
        }
      </div>
    </div>
  );
};

const fetchMoviesByGenre = (genreId) => {
  
  fetch(`http://localhost:8000/movies/genre/${genreId}`)
      .then(response => response.json())
      .then(data => {
          setMovies(data);
  
      })
      .catch(error => {
          console.error('Error fetching movies by genre:', error);
  
      });
};

export default App;
