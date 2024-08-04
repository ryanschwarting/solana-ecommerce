"use client";
import React from "react";
import Link from "next/link";
import { SiSolana } from "react-icons/si";
import "@solana/wallet-adapter-react-ui/styles.css";
import { motion } from "framer-motion";
import { CustomWalletButton } from "./CustomWalletButton";
import { FiShoppingCart } from "react-icons/fi";
import { useShoppingCart } from "../context/shoppingCart";

export const NavBar: React.FC = () => {
  const { cartQuantity, isLoading } = useShoppingCart();

  return (
    <>
      <motion.nav className="p-10 h-24 border-b-2 border-sol-green">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
          <Link href="/">
            <motion.button className="flex items-center text-sol-green font-bold text-[32px]">
              Crypto
              <span className="ml-2">
                <SiSolana />
              </span>
              tore
            </motion.button>
          </Link>

          <div className="flex flex-row gap-4">
            <Link href={"/checkout"}>
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="flex items-center justify-center bg-gray-900 h-[40px] md:h-[60px] px-4 rounded-xl text-white border-2 border-white hover:border-2 hover:border-sol-green font-medium"
              >
                <FiShoppingCart className="text-[24px] items-center" />
                <span className="mx-2 mt-0.5 text-lg">My Cart</span>

                {!isLoading && cartQuantity > 0 && (
                  <span className="ml-1 text-lg items-center mt-0.5 text-white">
                    {cartQuantity}
                  </span>
                )}
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
