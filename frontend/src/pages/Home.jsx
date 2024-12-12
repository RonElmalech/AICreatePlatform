import React, { useState, useEffect, useRef } from 'react';
import { Loader, Card, FormField } from '../components';
import axios from 'axios';

const texts = {
  en: {
    title: "Welcome to Mind Craft AI: Unleash Your Creativity",
    description:
      "Mind Craft AI is a community where creativity meets innovation. Explore a collection of stunning AI-generated artworks, connect, and share your imagination.",
    searchPlaceholder: "Search posts by name or prompt",
    noResults: "NO SEARCH RESULTS FOUND",
    noPosts: "NO POSTS AVAILABLE",
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

const RenderCards = ({ data, noResultsText, language }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} language={language} />);
  }

  return (
    <div className="flex justify-center items-center w-full col-span-full">
      <h2 className="text-xl font-bold text-cyan-500 whitespace-nowrap">
        {noResultsText}
      </h2>
    </div>
  );
};

const Home = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchText, setSearchText] = useState('');
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
    if (!isFetching.current) {
      isFetching.current = true;

      const fetchPosts = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/api/v1/post', {
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
    <section className="home-container container">
      <div className="flex justify-between items-center">
      <div className="w-full" dir={language === 'he' ? 'rtl' : 'ltr'}>
  <h1
    className={`title text-3xl font-bold text-gray-800 ${language === 'he' ? 'text-right' : ''}`}
  >
    {texts[language].title}
  </h1>

  <p
    className={`description text-lg text-gray-600 px-1 max-w-3xl pb-8 pt-3 ${language === 'he' ? 'text-right' : ''}`}
    style={language === 'he' ? { textAlign: 'right' } : {}}
  >
    {texts[language].description}
  </p>
</div>

      </div>

      <div className="px-1 mb-4 w-full sm:w-auto">
        <FormField
          labelName={texts[language].searchPlaceholder}
          name="text"
          placeholder={texts[language].searchPlaceholder}
          value={searchText}
          handleChange={handleSearchChange}
          language={language}  
          autocomplete="off"
          maxLength={50}
        />
      </div>

      <div className="card-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-full col-span-full">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2
              className={`text-xl font-bold text-gray-500 col-span-full mb-4 ${language === 'he' ? 'text-right' : ''} break-words whitespace-normal`}
              dir={language === 'he' ? 'rtl' : 'ltr'}
            >
              {texts[language].showingResults}{' '}
              <span className="highlight">{searchText}</span>
            </h2>
            
            )}

            {searchText ? (
              <RenderCards
                data={searchedResults}
                noResultsText={texts[language].noResults}
                language={language}
              />
            ) : (
              <RenderCards
                data={allPosts}
                noResultsText={texts[language].noPosts}
                language={language}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
