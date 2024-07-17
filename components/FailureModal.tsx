import React from "react";
import { FaTimes } from "react-icons/fa";

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FailureModal: React.FC<FailureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Transaction Failed</h2>
        <p className="text-gray-500">
          Your transaction could not be completed. Please try again.
        </p>
      </div>
    </div>
  );
};

export default FailureModal;
