import React, { useState, useEffect, useRef } from 'react';
import { Loader, Card, FormField } from '../components';
import axios from 'axios';
import LanguageSwitcher from '../components/LanguageSwitcher';

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
    <h2 className="mt-5 font-bold text-blue-500 text-xl uppercase">{title}</h2>
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
    <section className="max-w-7xl mx-auto py-8 px-4 bg-gray-900 text-white">
      <div>
        <h1
          className={`font-extrabold text-4xl mb-4 ${
            language === 'he' ? 'text-right' : ''
          }`}
        >
          {texts[language].title}
        </h1>
        <p
          className={`text-lg text-gray-300 max-w-4xl mb-6 ${
            language === 'he' ? 'text-right' : ''
          }`}
        >
          {texts[language].description}
        </p>
      </div>

      <div className="mt-8">
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
              <h2 className="font-medium text-gray-400 text-xl mb-3">
                {texts[language].showingResults} <span className="text-white">{searchText}</span>
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
