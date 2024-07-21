"use client";
import { useShoppingCart } from "../context/shoppingCart";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { SiSolana } from "react-icons/si";
import { useEffect, useState } from "react";
import { assets } from "@/constants/images";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getSolPrice } from "../utils/solPrice"; // Adjust the path as needed
import { NavBar } from "./NavBar";

export default function ShoppingItemDetail() {
  const [solPrice, setSolPrice] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPrice = async () => {
      const price = await getSolPrice();
      setSolPrice(price);
    };
    fetchPrice();
  }, []);

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  const { id } = useParams();
  const item = Number(id);
  const matchingAsset = assets.find((asset) => asset.id === item);

  if (!matchingAsset) return <div>Item not found!</div>;

  const quantity = getItemQuantity(matchingAsset.id);

  // const parallaxVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 1.0 } },
  // };

  const solEquivalent =
    solPrice !== null
      ? (matchingAsset.price / solPrice).toFixed(2)
      : "Loading...";

  return (
    <>
      <div className="py-4">
        <NavBar />
      </div>

      <div className="flex justify-center h-full py-10 overflow-y-auto no-scrollbar bg-black">
        <motion.div
          className="flex justify-center items-center mt-2"
          // variants={parallaxVariants}
          // initial="hidden"
          // animate="visible"
        >
          <Image
            width={500}
            height={500}
            src={matchingAsset.image}
            alt={matchingAsset.name}
            className="rounded-xl mr-10"
          />
        </motion.div>

        {/* Display name, price, and Add to Cart functionality */}
        <div className="flex justify-center flex-col ml-12 space-y-5 text-white w-[500px]">
          <motion.p
            className="text-[36px] font-semibold"
            // variants={parallaxVariants}
            // initial="hidden"
            // animate="visible"
          >
            {matchingAsset.name}
          </motion.p>

          <motion.p
            className="flex text-[24px] font-medium items-center"
            // variants={parallaxVariants}
            // initial="hidden"
            // animate="visible"
            // transition={{ delay: 0.5 }}
          >
            <span className="mr-1">
              <SiSolana />
            </span>
            {solEquivalent} SOL{" "}
            <span className="ml-1 text-gray-400">(${matchingAsset.price})</span>
          </motion.p>
          <motion.hr
            // variants={parallaxVariants}
            // initial="hidden"
            // animate="visible"
            // transition={{ delay: 0.7 }}
            className="w-full border-t-2 border-sol-green my-2"
          />

          <motion.p
            className="text-[18px] font-medium flex items-center"
            // variants={parallaxVariants}
            // initial="hidden"
            // animate="visible"
            // transition={{ delay: 0.6 }}
          >
            {matchingAsset.description}
          </motion.p>
          {/* Add to Cart Functionality */}
          <motion.div
            className="flex gap-2 pt-4"
            // variants={parallaxVariants}
            // initial="hidden"
            // animate="visible"
            // transition={{ delay: 0.7 }}
          >
            {quantity === 0 ? (
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="bg-gray-900 text-white font-medium text-[18px] w-[200px] border-2 border-white hover:border-2 hover:border-sol-green p-3 rounded-xl flex justify-center items-center"
                onClick={() => increaseCartQuantity(matchingAsset.id)}
              >
                <MdOutlineShoppingBag className="mr-4 w-auto h-[24px]" /> Add To
                Cart
              </motion.button>
            ) : (
              <div className="flex items-center flex-col gap-2 bg-gray-900 text-white">
                <div className="flex justify-center gap-2 border-2 border-white hover:border-2 hover:border-sol-green rounded-xl py-2">
                  <motion.button
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    className="bg-gray-900 text-white  px-4 rounded-xl"
                    onClick={() => decreaseCartQuantity(matchingAsset.id)}
                  >
                    <FaMinus />
                  </motion.button>
                  <div className="bg-gray-900 text-white font-medium py-1 text-[18px] w-[100px] flex justify-center items-center rounded-xl ">
                    <span>{quantity} in cart</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 0.9 }}
                    whileTap={{ scale: 0.8 }}
                    className="bg-gray-900 text-white px-4 rounded-xl"
                    onClick={() => increaseCartQuantity(matchingAsset.id)}
                  >
                    <FaPlus />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
