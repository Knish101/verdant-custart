// functions/generate.js

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function (event, context) {
  const query = event.queryStringParameters.topic;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing topic" }),
    };
  }

  const apiKey = "c049de4ae4e2234976dedfb5646e6d60120b1b31a2cfc0de9df5d0131f0321ad";
  const serpUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=3`;

  try {
    const serpResponse = await fetch(serpUrl);
    const serpData = await serpResponse.json();

    const snippets = serpData.organic_results
      ?.map((r) => r.snippet)
      .filter(Boolean)
      .join("\n\n");

    const content = `Here’s real-time content generated from live data:\n\n${snippets || "No snippets found."}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Fetch error",
        details: err.message,
      }),
    };
  }
};
