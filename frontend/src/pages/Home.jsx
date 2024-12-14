import React, { useState, useEffect, useRef } from 'react';
import { Loader, Card, FormField } from '../components';
import axios from 'axios';

const texts = {
  en: {
    title: "Welcome to Mind Craft AI: Unleash Your Creativity",
    description:
      "Explore Mind Craft AI, your hub for creativity and innovation. Generate stunning AI art, browse the community feed, and share your imagination with others.",
    searchPlaceholder: "Search posts by name or prompt",
    noResults: "NO SEARCH RESULTS FOUND",
    noPosts: "NO POSTS AVAILABLE",
    showingResults: "Displaying results for",
    createImage: "Create AI-Generated Images",
    communityFeed: "Explore the Community Feed",
    createImageDescription: "Generate stunning AI-powered artworks tailored to your imagination",
    communityFeedDescription: "Discover and engage with creations from our vibrant community",
  },
  he: {
    title: "ברוכים הבאים ל-Mind Craft AI: שחררו את היצירתיות שלכם",
    description:
      "גלו את Mind Craft AI, המרכז שלכם ליצירתיות וחדשנות. צרו אמנות מדהימה בבינה מלאכותית, עיינו בפיד הקהילה ושתפו את הדמיון שלכם עם אחרים.",
    searchPlaceholder: "חפש פוסטים לפי שם או תיאור",
    noResults: "לא נמצאו תוצאות חיפוש",
    noPosts: "אין פוסטים זמינים",
    showingResults: "מציג תוצאות עבור",
    createImage: "צור תמונות מבוססות בינה מלאכותית",
    communityFeed: "חקור את פיד הקהילה",
    createImageDescription: "צרו יצירות אמנות מדהימות המבוססות על הדמיון שלכם",
    communityFeedDescription: "גלו ותתחברו עם יצירות מהקהילה המגוונת שלנו",
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
    <section className="home-container container mx-auto text-white min-h-screen px-4 py-8 w-full">
      <div className="flex flex-col items-center text-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-bold mb-4">{texts[language].title}</h1>
        <p className="text-lg max-w-2xl mb-8 text-gray-400">{texts[language].description}</p>
      </div>
      <div className={`flex justify-center gap-6 mb-8 flex-wrap ${language === 'he' ? 'text-right' : ''}`}
>
        <div
          className="card bg-cyan-700 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-cyan-500/50 w-80"
          onClick={() => window.location.href = '/generate'}
        >
          <h2 className="text-2xl font-bold mb-2">{texts[language].createImage}</h2>
          <p className="text-sm">{texts[language].createImageDescription}</p>
        </div>

        <div
          className="card bg-cyan-700 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-cyan-500/50 w-80"
          onClick={() => window.location.href = '/community'}
        >
          <h2 className="text-2xl font-bold mb-2">{texts[language].communityFeed}</h2>
          <p className="text-sm">{texts[language].communityFeedDescription}</p>
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

      <div className="card-section grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-full col-span-full">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2
                className={`text-xl font-bold text-gray-300 col-span-full mb-4 ${language === 'he' ? 'text-right' : ''} break-words whitespace-normal`}
                dir={language === 'he' ? 'rtl' : 'ltr'}
              >
                {texts[language].showingResults}{' '}
                <span className="highlight text-cyan-400">{searchText}</span>
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