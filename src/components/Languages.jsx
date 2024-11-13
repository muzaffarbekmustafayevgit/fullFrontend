import React, { useState } from 'react';
function Languages() {
    const [language, setLanguage] = useState('en'); 

    const handleLanguageChange = (event) => {
      setLanguage(event.target.value);
    };
  
    return (
      <div className='bg-transparent'>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="language-select dark:bg-gray-800  "
        >
          <option value="uz" >O'zbekcha</option>
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    );
}

export default Languages
