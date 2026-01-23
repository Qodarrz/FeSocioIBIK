import { useState } from 'react'

const cekIsDark = () => {
    
  const [isDark, setIsDark] = useState(false);
  const theme = document.documentElement.classList.contains('dark');

  setInterval(() => {
    const currentTheme = document.documentElement.classList.contains('dark');
    if (currentTheme !== theme) {
      if (currentTheme) {
        setIsDark(true);
      } else {
        setIsDark(false);
      }
    }
  }, 300);
  return { isDark };
}

export default cekIsDark