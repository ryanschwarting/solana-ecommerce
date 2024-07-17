"use client";
import { SiSolana } from "react-icons/si";
import { useShoppingCart } from "../context/shoppingCart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSolPrice } from "../utils/solPrice";

export const ShoppingItem = ({
  image,
  id,
  name,
  price,
  description,
}: {
  image: string;
  id: number;
  name: string;
  price: number;
  description: string;
}) => {
  const { getItemQuantity } = useShoppingCart();
  const [solPrice, setSolPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getSolPrice();
      setSolPrice(price);
    };

    fetchPrice();
  }, []);

  const solEquivalent =
    solPrice !== null ? (price / solPrice).toFixed(2) : "Loading...";

  return (
    <div className="flex flex-col items-center">
      <div className="hover:underline decoration-sol-green">
        <div
          className={`relative bg-opacity-0 hover:bg-opacity-100 transform hover:scale-95 transition-transform duration-500 ease-in-out shadow-2xl`}
        >
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="rounded-xl"
          />
        </div>
        <div className="flex flex-col pt-2">
          <p className="text-[24px] font-medium">{name}</p>
          <p className="flex text-[22px] items-center font-normal">
            <span className="mr-1">
              <SiSolana />
            </span>
            {solEquivalent !== "Loading..." ? (
              <>
                {solEquivalent} SOL{" "}
                <span className="ml-1 text-gray-400">(${price})</span>
              </>
            ) : (
              "Loading..."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
