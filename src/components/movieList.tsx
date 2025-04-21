import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaRegStar, FaPlay } from 'react-icons/fa';
import { FiInfo } from 'react-icons/fi';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview?: string;
}

interface MovieListProps {
  movies: Movie[];
  title: string;
  showDescription?: boolean;
}

const MovieList = ({ movies, title, showDescription = false }: MovieListProps) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">{title}</h1>
      
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No movies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="group relative">
              {/* Movie Poster */}
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-3">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/placeholder-movie.jpg'
                  }
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition duration-300 group-hover:opacity-70"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="mb-2">
                    <div className="flex items-center">
                      {renderRatingStars(movie.vote_average)}
                      <span className="ml-2 text-white text-sm">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  {showDescription && movie.overview && (
                    <p className="text-white text-xs line-clamp-3 mb-3">
                      {movie.overview}
                    </p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Link href={`/movies/${movie.id}`}>
                      <a className="flex-1 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded px-3 py-1 text-sm transition">
                        <FiInfo className="mr-1" /> Details
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Movie Info */}
              <div className="px-1">
                <h2 className="font-semibold text-white group-hover:text-red-400 transition line-clamp-1">
                  {movie.title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {movie.release_date.split('-')[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;