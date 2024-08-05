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

// import { NextResponse } from "next/server";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // Function to get all active products from Stripe
// const getActiveProducts = async () => {
//   const checkProducts = await stripe.products.list();
//   const availableProducts = checkProducts.data.filter(
//     (product: any) => product.active === true
//   );
//   return availableProducts;
// };

// export const POST = async (request: any) => {
//   const { products } = await request.json(); // Get products from request body
//   const data: { name: string; price: number; quantity: number }[] = products;

//   // Get active products from Stripe
//   let activeProducts = await getActiveProducts();

//   try {
//     // Ensure each product exists on Stripe
//     for (const product of data) {
//       const stripeProduct = activeProducts.find(
//         (stripeProduct: any) =>
//           stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
//       );

//       if (!stripeProduct) {
//         await stripe.products.create({
//           name: product.name,
//           default_price_data: {
//             unit_amount: product.price * 100,
//             currency: "usd",
//           },
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error in creating a new product", error);
//     return NextResponse.json(
//       { error: "Failed to create products on Stripe" },
//       { status: 500 }
//     );
//   }

//   // Refresh active products
//   activeProducts = await getActiveProducts();
//   let stripeItems: any = [];

//   // Create line items for Stripe checkout session
//   for (const product of data) {
//     const stripeProduct = activeProducts.find(
//       (prod: any) => prod?.name?.toLowerCase() === product?.name?.toLowerCase()
//     );

//     if (stripeProduct) {
//       stripeItems.push({
//         price: stripeProduct.default_price,
//         quantity: product.quantity,
//         // dynamic_tax_rates: ["txr_1PjQiJGbZAwdK8CRgbaOex6b"],
//       });
//     }
//   }

//   // Create a checkout session
//   try {
//     const session = await stripe.checkout.sessions.create({
//       shipping_address_collection: {
//         allowed_countries: ["US", "CA"], // Specify allowed countries
//       },
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             type: "fixed_amount",
//             fixed_amount: {
//               amount: 1000,
//               currency: "usd",
//             },
//             display_name: "Shipping",
//             delivery_estimate: {
//               minimum: {
//                 unit: "business_day",
//                 value: 5,
//               },
//               maximum: {
//                 unit: "business_day",
//                 value: 7,
//               },
//             },
//           },
//         },
//         // {
//         //   shipping_rate_data: {
//         //     type: "fixed_amount",
//         //     fixed_amount: {
//         //       amount: 1500,
//         //       currency: "usd",
//         //     },
//         //     display_name: "Next day air",
//         //     delivery_estimate: {
//         //       minimum: {
//         //         unit: "business_day",
//         //         value: 1,
//         //       },
//         //       maximum: {
//         //         unit: "business_day",
//         //         value: 1,
//         //       },
//         //     },
//         //   },
//         // },
//       ],
//       line_items: stripeItems,
//       mode: "payment",
//       // success_url: "http://localhost:3000/payment-success",
//       // success_url: "https://solana-ecommerce-o1qe.vercel.app/payment-success",
//       cancel_url: "http://localhost:3000/cancel",
//       // cancel_url: "https://solana-ecommerce-o1qe.vercel.app/cancel",
//       automatic_tax: { enabled: true },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.error("Error creating checkout session", error);
//     return NextResponse.json(
//       { error: "Failed to create checkout session" },
//       { status: 500 }
//     );
//   }
// };

// import { NextResponse } from "next/server";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // Function to get all active products from Stripe
// const getActiveProducts = async () => {
//   const checkProducts = await stripe.products.list();
//   const availableProducts = checkProducts.data.filter(
//     (product: any) => product.active === true
//   );
//   return availableProducts;
// };

// export const POST = async (request: any) => {
//   try {
//     const { products } = await request.json(); // Get products from request body
//     const data: { name: string; price: number; quantity: number }[] = products;

//     // Calculate order total, subtotal, and shipping
//     const subtotalUSD = data.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//     const shippingCost = 1000; // fixed shipping cost, in cents
//     const orderTotalUSD = subtotalUSD + shippingCost;

//     // Get active products from Stripe
//     let activeProducts = await getActiveProducts();

