import React from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useShoppingCart } from "@/context/shoppingCart";
import { motion } from "framer-motion";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalSpent: string;
  totalSOL: string;
  paymentMethod: "SOL" | "USDC";
  transactionSignature: string;
  shippingCost: number;
  subtotalUSD: number;
  subtotalSOL: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalSpent,
  totalSOL,
  paymentMethod,
  transactionSignature,
  shippingCost,
  subtotalUSD,
  subtotalSOL,
}) => {
  const { clearCart } = useShoppingCart();

  const handleKeepShopping = () => {
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg max-w-lg w-full relative border-2 border-sol-green shadow-2xl shadow-sol-green">
        <motion.button
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleKeepShopping}
          className="absolute top-2 right-2 text-white hover:text-sol-green"
        >
          <FaTimes size={20} />
        </motion.button>
        <div className="flex flex-col justify-center">
          <h2 className="text-center text-sol-green text-2xl font-bold">
            Thank you for your purchase!
          </h2>
          <h2 className="text-sm font-medium text-center py-4 text-white w-full md:w-[350px] mx-auto">
            We appreciate your order, we’re currently processing it. So hang
            tight and we’ll send you confirmation very soon!
          </h2>
        </div>

        {cartItems.map((item, index) => (
          <>
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <Image
                  src={item.image}
                  width={50}
                  height={50}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="ml-4 text-white">
                  <div className="font-bold text-md">{item.name}</div>
                  <div className="font-medium text-xs">
                    Quantity: {item.quantity}
                  </div>
                </div>
              </div>
              <div className="text-white font-medium text-sm ">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
            <hr className="border-t-2 border-sol-green my-2 w-full" />
          </>
        ))}
        <div className="flex justify-between font-medium text-sm text-white">
          <div>Subtotal:</div>
          <div>
            {paymentMethod === "SOL" ? (
              <>
                {subtotalSOL} SOL (${subtotalUSD.toFixed(2)})
              </>
            ) : (
              <>${subtotalUSD.toFixed(2)}</>
            )}
          </div>
        </div>

        <div className="flex justify-between font-medium text-sm text-white">
          <div>Shipping:</div>
          <div>${shippingCost.toFixed(2)}</div>
        </div>

        <hr className="border-t-2 border-sol-green my-2 w-full" />

        <div className="flex justify-between font-bold text-md text-white">
          <div>Total:</div>
          <div>
            {paymentMethod === "SOL" ? (
              <>
                {totalSOL} SOL (${totalSpent})
              </>
            ) : (
              <>{totalSpent} USDC</>
            )}
          </div>
        </div>

        <div className="mt-4">
          <a
            href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sol-green underline text-xs"
          >
            View Transaction
          </a>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
