"use client";
import { ShoppingItem } from "./ShoppingItem";
import { assets } from "../constants/productData";
import Link from "next/link";
import "../css/hologramStyles.css";

export const LandingPage = () => {
  return (
    <div className="py-2 bg-black text-white">
      <h1 className="mb-8 text-[52px] font-semibold">Store</h1>
      <div className="flex justify-between mb-5 text-[20px]">
        <div>
          <h3 className="limitedDesignText font-light text-[18px] text-sol-green">
            Limited Designs
          </h3>
        </div>
        <div>
          <h3 className="font-light text-[18px] text-sol-green">
            Buy with Solana, USDC or Credit Card
          </h3>
        </div>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 select-none mb-10">
        {assets.map((asset, index) => {
          return (
            <Link href={`/item-detail/${asset.id}`} key={asset.image}>
              <div>
                <ShoppingItem {...asset} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
