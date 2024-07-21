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

  // const navVariants = {
  //   hidden: { y: -150, opacity: 0 },
  //   visible: {
  //     y: 0,
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.2, // this will stagger the children's animations
  //     },
  //   },
  // };

  // const navItemVariants = {
  //   hidden: { y: -20, opacity: 0 },
  //   visible: { y: 0, opacity: 1 },
  // };

  return (
    <>
      <motion.nav
        className="p-10 h-24 shadow-lg shadow-sol-green rounded-xl"
        // initial="hidden"
        // animate="visible"
        // variants={navVariants}
        // transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
          <Link href="/">
            <motion.button
              className="flex items-center text-sol-green font-bold text-[32px]"
              // variants={navItemVariants}
            >
              Crypto
              <span className="ml-2">
                <SiSolana />
              </span>
              tore
            </motion.button>
          </Link>

          <div className="flex flex-row gap-4">
            <motion.div
            // variants={navItemVariants}
            >
              <CustomWalletButton />
            </motion.div>
            <Link href={"/checkout"}>
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="flex items-center justify-center bg-gray-900 h-[40px] md:h-[60px] px-4 rounded-xl text-white border-2 border-white hover:border-2 hover:border-sol-green font-medium"
                // variants={navItemVariants}
              >
                <MdOutlineShoppingBag className="text-[24px] items-center" />
                {!isLoading && cartQuantity > 0 && (
                  <span className="ml-2 text-[22px] items-center mt-0.5">
                    {cartQuantity}
                  </span>
                )}
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>
      {/* <hr className="mt-2 border-t-2 border-sol-green "></hr> */}
    </>
  );
};
