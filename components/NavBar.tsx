"use client";
import React from "react";
import Link from "next/link";
import { SiSolana } from "react-icons/si";
import "@solana/wallet-adapter-react-ui/styles.css";
import { motion } from "framer-motion";
import { CustomWalletButton } from "./CustomWalletButton";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useShoppingCart } from "../context/shoppingCart";

export const NavBar: React.FC = () => {
  const { cartQuantity, isLoading } = useShoppingCart();

  return (
    <nav className="bg-sol-green p-10 h-16 rounded-full ">
      <div className="max-w-7xl mx-auto flex  justify-between items-center h-full">
        <Link href="/">
          <button className="flex items-center text-sol-purple font-bold text-[28px]">
            Crypto
            <span className="ml-2">
              <SiSolana />
            </span>
            tore
          </button>
        </Link>

        <div className="flex flex-row gap-4">
          <CustomWalletButton />
          <Link href={"/checkout"}>
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              className="flex items-center justify-center bg-white h-[40px] md:h-[60px] px-4 rounded-xl text-black font-medium"
            >
              <MdOutlineShoppingBag className="mr-2 text-[24px]" />
              <span className="text-[22px] items-center mt-0.5">
                {isLoading ? "Loading..." : cartQuantity}
              </span>
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
