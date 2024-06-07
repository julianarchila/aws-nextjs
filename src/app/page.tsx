import Chat from "./components/chat";

export default function Home() {
  console.log("log from home page");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Chat />
    </main>
  );
}
