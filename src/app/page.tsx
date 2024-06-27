import SlowComponent from "@/components/slow";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </main>
  );
}
