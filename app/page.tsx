"use client";
import { Hero } from "@/components/Hero";
import { LandingPage } from "../components/LandingPage";

export default function Home() {
  return (
    <main>
      <Hero />
      <hr className="w-full border-t-2 border-sol-green my-2" />

      <div className="flex justify-center w-full min-h-screen">
        <LandingPage />
      </div>
    </main>
  );
}
