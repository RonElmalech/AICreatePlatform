import React, { useState, useEffect, useRef } from 'react';
import { Loader, Card, FormField } from '../components';
import axios from 'axios';

// Language texts
const texts = {
  en: {
    title: "Welcome to Mind Craft AI: Unleash Your Creativity",
    description:
      "Mind Craft AI is a community where creativity meets innovation. Explore a collection of stunning AI-generated artworks, connect, and share your imagination.",
    searchPlaceholder: "Search posts by name or prompt",
    noResults: "No search results found",
    noPosts: "No posts available",
    showingResults: "Displaying results for",
  },
  he: {
    title: "ברוכים הבאים ל-Mind Craft AI: שחררו את היצירתיות שלכם",
    description:
      "Mind Craft AI היא קהילה בה יצירתיות וחדשנות נפגשות. גלו אוסף מרהיב של יצירות אמנות שנוצרו על ידי בינה מלאכותית, התחברו ושתפו את הדמיון שלכם.",
    searchPlaceholder: "חפש פוסטים לפי שם או תיאור",
    noResults: "לא נמצאו תוצאות חיפוש",
    noPosts: "אין פוסטים זמינים",
    showingResults: "מציג תוצאות עבור",
  },
};

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
      {title}
    </h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [language, setLanguage] = useState('en'); // Default language is English
  const isFetching = useRef(false);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter((post) =>
          post.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          post.prompt.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setSearchedResults(searchResults);
      }, 500)
    );
  };

  // Auto detect user language (if preferred)
  useEffect(() => {
    const userLanguage = navigator.language.includes('he') ? 'he' : 'en';
    setLanguage(userLanguage);
  }, []);

  useEffect(() => {
    if (!isFetching.current) {
      isFetching.current = true;

      const fetchPosts = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/v1/post`, {
            headers: { 'Content-Type': 'application/json' },
          });
          setAllPosts(response.data.data.reverse());
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
          isFetching.current = false;
        }
      };

      fetchPosts();
    }
  }, []);

  return (
    <section className="max-w-7xl mx-auto relative">
      {/* Language Switcher (flags on top right) */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          {language === 'en' ? '🇮🇱' : '🇬🇧'}
        </button>
      </div>

      <div>
        <h1
          className={`font-extrabold text-[#222328] text-[32px] ${language === 'he' ? 'text-right' : ''}`}
        >
          {texts[language].title}
        </h1>
        <p
          className={`mt-2 text-[#666e75] text-[16px] max-w-[700px] ${
            language === 'he' ? 'text-right' : ''
          }`}
        >
          {texts[language].description}
        </p>
      </div>

      <div className="mt-16">
        <FormField
          labelName={texts[language].searchPlaceholder}
          type="text"
          name="text"
          placeholder={texts[language].searchPlaceholder}
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                {texts[language].showingResults} <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchText ? (
                <RenderCards data={searchedResults} title={texts[language].noResults} />
              ) : (
                <RenderCards data={allPosts} title={texts[language].noPosts} />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
