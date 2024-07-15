"use client";
import { useShoppingCart } from "../context/shoppingCart";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import { BsTrash3 } from "react-icons/bs";
import { SiSolana } from "react-icons/si";
import { useEffect } from "react";
import { assets } from "@/constants/images";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ShoppingItemDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
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

  return (
    <div className="flex justify-center h-full py-10 overflow-y-auto no-scrollbar bg-black">
      <div className="flex justify-center items-center mt-2 ">
        <Image
          width={500}
          height={500}
          src={matchingAsset.image}
          alt={matchingAsset.name}
          className="rounded-xl mr-10"
        />
      </div>

      {/* Display name, price, and Add to Cart functionality */}
      <div className="flex justify-center flex-col ml-12 space-y-5 text-white w-[500px]">
        <p className="text-[36px] font-semibold">{matchingAsset.name}</p>

        <p className="flex text-[24px] font-medium items-center">
          <span className="mr-1">
            <SiSolana />
          </span>{" "}
          {matchingAsset.price}
        </p>
        <hr className="w-full border-t-2 border-sol-green my-2" />

        <p className="text-[18px] font-light flex items-center">
          {matchingAsset.description}
        </p>
        {/* Add to Cart Functionality */}
        <div className="flex gap-2 pt-4 ">
          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              className="bg-black text-white font-light text-[18px] w-[200px] border-2 border-white p-3 rounded-xl flex justify-center items-center"
              onClick={() => increaseCartQuantity(matchingAsset.id)}
            >
              <MdOutlineShoppingBag className="mr-4 w-auto h-[24px]" /> Add To
              Cart
            </motion.button>
          ) : (
            <div className="flex items-center flex-col gap-2 bg-black text-white">
              <div className="flex justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  className="bg-black text-white  px-4 rounded-xl"
                  onClick={() => decreaseCartQuantity(matchingAsset.id)}
                >
                  <FaMinus />
                </motion.button>
                <div className="bg-black text-white border-2 py-1 border-white text-[16px] w-[100px] flex justify-center items-center rounded-xl ">
                  <span>{quantity} in cart</span>
                </div>
                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  className="bg-black text-white px-4 rounded-xl"
                  onClick={() => increaseCartQuantity(matchingAsset.id)}
                >
                  <FaPlus />
                </motion.button>
              </div>
            </div>
          )}
          {/* <button
            className={` py-2 flex justify-center ${
              quantity === 0 ? "opacity-0" : ""
            }`}
            onClick={() => removeFromCart(matchingAsset.id)}
          >
            <BsTrash3 />
          </button> */}
        </div>
      </div>
    </div>
  );
}
