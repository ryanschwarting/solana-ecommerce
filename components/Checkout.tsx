// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useShoppingCart } from "@/context/shoppingCart";
// import { FaPlus, FaMinus } from "react-icons/fa";
// import { SiSolana } from "react-icons/si";
// import { BsCreditCardFill } from "react-icons/bs";
// import { FaTrashAlt } from "react-icons/fa";
// import { PiKnifeFill } from "react-icons/pi";
// import { assets } from "@/constants/images";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { getSolPrice } from "../utils/solPrice"; // Adjust the path as needed
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import convertToSubcurrency from "@/lib/convertToSubcurrency";
// import { NavBar } from "./NavBar";
// import transferSolana from "@/utils/solana-transfer";

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
// }

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// const CartCheckoutInner: React.FC<{ clientSecret: string; amount: number }> = ({
//   clientSecret,
//   amount,
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [errorMessage, setErrorMessage] = useState<string>();
//   const [loading, setLoading] = useState(false);
//   // const { clearCart } = useShoppingCart();

//   const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     if (!stripe || !elements) {
//       return;
//     }

//     const { error: submitError } = await elements.submit();

//     if (submitError) {
//       setErrorMessage(submitError.message);
//       setLoading(false);
//       return;
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       clientSecret,
//       confirmParams: {
//         return_url: `http://localhost:3000/payment-success?amount=${amount}`,
//       },
//     });

//     if (error) {
//       setErrorMessage(error.message);
//     } else {
//       // Clear the cart
//     }

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handlePayment} className="bg-white p-2 rounded-md">
//       {clientSecret && <PaymentElement />}

//       {errorMessage && <div>{errorMessage}</div>}

//       <button
//         disabled={!stripe || loading}
//         className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
//       >
//         {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
//       </button>
//     </form>
//   );
// };

// export const CartCheckout: React.FC = () => {
//   const {
//     cartItems,
//     getItemQuantity,
//     increaseCartQuantity,
//     decreaseCartQuantity,
//     removeFromCart,
//     clearCart,
//   } = useShoppingCart();

//   const [isTransactionPending, setIsTransactionPending] = useState(false);
//   const [transactionSuccessful, setTransactionSuccessful] = useState(false);
//   const [solPrice, setSolPrice] = useState<number | null>(null);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [showStripe, setShowStripe] = useState(false);
//   const [clientSecret, setClientSecret] = useState("");
//   const [totalSupplies, setTotalSupplies] = useState<number | undefined>(); // change argument to undefined

//   useEffect(() => {
//     const fetchPrice = async () => {
//       const price = await getSolPrice();
//       setSolPrice(price);
//     };
//     fetchPrice();
//   }, []);

//   const totalUSD = cartItems.reduce((sum, cartItem) => {
//     const matchingAsset = assets.find((asset) => asset.id === cartItem.id);
//     return sum + (matchingAsset ? matchingAsset.price * cartItem.quantity : 0);
//   }, 0);

//   const totalSOL =
//     solPrice !== null ? (totalUSD / solPrice).toFixed(2) : "Loading...";

//   useEffect(() => {
//     if (showStripe && totalUSD > 0) {
//       fetch("/api/create-payment-intent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount: convertToSubcurrency(totalUSD) }),
//       })
//         .then((res) => res.json())
//         .then((data) => setClientSecret(data.clientSecret));
//     }
//   }, [totalUSD, showStripe]);

//   const handleFormSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setIsFormSubmitted(true);
//     setIsEditMode(false);
//   };

//   const handleEditClick = () => {
//     setIsEditMode(true);
//     setIsFormSubmitted(false);
//   };

//   const handleStripeClick = () => {
//     setShowStripe(true);
//   };

//   const handleSolanaClick = async () => {
//     try {
//       setIsTransactionPending(true);
//       const solAmount = parseFloat(totalSOL); // Convert totalSOL to a number

//       // Call transferSolana and await the response
//       const response = await transferSolana(
//         "8wM3AkEXsho9MvZDjvZ7ShtFnsZoHuHcrdkcAkvccV6S",
//         solAmount
//       );

//       // // Ensure response is defined and has a valid structure
//       // if (!response || typeof response !== "object") {
//       //   throw new Error("Failed to initiate Solana transfer: Invalid response");
//       // }

//       // // Check if there is an error property in the response
//       // if (response.error) {
//       //   throw new Error(
//       //     `Failed to initiate Solana transfer: ${response.error}`
//       //   );
//       // }

//       console.log("Solana transfer initiated:", response);

//       // Optionally handle success, e.g., redirect to payment success page
//       setIsTransactionPending(false);
//       setTransactionSuccessful(true);
//     } catch (error) {
//       console.error("Error initiating Solana transfer:", error);
//       setIsTransactionPending(false);
//       // Handle error state
//     }
//   };

//   // useEffect(() => {
//   //   if (transactionSuccessful) {
//   //     clearCart();
//   //   }
//   // }, [transactionSuccessful]);

//   if (cartItems.length === 0) {
//     return (
//       <>
//         <div className="py-4">
//           <NavBar />
//         </div>

