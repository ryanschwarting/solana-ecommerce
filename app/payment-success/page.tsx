// "use client";
// import React from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { useShoppingCart } from "@/context/shoppingCart";
// import Image from "next/image";
// import { assets } from "@/constants/productData";

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
//     <main className="flex justify-center items-center min-h-screen max-w-6xl mx-auto text-white text-center bg-black my-2">
//       <div className="mb-10 bg-gray-900 p-10 w-full rounded-xl ">
//         <h1 className="text-2xl font-bold mb-2 text-sol-green pb-5 ">
//           Payment successful
//         </h1>
//         <h2 className="text-4xl font-bold">Thanks for ordering!</h2>
//         <div className="flex justify-center">
//           <h2 className="text-lg font-medium w-[500px] text-center py-4">
//             We appreciate your order, we’re currently processing it. So hang
//             tight and we’ll send you confirmation very soon!
//           </h2>
//         </div>
//         <h2 className="text-xl py-4 font-medium">
//           Order ID: <span className="text-sol-green">1425271812829</span>
//         </h2>
//         <hr className="border-t-2 border-sol-green mb-2 w-full md:w-[500px] mx-auto" />

//         <div className="mt-4 gap-4 flex flex-col items-center">
//           {cartItems.map((cartItem) => {
//             const matchingAsset = assets.find(
//               (asset) => asset.id === cartItem.id
//             );
//             if (!matchingAsset) return null;

//             return (
//               <>
//                 <div className="flex justify-between w-full md:w-[500px] px-2">
//                   <div
//                     key={cartItem.id}
//                     className="flex flex-row items-start gap-4 w-full md:w-[500px]"
//                   >
//                     <Image
//                       src={matchingAsset.image}
//                       width={300}
//                       height={300}
//                       alt={matchingAsset.name}
//                       className="w-20 h-20 object-cover rounded-xl"
//                     />
//                     <div className="flex flex-col items-start">
//                       <div className="text-xl font-bold">
//                         {matchingAsset.name}
//                       </div>
//                       <div className="text-md font-medium">
//                         Quantity: {cartItem.quantity}
//                       </div>
//                       <div className="text-md font-medium">Size</div>
//                     </div>
//                   </div>

//                   <div className="flex justify-center items-center text-xl font-medium">
//                     ${matchingAsset.price}
//                   </div>
//                 </div>
//                 <hr className="border-t-2 border-sol-green my-2 w-full md:w-[500px] mx-auto" />
//               </>
//             );
//           })}
//         </div>
//         <div className="flex flex-col w-full md:w-[500px] mx-auto">
//           <div className="flex justify-between text-white mt-4 font-medium px-2">
//             <span className="text-lg">Subtotal:</span>
//             <span className="text-xl">${amount}</span>
//           </div>
//           <div className="flex justify-between text-white mt-4 font-medium px-2">
//             <span className="text-lg">Shipping:</span>
//             <span className="text-xl">$10</span>
//           </div>
//           <hr className="border-t-2 border-sol-green my-2 w-full md:w-[500px] mx-auto" />
//           <div className="flex justify-between text-sol-green mt-2 font-bold px-2">
//             <span className="text-2xl">Total:</span>
//             <span className="text-xl">${amount}</span>
//           </div>
//         </div>

//         <Link href="/">
//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             onClick={handleKeepShopping}
//             className="mt-10 text-white 0 p-3 rounded-xl font-medium text-lg border-2 border-white hover:border-sol-green"
//           >
//             Continue shopping
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
import { assets } from "@/constants/productData";
import { useSearchParams } from "next/navigation"; // Import hook

// export default function PaymentSuccess() {
//   const { cartItems, clearCart } = useShoppingCart();
//   const searchParams = useSearchParams(); // Use hook to get URL params

//   const amount = searchParams.get("amount");
//   const subtotal = searchParams.get("subtotal");
//   const shipping = searchParams.get("shipping");

//   const handleKeepShopping = () => {
//     clearCart();
//   };

export default function PaymentSuccess({
  searchParams: { amount, subtotal, shipping },
}: {
  searchParams: { amount: string; subtotal: number; shipping: number };
}) {
  const { cartItems, clearCart } = useShoppingCart();

  const handleKeepShopping = () => {
    clearCart();
  };

  return (
    <main className="flex justify-center items-center min-h-screen max-w-6xl mx-auto text-white text-center bg-black my-2">
      <div className="mb-10 p-10 w-full rounded-xl border-2 border-sol-green shadow-2xl shadow-sol-green ">
        <h1 className="text-lg font-bold mb-2 text-sol-green pb-2">
          Payment successful
        </h1>
        <h2 className="text-3xl font-bold">Thank you for your purchase!</h2>
        <div className="flex justify-center">
          <h2 className="text-md font-medium w-full md:w-[440px] text-center py-4">
            We appreciate your order, we’re currently processing it. So hang
            tight and we’ll send you confirmation very soon!
          </h2>
        </div>
        <h2 className="text-xl py-4 font-medium">
          Order ID: <span className="text-sol-green">1425271812829</span>
        </h2>
        <hr className="border-t-2 border-sol-green mb-2 w-full md:w-[500px] mx-auto" />

        <div className="mt-4 gap-4 flex flex-col items-center">
          {cartItems.map((cartItem) => {
            const matchingAsset = assets.find(
              (asset) => asset.id === cartItem.id
            );
            if (!matchingAsset) return null;
            const totalProductPrice = matchingAsset.price * cartItem.quantity;

            return (
              <>
                <div className="flex justify-between w-full md:w-[500px] px-2">
                  <div
                    key={cartItem.id}
                    className="flex flex-row items-start gap-4 w-full md:w-[500px]"
                  >
                    <Image
                      src={matchingAsset.image}
                      width={300}
                      height={300}
                      alt={matchingAsset.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex flex-col items-start">
                      <div className="text-xl font-bold">
                        {matchingAsset.name}
                      </div>
                      <div className="text-md font-medium">
                        Quantity: {cartItem.quantity}
                      </div>
                      <div className="text-md font-medium">Size</div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center text-lg font-medium">
                    ${totalProductPrice}
                  </div>
                </div>
                <hr className="border-t-2 border-sol-green w-full md:w-[500px] mx-auto" />
              </>
            );
          })}
        </div>
        <div className="flex flex-col w-full md:w-[500px] mx-auto">
          <div className="flex justify-between text-white mt-4 font-medium px-2">
            <span className="text-md">Subtotal:</span>
            <span className="text-lg">${subtotal}</span>
          </div>
          <div className="flex justify-between text-white mt-2 font-medium px-2">
            <span className="text-md">Shipping:</span>
            <span className="text-lg">${shipping}</span>
          </div>
          <hr className="border-t-2 border-sol-green my-2 w-full md:w-[500px] mx-auto" />
          <div className="flex justify-between text-sol-green mt-2 font-bold px-2">
            <span className="text-xl">Total:</span>
            <span className="text-xl">${amount}</span>
          </div>
        </div>

        <Link href="/">
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleKeepShopping}
            className="bg-gray-900 mt-10 text-white p-3 rounded-xl font-medium text-lg border-2 border-white hover:border-sol-green"
          >
            Continue shopping
          </motion.button>
        </Link>
      </div>
    </main>
  );
}
