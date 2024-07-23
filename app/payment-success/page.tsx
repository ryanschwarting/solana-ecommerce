// "use client";
// import React from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { useShoppingCart } from "@/context/shoppingCart";
// import Image from "next/image";
// import { assets } from "@/constants/images"; // Import the assets

// export default function PaymentSuccess({
//   searchParams: { amount },
// }: {
//   searchParams: { amount: string };
// }) {
//   const { cartItems, clearCart } = useShoppingCart();

//   const handleKeepShopping = () => {
//     clearCart();
//   };

//   return (
//     <main className="flex justify-center items-center min-h-screen max-w-6xl mx-auto text-white text-center bg-black">
//       <div className="mb-10">
//         <h1 className="text-4xl font-extrabold mb-2 text-sol-green py-10">
//           Order submitted!
//         </h1>
//         <h2 className="text-2xl">Thank you so much for your order!</h2>
//         <h2 className="text-2xl py-5">Order ID:</h2>

//         <div className="bg-gray-900 p-2 rounded-xl text-sol-green mt-5 text-2xl font-bold">
//           Total Spent: ${amount}
//         </div>

//         <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
//           {cartItems.map((cartItem) => {
//             const matchingAsset = assets.find(
//               (asset) => asset.id === cartItem.id
//             );
//             if (!matchingAsset) return null;

//             return (
//               <div
//                 key={cartItem.id}
//                 className="flex flex-col items-center gap-4"
//               >
//                 <Image
//                   src={matchingAsset.image}
//                   width={300}
//                   height={300}
//                   alt={matchingAsset.name}
//                   className="w-50 h-50 object-cover rounded-xl"
//                 />
//                 <div className="text-xl font-bold">{matchingAsset.name}</div>
//                 <div className="text-lg">Quantity: {cartItem.quantity}</div>
//               </div>
//             );
//           })}
//         </div>

//         <Link href="/">
//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             onClick={handleKeepShopping}
//             className="mt-10 bg-gray-900 text-sol-green 0 p-3 rounded-xl font-bold text-xl"
//           >
//             Click here to keep shopping
//           </motion.button>
//         </Link>
//       </div>
//     </main>
//   );
// }
"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useShoppingCart } from "@/context/shoppingCart";
import Image from "next/image";
import { assets } from "@/constants/images"; // Import the assets

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const { cartItems, clearCart } = useShoppingCart();

  const handleKeepShopping = () => {
    clearCart();
  };

  const isMultipleItems = cartItems.length > 1;

  return (
    <main className="flex justify-center items-center min-h-screen max-w-6xl mx-auto text-white text-center bg-black">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-sol-green pb-5">
          Order submitted!
        </h1>
        <h2 className="text-2xl">Thank you so much for your order!</h2>
        <h2 className="text-2xl py-5">Order ID:</h2>

        <div className="bg-gray-900 p-2 rounded-xl text-sol-green mt-5 text-2xl font-bold">
          Total Spent: ${amount}
        </div>

        <div
          className={`mt-10 gap-4 ${
            isMultipleItems
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "flex flex-col items-center"
          }`}
        >
          {cartItems.map((cartItem) => {
            const matchingAsset = assets.find(
              (asset) => asset.id === cartItem.id
            );
            if (!matchingAsset) return null;

            return (
              <div
                key={cartItem.id}
                className="flex flex-col items-center gap-4"
              >
                <Image
                  src={matchingAsset.image}
                  width={300}
                  height={300}
                  alt={matchingAsset.name}
                  className="w-50 h-50 object-cover rounded-xl"
                />
                <div className="text-xl font-bold">{matchingAsset.name}</div>
                <div className="text-lg">Quantity: {cartItem.quantity}</div>
              </div>
            );
          })}
        </div>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleKeepShopping}
            className="mt-10 bg-gray-900 text-sol-green 0 p-3 rounded-xl font-bold text-xl"
          >
            Click here to keep shopping
          </motion.button>
        </Link>
      </div>
    </main>
  );
}
