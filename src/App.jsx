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
  const [selectedAnime, setSelectedAnime] = useState(null); // State untuk menyimpan anime yang dipilih
  const [isCarouselLoading, setIsCarouselLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);


  const localImages = [image1, image2, image3];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-base-200', 'text-white');
      document.body.classList.remove('bg-white', 'text-black');
    } else {
      document.body.classList.add('bg-white', 'text-black');
      document.body.classList.remove('bg-base-200', 'text-white');
    }
  }, [isDarkMode]);

  // AOS Animation
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi dalam milidetik
      once: true, // Animasi hanya dijalankan sekali
    });
  }, []);


  useEffect(() => {
    // Simulasi delay untuk loading data carousel (jika diperlukan)
    setTimeout(() => {
      setIsCarouselLoading(false);
    }, 2000); // Simulasi delay 2 detik
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

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  useEffect(() => {
    if (searchTerm === '') {
      fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity')
        .then(response => response.json())
        .then(data => {
          setAnimeList(data.data);
          setIsSearching(false);
          console.log(data.data)
        });
    } else {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}`)
          .then(response => response.json())
          .then(data => {
            setAnimeList(data.data || []);
            setIsSearching(false);
          });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const handlePrevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === 0 ? localImages.length - 1 : prevSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === localImages.length - 1 ? 0 : prevSlide + 1));
  };

  const handleCardClick = (anime) => {
    setSelectedAnime(anime); // Simpan data anime yang diklik
  };

  const closeModal = () => {
    setSelectedAnime(null); // Tutup modal
  };

  return (
    <div className={`${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div
        className={`flex justify-between navbar ${scrolled ? 'bg-base-300' : 'bg-transparent text-white'} ${isDarkMode ? 'text-white' : 'text-black bg-white'} fixed top-0 left-0 right-0 z-10 transition`}
      >
        <a href='' className="btn btn-ghost text-xl">Juju Otaku</a>
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />

          {/* sun icon */}
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>

      {/* Carousel */}
      <div className="carousel w-full h-[1080px] sm:h-full relative bg-black">
        {isCarouselLoading ? (
          // Skeleton carousel
          <div className="animate-pulse w-full h-[1000px] bg-gray-600 rounded-md"></div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={localImages[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover opacity-50"
            />
            <div className={`absolute top-0 left-0 w-full h-full ${isDarkMode ? 'bg-gradient-to-t from-black to-transparent' : 'bg-gradient-to-t from-white to-transparent'} `}></div>
          </div>
        )}

        {!isCarouselLoading && (
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <button className={`btn btn-circle ${isDarkMode ? '' : "bg-white border-none"}`} onClick={handlePrevSlide}>
              ❮
            </button>
            <button className={`btn btn-circle ${isDarkMode ? '' : "bg-white border-none"}`} onClick={handleNextSlide}>
              ❯
            </button>
          </div>
        )}
      </div>




      {/* Search bar */}
      <div className="flex mb-3 items-center ml-5 md:ml-28 mt-5 justify-evenly m-2">
        <h2 className="text-2xl font-bold">Most Popular</h2>
        <label className={`input input-bordered border-black flex items-center gap-2 ${isDarkMode ? '' : 'bg-white'}`}>
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd" />
          </svg>
        </label>
      </div>


      {/* Anime cards */}
      <div className="flex justify-center min-h-screen m-10">
        {isSearching ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animeList.length === 0 ? (
              // Skeleton placeholder
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse flex flex-col items-center space-y-3">
                  <div className="w-full h-60 bg-gray-300 rounded-md"></div>
                  <div className="w-3/4 h-5 bg-gray-300 rounded-md"></div>
                </div>
              ))
            ) : (
              animeList.map((data, index) => (
                <div
                  key={index}
                  className="flex my-3 flex-col items-center rounded-md overflow-hidden cursor-pointer relative group transition hover:scale-110"
                  onClick={() => handleCardClick(data)}
                  data-aos="fade-up"
                >
                  <img
                    src={data.images.jpg.large_image_url || data.images.jpg.image_url}
                    alt={data.title}
                    className="object-cover w-full h-60 z-10"
                  />
                  <h1 className="font-semibold text-center p-2 text-sm">{data.title}</h1>
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-500 to-transparent opacity-0 group-hover:opacity-80 transition-opacity z-20"></div>
                </div>
              ))
            )}
          </div>
        )}
      </div>


      {/* Modal Detail Anime */}
      {selectedAnime && (
        <div className={`modal modal-open`}>
          <div className={`modal-box ${isDarkMode ? '' : 'bg-white text-black'}`}>
            <h2 className="font-bold text-lg text-center">{selectedAnime.title}</h2>
            <img
              src={selectedAnime.images.jpg.large_image_url}
              alt={selectedAnime.title}
              className="mt-4 w-full"
            />
            <p><span className='font-bold'>Genre: </span>{selectedAnime.genres.map((genre, index) => (
              <span key={index}>{genre.name}{index < selectedAnime.genres.length - 1 ? ', ' : ''}</span>
            ))}</p>
            <p><span className='font-bold'>Total Episode: </span>{selectedAnime.episodes}</p>
            <p><span className='font-bold'>Popularity: </span> {selectedAnime.popularity}</p>
            <p><span className='font-bold'>Score: </span> {selectedAnime.score}</p>
            {selectedAnime.trailer && selectedAnime.trailer.embed_url ? (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Trailer</h3>
                <iframe
                  width="100%"
                  height="315"
                  src={selectedAnime.trailer.embed_url}
                  title={`Trailer of ${selectedAnime.title}`}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="mt-4">Trailer not available</p>
            )}
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All right reserved by Rhakelino</p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