//         <div className="bg-black text-white h-screen">
//           <div className="text-sol-green flex justify-center font-medium my-10 text-[52px]">
//             Shopping Cart
//           </div>
//           <div className="pt-10 space-y-6 flex flex-col justify-center items-center">
//             <div className="pr-5">
//               <Image
//                 src={"/sad-cart-3.jpg"}
//                 width={500}
//                 height={500}
//                 className="w-[200px] invert"
//                 alt={"Cart"}
//               />
//             </div>
//             <div className="text-[28px] font-normal">Nothing in your bag</div>
//             <div>
//               <Link href="/">
//                 <motion.button
//                   whileHover={{ scale: 0.9 }}
//                   whileTap={{ scale: 0.8 }}
//                   className="flex justify-center border-2 border-white bg-black text-white py-3 px-10 text-[28px] font-normal rounded-full shadow-2xl"
//                 >
//                   Keep Shopping
//                 </motion.button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <Elements
//       stripe={stripePromise}
//       options={{
//         mode: "payment",
//         amount: convertToSubcurrency(totalUSD),
//         currency: "usd",
//       }}
//     >
//       <div className="py-4">
//         <NavBar />
//       </div>
//       <div className="text-sol-green flex justify-center font-medium mb-5 text-[44px]">
//         Shopping Cart
//       </div>
//       <div className="bg-black text-white px-10 h-full flex border-t-2 border-sol-green">
//         <div className="w-1/2 pr-4 border-r-2 border-sol-green">
//           <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
//             <h2 className="text-sol-green text-[32px] font-bold mb-4">
//               <span className="mr-2 text-[36px]">&#9312;</span>Submit Shipping
//               Info
//             </h2>
//             <div>
//               <label className="block text-sm font-medium">Name</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Email</label>
//               <input
//                 type="email"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">
//                 Street Address
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">
//                 Apartment, Suite, etc (optional)
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">City</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">
//                   Province / State
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">Country</label>
//                 <select
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 >
//                   <option value="United States">United States</option>
//                   {/* Add more options as needed */}
//                 </select>
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">Postal Code</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Phone Number</label>
//               <input
//                 type="tel"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <motion.button
//               whileHover={{ scale: 0.9 }}
//               whileTap={{ scale: 0.8 }}
//               type="submit"
//               className={`w-full py-2 mt-4 ${
//                 isFormSubmitted ? "hidden" : "bg-sol-green"
//               } text-black font-bold rounded-md hover:bg-sol-green-light transition-colors`}
//               disabled={isFormSubmitted}
//             >
//               Submit
//             </motion.button>
//           </form>
//           {isFormSubmitted && (
//             <motion.button
//               whileHover={{ scale: 0.9 }}
//               whileTap={{ scale: 0.8 }}
//               onClick={handleEditClick}
//               className="w-full py-2 mt-4 bg-sol-green text-black font-bold rounded-md hover:bg-sol-green-light transition-colors"
//             >
//               Edit
//             </motion.button>
//           )}
//         </div>

//         <div className="w-1/2 pl-4">
//           <h2 className="text-sol-green text-[32px] font-bold mb-4 pt-4">
//             <span className="mr-2 text-[36px]">&#9313;</span>Submit Payment
//           </h2>

//           <ul>
//             {cartItems.map((cartItem) => {
//               const matchingAsset = assets.find(
//                 (asset) => asset.id === cartItem.id
//               );
//               if (!matchingAsset) return null;

//               const quantity = getItemQuantity(matchingAsset.id);

//               const handleAddToCart = () => {
//                 const remaining = totalSupplies! - quantity;
//                 if (remaining <= 0) return;
//                 increaseCartQuantity(matchingAsset.id);
//               };

//               const solEquivalent =
//                 solPrice !== null
//                   ? (matchingAsset.price / solPrice).toFixed(2)
//                   : "Loading...";

//               const totalPriceUSD = matchingAsset.price * cartItem.quantity;
//               const totalPriceSOL =
//                 solPrice !== null
//                   ? (totalPriceUSD / solPrice).toFixed(2)
//                   : "Loading...";

//               return (
//                 <div
//                   className="flex justify-center font-normal"
//                   key={cartItem.id}
//                 >
//                   <li className="flex items-center justify-between px-5 py-4 w-[800px]">
//                     <div className="flex items-center space-x-4">
//                       <Link
//                         href={`/item-detail/${matchingAsset.id}`}
//                         key={matchingAsset.image}
//                       >
//                         <Image
//                           width={300}
//                           height={300}
//                           src={matchingAsset.image}
//                           alt={matchingAsset.name}
//                           className="w-20 h-20 object-cover rounded-xl hover:scale-95 transition-transform duration-500 ease-in-out"
//                         />
//                       </Link>
//                       <span className="text-[20px]">
//                         {matchingAsset.name}
//                         {totalPriceSOL !== "Loading..." && (
//                           <>
//                             <span className="flex items-center text-white">
//                               <SiSolana className="mr-1" />
//                               {totalPriceSOL} SOL
//                               <span className="ml-1 text-gray-400">
//                                 (${totalPriceUSD.toFixed(2)})
//                               </span>
//                             </span>
//                           </>
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex items-center flex-col gap-2 text-black">
//                       <div className="flex justify-center gap-2">
//                         <motion.button
//                           whileHover={{ scale: 0.9 }}
//                           whileTap={{ scale: 0.8 }}
//                           className="bg-black text-white p-1 rounded-md w-6 items-center"
//                           onClick={() => decreaseCartQuantity(matchingAsset.id)}
//                         >
//                           <FaMinus />
//                         </motion.button>
//                         <div className="bg-black text-white p-2 rounded-md text-[20px] items-center">
//                           <span>{cartItem.quantity} in cart</span>
//                         </div>
//                         <motion.button
//                           whileHover={{ scale: 0.9 }}
//                           whileTap={{ scale: 0.8 }}
//                           className="bg-black text-white p-1 rounded-md w-6 items-center"
//                           onClick={handleAddToCart}
//                         >
//                           <FaPlus />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 0.9 }}
//                           whileTap={{ scale: 0.8 }}
//                           className={`text-white flex justify-center items-center ml-4 text-[16px] ${
//                             quantity === 0 ? "opacity-0" : ""
//                           }`}
//                           onClick={() => removeFromCart(matchingAsset.id)}
//                         >
//                           <FaTrashAlt />
//                         </motion.button>
//                       </div>
//                     </div>
//                   </li>
//                 </div>
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//       <div className="">
//         <hr className="border-t-2 border-sol-green mt-10"></hr>
//         <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-purple">
//           Total: {totalSOL} SOL (${totalUSD.toFixed(2)})
//         </div>
//         <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-green">
//           Payment Method
//         </div>
//         <div className="flex justify-center space-x-3 text-white my-8 text-[18px]">
//           {/* <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             disabled={!isFormSubmitted}
//             className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//               !isFormSubmitted ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <SiSolana className="mt-1 mr-2" />
//             Buy with Solana
//           </motion.button> */}
//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             disabled={!isFormSubmitted || isTransactionPending}
//             onClick={handleSolanaClick}
//             className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//               !isFormSubmitted || isTransactionPending
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <SiSolana className="mt-1 mr-2" />
//             {!isTransactionPending ? "Buy with Solana" : "Processing..."}
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             disabled={!isFormSubmitted}
//             className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//               !isFormSubmitted ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <SiSolana className="mt-1 mr-2" />
//             Buy with USDC
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             disabled={!isFormSubmitted}
//             onClick={handleStripeClick}
//             className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//               !isFormSubmitted ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <BsCreditCardFill className="mt-1 mr-2" />
//             Credit or Debit Card
//           </motion.button>
//         </div>
//         {showStripe && clientSecret && (
//           <CartCheckoutInner clientSecret={clientSecret} amount={totalUSD} />
//         )}
//       </div>
//     </Elements>
//   );
// };

// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useShoppingCart } from "@/context/shoppingCart";
// import { FaPlus, FaMinus } from "react-icons/fa";
// import { SiSolana } from "react-icons/si";
// import { BsCreditCardFill } from "react-icons/bs";
// import { FaTrashAlt } from "react-icons/fa";
// import { assets } from "@/constants/images";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { getSolPrice } from "../utils/solPrice"; // Adjust the path as needed
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import convertToSubcurrency from "@/lib/convertToSubcurrency";
// import { NavBar } from "./NavBar";
// import transferSolana from "@/utils/solana-transfer";
// import { useWallet } from "@solana/wallet-adapter-react";

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
// }

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// const CartCheckoutInner: React.FC<{ clientSecret: string; amount: number }> = ({
//   clientSecret,
//   amount,
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [errorMessage, setErrorMessage] = useState<string>();
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     if (!stripe || !elements) {
//       return;
//     }

//     const { error: submitError } = await elements.submit();

//     if (submitError) {
//       setErrorMessage(submitError.message);
//       setLoading(false);
//       return;
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       clientSecret,
//       confirmParams: {
//         return_url: `http://localhost:3000/payment-success?amount=${amount}`,
//       },
//     });

//     if (error) {
//       setErrorMessage(error.message);
//     } else {
//       // Clear the cart
//     }

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handlePayment} className="bg-white p-2 rounded-md">
//       {clientSecret && <PaymentElement />}

//       {errorMessage && <div>{errorMessage}</div>}

//       <button
//         disabled={!stripe || loading}
//         className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
//       >
//         {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
//       </button>
//     </form>
//   );
// };

// export const CartCheckout: React.FC = () => {
//   const {
//     cartItems,
//     getItemQuantity,
//     increaseCartQuantity,
//     decreaseCartQuantity,
//     removeFromCart,
//     clearCart,
//   } = useShoppingCart();

//   const { connected, publicKey, sendTransaction } = useWallet();
//   const [isTransactionPending, setIsTransactionPending] = useState(false);
//   const [transactionSuccessful, setTransactionSuccessful] = useState(false);
//   const [solPrice, setSolPrice] = useState<number | null>(null);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [showStripe, setShowStripe] = useState(false);
//   const [clientSecret, setClientSecret] = useState("");
//   const [totalSupplies, setTotalSupplies] = useState<number | undefined>();

//   useEffect(() => {
//     const fetchPrice = async () => {
//       const price = await getSolPrice();
//       setSolPrice(price);
//     };
//     fetchPrice();
//   }, []);

//   const totalUSD = cartItems.reduce((sum, cartItem) => {
//     const matchingAsset = assets.find((asset) => asset.id === cartItem.id);
//     return sum + (matchingAsset ? matchingAsset.price * cartItem.quantity : 0);
//   }, 0);

//   const totalSOL =
//     solPrice !== null ? (totalUSD / solPrice).toFixed(2) : "Loading...";

//   useEffect(() => {
//     if (showStripe && totalUSD > 0) {
//       fetch("/api/create-payment-intent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount: convertToSubcurrency(totalUSD) }),
//       })
//         .then((res) => res.json())
//         .then((data) => setClientSecret(data.clientSecret));
//     }
//   }, [totalUSD, showStripe]);

//   const handleFormSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setIsFormSubmitted(true);
//     setIsEditMode(false);
//   };

//   const handleEditClick = () => {
//     setIsEditMode(true);
//     setIsFormSubmitted(false);
//   };

//   const handleStripeClick = () => {
//     setShowStripe(true);
//   };

//   const handleSolanaClick = async () => {
//     if (!publicKey) {
//       console.error("Wallet not connected");
//       return;
//     }

//     try {
//       setIsTransactionPending(true);
//       const solAmount = parseFloat(totalSOL.toString());

//       await transferSolana(solAmount, publicKey, sendTransaction);

//       setIsTransactionPending(false);
//       setTransactionSuccessful(true);
//       // Optionally handle success, e.g., clear the cart or show a success message
//     } catch (error) {
//       console.error("Error initiating Solana transfer:", error);
//       setIsTransactionPending(false);
//       // Handle error state
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <>
//         <div className="py-4">
//           <NavBar />
//         </div>

