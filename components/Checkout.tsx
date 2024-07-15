"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useShoppingCart } from "@/context/shoppingCart";
import sadCart from "../assets/sad-cart-3.jpg";
import { FaPlus, FaMinus } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { BsCreditCardFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { PiKnifeFill } from "react-icons/pi";
import { assets } from "@/constants/images";
import Image from "next/image";
import { motion } from "framer-motion";

export const CartCheckout = () => {
  const {
    cartItems,
    cartQuantity,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const [isTransactionPending, setIsTransactionPending] = useState(false); // State to track transaction status
  //   const { contractProvider, contractSigner } = useEthereum();
  const [totalSupplies, setTotalSupplies] = useState<number | undefined>(); // change argument to undefined
  const [remainingSupplies, setRemainingSupplies] = useState<{
    [key: number]: number;
  }>({});
  const [transactionSuccessful, setTransactionSuccessful] = useState(false);

  if (isTransactionPending || transactionSuccessful || cartItems.length !== 0)
    return (
      <div className="bg-black text-white p-8 h-full">
        {transactionSuccessful && (
          <div className="fixed flex flex-col top-0 left-0 w-full h-full space-y-7 items-center justify-center bg-black bg-opacity-90 z-50">
            <div className="text-[35px] text-white  mb-5">
              {" "}
              Thank you for your purchase!{" "}
            </div>
            <a
              // href={`https://opensea.io/assets/${contractAddress}/${tokenId}`}
              href="https://testnets.opensea.io/account" //delete testnets for prod
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex justify-center bg-black text-white  py-3 px-8 text-[18px] font-normal rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out">
                View your collectible on OpenSea!
              </button>
            </a>

            <Link
              href={"/"}
              className="flex justify-center bg-black text-white  py-3 px-8 text-[18px] font-normal rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
            >
              Buy More ?
            </Link>
          </div>
        )}
        {isTransactionPending && (
          <div className="fixed flex flex-col top-0 left-0 w-full h-full items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="text-[28px] text-black  mb-10">
              Waiting for your transaction to complete!{" "}
            </div>
            <PiKnifeFill className="animate-spin text-black text-[50px]" />
            {/* <div style={{ width: "480px" }}>
              <iframe
                allow="fullscreen"
                height="320"
                src="https://giphy.com/embed/u2wg2uXJbHzkXkPphr/video"
                width="480"
              ></iframe>
            </div> */}
          </div>
        )}
        <div className="text-sol-green flex justify-center font-medium mb-10 text-[44px]">
          Shopping Cart
        </div>
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

            return (
              <div
                className="flex justify-center font-normal"
                key={cartItem.id}
              >
                <li className="flex items-center justify-between px-5 py-4 w-[800px] border-b">
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
                        className="w-20 h-20 object-cover rounded-xl hover:scale-95 transition-transform duration-500 ease-in-ou"
                      />
                    </Link>
                    <span className="text-[20px]">{matchingAsset.name}</span>
                  </div>
                  <div className="flex items-center flex-col gap-2 text-black">
                    <div className="flex justify-center  gap-2">
                      <motion.button
                        whileHover={{ scale: 0.9 }}
                        whileTap={{ scale: 0.8 }}
                        className="bg-black text-white p-1 rounded-md w-6 items-center"
                        onClick={() => decreaseCartQuantity(matchingAsset.id)}
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
        <div className="flex justify-center font-semibold text-[24px] mt-10 text-sol-green">
          Payment Method
        </div>
        <div className="flex justify-center space-x-3 text-black my-8 text-[18px]">
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            className="flex bg-white rounded-lg py-2 px-3"
            // onClick={handleCryptoPayment}
          >
            <SiSolana className="mt-1 mr-2" />
            Buy with Solana
          </motion.button>
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            className="flex bg-white rounded-lg py-2 px-3 "
            // onClick={handleCryptoPayment}
          >
            <SiSolana className="mt-1 mr-2" />
            Buy with USDC
          </motion.button>
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            className="flex bg-white rounded-lg py-2 px-3"
          >
            <BsCreditCardFill className="mt-1 mr-2" />
            Credit or Debit Card
          </motion.button>
        </div>
      </div>
    );

  return (
    <div className="bg-black text-white h-screen">
      <div className="text-sol-green flex justify-center font-medium my-10 text-[52px] ">
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
  );
};
