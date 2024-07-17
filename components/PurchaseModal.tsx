import React from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useShoppingCart } from "@/context/shoppingCart";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  totalSOL: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalSOL,
}) => {
  const { clearCart } = useShoppingCart();

  const handleKeepShopping = () => {
    clearCart();
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
        <button
          onClick={handleKeepShopping}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4">
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
            <div className="ml-4">
              <div className="font-bold">{item.name}</div>
              <div className="text-gray-500">Quantity: {item.quantity}</div>
              <div className="text-gray-500">
                Price: ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
        <div className="font-bold text-lg">Total Spent: {totalSOL} SOL</div>
      </div>
    </div>
  );
};

export default PurchaseModal;
