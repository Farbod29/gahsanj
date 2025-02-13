import Document, { Html, Head, Main, NextScript } from 'next/document';
import Image from 'next/image';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Import your custom fonts here */}
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='anonymous'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=YOUR_FONT:ital,wght@0,400;0,700;1,400;1,700&display=swap'
            rel='stylesheet'
          />
          {/* Other head tags as needed */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
