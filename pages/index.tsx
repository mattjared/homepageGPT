import DOMPurify from 'dompurify'
import LoadingDots from "../components/LoadingDots";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");  
  const [market, setMarket] = useState("");
  const [generatedBios, setGeneratedBios] = useState<string>("");
  const year = new Date().getFullYear();
  const [newSiteText, setnewSiteText ] = useState("");
  const cdn = "https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css";
  const columns = 3;
  const colorway = "red";
  const prompt = `
    write html and website content for a business that specializes in ${bio} for ${market}. The page should be styled with tailwindcss (using this cdn ${cdn}). The page should contain a hero section with a relevant headline about ${bio}. After that there should be a section with ${columns} columns of paragraphs containing relevant content for our business that does ${bio} for ${market}. Any colors used should go with ${colorway}. The copyright year in the footer should be the ${year}.
  `
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(generatedBios)
  })
  const generateBio = async (e: any) => {
    e.preventDefault();
    setnewSiteText("New site, yo 💯!");
    scrollToBios();
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
  
  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Head>
        <title>Homepage GPT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="p-10 flex flex-col mx-auto max-w-3xl">
        <div className="w-full">
          <h3 className="text-3xl border-b pb-4 mb-10 font-black text-slate-900">Fill out these prompts ⤵️</h3>
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              1. What does your company do?{" "}
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
            <p className="text-left font-medium">
              2. What market do you serve?{" "}
            </p>
          </div>
          <textarea
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            rows={1}
            className="w-full px-4 h-20 rounded border shadow-sm focus:border-black focus:ring-black my-5 bg-gray-50"
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
      <h3 className="text-3xl font-black text-slate-900 text-center pb-4 mb-10 mt-20 border-b max-w-3xl mx-auto" ref={bioRef}>{newSiteText}</h3>
      {generatedBios && (
        <div className="mt-10">
          <div className="flex flex-row">
            <div className="text-center w-1/2">
              <button>Copy Code</button>
            </div>
            <div className="text-center w-1/2">
              <button>Deploy Site</button>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="p-10 flex flex-col w-1/2 text-gray-300 bg-gray-900">
              <div className="font-mono flex-1 max-w-100 text-small ">
                {generatedBios}
              </div>
            </div>   
            <div className="flex flex-col w-1/2">
              <div
                dangerouslySetInnerHTML={sanitizedData()}
              />
            </div>   
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;