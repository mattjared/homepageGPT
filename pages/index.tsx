import LoadingDots from "../components/LoadingDots";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");  
  const [market, setMarket] = useState("");
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const prompt = `
    fill and complete in the following html with website copy for a company that makes ${bio} tweets targeting ${market} <html><h1>{headline}</h1><div>{more content here}</div></html>
  `
  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Homepage GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-row h-screen w-screen">
        <div className="flex-1 w-1/2 bg-orange-500">
          <div className="bg-orange-500">
            <div className="max-w-3xl w-full">
              <div className="flex mt-10 items-center space-x-3">
                <p>1</p>
                <p className="text-left font-medium">
                  What does your company do?{" "}
                </p>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={1}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                placeholder={
                  "e.g. SaaS. AI platform. Serverless database. Project management software. Troll twitter."
                }
              />
              <div className="flex mt-10 items-center space-x-3">
                <p>2</p>
                <p className="text-left font-medium">
                  What market do you serve?{" "}
                </p>
              </div>
              <textarea
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                rows={1}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                placeholder={
                  "e.g. Developers, Project managers, Construction workers, millenials. Lawyers"
                }
              />
              {!loading && (
                <button
                  className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                  onClick={(e) => generateBio(e)}
                >
                  Generate your site (content and all) &rarr;
                </button>
              )}
              {loading && (
                <button
                  className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                  disabled
                >
                  <LoadingDots color="white" style="large" />
                </button>
              )}
            </div>
            <Footer />
          </div>
        </div>
        <div className="flex-1 w-1/2 bg-blue-500">
          {generatedBios}
        </div>      
      </main>
    </div>
  );
};

export default Home;