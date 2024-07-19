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
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalSpent,
  paymentMethod,
  totalSOL,
  transactionSignature,
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
        <h2 className="flex justify-center text-sol-green text-2xl font-bold mb-4">
          Thank You for Your Purchase!
        </h2>
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center mb-4">
            <Image
              src={item.image}
              width={50}
              height={50}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="ml-4 text-white">
              <div className="font-bold">{item.name}</div>
              <div>Quantity: {item.quantity}</div>
              <div>Price: ${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        ))}
        <div className="font-bold text-lg text-white">
          {paymentMethod === "SOL" ? (
            <>
              Total Spent: {totalSOL} SOL (${totalSpent})
            </>
          ) : (
            <>Total Spent: {totalSpent} USDC</>
          )}
        </div>
        <div className="mt-2">
          <a
            href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
            // href={`https://solscan.io/tx/${transactionSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sol-green underline"
          >
            View Transaction
          </a>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
