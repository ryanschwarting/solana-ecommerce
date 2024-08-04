"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useShoppingCart } from "@/context/shoppingCart";
import { SiSolana } from "react-icons/si";
import { BsCreditCardFill } from "react-icons/bs";
import { FaTrashAlt, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { assets } from "@/constants/productData";
import Image from "next/image";
import { motion } from "framer-motion";
import { getSolPrice } from "../utils/solPrice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { NavBar } from "./NavBar";
import transferUsdc from "@/utils/usdc-transfer";
import transferSolana from "@/utils/solana-transfer";
import { useWallet } from "@solana/wallet-adapter-react";
import PurchaseModal from "./PurchaseModal";
import FailureModal from "./FailureModal";
import Footer from "./Footer";
import { countries } from "countries-list";
import { CustomWalletButton } from "./CustomWalletButton";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
// List of allowed countries
const allowedCountries = ["United States", "Canada", "Mexico"];

// Filtered list of allowed country data
const countryList = Object.values(countries).filter((country) =>
  allowedCountries.includes(country.name)
);

export const CartCheckout: React.FC = () => {
  const {
    cartItems,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const { connected, publicKey, sendTransaction } = useWallet();
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [transactionSuccessful, setTransactionSuccessful] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "success" | "failure" | null
  >(null);
  const [paymentMethod, setPaymentMethod] = useState<"SOL" | "USDC">("SOL");
  const [transactionSignature, setTransactionSignature] = useState("");
  const [shippingCost] = useState(10); // Set the shipping cost
  const [isProcessing, setIsProcessing] = useState(false);

  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const subtotalUSD = cartItems.reduce((sum, cartItem) => {
    const matchingAsset = assets.find((asset) => asset.id === cartItem.id);
    return sum + (matchingAsset ? matchingAsset.price * cartItem.quantity : 0);
  }, 0);

  const orderTotalUSD = subtotalUSD + shippingCost;

  const subtotalSOL =
    solPrice !== null ? (subtotalUSD / solPrice).toFixed(5) : "Loading...";
  const totalSOL =
    solPrice !== null ? (orderTotalUSD / solPrice).toFixed(5) : "Loading...";

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getSolPrice();
      setSolPrice(price);
    };
    fetchPrice();
  }, []);

  const handleStripeClick = async () => {
    setIsProcessing(true); // Set the processing state to true
    try {
      const products = cartItems
        .map((cartItem) => {
          const matchingAsset = assets.find(
            (asset) => asset.id === cartItem.id
          );
          if (!matchingAsset) {
            console.error(`Product with id ${cartItem.id} not found.`);
            return null;
          }

          return {
            name: matchingAsset.name,
            image: matchingAsset.image,
            description: matchingAsset.description,
            price: matchingAsset.price,
            quantity: cartItem.quantity,
          };
        })
        .filter((item) => item !== null);

      if (products.length === 0) {
        console.error("No valid products found in cart.");
        setIsProcessing(false); // Reset processing state
        return;
      }

      const response = await fetch(
        // "http://localhost:3000/api/create-payment-intent",
        "https://solana-ecommerce-o1qe.vercel.app/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout session creation failed:", data.error);
        setIsProcessing(false); // Reset processing state
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      setIsProcessing(false); // Reset processing state
    }
  };

  const handleUsdcClick = async () => {
    if (!publicKey || !sendTransaction) {
      console.error("Wallet not connected");
      return;
    }

    try {
      setIsTransactionPending(true);
      const amount = orderTotalUSD;

      const result = await transferUsdc(amount, publicKey, sendTransaction);

      setIsTransactionPending(false);
      if (result.success && result.signature) {
        setTransactionStatus("success");
        setPaymentMethod("USDC");
        setTransactionSignature(result.signature);
        setIsModalOpen(true);
      } else {
        setTransactionStatus("failure");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error initiating USDC transfer:", error);
      setIsTransactionPending(false);
      setTransactionStatus("failure");
      setIsModalOpen(true);
    }
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
      if (result.success && result.signature) {
        setTransactionStatus("success");
        setPaymentMethod("SOL");
        setTransactionSignature(result.signature);
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
    setTransactionStatus(null);
  };

  const handleCryptoButtonClick = () => {
    setIsCryptoModalOpen(true);
  };

  const handleCryptoModalClose = () => {
    setIsCryptoModalOpen(false);
    setIsFormSubmitted(false);
  };

  const handleFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted((prev) => !prev);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div className="py-4">
          <NavBar />
        </div>
        <div className="bg-black text-white h-screen">
          <div className="text-white flex justify-center font-bold my-10 text-[52px]">
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
                  className="flex justify-center border-2 border-white hover:border-sol-green bg-gray-900 text-white py-3 px-10 text-[28px] font-normal rounded-full shadow-2xl"
                >
                  Keep Shopping
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: orderTotalUSD * 100,
          currency: "usd",
        }}
      >
        <div className="py-4">
          <NavBar />
        </div>
        <div className="text-white flex justify-center font-bold mb-2 mt-4 text-[44px]">
          Shopping Cart
        </div>
        <div className="bg-black text-white flex justify-center items-center rounded-xl p-6">
          <div className="w-full max-w-3xl">
            <div className="flex flex-col items-center border-t-2 border-sol-green">
              <ul className="w-full mb-4">
                {cartItems.map((cartItem) => {
                  const matchingAsset = assets.find(
                    (asset) => asset.id === cartItem.id
                  );
                  if (!matchingAsset) return null;

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
                      className="flex justify-between items-center py-4 border-b-2 border-sol-green px-2"
                      key={cartItem.id}
                    >
                      <div className="flex items-center space-x-4">
                        <Link
                          href={`/item-detail/${matchingAsset.id}`}
                          key={matchingAsset.image}
                        >
                          <Image
                            width={100}
                            height={100}
                            src={matchingAsset.image}
                            alt={matchingAsset.name}
                            className="w-20 h-20 object-cover rounded-xl hover:scale-95 transition-transform duration-500 ease-in-out"
                          />
                        </Link>
                        <div className="flex flex-col ">
                          <span className="text-[18px]">
                            {matchingAsset.name}
                          </span>
                          <span className="text-[14px]">Size</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[16px]">
                          {totalPriceSOL} SOL{" "}
                          <span className="ml-1 text-gray-400">
                            (${totalPriceUSD.toFixed(2)})
                          </span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 0.9 }}
                            whileTap={{ scale: 0.8 }}
                            className="bg-black text-white p-1 rounded-xl w-6 items-center"
                            onClick={() =>
                              decreaseCartQuantity(matchingAsset.id)
                            }
                          >
                            <FaMinus />
                          </motion.button>
                          <span className="bg-black text-white p-2 rounded-xl text-[14px] items-center">
                            {cartItem.quantity} in cart
                          </span>
                          <motion.button
                            whileHover={{ scale: 0.9 }}
                            whileTap={{ scale: 0.8 }}
                            className="bg-black text-white p-1 rounded-xl w-6 items-center"
                            onClick={() =>
                              increaseCartQuantity(matchingAsset.id)
                            }
                          >
                            <FaPlus />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 0.9 }}
                            whileTap={{ scale: 0.8 }}
                            className="text-white flex justify-center items-center text-[14px]"
                            onClick={() => removeFromCart(matchingAsset.id)}
                          >
                            <FaTrashAlt />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ul>
              <div className="flex space-x-4 w-full mt-4">
                {/* Order Summary */}
                <div className="w-2/3 border-2 border-sol-green p-4 rounded-xl">
                  <h3 className="text-sol-green font-bold text-[22px] mb-2">
                    Order Summary
                  </h3>
                  <div className="flex justify-between text-[16px] font-medium mb-2">
                    <span>Subtotal:</span>
                    <span>
                      {subtotalSOL} SOL{" "}
                      <span className="ml-1 text-gray-400">
                        (${subtotalUSD.toFixed(2)})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[16px] font-medium mb-2">
                    <span>Shipping:</span>
                    <span>
                      {(shippingCost / solPrice!).toFixed(5)} SOL{" "}
                      <span className="ml-1 text-gray-400">
                        (${shippingCost.toFixed(2)})
                      </span>
                    </span>
                  </div>
                  <hr className="border-t-2 border-sol-green my-2" />
                  <div className="flex justify-between text-[18px] font-medium text-sol-purple mt-2">
                    <span>Total:</span>
                    <span>
                      {totalSOL} SOL (${orderTotalUSD.toFixed(2)})
                    </span>
                  </div>
                </div>
                {/* Payment Options */}
                <div className="w-1/3 flex flex-col justify-center items-end space-y-8">
                  <motion.button
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleCryptoButtonClick}
                    className="flex w-[220px] justify-center items-center bg-black rounded-xl py-2 px-4 border-2 border-white hover:border-sol-green"
                  >
                    <SiSolana className="mr-2" />
                    Pay with Crypto
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleStripeClick}
                    disabled={isProcessing}
                    className="flex w-[220px] justify-center items-center bg-black rounded-xl py-2 px-4 border-2 border-white hover:border-sol-green"
                  >
                    <BsCreditCardFill className="mr-2" />
                    {isProcessing ? "Processing..." : "Pay with Card"}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Elements>
      {isCryptoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative p-5 rounded-xl bg-black w-full md:w-[800px] border-2 border-sol-green">
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              onClick={handleCryptoModalClose}
              className="absolute top-4 right-4 text-white mb-10 hover:text-sol-green"
            >
              <FaTimes size={24} />
            </motion.button>
            <form onSubmit={handleFormSubmit}>
              <h2 className="text-sol-green text-2xl font-bold mb-4 text-center">
                {isFormSubmitted
                  ? "Edit Shipping Info"
                  : "Submit Shipping Info"}
              </h2>
              <div className="px-10">
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                    required
                    disabled={isFormSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                    required
                    disabled={isFormSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Apartment, Suite, etc (optional)
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleFormChange}
                    className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                    disabled={isFormSubmitted}
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-xs font-medium text-white mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                      required
                      disabled={isFormSubmitted}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-medium text-white mb-1">
                      Province / State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                      required
                      disabled={isFormSubmitted}
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2 ">
                    <label className="block text-xs font-medium text-white mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleFormChange}
                      className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                      required
                      disabled={isFormSubmitted}
                    >
                      {countryList.map((country) => (
                        <option key={country.name} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-medium text-white mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleFormChange}
                      className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                      disabled={isFormSubmitted}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full text-xs px-4 py-2 bg-gray-900 text-sol-green rounded-xl mb-2"
                    required
                    disabled={isFormSubmitted}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  type="submit"
                  className="w-full text-sm py-2 mt-4 bg-sol-green text-black font-medium rounded-xl hover:bg-sol-green-light transition-colors"
                >
                  {isFormSubmitted ? "Edit" : "Submit"}
                </motion.button>
              </div>
            </form>
            {isFormSubmitted && (
              <div className="px-10 mt-8">
                <div className="p-4 flex items-center justify-center border-2 border-sol-green rounded-xl">
                  <div className="flex space-x-4 w-full">
                    <div className="w-1/2 p-4">
                      <h3 className="text-sol-green text-lg font-bold mb-4">
                        Order Summarry
                      </h3>
                      <div className="flex justify-between text-sm  font-medium mb-2 text-white">
                        <span>Subtotal:</span>
                        <span>
                          {subtotalSOL} SOL{" "}
                          <span className="ml-1 text-gray-400">
                            (${subtotalUSD.toFixed(2)})
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium mb-2 text-white">
                        <span>Shipping:</span>
                        <span>
                          {(shippingCost / solPrice!).toFixed(5)} SOL{" "}
                          <span className="ml-1 text-gray-400">
                            (${shippingCost.toFixed(2)})
                          </span>
                        </span>
                      </div>
                      <hr className="border-t-2 border-sol-green my-2" />
                      <div className="flex justify-between text-md font-medium text-sol-purple mb-2">
                        <span>Total:</span>
                        <span>
                          {totalSOL} SOL (${orderTotalUSD.toFixed(2)})
                        </span>
                      </div>
                    </div>

                    <div className="w-1/2 flex flex-col items-end justify-center space-y-4">
                      <CustomWalletButton />
                      <motion.button
                        whileHover={{ scale: 0.9 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleSolanaClick}
                        disabled={!connected || isTransactionPending}
                        className={`w-[220px] text-sm md:text-md flex items-center font-medium justify-center text-white bg-black rounded-xl py-2 px-4 border-2 border-white hover:border-sol-green ${
                          !connected || isTransactionPending
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } mt-2`}
                      >
                        <SiSolana className="mr-2" />
                        {isTransactionPending
                          ? "Processing..."
                          : "Pay with Solana"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 0.9 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={handleUsdcClick}
                        disabled={!connected || isTransactionPending}
                        className={`w-[220px] text-sm md:text-md flex items-center font-medium justify-center text-white bg-black rounded-xl py-2 px-4 border-2 border-white hover:border-sol-green ${
                          !connected || isTransactionPending
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        } mt-2`}
                      >
                        <SiSolana className="mr-2" />
                        {isTransactionPending
                          ? "Processing..."
                          : "Pay with USDC"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isFormSubmitted && !connected && (
              <div className="text-center text-sm font-medium text-sol-purple mt-2 italic">
                Connect Solana Wallet to Pay in SOL/USDC
              </div>
            )}
          </div>
        </div>
      )}

      {transactionStatus === "success" && (
        <PurchaseModal
          cartItems={cartItems.map((cartItem) => {
            const matchingAsset = assets.find(
              (asset) => asset.id === cartItem.id
            );
            return {
              ...matchingAsset,
              quantity: cartItem.quantity,
            };
          })}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          totalSpent={orderTotalUSD.toString()}
          paymentMethod={paymentMethod}
          totalSOL={totalSOL}
          transactionSignature={transactionSignature}
          shippingCost={shippingCost}
          subtotalUSD={subtotalUSD}
          subtotalSOL={subtotalSOL}
        />
      )}
      {transactionStatus === "failure" && (
        <FailureModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
      <Footer />
    </>
  );
};
