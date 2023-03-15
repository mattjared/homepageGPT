import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Build a homepage in seconds using AI"
          />
          <meta
            property="og:description"
            content="Build a homepage in seconds using AI"
          />
          <meta property="og:title" content="HomepageGPT" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="HomepageGPT" />
          <meta
            name="twitter:description"
            content="Build a homepage in seconds using AI"
          />
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
