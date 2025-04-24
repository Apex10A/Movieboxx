import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/app/index.css";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiMenu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

interface Movie {
  id: number;
  title: string;
  // Add other movie properties as needed
}

interface NavbarProps {
  movies?: Movie[];
}

const Navbar = ({ movies = [] }: NavbarProps) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredMovies);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movieId: number) => {
    setSearchQuery("");
    setSuggestions([]);
    router.push(`/movies/${movieId}`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md text-black"
          : "bg-gradient-to-b from-black/70 to-transparent text-white"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-wider">MovieBoxx</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex relative flex-1 max-w-xl mx-8">
            <div
              className={`flex items-center w-full rounded-full border px-4 py-2 transition-all ${
                scrolled ? "border-gray-300" : "border-white/50"
              }`}
            >
              <FiSearch className={`mr-2 ${scrolled ? "text-gray-600" : "text-white/70"}`} />
              <input
                type="text"
                placeholder="What do you want to watch?"
                className="w-full bg-transparent outline-none placeholder-gray-400 text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl overflow-hidden">
                {suggestions.map(movie => (
                  <div
                    key={movie.id}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(movie.id)}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/movies" className="hover:text-primary transition">
            <p>  Movies</p>
            </Link>
            <Link href="/tv-shows" className="hover:text-primary transition">
            <p>  TV Shows </p>
            </Link>
            <Link href="/about" className="hover:text-primary transition">
              <p>About</p>
            </Link>
            <button className="flex items-center space-x-1 hover:text-primary transition">
              <FaUserCircle className="text-xl" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-4">
            <button onClick={toggleMobileSearch}>
              <FiSearch className="text-xl" />
            </button>
            <button onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </nav>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="md:hidden mb-4 relative">
            <div className="flex items-center w-full rounded-full border px-4 py-2 bg-white/10 backdrop-blur-sm">
              <FiSearch className="mr-2" />
              <input
                type="text"
                placeholder="Search movies..."
                className="w-full bg-transparent outline-none placeholder-white/70 text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl overflow-hidden">
                {suggestions.map(movie => (
                  <div
                    key={movie.id}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(movie.id)}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-lg">
            <div className="flex flex-col space-y-3">
              <Link href="/movies" className="hover:text-primary transition">
                Movies
              </Link>
              <Link href="/tv-shows" className="hover:text-primary transition">
                TV Shows
              </Link>
              <Link href="/about" className="hover:text-primary transition">
                About
              </Link>
              <button className="flex items-center space-x-1 hover:text-primary transition">
                <FaUserCircle className="text-xl" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;