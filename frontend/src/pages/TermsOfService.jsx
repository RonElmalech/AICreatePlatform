import React from 'react';
import { useSelector } from 'react-redux';

const TermsOfService = () => {
  const language = useSelector((state) => state.language.language);

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100">
      <h1 className="text-3xl font-semibold mb-4">
        {language === 'he' ? 'תנאי שימוש' : 'Terms of Service'}
      </h1>
      <p className="mb-6">
        {language === 'he' ? 'עודכן לאחרונה: 21 בדצמבר 2024' : 'Last Updated: December 21, 2024'}
      </p>
      <p className="mb-6">
        {language === 'he' 
          ? 'ברוך הבא ל-MindCraft. בשימוש בשירותים שלנו, אתה מסכים לתנאים הבאים. אנא קרא אותם בקפידה.'
          : 'Welcome to MindCraft. By using our services, you agree to the following terms. Please read them carefully.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '1. קבלת תנאים' : '1. Acceptance of Terms'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'על ידי גישה לשירותים המוצעים על ידי MindCraft ("השירות"), אתה מסכים לעמוד בתנאים אלו ובחוקים הרלוונטיים. אם אינך מסכים לתנאים אלו, אנא אל תשתמש בשירות.'
          : 'By accessing and using the services provided by MindCraft ("the Service"), you agree to comply with these Terms of Service and all applicable laws. If you do not agree to these terms, please do not use the Service.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '2. שינויים בתנאים' : '2. Changes to Terms'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'אנו שומרים לעצמנו את הזכות לשנות את התנאים בכל זמן. כל שינוי יפורסם בעמוד זה עם תאריך "עודכן לאחרונה" מעודכן. בהמשך השימוש בשירות לאחר ביצוע השינויים, אתה מסכים לתנאים החדשים.'
          : 'We reserve the right to modify these terms at any time. Any changes will be posted on this page with an updated "Last Updated" date. By continuing to use the Service after changes are made, you agree to the new terms.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '3. אחריות המשתמשים' : '3. User Responsibilities'}
      </h2>
      <ul className="list-disc pl-6 mb-6">
        <li>
          {language === 'he' ? 'השתמש בשירות בצורה חוקית.' : 'Use the Service in a lawful manner.'}
        </li>
        <li>
          {language === 'he' ? 'אל תעלה או תעביר תוכן מזיק, לא חוקי או פוגע.' : 'Not upload or transmit any harmful, illegal, or offensive content.'}
        </li>
        <li>
          {language === 'he' ? 'שמור על סודיות מידע החשבון שלך.' : 'Maintain the confidentiality of your account information.'}
        </li>
        <li>
          {language === 'he' ? 'כבד את זכויות המשתמשים האחרים.' : 'Respect the rights of other users.'}
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '4. בעלות על תוכן' : '4. Content Ownership'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'כל תוכן שנוצר באמצעות השירות שייך למשתמש שיצר אותו. עם זאת, בשימוש בשירות אתה מעניק לנו רישיון לא בלעדי, עולמי וללא תמלוגים להשתמש, לשנות ולהפיץ את התוכן לצורך מתן השירות.'
          : 'All content created through the Service is owned by the user who created it. However, by using the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and distribute content for the purposes of providing the Service.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '5. פרטיות' : '5. Privacy'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'השימוש שלך בשירות כפוף למדיניות הפרטיות שלנו, שמסבירה כיצד אנו אוספים ומשתמשים במידע האישי שלך.'
          : 'Your use of the Service is governed by our Privacy Policy, which explains how we collect and use your personal information.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '6. הגבלת אחריות' : '6. Limitation of Liability'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'MindCraft אינה אחראית לכל נזק ישיר, עקיף, תוצאתי או מקרי שנגרם כתוצאה משימושך בשירות.'
          : 'MindCraft is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '7. סיום' : '7. Termination'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? '.אנו שומרים לעצמנו את הזכות להפסיק או לסיים את הגישה שלך לשירות אם תפר את תנאי השימוש'
          : 'We reserve the right to suspend or terminate your access to the Service if you violate these Terms of Service.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '8. דין וסמכות שיפוטית' : '8. Governing Law'}
      </h2>
      <p className="mb-14">
        {language === 'he' 
          ? '.תנאי השימוש אלו כפופים לחוקי ישראל. כל סכסוך ייפתר בבתי המשפט של ישראל'
          : 'These Terms of Service are governed by the laws of Israel. Any disputes will be resolved in the courts of Israel.'
        }
      </p>
      
    </div>
  );
};

export default TermsOfService;