//         <div className="bg-black text-white h-screen">
//           <div className="text-sol-green flex justify-center font-medium my-10 text-[52px]">
//             Shopping Cart
//           </div>
//           <div className="pt-10 space-y-6 flex flex-col justify-center items-center">
//             <div className="pr-5">
//               <Image
//                 src={"/sad-cart-3.jpg"}
//                 width={500}
//                 height={500}
//                 className="w-[200px] invert"
//                 alt={"Cart"}
//               />
//             </div>
//             <div className="text-[28px] font-normal">Nothing in your bag</div>
//             <div>
//               <Link href="/">
//                 <motion.button
//                   whileHover={{ scale: 0.9 }}
//                   whileTap={{ scale: 0.8 }}
//                   className="flex justify-center border-2 border-white bg-black text-white py-3 px-10 text-[28px] font-normal rounded-full shadow-2xl"
//                 >
//                   Keep Shopping
//                 </motion.button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <Elements
//       stripe={stripePromise}
//       options={{
//         mode: "payment",
//         amount: convertToSubcurrency(totalUSD),
//         currency: "usd",
//       }}
//     >
//       <div className="py-4">
//         <NavBar />
//       </div>
//       <div className="text-sol-green flex justify-center font-medium mb-5 text-[44px]">
//         Shopping Cart
//       </div>
//       <div className="bg-black text-white px-10 h-full flex border-t-2 border-sol-green">
//         <div className="w-1/2 pr-4 border-r-2 border-sol-green">
//           <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
//             <h2 className="text-sol-green text-[32px] font-bold mb-4">
//               <span className="mr-2 text-[36px]">&#9312;</span>Submit Shipping
//               Info
//             </h2>
//             <div>
//               <label className="block text-sm font-medium">Name</label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Email</label>
//               <input
//                 type="email"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">
//                 Street Address
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">
//                 Apartment, Suite, etc (optional)
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">City</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">
//                   Province / State
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">Country</label>
//                 <select
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 >
//                   <option value="United States">United States</option>
//                 </select>
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium">Postal Code</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Phone Number</label>
//               <input
//                 type="tel"
//                 className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                 required
//                 disabled={isFormSubmitted}
//               />
//             </div>
//             <motion.button
//               whileHover={{ scale: 0.9 }}
//               whileTap={{ scale: 0.8 }}
//               type="submit"
//               className={`w-full py-2 mt-4 ${
//                 isFormSubmitted ? "hidden" : "bg-sol-green"
//               } text-black font-bold rounded-md hover:bg-sol-green-light transition-colors`}
//               disabled={isFormSubmitted}
//             >
//               Submit
//             </motion.button>
//           </form>
//           {isFormSubmitted && (
//             <motion.button
//               whileHover={{ scale: 0.9 }}
//               whileTap={{ scale: 0.8 }}
//               onClick={handleEditClick}
//               className="w-full py-2 mt-4 bg-sol-green text-black font-bold rounded-md hover:bg-sol-green-light transition-colors"
//             >
//               Edit
//             </motion.button>
//           )}
//         </div>

//         <div className="w-1/2 pl-4">
//           <h2 className="text-sol-green text-[32px] font-bold mb-4 pt-4">
//             <span className="mr-2 text-[36px]">&#9313;</span>Submit Payment
//           </h2>

//           <ul>
//             {cartItems.map((cartItem) => {
//               const matchingAsset = assets.find(
//                 (asset) => asset.id === cartItem.id
//               );
//               if (!matchingAsset) return null;

//               const quantity = getItemQuantity(matchingAsset.id);

//               const handleAddToCart = () => {
//                 const remaining = totalSupplies! - quantity;
//                 if (remaining <= 0) return;
//                 increaseCartQuantity(matchingAsset.id);
//               };

//               const solEquivalent =
//                 solPrice !== null
//                   ? (matchingAsset.price / solPrice).toFixed(2)
//                   : "Loading...";

//               const totalPriceUSD = matchingAsset.price * cartItem.quantity;
//               const totalPriceSOL =
//                 solPrice !== null
//                   ? (totalPriceUSD / solPrice).toFixed(2)
//                   : "Loading...";

//               return (
//                 <div
//                   className="flex justify-center font-normal"
//                   key={cartItem.id}
//                 >
//                   <li className="flex items-center justify-between px-5 py-4 w-[800px]">
//                     <div className="flex items-center space-x-4">
//                       <Link
//                         href={`/item-detail/${matchingAsset.id}`}
//                         key={matchingAsset.image}
//                       >
//                         <Image
//                           width={300}
//                           height={300}
//                           src={matchingAsset.image}
//                           alt={matchingAsset.name}
//                           className="w-20 h-20 object-cover rounded-xl hover:scale-95 transition-transform duration-500 ease-in-out"
//                         />
//                       </Link>
//                       <span className="text-[20px]">
//                         {matchingAsset.name}
//                         {totalPriceSOL !== "Loading..." && (
//                           <>
//                             <span className="flex items-center text-white">
//                               <SiSolana className="mr-1" />
//                               {totalPriceSOL} SOL
//                               <span className="ml-1 text-gray-400">
//                                 (${totalPriceUSD.toFixed(2)})
//                               </span>
//                             </span>
//                           </>
//                         )}
//                       </span>
//                     </div>
//                     <div className="flex items-center flex-col gap-2 text-black">
//                       <div className="flex justify-center gap-2">
//                         <motion.button
//                           whileHover={{ scale: 0.9 }}
//                           whileTap={{ scale: 0.8 }}
//                           className="bg-black text-white p-1 rounded-md w-6 items-center"
//                           onClick={() => decreaseCartQuantity(matchingAsset.id)}
//                         >
//                           <FaMinus />
//                         </motion.button>
//                         <div className="bg-black text-white p-2 rounded-md text-[20px] items-center">
//                           <span>{cartItem.quantity} in cart</span>
//                         </div>
//                         <motion.button
//                           whileHover={{ scale: 0.9 }}
//                           whileTap={{ scale: 0.8 }}
//                           className="bg-black text-white p-1 rounded-md w-6 items-center"
//                           onClick={handleAddToCart}
//                         >
//                           <FaPlus />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 0.9 }}
//                           whileTap={{ scale: 0.8 }}
//                           className={`text-white flex justify-center items-center ml-4 text-[16px] ${
//                             quantity === 0 ? "opacity-0" : ""
//                           }`}
//                           onClick={() => removeFromCart(matchingAsset.id)}
//                         >
//                           <FaTrashAlt />
//                         </motion.button>
//                       </div>
//                     </div>
//                   </li>
//                 </div>
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//       <div className="">
//         <hr className="border-t-2 border-sol-green mt-10"></hr>
//         <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-purple">
//           Total: {totalSOL} SOL (${totalUSD.toFixed(2)})
//         </div>
//         <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-green">
//           Payment Method
//         </div>
//         <div className="flex justify-center space-x-3 text-white my-8 text-[18px]">
//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             disabled={!connected || !isFormSubmitted || isTransactionPending}
//             onClick={handleSolanaClick}
//             className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//               !connected || !isFormSubmitted || isTransactionPending
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <SiSolana className="mt-1 mr-2" />
//             {!isTransactionPending ? "Buy with Solana" : "Processing..."}
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             disabled={!connected || !isFormSubmitted}
//             className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//               !connected || !isFormSubmitted
//                 ? "opacity-50 cursor-not-allowed"
//                 : ""
//             }`}
//           >
//             <SiSolana className="mt-1 mr-2" />
//             Buy with USDC
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 0.9 }}
//             whileTap={{ scale: 0.8 }}
//             disabled={!isFormSubmitted}
//             onClick={handleStripeClick}
//             className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//               !isFormSubmitted ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <BsCreditCardFill className="mt-1 mr-2" />
//             Credit or Debit Card
//           </motion.button>
//         </div>
//         {showStripe && clientSecret && (
//           <CartCheckoutInner clientSecret={clientSecret} amount={totalUSD} />
//         )}
//       </div>
//     </Elements>
//   );
// };

// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useShoppingCart } from "@/context/shoppingCart";
// import { FaPlus, FaMinus } from "react-icons/fa";
// import { SiSolana } from "react-icons/si";
// import { BsCreditCardFill } from "react-icons/bs";
// import { FaTrashAlt } from "react-icons/fa";
// import { assets } from "@/constants/images";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { getSolPrice } from "../utils/solPrice"; // Adjust the path as needed
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import convertToSubcurrency from "@/lib/convertToSubcurrency";
// import { NavBar } from "./NavBar";
// import transferSolana from "@/utils/solana-transfer";
// import { useWallet } from "@solana/wallet-adapter-react";
// import PurchaseModal from "./PurchaseModal"; // Import the new modal component

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
// }

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// const CartCheckoutInner: React.FC<{ clientSecret: string; amount: number }> = ({
//   clientSecret,
//   amount,
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [errorMessage, setErrorMessage] = useState<string>();
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     if (!stripe || !elements) {
//       return;
//     }

//     const { error: submitError } = await elements.submit();

//     if (submitError) {
//       setErrorMessage(submitError.message);
//       setLoading(false);
//       return;
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       clientSecret,
//       confirmParams: {
//         return_url: `http://localhost:3000/payment-success?amount=${amount}`,
//       },
//     });

//     if (error) {
//       setErrorMessage(error.message);
//     } else {
//       // Clear the cart
//     }

//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handlePayment} className="bg-white p-2 rounded-md">
//       {clientSecret && <PaymentElement />}

//       {errorMessage && <div>{errorMessage}</div>}

//       <button
//         disabled={!stripe || loading}
//         className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
//       >
//         {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
//       </button>
//     </form>
//   );
// };

// export const CartCheckout: React.FC = () => {
//   const {
//     cartItems,
//     getItemQuantity,
//     increaseCartQuantity,
//     decreaseCartQuantity,
//     removeFromCart,
//     clearCart,
//   } = useShoppingCart();

//   const { connected, publicKey, sendTransaction } = useWallet();
//   const [isTransactionPending, setIsTransactionPending] = useState(false);
//   const [transactionSuccessful, setTransactionSuccessful] = useState(false);
//   const [solPrice, setSolPrice] = useState<number | null>(null);
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [showStripe, setShowStripe] = useState(false);
//   const [clientSecret, setClientSecret] = useState("");
//   const [totalSupplies, setTotalSupplies] = useState<number | undefined>();
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

//   useEffect(() => {
//     const fetchPrice = async () => {
//       const price = await getSolPrice();
//       setSolPrice(price);
//     };
//     fetchPrice();
//   }, []);

//   const totalUSD = cartItems.reduce((sum, cartItem) => {
//     const matchingAsset = assets.find((asset) => asset.id === cartItem.id);
//     return sum + (matchingAsset ? matchingAsset.price * cartItem.quantity : 0);
//   }, 0);

//   const totalSOL =
//     solPrice !== null ? (totalUSD / solPrice).toFixed(2) : "Loading...";

//   useEffect(() => {
//     if (showStripe && totalUSD > 0) {
//       fetch("/api/create-payment-intent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount: convertToSubcurrency(totalUSD) }),
//       })
//         .then((res) => res.json())
//         .then((data) => setClientSecret(data.clientSecret));
//     }
//   }, [totalUSD, showStripe]);

//   const handleFormSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setIsFormSubmitted(true);
//     setIsEditMode(false);
//   };

//   const handleEditClick = () => {
//     setIsEditMode(true);
//     setIsFormSubmitted(false);
//   };

//   const handleStripeClick = () => {
//     setShowStripe(true);
//   };

//   const handleSolanaClick = async () => {
//     if (!publicKey) {
//       console.error("Wallet not connected");
//       return;
//     }

//     try {
//       setIsTransactionPending(true);
//       const solAmount = parseFloat(totalSOL.toString());

//       await transferSolana(solAmount, publicKey, sendTransaction);

//       setIsTransactionPending(false);
//       setTransactionSuccessful(true);
//       setIsModalOpen(true); // Show the modal
//       // Optionally handle success, e.g., clear the cart or show a success message
//     } catch (error) {
//       console.error("Error initiating Solana transfer:", error);
//       setIsTransactionPending(false);
//       // Handle error state
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   if (cartItems.length === 0) {
//     return (
//       <>
//         <div className="py-4">
//           <NavBar />
//         </div>

//         <div className="bg-black text-white h-screen">
//           <div className="text-sol-green flex justify-center font-medium my-10 text-[52px]">
//             Shopping Cart
//           </div>
//           <div className="pt-10 space-y-6 flex flex-col justify-center items-center">
//             <div className="pr-5">
//               <Image
//                 src={"/sad-cart-3.jpg"}
//                 width={500}
//                 height={500}
//                 className="w-[200px] invert"
//                 alt={"Cart"}
//               />
//             </div>
//             <div className="text-[28px] font-normal">Nothing in your bag</div>
//             <div>
//               <Link href="/">
//                 <motion.button
//                   whileHover={{ scale: 0.9 }}
//                   whileTap={{ scale: 0.8 }}
//                   className="flex justify-center border-2 border-white bg-black text-white py-3 px-10 text-[28px] font-normal rounded-full shadow-2xl"
//                 >
//                   Keep Shopping
//                 </motion.button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Elements
//         stripe={stripePromise}
//         options={{
//           mode: "payment",
//           amount: convertToSubcurrency(totalUSD),
//           currency: "usd",
//         }}
//       >
//         <div className="py-4">
//           <NavBar />
//         </div>
//         <div className="text-sol-green flex justify-center font-medium mb-5 text-[44px]">
//           Shopping Cart
//         </div>
//         <div className="bg-black text-white px-10 h-full flex border-t-2 border-sol-green">
//           <div className="w-1/2 pr-4 border-r-2 border-sol-green">
//             <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
//               <h2 className="text-sol-green text-[32px] font-bold mb-4">
//                 <span className="mr-2 text-[36px]">&#9312;</span>Submit Shipping
//                 Info
//               </h2>
//               <div>
//                 <label className="block text-sm font-medium">Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">
//                   Street Address
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">
//                   Apartment, Suite, etc (optional)
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//               <div className="flex space-x-4">
//                 <div className="w-1/2">
//                   <label className="block text-sm font-medium">City</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                     required
//                     disabled={isFormSubmitted}
//                   />
//                 </div>
//                 <div className="w-1/2">
//                   <label className="block text-sm font-medium">
//                     Province / State
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                     required
//                     disabled={isFormSubmitted}
//                   />
//                 </div>
//               </div>
//               <div className="flex space-x-4">
//                 <div className="w-1/2">
//                   <label className="block text-sm font-medium">Country</label>
//                   <select
//                     className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                     required
//                     disabled={isFormSubmitted}
//                   >
//                     <option value="United States">United States</option>
//                   </select>
//                 </div>
//                 <div className="w-1/2">
//                   <label className="block text-sm font-medium">
//                     Postal Code
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                     required
//                     disabled={isFormSubmitted}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
//                   required
//                   disabled={isFormSubmitted}
//                 />
//               </div>
//               <motion.button
//                 whileHover={{ scale: 0.9 }}
//                 whileTap={{ scale: 0.8 }}
//                 type="submit"
//                 className={`w-full py-2 mt-4 ${
//                   isFormSubmitted ? "hidden" : "bg-sol-green"
//                 } text-black font-bold rounded-md hover:bg-sol-green-light transition-colors`}
//                 disabled={isFormSubmitted}
//               >
//                 Submit
//               </motion.button>
//             </form>
//             {isFormSubmitted && (
//               <motion.button
//                 whileHover={{ scale: 0.9 }}
//                 whileTap={{ scale: 0.8 }}
//                 onClick={handleEditClick}
//                 className="w-full py-2 mt-4 bg-sol-green text-black font-bold rounded-md hover:bg-sol-green-light transition-colors"
//               >
//                 Edit
//               </motion.button>
//             )}
//           </div>

//           <div className="w-1/2 pl-4">
//             <h2 className="text-sol-green text-[32px] font-bold mb-4 pt-4">
//               <span className="mr-2 text-[36px]">&#9313;</span>Submit Payment
//             </h2>

//             <ul>
//               {cartItems.map((cartItem) => {
//                 const matchingAsset = assets.find(
//                   (asset) => asset.id === cartItem.id
//                 );
//                 if (!matchingAsset) return null;

//                 const quantity = getItemQuantity(matchingAsset.id);

//                 const handleAddToCart = () => {
//                   const remaining = totalSupplies! - quantity;
//                   if (remaining <= 0) return;
//                   increaseCartQuantity(matchingAsset.id);
//                 };

//                 const solEquivalent =
//                   solPrice !== null
//                     ? (matchingAsset.price / solPrice).toFixed(2)
//                     : "Loading...";

//                 const totalPriceUSD = matchingAsset.price * cartItem.quantity;
//                 const totalPriceSOL =
//                   solPrice !== null
//                     ? (totalPriceUSD / solPrice).toFixed(2)
//                     : "Loading...";

//                 return (
//                   <div
//                     className="flex justify-center font-normal"
//                     key={cartItem.id}
//                   >
//                     <li className="flex items-center justify-between px-5 py-4 w-[800px]">
//                       <div className="flex items-center space-x-4">
//                         <Link
//                           href={`/item-detail/${matchingAsset.id}`}
//                           key={matchingAsset.image}
//                         >
//                           <Image
//                             width={300}
//                             height={300}
//                             src={matchingAsset.image}
//                             alt={matchingAsset.name}
//                             className="w-20 h-20 object-cover rounded-xl hover:scale-95 transition-transform duration-500 ease-in-out"
//                           />
//                         </Link>
//                         <span className="text-[20px]">
//                           {matchingAsset.name}
//                           {totalPriceSOL !== "Loading..." && (
//                             <>
//                               <span className="flex items-center text-white">
//                                 <SiSolana className="mr-1" />
//                                 {totalPriceSOL} SOL
//                                 <span className="ml-1 text-gray-400">
//                                   (${totalPriceUSD.toFixed(2)})
//                                 </span>
//                               </span>
//                             </>
//                           )}
//                         </span>
//                       </div>
//                       <div className="flex items-center flex-col gap-2 text-black">
//                         <div className="flex justify-center gap-2">
//                           <motion.button
//                             whileHover={{ scale: 0.9 }}
//                             whileTap={{ scale: 0.8 }}
//                             className="bg-black text-white p-1 rounded-md w-6 items-center"
//                             onClick={() =>
//                               decreaseCartQuantity(matchingAsset.id)
//                             }
//                           >
//                             <FaMinus />
//                           </motion.button>
//                           <div className="bg-black text-white p-2 rounded-md text-[20px] items-center">
//                             <span>{cartItem.quantity} in cart</span>
//                           </div>
//                           <motion.button
//                             whileHover={{ scale: 0.9 }}
//                             whileTap={{ scale: 0.8 }}
//                             className="bg-black text-white p-1 rounded-md w-6 items-center"
//                             onClick={handleAddToCart}
//                           >
//                             <FaPlus />
//                           </motion.button>
//                           <motion.button
//                             whileHover={{ scale: 0.9 }}
//                             whileTap={{ scale: 0.8 }}
//                             className={`text-white flex justify-center items-center ml-4 text-[16px] ${
//                               quantity === 0 ? "opacity-0" : ""
//                             }`}
//                             onClick={() => removeFromCart(matchingAsset.id)}
//                           >
//                             <FaTrashAlt />
//                           </motion.button>
//                         </div>
//                       </div>
//                     </li>
//                   </div>
//                 );
//               })}
//             </ul>
//           </div>
//         </div>
//         <div className="">
//           <hr className="border-t-2 border-sol-green mt-10"></hr>
//           <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-purple">
//             Total: {totalSOL} SOL (${totalUSD.toFixed(2)})
//           </div>
//           <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-green">
//             Payment Method
//           </div>
//           <div className="flex justify-center space-x-3 text-white my-8 text-[18px]">
//             <motion.button
//               whileHover={{ scale: 0.9 }}
//               whileTap={{ scale: 0.8 }}
//               disabled={!connected || !isFormSubmitted || isTransactionPending}
//               onClick={handleSolanaClick}
//               className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//                 !connected || !isFormSubmitted || isTransactionPending
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               <SiSolana className="mt-1 mr-2" />
//               {!isTransactionPending ? "Buy with Solana" : "Processing..."}
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 0.9 }}
//               whileTap={{ scale: 0.8 }}
//               disabled={!connected || !isFormSubmitted}
//               className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//                 !connected || !isFormSubmitted
//                   ? "opacity-50 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               <SiSolana className="mt-1 mr-2" />
//               Buy with USDC
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 0.9 }}
//               whileTap={{ scale: 0.8 }}
//               disabled={!isFormSubmitted}
//               onClick={handleStripeClick}
//               className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
//                 !isFormSubmitted ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               <BsCreditCardFill className="mt-1 mr-2" />
//               Credit or Debit Card
//             </motion.button>
//           </div>
//           {showStripe && clientSecret && (
//             <CartCheckoutInner clientSecret={clientSecret} amount={totalUSD} />
//           )}
//         </div>
//       </Elements>

