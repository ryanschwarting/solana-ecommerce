// import { NextRequest, NextResponse } from "next/server";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     const { amount } = await request.json();

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Internal Error:", error);
//     // Handle other errors (e.g., network issues, parsing errors)
//     return NextResponse.json(
//       { error: `Internal Server Error: ${error}` },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Function to get all active products from Stripe
const getActiveProducts = async () => {
  const checkProducts = await stripe.products.list();
  const availableProducts = checkProducts.data.filter(
    (product: any) => product.active === true
  );
  return availableProducts;
};

export const POST = async (request: any) => {
  const { products } = await request.json(); // Get products from request body
  const data: { name: string; price: number; quantity: number }[] = products;

  // Get active products from Stripe
  let activeProducts = await getActiveProducts();

  try {
    // Ensure each product exists on Stripe
    for (const product of data) {
      const stripeProduct = activeProducts.find(
        (stripeProduct: any) =>
          stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
      );

      if (!stripeProduct) {
        await stripe.products.create({
          name: product.name,
          default_price_data: {
            unit_amount: product.price * 100,
            currency: "usd",
          },
        });
      }
    }
  } catch (error) {
    console.error("Error in creating a new product", error);
    return NextResponse.json(
      { error: "Failed to create products on Stripe" },
      { status: 500 }
    );
  }

  // Refresh active products
  activeProducts = await getActiveProducts();
  let stripeItems: any = [];

  // Create line items for Stripe checkout session
  for (const product of data) {
    const stripeProduct = activeProducts.find(
      (prod: any) => prod?.name?.toLowerCase() === product?.name?.toLowerCase()
    );

    if (stripeProduct) {
      stripeItems.push({
        price: stripeProduct.default_price,
        quantity: product.quantity,
      });
    }
  }

  // Create a checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: stripeItems,
      mode: "payment",
      // success_url: "http://localhost:3000/payment-success",
      // success_url: `http://localhost:3000/payment-success?amount=${amount}&subtotal=${subtotal}&shipping=${shipping}`,
      success_url: "https://solana-ecommerce-o1qe.vercel.app/payment-success",

      // cancel_url: "http://localhost:3000/cancel",
      cancel_url: "https://solana-ecommerce-o1qe.vercel.app/cancel",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
};
