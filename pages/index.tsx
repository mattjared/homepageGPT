import DOMPurify from 'dompurify'
import LoadingDots from "../components/LoadingDots";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from 'next/link';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");  
  const [market, setMarket] = useState("");
  const [generatedBios, setGeneratedBios] = useState<string>("");
  const year = new Date().getFullYear();
  const [newSiteText, setnewSiteText ] = useState("");
  const [showFooter, setShowFooter] = useState(false);
  const cdn = "https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css";
  const columns = 3;
  const [showCopied, setShowCopied] = useState(false);
  const [colorway, setColorWay] = useState("");
  const prompt = `
    write html and website content for a business that specializes in ${bio} for ${market}. The page should be styled with tailwindcss (using this cdn ${cdn}). The page should contain a hero section with a relevant headline about ${bio} to the left or right and a large call to action button opposite. After that there should be a section with ${columns} columns of paragraphs containing relevant content for our business that does ${bio} for ${market}. Finally given space and time there should be a call to action button or a contact form on the opposite side of the button from before with a relevant ${bio} picture sourced from unsplash.com opposite. Any colors used should be ${colorway} or complement it in some way. The copyright year in the footer should be the ${year}.
  `
  const bioRef = useRef<null | HTMLDivElement>(null);
  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(generatedBios)
  })
  const generateBio = async (e: any) => {
    e.preventDefault();
    setnewSiteText("🚀 Deploy to the web!");
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
    setShowFooter(true);
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
          <h3 className="text-3xl border-b pb-4 mb-10 font-black text-slate-900">🧑‍🚀 Fill out these prompts: </h3>
          <div className="flex mt-5 items-center space-x-3">
            <p className="text-left font-medium">
              What does your company do?{" "}
            </p>
          </div>
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            type="text"
            className="w-full px-4 h-10 rounded border shadow-sm focus:border-black focus:ring-black my-2 bg-gray-50"
            placeholder={
              "e.g. SaaS. AI. Database. Project management. Troll farm."
            }
          />
          <div className="flex mt-5 items-center space-x-3">
            <p className="text-left font-medium">
              What market do you serve?{" "}
            </p>
          </div>
          <input
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            type="text"
            className="w-full px-4 h-10 rounded border shadow-sm focus:border-black focus:ring-black my-2 bg-gray-50"
            placeholder={
              "e.g. Developers. Product managers. Lawyers. Millenials."
            }
          />
          <div className="flex mt-5 items-center space-x-3">
            <p className="text-left font-medium">
              What is your brand color?{" "}
            </p>
          </div>
          <input
            value={colorway}
            onChange={(e) => setColorWay(e.target.value)}
            type="text"
            className="w-full px-4 h-10 rounded border shadow-sm focus:border-black focus:ring-black my-2 bg-gray-50"
            placeholder={
              "e.g. blue"
            }
          />
          {!loading && !newSiteText && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your site &rarr;
            </button>
          )}
        </div>
      </div>
      {newSiteText && (
        <div className="px-10 pb-10 flex flex-col mx-auto max-w-3xl">
          <h3 className="text-3xl font-black text-slate-900 pb-4 mb-10 border-b" ref={bioRef}>🚀 Time for blast off!</h3>
          <p className="text-left font-medium mb-3">0️⃣ Watch your site come to life below</p>
          <p className="text-left font-medium mb-3">1️⃣ Copy all your code</p>
          <p className="text-left font-medium mb-3">2️⃣ Paste that into an index.html file</p>
          <p className="text-left font-medium mb-3">3️⃣ Upload it to <Link href="https://vercel.com" className='underline' target="_blank">Vercel</Link></p>
        </div>
      )}
      {showFooter && (
        <div className="flex flex-col mx-auto max-w-3xl mb-10">
          <button 
          onClick={() => {
            navigator.clipboard.writeText(generatedBios)
            setShowCopied(true);
          }}
          className="bg-black rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
          >
            Copy Code
          </button>
          {showCopied && (
            <>
              <p className="text-center mt-3 font-medium text-xs">code copied to clipboard</p>
            </>
          )}
        </div>
      )}
      {generatedBios && (
        <div className="mt-1">
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
      {showFooter && (
        <div className="pt-3 mt-4 flex flex-col mx-auto max-w-3xl">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Home;