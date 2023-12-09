import { NextRequest } from "next/server";

export async function POST(request: Request) {

  const res = await request.json();
  const prompt = res.prompt;

  console.log({prompt});

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/sdxl
      version:
        '2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2',

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: prompt },
    }),
  });

  console.log({response});

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();

  console.log({prediction});
  
  res.statusCode = 201;
  
  return Response.json(prediction);
}
