import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Card, FormField, Loader } from '../components';

const texts = {
  en: {
    title: "Explore the Mind Craft AI Community Feed",
    description:
      "Dive into the Mind Craft AI community feed, where creativity meets collaboration. Browse through AI-generated artworks, engage with fellow creators, and share your own unique creations.",
    searchPlaceholder: "Search community posts",
    noResults: "No results found for your search",
    noPosts: "No posts available in the feed",
  },
  he: {
    title: "חקור את פיד הקהילה של Mind Craft AI",
    description:
      "היכנסו לפיד הקהילה של Mind Craft AI, מקום שבו יצירתיות נפגשת עם שיתוף פעולה. עיינו ביצירות אמנות מבוססות בינה מלאכותית, התחברו עם יוצרים אחרים, ושתפו את היצירות הייחודיות שלכם.",
    searchPlaceholder: "חפש פוסטים בקהילה",
    noResults: "לא נמצאו תוצאות עבור החיפוש שלך",
    noPosts: "אין פוסטים זמינים בפיד",
  },
};

const RenderCards = ({ data, noResultsText, language, lastPostRef }) => {
  if (data?.length > 0) {
    return data.map((post, index) => {
      // Apply the `lastPostRef` to the last element
      return (
        <div ref={index === data.length - 1 ? lastPostRef : null} key={post._id}>
          <Card {...post} language={language} />
        </div>
      );
    });
  }

  return (
    <div className="flex justify-center items-center w-full col-span-full">
      <h2 className="text-xl font-bold text-cyan-500 whitespace-nowrap">
        {noResultsText}
      </h2>
    </div>
  );
};

const Community = ({ language }) => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const observer = useRef();

  const fetchPosts = async (searchQuery = '', pageNumber = 1, reset = false) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/post?page=${pageNumber}&limit=10&searchText=${searchQuery}`
      );

      const { data, totalPages } = response.data;

      setAllPosts((prev) => (reset ? data : [...prev, ...data]));
      setHasMore(pageNumber < totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(searchText, 1, true); // Reset when search changes
  }, [searchText]);

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPosts(searchText, page + 1);
    setPage((prevPage) => prevPage + 1);
  }, [loading, hasMore, searchText, page]);

  const lastPostRef = useCallback((node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMorePosts]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(1); // Reset to the first page for new searches
    setAllPosts([]);
  };

  return (
    <section className="home-container container mx-auto min-h-screen px-4 py-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="w-full" dir={language === 'he' ? 'rtl' : 'ltr'}>
          <h1
            className={`title text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-100 ${
              language === 'he' ? 'text-right' : ''
            }`}
          >
            {texts[language].title}
          </h1>
          <p
            className={`description text-xs sm:text-sm md:text-md lg:text-lg text-gray-400 px-1 max-w-3xl pb-8 pt-3 ${
              language === 'he' ? 'text-right' : ''
            }`}
          >
            {texts[language].description}
          </p>
        </div>
      </div>

   {/* Search Field */}
<div className="px-1 mb-4" >
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


      {/* Cards */}
      <div className="card-section grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {searchText ? (
          <RenderCards
            data={allPosts}
            noResultsText={texts[language].noResults}
            language={language}
          />
        ) : (
          <>
            <RenderCards
              data={allPosts}
              noResultsText={texts[language].noPosts}
              language={language}
              lastPostRef={lastPostRef}
            />
            {loading && (
              <div className="flex justify-center items-center h-full col-span-full">
                <Loader />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Community;
