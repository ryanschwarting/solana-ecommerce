import { SiSolana } from "react-icons/si";
import { useShoppingCart } from "../context/shoppingCart";
import Image from "next/image";

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
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
        <div className="flex flex-col pt-2">
          <p className="text-[24px] font-semibold">{name}</p>
          <p className="flex text-[22px] items-center font-medium">
            <span className="mr-1">
              <SiSolana />
            </span>
            {price}
          </p>
        </div>
      </div>
    </div>
  );
};
