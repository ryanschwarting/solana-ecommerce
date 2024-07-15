// "use client";
// import { createContext, ReactNode, useContext } from "react";
// import { useLocalStorage } from "../hooks/localStorage";

// type ShoppingCartProviderProps = {
//   children: ReactNode;
// };

// type CartItem = {
//   id: number;
//   quantity: number;
// };

// type ShoppingCartContext = {
//   getItemQuantity: (id: number) => number;
//   increaseCartQuantity: (id: number) => void;
//   decreaseCartQuantity: (id: number) => void;
//   removeFromCart: (id: number) => void;
//   cartQuantity: number;
//   cartItems: CartItem[];
// };

// const ShoppingCartContext = createContext<ShoppingCartContext | undefined>(
//   undefined
// );

// export function useShoppingCart() {
//   const context = useContext(ShoppingCartContext);
//   if (context === undefined) {
//     throw new Error(
//       "useShoppingCart must be used within a ShoppingCartProvider"
//     );
//   }
//   return context;
// }

// export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
//   const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
//     "shopping-cart",
//     []
//   );

//   const cartQuantity = cartItems.reduce(
//     (quantity, item) => item.quantity + quantity,
//     0
//   );

//   function getItemQuantity(id: number) {
//     return cartItems.find((item) => item.id === id)?.quantity || 0;
//   }

//   function increaseCartQuantity(id: number) {
//     setCartItems((currItems) => {
//       if (currItems.find((item) => item.id === id) == null) {
//         return [...currItems, { id, quantity: 1 }];
//       } else {
//         return currItems.map((item) => {
//           if (item.id === id) {
//             return { ...item, quantity: item.quantity + 1 };
//           } else {
//             return item;
//           }
//         });
//       }
//     });
//   }

//   function decreaseCartQuantity(id: number) {
//     setCartItems((currItems) => {
//       if (currItems.find((item) => item.id === id)?.quantity === 1) {
//         return currItems.filter((item) => item.id !== id);
//       } else {
//         return currItems.map((item) => {
//           if (item.id === id) {
//             return { ...item, quantity: item.quantity - 1 };
//           } else {
//             return item;
//           }
//         });
//       }
//     });
//   }

//   function removeFromCart(id: number) {
//     setCartItems((currItems) => currItems.filter((item) => item.id !== id));
//   }

//   return (
//     <ShoppingCartContext.Provider
//       value={{
//         getItemQuantity,
//         increaseCartQuantity,
//         decreaseCartQuantity,
//         removeFromCart,
//         cartItems,
//         cartQuantity,
//       }}
//     >
//       {children}
//     </ShoppingCartContext.Provider>
//   );
// }

"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useLocalStorage } from "../hooks/localStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isLoading: boolean;
};

const ShoppingCartContext = createContext<ShoppingCartContext | undefined>(
  undefined
);

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider"
    );
  }
  return context;
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id: number) {
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        isLoading,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
