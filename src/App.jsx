import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import image1 from './assets/images/1.jpg';
import image2 from './assets/images/2.jpg';
import image3 from './assets/images/4.png';

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [isCarouselLoading, setIsCarouselLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);

  const localImages = [image1, image2, image3];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-base-300', 'text-white');
      document.body.classList.remove('bg-white', 'text-gray-800');
    } else {
      document.body.classList.add('bg-white', 'text-gray-800');
      document.body.classList.remove('bg-base-300', 'text-white');
    }
  }, [isDarkMode]);

  // AOS Animation
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    // Simulasi delay untuk loading data carousel
    setTimeout(() => {
      setIsCarouselLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    if (searchTerm === '') {
      let endpoint = '';
      
      if (sortBy === 'popularity') {
        endpoint = `https://api.jikan.moe/v4/top/anime?page=${currentPage}&filter=bypopularity`;
      } else if (sortBy === 'score') {
        endpoint = `https://api.jikan.moe/v4/top/anime?page=${currentPage}`;
      } else if (sortBy === 'upcoming') {
        endpoint = `https://api.jikan.moe/v4/seasons/upcoming?page=${currentPage}`;
      }
      
      fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          setAnimeList(data.data);
          setTotalPages(Math.min(data.pagination?.last_visible_page || 1, 10));
          setIsSearching(false);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching anime data:', error);
          setLoading(false);
        });
    } else {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}&page=${currentPage}`)
          .then(response => response.json())
          .then(data => {
            setAnimeList(data.data || []);
            setTotalPages(Math.min(data.pagination?.last_visible_page || 1, 10));
            setIsSearching(false);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error searching anime:', error);
            setLoading(false);
          });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, currentPage, sortBy]);

  const handlePrevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === 0 ? localImages.length - 1 : prevSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === localImages.length - 1 ? 0 : prevSlide + 1));
  };

  const handleCardClick = (anime) => {
    setSelectedAnime(anime);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedAnime(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className={`${isDarkMode ? 'bg-base-300' : 'bg-gray-50'} min-h-screen`}>
      {/* Navbar - Improved design */}
      <div
        className={`navbar ${scrolled ? 'bg-base-200 shadow-md' : 'bg-transparent'} 
          ${isDarkMode ? 'text-white' : 'text-gray-800'} 
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 lg:px-8`}
      >
        <div className="navbar-start">
          <a href='' className="btn btn-ghost text-xl font-bold">
            <span className="text-primary">Juju</span> Otaku
          </a>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li><a className="hover:text-primary transition-colors">Home</a></li>
            <li><a className="hover:text-primary transition-colors">Seasonal</a></li>
            <li><a className="hover:text-primary transition-colors">Top Anime</a></li>
            <li><a className="hover:text-primary transition-colors">About</a></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          <label className="swap swap-rotate mr-4">
            <input
              type="checkbox"
              className="theme-controller"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <svg className="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg className="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 ${isDarkMode ? 'bg-base-200' : 'bg-white'}`}>
              <li><a>Home</a></li>
              <li><a>Seasonal</a></li>
              <li><a>Top Anime</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Original Carousel - Keeps the original structure but with improved styling */}
      <div className="carousel w-full h-[80vh] relative bg-black">
        {isCarouselLoading ? (
          <div className="animate-pulse w-full h-full bg-gray-600 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={localImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover opacity-60"
            />
            
            {/* Gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent"></div>
            
            {/* Hero content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-5xl">
              <h1 data-aos="fade-right" data-aos-delay="200" className="text-3xl md:text-5xl font-bold text-white mb-4">
                {currentSlide === 0 ? "Explore Anime World" : 
                 currentSlide === 1 ? "Discover New Series" : 
                 "Join the Community"}
              </h1>
              <p data-aos="fade-right" data-aos-delay="300" className="text-white text-lg md:text-xl mb-8 max-w-2xl">
                {currentSlide === 0 ? "Discover top-rated anime, trending shows, and upcoming releases all in one place." : 
                 currentSlide === 1 ? "Stay updated with the latest episodes and never miss your favorite anime series." : 
                 "Connect with other anime fans and share your thoughts on your favorite shows."}
              </p>
              <div data-aos="fade-right" data-aos-delay="400" className="flex gap-4">
                <button className="btn btn-primary">Browse Now</button>
                <button className="btn btn-outline text-white border-white hover:bg-white hover:text-black">Learn More</button>
              </div>
            </div>
          </div>
        )}

        {!isCarouselLoading && (
          <>
            {/* Carousel controls */}
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <button 
                className="btn btn-circle btn-sm md:btn-md bg-black/30 border-none hover:bg-primary text-white" 
                onClick={handlePrevSlide}
              >
                ❮
              </button>
              <button 
                className="btn btn-circle btn-sm md:btn-md bg-black/30 border-none hover:bg-primary text-white" 
                onClick={handleNextSlide}
              >
                ❯
              </button>
            </div>
            
            {/* Carousel indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {localImages.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-primary w-8' : 'bg-white/50'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div data-aos="fade-right">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Anime Collection
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center" data-aos="fade-left">
            <div className="join">
              <button 
                className={`btn join-item ${sortBy === 'popularity' ? 'btn-primary' : ''}`} 
                onClick={() => {setSortBy('popularity'); setCurrentPage(1);}}
              >
                Popular
              </button>
              <button 
                className={`btn join-item ${sortBy === 'score' ? 'btn-primary' : ''}`} 
                onClick={() => {setSortBy('score'); setCurrentPage(1);}}
              >
                Top Rated
              </button>
              <button 
                className={`btn join-item ${sortBy === 'upcoming' ? 'btn-primary' : ''}`} 
                onClick={() => {setSortBy('upcoming'); setCurrentPage(1);}}
              >
                Upcoming
              </button>
            </div>
            
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                className={`input input-bordered w-full md:w-64 pr-10 ${isDarkMode ? 'bg-base-200' : 'bg-white'}`}
                placeholder="Search anime..."
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        <div className="mb-10">
          {loading || isSearching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse flex flex-col rounded-lg overflow-hidden bg-base-200">
                  <div className="w-full h-64 bg-gray-600 rounded-t-lg"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : animeList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">No anime found</h3>
              <p className="text-gray-500">Try a different search term or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {animeList.map((anime, index) => (
                <div
                  key={index}
                  className={`card bg-base-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ${isDarkMode ? 'hover:shadow-primary/30' : 'hover:shadow-primary/20'}`}
                  data-aos="fade-up"
                  data-aos-delay={100 + (index % 5) * 50}
                  onClick={() => handleCardClick(anime)}
                >
                  <figure className="relative overflow-hidden h-64">
                    <img
                      src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 badge badge-primary">{anime.score || 'N/A'}</div>
                    {anime.episodes && (
                      <div className="absolute bottom-2 left-2 badge badge-secondary">
                        {anime.episodes} eps
                      </div>
                    )}
                  </figure>
                  <div className="card-body p-3">
                    <h2 className="card-title text-sm md:text-base line-clamp-2">{anime.title}</h2>
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {anime.genres.slice(0, 2).map((genre, i) => (
                          <span key={i} className="badge badge-outline badge-sm">{genre.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isSearching && animeList.length > 0 && (
          <div className="flex justify-center mt-8" data-aos="fade-up">
            <div className="join">
              <button 
                className="join-item btn btn-sm md:btn-md"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                // Show limited page buttons for better mobile experience
                if (
                  index === 0 || 
                  index === totalPages - 1 || 
                  (index >= currentPage - 2 && index <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={index}
                      className={`join-item btn btn-sm md:btn-md ${currentPage === index + 1 ? 'btn-primary' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  );
                } else if (
                  index === currentPage - 3 || 
                  index === currentPage + 3
                ) {
                  return (
                    <button key={index} className="join-item btn btn-sm md:btn-md btn-disabled">...</button>
                  );
                }
                return null;
              })}
              
              <button 
                className="join-item btn btn-sm md:btn-md"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className={`py-10 ${isDarkMode ? 'bg-base-200' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" data-aos="fade-up">
            Why Choose Juju Otaku?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="card bg-base-100 shadow-xl" data-aos="fade-up" data-aos-delay="100">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl">Fast Updates</h3>
                <p>Get the latest anime releases as soon as they air in Japan.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl" data-aos="fade-up" data-aos-delay="200">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="card-title text-xl">Personalized</h3>
                <p>Discover anime tailored to your taste and preferences.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl" data-aos="fade-up" data-aos-delay="300">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="card-title text-xl">Community</h3>
                <p>Join discussions with fellow anime enthusiasts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-12 container mx-auto px-4">
          <div className={`p-8 rounded-xl shadow-xl max-w-3xl mx-auto text-center ${isDarkMode ? 'bg-base-200' : 'bg-white'}`} data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6">Subscribe to our newsletter for weekly anime updates and recommendations.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com" className={`input input-bordered flex-1 ${isDarkMode ? 'bg-base-300' : 'bg-white'}`} />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
      </div>

      {/* Modal Detail Anime */}
      {selectedAnime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={closeModal}>
          <div 
            className={`modal-box max-w-3xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-base-200' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={selectedAnime.images.jpg.large_image_url}
                  alt={selectedAnime.title}
                  className="w-full rounded-lg shadow-md"
                />
                
                <div className="stats stats-vertical shadow mt-4 w-full">
                  <div className="stat">
                    <div className="stat-title">Score</div>
                    <div className="stat-value text-primary">{selectedAnime.score || 'N/A'}</div>
                    <div className="stat-desc">{selectedAnime.scored_by ? `${(selectedAnime.scored_by/1000).toFixed(1)}K votes` : 'No votes yet'}</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-title">Rank</div>
                    <div className="stat-value text-secondary">#{selectedAnime.rank || 'N/A'}</div>
                    <div className="stat-desc">Popularity: #{selectedAnime.popularity || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedAnime.title}</h2>
                {selectedAnime.title_english && selectedAnime.title_english !== selectedAnime.title && (
                  <p className="text-lg text-gray-500 mb-4">{selectedAnime.title_english}</p>
                )}
                
                <div className="divider my-2"></div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <div>
                    <span className="font-semibold">Type:</span> {selectedAnime.type || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Episodes:</span> {selectedAnime.episodes || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> {selectedAnime.status || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Aired:</span> {selectedAnime.aired?.string || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Season:</span> {selectedAnime.season ? `${selectedAnime.season.charAt(0).toUpperCase() + selectedAnime.season.slice(1)} ${selectedAnime.year}` : 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Studio:</span> {selectedAnime.studios?.map(s => s.name).join(', ') || 'N/A'}
                  </div>
                </div>
                
                {selectedAnime.synopsis && (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Synopsis</h3>
                    <p className="text-sm overflow-y-auto max-h-32">{selectedAnime.synopsis}</p>
                  </div>
                )}
                
                {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnime.genres.map((genre, index) => (
                        <span key={index} className="badge badge-primary">{genre.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Trailer Section */}
            {selectedAnime.trailer && selectedAnime.trailer.embed_url && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Trailer</h3>
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedAnime.trailer.embed_url}
                    title={`Trailer of ${selectedAnime.title}`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
            
            <div className="modal-action">
              <button className="btn btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`footer footer-center p-10 ${isDarkMode ? 'bg-base-200 text-base-content' : 'bg-gray-800 text-white'}`}>
        <div className="grid grid-flow-col gap-4">
          <a className="link link-hover">About Us</a> 
          <a className="link link-hover">Contact</a> 
          <a className="link link-hover">Privacy Policy</a> 
          <a className="link link-hover">Terms of Service</a>
        </div> 
        <div>
          <div className="grid grid-flow-col gap-4">
            <a className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a> 
            <a className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a> 
            <a className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div> 
        <div>
          <p>Copyright © {new Date().getFullYear()} - All right reserved by Juju Otaku</p>
        </div>
      </footer>
    </div>
  );
}

export default App;