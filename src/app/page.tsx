// import SlowComponent from "@/components/slow";
// import { Suspense } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link
        href="/chat"
        className="text-2xl font-bold text-blue-500 hover:text-blue-700"
      >
        Chat
      </Link>
    </main>
  );
}
