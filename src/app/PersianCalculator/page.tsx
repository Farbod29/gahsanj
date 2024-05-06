// src/pages/calculator.tsx
'use client';

import { useEffect } from 'react';

const Calculator = () => {
  useEffect(() => {
    // Function to replace English numbers with Persian numbers
    const replaceNumbersWithPersian = (text) => {
      const persianNumbers = {
        '0': '۰',
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹',
      };

      return text.replace(/[0-9]/g, (match) => persianNumbers[match] || match);
    };

    const receiveMessage = (event) => {
      if (event.origin === 'https://okcalc.com') {
        try {
          const iframeContent =
            document.getElementById('myIframe').contentWindow.document;
          const elementsWithNumbers =
            iframeContent.querySelectorAll('*:not(script)');

          elementsWithNumbers.forEach((element) => {
            if (element.childNodes && element.childNodes.length > 0) {
              element.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                  node.textContent = replaceNumbersWithPersian(
                    node.textContent
                  );
                }
              });
            }
          });
        } catch (error) {
          console.error('Cross-origin interaction failed:', error);
        }
      }
    };

    window.addEventListener('message', receiveMessage);

    return () => {
      window.removeEventListener('message', receiveMessage);
    };
  }, []);

  return (
    <div>
      <iframe
        id="myIframe"
        src="https://okcalc.com/fa/"
        width="600"
        height="420"
        title="Persian Calculator"
      ></iframe>
    </div>
  );
};

export default Calculator;
