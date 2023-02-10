import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (): Promise<Response> => {
  // const { prompt } = (await req.json()) as {
  //   prompt?: string;
  // };

  // if (!prompt) {
  //   return new Response("No prompt in the request", { status: 400 });
  // }

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt: `help me write copy for my software product which serves paralegals by writing a short captivating headline with no more than 5 words, then write 2 short sentences, then write 5 paragraphs"

Desired format: 
{
  headline: {headline},
  subheader: [{sentences}],
  copy: [{paragraph1}, {paragraph2}, {paragraph3}, {paragraph4}]
}`,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
