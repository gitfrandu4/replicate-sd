export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  const response = await fetch(
    'https://api.replicate.com/v1/predictions/' + params.id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.status !== 200) {
    let error = await response.json();
    const errorResponse = new Response(
      JSON.stringify({ detail: error.detail }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return errorResponse;
  }

  const prediction = await response.json();

  const newResponse = new Response(JSON.stringify({ ...prediction }), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  });

  return newResponse;
}
