import { headers } from "next/headers";

export async function GET(request: Request) {
  const randomNumber = Math.floor(Math.random() * 100);
  console.log({ route: request.url, randomNumber });
  return new Response(`Hello, Next.js! ${randomNumber}`);
}
