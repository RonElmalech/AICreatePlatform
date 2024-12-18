import React from 'react';

const texts = {
  en: {
    title: "Welcome to Mind Craft AI: Unleash Your Creativity",
    description:
      "Mind Craft AI is a creative community where you can generate, share, and explore AI-powered images. Join the vibrant community of creators, upload your unique artwork, and download stunning AI-generated images.",
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
      "Mind Craft AI הוא קהילת יצירה בה תוכלו ליצור, לשתף ולגלות תמונות מבוססות בינה מלאכותית. הצטרפו לקהילה המגוונת של יוצרות ויוצרים, העלו את יצירותיכם הייחודיות והורידו תמונות מדהימות שנוצרו בעזרת בינה מלאכותית.",
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

const Home = ({ language }) => {
  return (
    <section className="home-container container mx-auto text-white min-h-screen px-4 py-8 w-full">
      <div className="flex flex-col items-center text-center" dir={language === 'he' ? 'rtl' : 'ltr'}>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4">{texts[language].title}</h1>
        <p className="text-xs sm:text-sm md:text-md lg:text-lg max-w-2xl mb-8 text-gray-400">
          {texts[language].description}
        </p>
      </div>
  
      <div className={`flex justify-center gap-6 mb-8 flex-wrap ${language === 'he' ? 'text-right' : ''}`}>
        <div
          className="card bg-cyan-700 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-cyan-500/50 w-full sm:w-80"
          onClick={() => window.location.href = '/generate'}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">{texts[language].createImage}</h2>
          <p className="text-xs sm:text-sm md:text-md lg:text-lg">{texts[language].createImageDescription}</p>
        </div>

        <div
          className="card bg-cyan-700 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-cyan-500/50 w-full sm:w-80"
          onClick={() => window.location.href = '/community'}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">{texts[language].communityFeed}</h2>
          <p className="text-xs sm:text-sm md:text-md lg:text-lg">{texts[language].communityFeedDescription}</p>
        </div>
      </div>
    </section>
  );
};

export default Home;
