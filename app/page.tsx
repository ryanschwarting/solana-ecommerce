"use client";
import { Hero } from "@/components/Hero";
import { LandingPage } from "../components/LandingPage";
import { NavBar } from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <div className="py-4">
        <NavBar />
      </div>
      <Hero />
      <hr className="w-full border-t-2 border-sol-green my-2" />
      <div className="flex justify-center w-full min-h-screen">
        <LandingPage />
      </div>
      <Footer />
    </main>
  );
}
