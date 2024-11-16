import React, { useState, useEffect } from 'react';
import image1 from './assets/images/1.jpg';
import image2 from './assets/images/2.jpg';
import image3 from './assets/images/4.png';

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const localImages = [image1, image2, image3]; // Array gambar lokal

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-base-200', 'text-white'); // Dark mode
      document.body.classList.remove('bg-white', 'text-black'); // Light mode
    } else {
      document.body.classList.add('bg-white', 'text-black'); // Light mode
      document.body.classList.remove('bg-base-200', 'text-white'); // Dark mode
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (searchTerm === '') {
      fetch('https://api.jikan.moe/v4/top/anime')
        .then(response => response.json())
        .then((data) => {
          setAnimeList(data.data);
          setIsSearching(false);
        });
    } else {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}`)
          .then(response => response.json())
          .then((data) => {
            setAnimeList(data.data || []);
            setIsSearching(false);
          });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? localImages.length - 1 : prevSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === localImages.length - 1 ? 0 : prevSlide + 1));
  };

  return (
    <>
      <div className={`flex justify-between navbar ${isDarkMode ? 'bg-base-200' : 'bg-white'}`}>
        <a className="btn btn-ghost text-xl">Juju Otaku</a>
        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
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
      <div className="carousel w-full h-[500px] relative">
        <img
          src={localImages[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full object-cover"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <button className="btn btn-circle" onClick={handlePrevSlide}>
            ❮
          </button>
          <button className="btn btn-circle" onClick={handleNextSlide}>
            ❯
          </button>
        </div>
      </div>
      {/* End carousel */}

      <div className="flex mb-3 items-center ml-5 md:ml-28 mt-5 justify-evenly m-2">
        <h2 className="text-2xl font-bold">Top Anime</h2>
        <label className={`input input-bordered border-black flex items-center gap-2 ${isDarkMode ? '' : 'bg-white'}`}>
          <input type="text"
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

      <div className="flex justify-center min-h-screen m-10">
        {isSearching ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animeList.map((data, index) => (
              <div key={index} className="flex my-3 flex-col items-center rounded-md overflow-hidden cursor-pointer relative group transition hover:scale-110">
                <img
                  src={data.images.jpg.large_image_url || data.images.jpg.image_url}
                  alt={data.title}
                  className="object-cover w-full h-60 z-10"
                />
                <h1 className="font-semibold text-center p-2 text-sm">{data.title}</h1>
                <div className="absolute inset-0 bg-gradient-to-t from-sky-500 to-transparent opacity-0 group-hover:opacity-80 transition-opacity z-20"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
  <nav className="grid grid-flow-col gap-4">
    <a className="link link-hover">About us</a>
    <a className="link link-hover">Contact</a>
    <a className="link link-hover">Jobs</a>
    <a className="link link-hover">Press kit</a>
  </nav>
  <nav>
    <div className="grid grid-flow-col gap-4">
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
        </svg>
      </a>
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
        </svg>
      </a>
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
        </svg>
      </a>
    </div>
  </nav>
  <aside>a
    <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
  </aside>
</footer>
    </>
  );
}

export default App;
