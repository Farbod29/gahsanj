// src/pages/calculator.tsx
'use client';
import { FC } from 'react';

const Calculator: FC = () => {
  return (
    <div>
      <iframe
        id='myIframe'
        src='https://okcalc.com/fa' // Ensure this URL is served over HTTPS
        width='700'
        height='420'
        title='Online Calculator'
        frameBorder='0'
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Calculator;
