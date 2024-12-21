import React from 'react';
import { useSelector } from 'react-redux';

// Texts for different languages
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
    chatWithAI: "Chat with AI",
    chatWithAIDescription: "Engage in creative conversations with AI and explore new ideas",
    editImage: "Edit Images",
    editImageDescription: "Enhance your AI-generated images with creative edits",
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
    chatWithAI: "שוחח עם בינה מלאכותית",
    chatWithAIDescription: "שוחחו עם בינה מלאכותית וגלו רעיונות יצירתיים חדשים",
    editImage: "ערוך תמונות",
    editImageDescription: "שדרגו את התמונות שנוצרו על ידי בינה מלאכותית עם עריכות יצירתיות",
  },
};

const Home = () => {
  // Redux state
  const language = useSelector((state) => state.language.language);
  return (
    <section className={` max-w-full text-white px-4 pt-8 w-full overflow-hidden ${language === 'he' ? 'pr-4' : 'pl-4'}`}>
      {/* Title and description */}
      <div className={`flex flex-col `}>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-[#f0f0f0]">
          {texts[language].title}
        </h1>
        <p className="text-xs sm:text-sm md:text-md lg:text-lg max-w-2xl mb-8 text-gray-400">
          {texts[language].description}
        </p>
      </div>

      {/* Cards */}
      <div className={`flex gap-6 mb-8 flex-wrap `}>
        <div
          className=" card bg-[#1a1a1a] p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-blue-500/50 w-full max-w-3xl"
          onClick={() => window.location.href = '/generate'}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-[#f0f0f0]">
            {texts[language].createImage}
          </h2>
          <p className="text-xs sm:text-sm md:text-md lg:text-lg text-gray-400">
            {texts[language].createImageDescription}
          </p>
        </div>

        <div
          className="card bg-[#1a1a1a] p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-blue-500/50 w-full max-w-3xl"
          onClick={() => window.location.href = '/community'}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-[#f0f0f0]">
            {texts[language].communityFeed}
          </h2>
          <p className="text-xs sm:text-sm md:text-md lg:text-lg text-gray-400">
            {texts[language].communityFeedDescription}
          </p>
        </div>

        <div
          className="card bg-[#1a1a1a] p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-blue-500/50 w-full max-w-3xl"
          onClick={() => window.location.href = '/chat'}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-[#f0f0f0]">
            {texts[language].chatWithAI}
          </h2>
          <p className="text-xs sm:text-sm md:text-md lg:text-lg text-gray-400">
            {texts[language].chatWithAIDescription}
          </p>
        </div>

        <div
          className="mb-16 card bg-[#1a1a1a] p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-blue-500/50 w-full max-w-3xl"
          onClick={() => window.location.href = '/edit'}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-[#f0f0f0]">
            {texts[language].editImage}
          </h2>
          <p className="text-xs sm:text-sm md:text-md lg:text-lg text-gray-400 ">
            {texts[language].editImageDescription}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;
