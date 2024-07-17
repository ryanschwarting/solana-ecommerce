// "use client";
// import { Hero } from "@/components/Hero";
// import { LandingPage } from "../components/LandingPage";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import CheckoutPage from "@/components/CheckoutPage";
// import convertToSubcurrency from "@/lib/convertToSubcurrency";

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
// }
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// export default function Home() {
//   const amount = 49.99;

//   return (
//     <main>
//       <div className="h-[100px] bg-blue-600">
//         <h1 className="text-black">
//           Ryan has requested <span>${amount}</span>
//         </h1>
//         <Elements
//           stripe={stripePromise}
//           options={{
//             mode: "payment",
//             amount: convertToSubcurrency(amount),
//             currency: "usd",
//           }}
//         >
//           <CheckoutPage amount={amount} />
//         </Elements>
//       </div>
//       <Hero />
//       <hr className="w-full border-t-2 border-sol-green my-2" />

//       <div className="flex justify-center w-full min-h-screen">
//         <LandingPage />
//       </div>
//     </main>
//   );
// }

"use client";
import { Hero } from "@/components/Hero";
import { LandingPage } from "../components/LandingPage";
import { NavBar } from "@/components/NavBar";

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
    </main>
  );
}
