export const POST = async (req: Request) => {
  const data = await req.json();

  console.log(data);
  return new Response("OK");
};
