"use client";
import { useState } from "react";
import { ShoppingItem } from "./ShoppingItem";
import { assets } from "../constants/images";
import Link from "next/link";
import "../css/hologramStyles.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const LandingPage = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.0 } },
  };

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.8,
  });

  return (
    <div className="py-2 bg-black text-white">
      <motion.h1
        ref={titleRef}
        variants={fadeInUp}
        initial="hidden"
        animate={titleInView ? "visible" : "hidden"}
        transition={{ duration: 0.1 }}
        className="mb-8 text-[52px] font-semibold"
      >
        Store
      </motion.h1>
      <div className="flex justify-between mb-5 text-[20px]">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          transition={{ duration: 0.1 }}
        >
          <h3 className="limitedDesignText font-light text-[18px]">
            Limited Designs
          </h3>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          transition={{ duration: 0.1 }}
        >
          <h3 className="font-light text-[18px]">
            Buy with Solana, USDC or Credit Card
          </h3>
        </motion.div>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 select-none mb-10">
        {assets.map((asset, index) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });

          return (
            <Link href={`/item-detail/${asset.id}`} key={asset.image}>
              <motion.div
                ref={ref}
                variants={fadeInUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.1, delay: index * 0.2 }}
              >
                <ShoppingItem {...asset} />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
