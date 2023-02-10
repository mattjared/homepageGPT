#!/usr/bin/node
import fetch from 'node-fetch';
import fs from 'fs';
// import path from "path";

const handler = async function() {
  let data;
  try {
    const response = await fetch('http://localhost:3000/api/generate');
    data = await response.text();  
  } catch (error) {
    console.log(error);
  }
  const dataToString = data.toString();
  fs.appendFile('./my-app/data.js', dataToString, (err) => {
    if (err) throw err;
    console.log("saved");
  })
  
}

handler();

// fs.mkdir('my-new-site', function() {});

// const dirPath = path.join(__dirname, "my-app");
// process.chdir(dirPath);

// const { exec } = require("child_process");

// const response = fetch("https://localhost:/api/generate", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     prompt,
//   }),
// });
// console.log("Edge function returned.");
// if (!response.ok) {
//   throw new Error(response.statusText);
// }
// console.log(response);

// This data is a ReadableStream
// const data = response.body;
// if (!data) {
//   return;
// }

// writeFile function with filename, content and callback function
// fs.writeFile('newfile.txt', 'Learn Node FS module', function (err) {
//   if (err) throw err;
//   console.log('File is created successfully.');
// });

// "start": "CURL http://localhost:3000/api/generate"