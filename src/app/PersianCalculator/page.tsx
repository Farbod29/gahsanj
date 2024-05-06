// src/pages/calculator.tsx
'use client';
import { FC } from 'react';

const Calculator: FC = () => {
  return (
    <div>
      <iframe
        id="myIframe"
        src="https://okcalc.com/fa"
        width="600"
        height="420"
        title="Online Calculator"
        frameBorder="0" // Optional: Adds a border around the iframe. Set to "0" to have no border.
        allowFullScreen // Optional: Allow the iframe content to go full screen.
      ></iframe>
    </div>
  );
};

export default Calculator;
