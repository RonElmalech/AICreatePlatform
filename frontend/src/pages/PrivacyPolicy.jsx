import React from 'react';
import { useSelector } from 'react-redux';

const PrivacyPolicy = () => {
  const language = useSelector((state) => state.language.language);

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100">
      <h1 className="text-3xl font-semibold mb-4">
        {language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
      </h1>
      <p className="mb-6">
        {language === 'he' ? 'עודכן לאחרונה: 21 בדצמבר 2024' : 'Last Updated: December 21, 2024'}
      </p>
      <p className="mb-6">
        {language === 'he' 
          ? 'MindCraft ("אנחנו", "שלנו") מעריכה את פרטיותך. מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך כאשר אתה משתמש בשירותים שלנו.'
          : 'MindCraft ("we," "us," "our") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '1. המידע שאנו אוספים' : '1. Information We Collect'}
      </h2>
      <ul className="list-disc pl-6 mb-6">
        <li>
          <strong>{language === 'he' ? 'מידע אישי' : 'Personal Information'}</strong>: 
          {language === 'he' 
            ? 'מידע שאתה מספק כאשר אתה יוצר חשבון (למשל, שם, כתובת אימייל).' 
            : 'Information you provide when creating an account (e.g., name, email address).'
          }
        </li>
        <li>
          <strong>{language === 'he' ? 'נתוני שימוש' : 'Usage Data'}</strong>: 
          {language === 'he' 
            ? 'מידע על איך אתה משתמש בשירותים שלנו (למשל, אינטראקציות עם הפלטפורמה, כתובת IP, סוג דפדפן).' 
            : 'Information about how you use our services (e.g., interactions with the platform, IP address, browser type).'
          }
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '2. איך אנו משתמשים במידע שלך' : '2. How We Use Your Information'}
      </h2>
      <ul className="list-disc pl-6 mb-6">
        <li>{language === 'he' ? 'לספק ולשפר את השירות.' : 'To provide and improve the Service.'}</li>
        <li>{language === 'he' ? 'לתקשר איתך לגבי עדכונים או שינויים בשירות.' : 'To communicate with you regarding updates or changes to the Service.'}</li>
        <li>{language === 'he' ? 'למלא חובות חוקיות.' : 'To comply with legal obligations.'}</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '3. אבטחת מידע' : '3. Data Security'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'אנו נוקטים אמצעים סבירים כדי להגן על המידע האישי שלך מפני גישה או גילוי לא מורשים. עם זאת, אין אפשרות להבטיח שידור נתונים דרך האינטרנט יהיה מאובטח לחלוטין.'
          : 'We take reasonable precautions to protect your personal information from unauthorized access or disclosure. However, no data transmission over the internet can be guaranteed to be completely secure.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '4. קובצי עוגיה' : '4. Cookies'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'אנו עשויים להשתמש בעוגיות כדי לשפר את חווית המשתמש שלך בפלטפורמה שלנו. עוגיות הן קבצים קטנים שנשמרים על המכשיר שלך ומסייעים לנו לזכור את ההעדפות שלך ולשפר את פונקציונליות השירות.'
          : 'We may use cookies to enhance your experience on our platform. Cookies are small files stored on your device that help us remember your preferences and improve the functionality of the Service.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '5. שיתוף המידע שלך' : '5. Sharing Your Information'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'אנו לא משתפים את המידע האישי שלך עם צדדים שלישיים, אלא במקרים הבאים:'
          : 'We do not share your personal information with third parties except in the following cases:'
        }
      </p>
      <ul className="list-disc pl-6">
        <li>{language === 'he' ? 'לצורך מילוי חובות חוקיות.' : 'To comply with legal obligations.'}</li>
        <li>{language === 'he' ? 'להגנה על הזכויות, רכוש, ובטיחות של MindCraft, המשתמשים שלה או אחרים.' : 'To protect the rights, property, and safety of MindCraft, its users, or others.'}</li>
      </ul>
      
      
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '7. פרטיות ילדים' : '7. Children’s Privacy'}
      </h2>
      <p className="mb-6">
        {language === 'he' 
          ? 'השירות שלנו אינו מיועד לאנשים מתחת גיל 13, ואנחנו לא אוספים מידע אישי מילדים בכוונה. אם אתה סבור שאספנו מידע מילד, אנא צור קשר מיידית.'
          : 'Our Service is not intended for individuals under the age of 13, and we do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.'
        }
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        {language === 'he' ? '8. שינויים במדיניות פרטיות' : '8. Changes to Privacy Policy'}
      </h2>
      <p className="mb-14 ">
        {language === 'he' 
          ? 'אנו עשויים לעדכן את מדיניות הפרטיות הזו מעת לעת. כל שינוי יפורסם בדף זה, עם תאריך ה"עודכן לאחרונה" המעודכן.'
          : 'We may update this Privacy Policy from time to time. Any changes will be posted on this page, with the updated "Last Updated" date.'
        }
      </p>
    </div>
  );
};

export default PrivacyPolicy;
