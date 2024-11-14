import React, { useState, useEffect } from 'react';

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch top anime only on initial load or when searchTerm is empty
    if (searchTerm === '') {
      fetch('https://api.jikan.moe/v4/top/anime')
        .then(response => response.json())
        .then((data) => {
          setAnimeList(data.data);
          setIsSearching(false);
        });
    } else {
      setIsSearching(true);
      // Fetch anime based on search term
      const timeoutId = setTimeout(() => {
        fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}`)
          .then(response => response.json())
          .then((data) => {
            setAnimeList(data.data || []);
            setIsSearching(false);
          });
      }, 500); // debounce by 500ms

      return () => clearTimeout(timeoutId); // Clean up timeout if searchTerm changes
    }
  }, [searchTerm]);

  return (
    <>
      <div>
        <nav className="bg-blue-600 p-4 flex justify-around gap-4 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-xl font-bold">JujuOtaku</span>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full px-4 py-1 w-96">
            <input
              type="text"
              placeholder="Cari"
              className="bg-transparent outline-none text-gray-800 placeholder-gray-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </nav>
      </div>
      <div className="flex mb-3 ml-5 md:ml-28 mt-5">
        <h2 className="text-2xl font-bold">Top Anime</h2>
      </div>
      <div className="flex justify-center min-h-screen m-10">
        {isSearching ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animeList.map((data, index) => (
              <div key={index} className="flex my-3 flex-col items-center rounded-md overflow-hidden cursor-pointer relative group transition hover:scale-110">
                {/* Gambar Card */}
                <img
                  src={data.images.jpg.large_image_url || data.images.jpg.image_url}
                  alt={data.title}
                  className="object-cover w-full h-60 z-10"
                />
                {/* Nama anime */}
                <h1 className="font-semibold text-center p-2 text-sm">{data.title}</h1>

                {/* Gradasi biru yang muncul saat hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-500 to-transparent opacity-0 group-hover:opacity-80 transition-opacity z-20"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
