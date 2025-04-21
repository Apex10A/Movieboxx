"use client"
import { useState, useEffect } from 'react';
import MovieList from '@/components/movieList';
import Head from 'next/head';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const KoreanMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKoreanMovies = async () => {
      try {
        const response = await fetch(
          `${process.env.TMDB_KOREAN_MOVIES}&api_key=${process.env.TMDB_API_KEY}`
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching Korean movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKoreanMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Popular Korean Movies | MovieBoxx</title>
        <meta name="description" content="Browse popular Korean movies" />
      </Head>
      <MovieList movies={movies} title="Popular Korean Movies" />
    </>
  );
};

export default KoreanMovies;