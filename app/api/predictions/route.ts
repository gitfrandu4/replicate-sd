export async function POST(request: Request) {

  const res = await request.json();
  const prompt = res.prompt;

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
        '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: prompt },
    }),
  });

  if (response.status !== 201) {
    const error = await response.json();
    const errorResponse = new Response(JSON.stringify({ detail: error.detail }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    return errorResponse;
  }

  const prediction = await response.json();

  const newResponse = new Response(JSON.stringify({...prediction}), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  });
  
  return newResponse;
}
