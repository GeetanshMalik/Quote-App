import React, { useState, useEffect } from 'react';
import { Share2, Heart, RefreshCw } from 'lucide-react';
import { quotesDatabase } from '../data/quotes';

const QuotesApp = () => {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showShareAlert, setShowShareAlert] = useState(false);

  // Get a random quote that's different from the current one
  const getRandomQuote = () => {
    const availableQuotes = quotesDatabase.filter(quote => 
      !currentQuote || quote.id !== currentQuote.id
    );
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    return availableQuotes[randomIndex];
  };

  // Initialize quote on first load
  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  // Handle quote refresh
  const refreshQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  // Toggle favorite status
  const toggleFavorite = (quote) => {
    const isFavorite = favorites.some(fav => fav.id === quote.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== quote.id));
    } else {
      setFavorites([...favorites, quote]);
    }
  };

  // Share quote
  const shareQuote = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Inspirational Quote',
        text: `"${currentQuote.text}" - ${currentQuote.author}`,
      }).catch(() => {
        setShowShareAlert(true);
        setTimeout(() => setShowShareAlert(false), 3000);
      });
    } else {
      setShowShareAlert(true);
      setTimeout(() => setShowShareAlert(false), 3000);
    }
  };

  if (!currentQuote) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Main Quote Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Quote of the Day
          </h1>
          <div className="text-center p-6">
            <p className="text-xl mb-4">"{currentQuote.text}"</p>
            <p className="text-gray-600">- {currentQuote.author}</p>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button 
              onClick={refreshQuote}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <RefreshCw className="h-4 w-4" />
              New Quote
            </button>
            <button 
              onClick={() => toggleFavorite(currentQuote)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              <Heart 
                className="h-4 w-4" 
                fill={favorites.some(fav => fav.id === currentQuote.id) ? "white" : "none"} 
              />
              Favorite
            </button>
            <button 
              onClick={shareQuote}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 
            className="text-xl font-bold cursor-pointer"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            Favorite Quotes ({favorites.length})
          </h2>
          {showFavorites && (
            <div className="mt-4">
              {favorites.length === 0 ? (
                <p className="text-center text-gray-500">No favorites yet</p>
              ) : (
                <div className="space-y-4">
                  {favorites.map(quote => (
                    <div key={quote.id} className="p-4 border rounded">
                      <p className="mb-2">"{quote.text}"</p>
                      <p className="text-gray-600">- {quote.author}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Share Alert */}
        {showShareAlert && (
          <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg">
            Quote copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotesApp;
