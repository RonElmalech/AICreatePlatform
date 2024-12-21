import React from 'react';
import { useSelector } from 'react-redux';

const AIDisclaimer = () => {
  const language = useSelector((state) => state.language.language);

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100">
      <h1 className="text-3xl font-semibold mb-4">
        {language === 'he' ? 'הבהרה על אינטליגנציה מלאכותית' : 'AI Disclaimer'}
      </h1>
      <p className="mb-6">
        {language === 'he' ? 'עודכן לאחרונה: 21 בדצמבר 2024' : 'Last Updated: December 21, 2024'}
      </p>
      <p className="mb-6">
        {language === 'he' 
          ? 'MindCraft עושה שימוש באינטליגנציה מלאכותית (AI) כדי להפעיל תכונות מסוימות בשירות שלנו. אנא קרא את ההבהרה הבאה בקפידה.'
          : 'MindCraft uses artificial intelligence (AI) to power certain features within our Service. Please read the following disclaimer carefully.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '1. מגבלות האינטליגנציה המלאכותית' : '1. AI Limitations'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'בעוד שאנו שואפים לספק תגובות מדויקות ושימושיות דרך אינטליגנציה מלאכותית, המידע שנוצר על ידי האינטליגנציה המלאכותית עשוי לא להיות תמיד שלם, נכון או מתאים. המשתמשים צריכים לאמת כל מידע לפני שהם סומכים עליו.'
          : 'While we strive to provide accurate and useful responses through AI, the information generated by the AI may not always be complete, correct, or appropriate. Users should verify any information before relying on it.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '2. אין ייעוץ מקצועי' : '2. No Professional Advice'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'האינטליגנציה המלאכותית לא מיועדת לספק ייעוץ מקצועי, כולל ייעוץ משפטי, רפואי או פיננסי. מומלץ למשתמשים להיעזר במומחים מוסמכים לנושאים אלו.'
          : 'The AI is not intended to provide professional advice, including legal, medical, or financial advice. Users are encouraged to consult with qualified professionals for such matters.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '3. יצירת תוכן' : '3. Content Generation'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'האינטליגנציה המלאכותית עשויה ליצור תוכן בהתבסס על קלט שניתן על ידי המשתמשים. איננו מבטיחים את דיוקו, מקוריותו או התאמתו של התוכן שנוצר. המשתמשים אחראים לוודא שהתוכן שהם יוצרים או משתפים תואם לחוקים ולתקנות הרלוונטיות.'
          : 'The AI may generate content based on input provided by users. We do not guarantee the accuracy, originality, or appropriateness of the content generated. Users are responsible for ensuring that the content they create or share complies with all applicable laws and regulations.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '4. שימוש אתי' : '4. Ethical Use'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'אנו מעודדים שימוש אתי באינטליגנציה מלאכותית והימנעות מתוכן מזיק, פוגע או לא חוקי. המשתמשים אינם רשאים להשתמש באינטליגנציה המלאכותית כדי ליצור תוכן המפר את זכויות אחרים או מקדם פעילויות בלתי חוקיות.'
          : 'We encourage ethical use of AI and the avoidance of harmful, offensive, or illegal content. Users must not use the AI to create content that violates the rights of others or promotes illegal activities.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '5. איסוף נתונים' : '5. Data Collection'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'תוכן שנוצר על ידי אינטליגנציה מלאכותית עשוי להתאחסן או להירשם לשם שיפור השירות. עם זאת, אנו לא אוספים נתונים אישיים רגישים אלא אם כן הוספקו על ידי המשתמש במפורש.'
          : 'AI-generated content may be stored or logged for the purpose of improving the service. However, we do not collect sensitive personal data unless explicitly provided by the user.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '6. שינויים בשירותי אינטליגנציה מלאכותית' : '6. Changes to AI Services'}
      </h2>
      <p className="mb-14">
        {language === 'he' 
          ? 'אנו עשויים לעדכן או לשנות את שירותי האינטליגנציה המלאכותית בכל זמן. שינויים אלה יתעדכנו בשירות, והמשתמשים צריכים לעיין בתנאים באופן תקופתי.'
          : 'We may update or modify the AI services at any time. These changes will be reflected in the Service, and users should review the terms periodically.'
        }
      </p>
      
    </div>
  );
};

export default AIDisclaimer;