//       <PurchaseModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         cartItems={cartItems.map((cartItem) => {
//           const matchingAsset = assets.find(
//             (asset) => asset.id === cartItem.id
//           );
//           return {
//             ...matchingAsset,
//             quantity: cartItem.quantity,
//           };
//         })}
//         totalSOL={totalSOL}
//       />
//     </>
//   );
// };

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useShoppingCart } from "@/context/shoppingCart";
import { FaPlus, FaMinus } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { BsCreditCardFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { assets } from "@/constants/images";
import Image from "next/image";
import { motion } from "framer-motion";
import { getSolPrice } from "../utils/solPrice"; // Adjust the path as needed
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { NavBar } from "./NavBar";
import transferSolana from "@/utils/solana-transfer";
import { useWallet } from "@solana/wallet-adapter-react";
import PurchaseModal from "./PurchaseModal"; // Import the new modal component
import FailureModal from "./FailureModal"; // Import the failure modal component

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CartCheckoutInner: React.FC<{ clientSecret: string; amount: number }> = ({
  clientSecret,
  amount,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      // Clear the cart
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePayment} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
      </button>
    </form>
  );
};

export const CartCheckout: React.FC = () => {
  const {
    cartItems,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    clearCart,
  } = useShoppingCart();

  const { connected, publicKey, sendTransaction } = useWallet();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionSuccessful, setTransactionSuccessful] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [totalSupplies, setTotalSupplies] = useState<number | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [transactionStatus, setTransactionStatus] = useState<
    "success" | "failure" | null
  >(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getSolPrice();
      setSolPrice(price);
    };
    fetchPrice();
  }, []);

  const totalUSD = cartItems.reduce((sum, cartItem) => {
    const matchingAsset = assets.find((asset) => asset.id === cartItem.id);
    return sum + (matchingAsset ? matchingAsset.price * cartItem.quantity : 0);
  }, 0);

  const totalSOL =
    solPrice !== null ? (totalUSD / solPrice).toFixed(2) : "Loading...";

  useEffect(() => {
    if (showStripe && totalUSD > 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: convertToSubcurrency(totalUSD) }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [totalUSD, showStripe]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsFormSubmitted(true);
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsFormSubmitted(false);
  };

  const handleStripeClick = () => {
    setShowStripe(true);
  };

  const handleSolanaClick = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      setIsTransactionPending(true);
      const solAmount = parseFloat(totalSOL.toString());

      const result = await transferSolana(
        solAmount,
        publicKey,
        sendTransaction
      );

      setIsTransactionPending(false);
      if (result.success) {
        setTransactionStatus("success");
        setIsModalOpen(true);
      } else {
        setTransactionStatus("failure");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error initiating Solana transfer:", error);
      setIsTransactionPending(false);
      setTransactionStatus("failure");
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransactionStatus(null); // Reset transaction status
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div className="py-4">
          <NavBar />
        </div>

        <div className="bg-black text-white h-screen">
          <div className="text-sol-green flex justify-center font-medium my-10 text-[52px]">
            Shopping Cart
          </div>
          <div className="pt-10 space-y-6 flex flex-col justify-center items-center">
            <div className="pr-5">
              <Image
                src={"/sad-cart-3.jpg"}
                width={500}
                height={500}
                className="w-[200px] invert"
                alt={"Cart"}
              />
            </div>
            <div className="text-[28px] font-normal">Nothing in your bag</div>
            <div>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  className="flex justify-center border-2 border-white bg-black text-white py-3 px-10 text-[28px] font-normal rounded-full shadow-2xl"
                >
                  Keep Shopping
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(totalUSD),
          currency: "usd",
        }}
      >
        <div className="py-4">
          <NavBar />
        </div>
        <div className="text-sol-green flex justify-center font-medium mb-5 text-[44px]">
          Shopping Cart
        </div>
        <div className="bg-black text-white px-10 h-full flex border-t-2 border-sol-green">
          <div className="w-1/2 pr-4 border-r-2 border-sol-green">
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              <h2 className="text-sol-green text-[32px] font-bold mb-4">
                <span className="mr-2 text-[36px]">&#9312;</span>Submit Shipping
                Info
              </h2>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                  required
                  disabled={isFormSubmitted}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                  required
                  disabled={isFormSubmitted}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Street Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                  required
                  disabled={isFormSubmitted}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Apartment, Suite, etc (optional)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                  disabled={isFormSubmitted}
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                    required
                    disabled={isFormSubmitted}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Province / State
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                    required
                    disabled={isFormSubmitted}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium">Country</label>
                  <select
                    className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                    required
                    disabled={isFormSubmitted}
                  >
                    <option value="United States">United States</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                    required
                    disabled={isFormSubmitted}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 bg-gray-900 text-sol-green rounded-md"
                  required
                  disabled={isFormSubmitted}
                />
              </div>
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                type="submit"
                className={`w-full py-2 mt-4 ${
                  isFormSubmitted ? "hidden" : "bg-sol-green"
                } text-black font-bold rounded-md hover:bg-sol-green-light transition-colors`}
                disabled={isFormSubmitted}
              >
                Submit
              </motion.button>
            </form>
            {isFormSubmitted && (
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleEditClick}
                className="w-full py-2 mt-4 bg-sol-green text-black font-bold rounded-md hover:bg-sol-green-light transition-colors"
              >
                Edit
              </motion.button>
            )}
          </div>

          <div className="w-1/2 pl-4">
            <h2 className="text-sol-green text-[32px] font-bold mb-4 pt-4">
              <span className="mr-2 text-[36px]">&#9313;</span>Submit Payment
            </h2>

            <ul>
              {cartItems.map((cartItem) => {
                const matchingAsset = assets.find(
                  (asset) => asset.id === cartItem.id
                );
                if (!matchingAsset) return null;

                const quantity = getItemQuantity(matchingAsset.id);

                const handleAddToCart = () => {
                  const remaining = totalSupplies! - quantity;
                  if (remaining <= 0) return;
                  increaseCartQuantity(matchingAsset.id);
                };

                const solEquivalent =
                  solPrice !== null
                    ? (matchingAsset.price / solPrice).toFixed(2)
                    : "Loading...";

                const totalPriceUSD = matchingAsset.price * cartItem.quantity;
                const totalPriceSOL =
                  solPrice !== null
                    ? (totalPriceUSD / solPrice).toFixed(2)
                    : "Loading...";

                return (
                  <div
                    className="flex justify-center font-normal"
                    key={cartItem.id}
                  >
                    <li className="flex items-center justify-between px-5 py-4 w-[800px]">
                      <div className="flex items-center space-x-4">
                        <Link
                          href={`/item-detail/${matchingAsset.id}`}
                          key={matchingAsset.image}
                        >
                          <Image
                            width={300}
                            height={300}
                            src={matchingAsset.image}
                            alt={matchingAsset.name}
                            className="w-20 h-20 object-cover rounded-xl hover:scale-95 transition-transform duration-500 ease-in-out"
                          />
                        </Link>
                        <span className="text-[20px]">
                          {matchingAsset.name}
                          {totalPriceSOL !== "Loading..." && (
                            <>
                              <span className="flex items-center text-white">
                                <SiSolana className="mr-1" />
                                {totalPriceSOL} SOL
                                <span className="ml-1 text-gray-400">
                                  (${totalPriceUSD.toFixed(2)})
                                </span>
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center flex-col gap-2 text-black">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 0.9 }}
                            whileTap={{ scale: 0.8 }}
                            className="bg-black text-white p-1 rounded-md w-6 items-center"
                            onClick={() =>
                              decreaseCartQuantity(matchingAsset.id)
                            }
                          >
                            <FaMinus />
                          </motion.button>
                          <div className="bg-black text-white p-2 rounded-md text-[20px] items-center">
                            <span>{cartItem.quantity} in cart</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 0.9 }}
                            whileTap={{ scale: 0.8 }}
                            className="bg-black text-white p-1 rounded-md w-6 items-center"
                            onClick={handleAddToCart}
                          >
                            <FaPlus />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 0.9 }}
                            whileTap={{ scale: 0.8 }}
                            className={`text-white flex justify-center items-center ml-4 text-[16px] ${
                              quantity === 0 ? "opacity-0" : ""
                            }`}
                            onClick={() => removeFromCart(matchingAsset.id)}
                          >
                            <FaTrashAlt />
                          </motion.button>
                        </div>
                      </div>
                    </li>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="">
          <hr className="border-t-2 border-sol-green mt-10"></hr>
          <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-purple">
            Total: {totalSOL} SOL (${totalUSD.toFixed(2)})
          </div>
          <div className="flex justify-center font-semibold text-[32px] mt-10 text-sol-green">
            Payment Method
          </div>
          <div className="flex justify-center space-x-3 text-white my-8 text-[18px]">
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              disabled={!connected || !isFormSubmitted || isTransactionPending}
              onClick={handleSolanaClick}
              className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
                !connected || !isFormSubmitted || isTransactionPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <SiSolana className="mt-1 mr-2" />
              {!isTransactionPending ? "Buy with Solana" : "Processing..."}
            </motion.button>

            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              disabled={!connected || !isFormSubmitted}
              className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
                !connected || !isFormSubmitted
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <SiSolana className="mt-1 mr-2" />
              Buy with USDC
            </motion.button>
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              disabled={!isFormSubmitted}
              onClick={handleStripeClick}
              className={`flex bg-black rounded-xl py-2 px-3 border-2 border-white ${
                !isFormSubmitted ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <BsCreditCardFill className="mt-1 mr-2" />
              Credit or Debit Card
            </motion.button>
          </div>
          {showStripe && clientSecret && (
            <CartCheckoutInner clientSecret={clientSecret} amount={totalUSD} />
          )}
        </div>
      </Elements>

      {transactionStatus === "success" && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          cartItems={cartItems.map((cartItem) => {
            const matchingAsset = assets.find(
              (asset) => asset.id === cartItem.id
            );
            return {
              ...matchingAsset,
              quantity: cartItem.quantity,
            };
          })}
          totalSOL={totalSOL}
        />
      )}

      {transactionStatus === "failure" && (
        <FailureModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  );
};