//     // Ensure each product exists on Stripe
//     for (const product of data) {
//       const stripeProduct = activeProducts.find(
//         (stripeProduct: any) =>
//           stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
//       );

//       if (!stripeProduct) {
//         await stripe.products.create({
//           name: product.name,
//           default_price_data: {
//             unit_amount: product.price * 100,
//             currency: "usd",
//           },
//         });
//       }
//     }

//     // Refresh active products
//     activeProducts = await getActiveProducts();
//     let stripeItems: any = [];

//     // Create line items for Stripe checkout session
//     for (const product of data) {
//       const stripeProduct = activeProducts.find(
//         (prod: any) =>
//           prod?.name?.toLowerCase() === product?.name?.toLowerCase()
//       );

//       if (stripeProduct) {
//         stripeItems.push({
//           price: stripeProduct.default_price,
//           quantity: product.quantity,
//         });
//       }
//     }

//     // Create a checkout session
//     const session = await stripe.checkout.sessions.create({
//       shipping_address_collection: {
//         allowed_countries: ["US", "CA"], // Specify allowed countries
//       },
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             type: "fixed_amount",
//             fixed_amount: {
//               amount: shippingCost,
//               currency: "usd",
//             },
//             display_name: "Shipping",
//             delivery_estimate: {
//               minimum: {
//                 unit: "business_day",
//                 value: 5,
//               },
//               maximum: {
//                 unit: "business_day",
//                 value: 7,
//               },
//             },
//           },
//         },
//       ],
//       line_items: stripeItems,
//       mode: "payment",
//       success_url: `http://localhost:3000/payment-success?amount=${orderTotalUSD}&subtotal=${subtotalUSD}&shipping=${shippingCost}`,
//       // success_url: `https://solana-ecommerce-o1qe.vercel.app/payment-success?amount=${orderTotalUSD}&subtotal=${subtotalUSD}&shipping=${shippingCost}`,
//       cancel_url: "http://localhost:3000/cancel",
//       // cancel_url: "https://solana-ecommerce-o1qe.vercel.app/cancel",
//       automatic_tax: { enabled: true },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.error("Error creating checkout session", error);
//     return NextResponse.json(
//       { error: "Failed to create checkout session" },
//       { status: 500 }
//     );
//   }
// };

import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getActiveProducts = async () => {
  const checkProducts = await stripe.products.list();
  return checkProducts.data.filter((product: any) => product.active);
};

export const POST = async (request: any) => {
  try {
    const { products } = await request.json();
    const data: { name: string; price: number; quantity: number }[] = products;

    // Calculate subtotal and shipping cost in cents
    const subtotalUSD = data.reduce(
      (sum, item) => sum + item.price * 100 * item.quantity,
      0
    );
    const shippingCost = 1000; // Fixed shipping cost in cents
    const orderTotalUSD = subtotalUSD + shippingCost;

    let activeProducts = await getActiveProducts();

    for (const product of data) {
      const stripeProduct = activeProducts.find(
        (stripeProduct: any) =>
          stripeProduct.name.toLowerCase() === product.name.toLowerCase()
      );

      if (!stripeProduct) {
        await stripe.products.create({
          name: product.name,
          default_price_data: {
            unit_amount: product.price * 100, // Convert price to cents
            currency: "usd",
          },
        });
      }
    }

    activeProducts = await getActiveProducts();
    const stripeItems = data.map((product) => {
      const stripeProduct = activeProducts.find(
        (prod: any) => prod.name.toLowerCase() === product.name.toLowerCase()
      );

      return {
        price: stripeProduct.default_price,
        quantity: product.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MX"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingCost,
              currency: "usd",
            },
            display_name: "Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ],
      line_items: stripeItems,
      mode: "payment",
      // success_url: `http://localhost:3000/payment-success?amount=${orderTotalUSD}&subtotal=${subtotalUSD}&shipping=${shippingCost}`,
      success_url: `https://solana-ecommerce-o1qe.vercel.app/payment-success?amount=${orderTotalUSD}&subtotal=${subtotalUSD}&shipping=${shippingCost}`,
      // cancel_url: "http://localhost:3000/cancel",
      cancel_url: "https://solana-ecommerce-o1qe.vercel.app/cancel",
      automatic_tax: { enabled: true },
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
