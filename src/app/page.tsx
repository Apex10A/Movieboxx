"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/layout/header';
import Image from 'next/image';
import './index.css'
import { FaPlay, FaInfoCircle, FaStar, FaRegStar } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
}

interface MovieCategory {
  title: string;
  movies: Movie[];
  link: string;
}

const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [movieCategories, setMovieCategories] = useState<MovieCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch multiple categories in parallel
        const [popularRes, trendingRes, topRatedRes, upcomingRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_API_KEY}`),
        ]);

        const [popularData, trendingData, topRatedData, upcomingData] = await Promise.all([
          popularRes.json(),
          trendingRes.json(),
          topRatedRes.json(),
          upcomingRes.json(),
        ]);

        if (popularData.results?.length > 0) {
          setFeaturedMovie(popularData.results[0]);
        }

        setMovieCategories([
          {
            title: "Popular Movies",
            movies: popularData.results?.slice(1, 7) || [],
            link: "/movies/popular"
          },
          {
            title: "Trending Now",
            movies: trendingData.results?.slice(0, 6) || [],
            link: "/movies/trending"
          },
          {
            title: "Top Rated",
            movies: topRatedData.results?.slice(0, 6) || [],
            link: "/movies/top-rated"
          },
          {
            title: "Coming Soon",
            movies: upcomingData.results?.slice(0, 6) || [],
            link: "/movies/upcoming"
          }
        ]);

      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleWatchTrailer = () => {
    setIsTrailerPlaying(true);
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Featured Movie Section */}
      {featuredMovie && (
        <div className="relative h-screen w-full">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0"
            priority
          />

          <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-7xl font-bold mb-4">
                {featuredMovie.title}
              </h1>
              
              <div className="flex items-center mb-6 space-x-6">
                <div className="flex items-center">
                  {renderRatingStars(featuredMovie.vote_average)}
                  <span className="ml-2">
                    {featuredMovie.vote_average.toFixed(1)}/10
                  </span>
                </div>
                <span>{new Date(featuredMovie.release_date).getFullYear()}</span>
              </div>

              <p className="text-lg mb-8 leading-relaxed">
                {featuredMovie.overview}
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={handleWatchTrailer}
                  className="flex items-center bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md transition"
                >
                  <FaPlay className="mr-2" /> Watch Trailer
                </button>
                <Link href={`/movies/${featuredMovie.id}`}>
                  <div className="flex items-center bg-white/30 hover:bg-white/40 px-6 py-3 rounded-md transition">
                    <FaInfoCircle className="mr-2" /> More Info
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Categories Sections */}
      {movieCategories.map((category) => (
        <div key={category.title} className="py-12 px-6 md:px-12 lg:px-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{category.title}</h2>
            <Link href={category.link}>
              <div className="flex items-center text-red-400 hover:text-red-500 transition">
                View All <FiChevronRight className="ml-1" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {category.movies.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`}>
                <div className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                    <Image
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/placeholder-movie.jpg'}
                      alt={movie.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                      <div>
                        <h3 className="font-semibold">{movie.title}</h3>
                        <div className="flex items-center mt-1">
                          {renderRatingStars(movie.vote_average)}
                          <span className="ml-2 text-sm">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs mt-2 line-clamp-2">
                          {movie.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Trailer Modal */}
      {isTrailerPlaying && featuredMovie && (
        <div className="fixed inset-0 bg-black/90 z-50 flex justify-center items-center">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setIsTrailerPlaying(false)}
              className="absolute -top-10 right-0 text-white hover:text-red-500 transition"
            >
              Close
            </button>
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/?autoplay=1&listType=search&list=${featuredMovie.title} official trailer`}
                title={`${featuredMovie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;