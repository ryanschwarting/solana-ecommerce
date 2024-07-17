"use client";
import React from "react";
import Link from "next/link";
import { useShoppingCart } from "@/context/shoppingCart";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const { clearCart } = useShoppingCart();

  const handleKeepShopping = () => {
    clearCart();
  };

  return (
    <main className="flex justify-center items-center min-h-screen max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Order submitted!</h1>
        <h2 className="text-2xl">Thank you so much for your order!</h2>
        <h2 className="text-2xl">Order ID:</h2>

        <div className="bg-white p-2 rounded-xl text-purple-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>

        <Link href="/">
          <button
            onClick={handleKeepShopping}
            className="mt-5 bg-white text-purple-500 p-3 rounded-xl font-bold"
          >
            Click here to go back home{" "}
          </button>
        </Link>
      </div>
    </main>
  );
}
