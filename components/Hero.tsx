"use client";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl  pt-4">
      <div className="mb-8 flex flex-wrap justify-between md:mb-16">
        <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
          <h1 className="mb-4 text-[24px] lg:text-[52px] font-semibold text-white sm:text-5xl md:mb-8 ">
            Top Fashion for a top price!
          </h1>
          <p className="max-w-md leading-relaxed text-white font-light text-[18px]">
            We sell only the most exclusive and high quality products for you.
            We are the best so come and shop with us.
          </p>
        </div>

        <div className="flex w-full lg:w-2/3">
          <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-xl bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
            <Image
              src={"/hero1.webp"}
              alt="Great Photo"
              className="h-full w-full object-cover object-center"
              priority
              width={500}
              height={500}
            />
          </div>

          <div className="overflow-hidden rounded-xl bg-gray-100 shadow-lg">
            <Image
              src={"/hero2.webp"}
              alt="Great Photo"
              className="h-full w-full object-cover object-center"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex h-12 w-64 divide-x overflow-hidden rounded-lg border">
          <Link
            href="/Men"
            className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
          >
            Men
          </Link>
          <Link
            href="/Women"
            className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
          >
            Women
          </Link>
          <Link
            href="/Teens"
            className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
          >
            Teens
          </Link>
        </div>
      </div> */}
    </section>
  );
};

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export const Hero = () => {
//   const parallaxVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 2.0 } },
//   };

//   return (
//     <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl pt-4">
//       <div className="mb-8 flex flex-wrap justify-between md:mb-16">
//         <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
//           <motion.h1
//             className="mb-4 text-[24px] lg:text-[52px] font-semibold text-white sm:text-5xl md:mb-8"
//             variants={parallaxVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             Top Fashion for a top price!
//           </motion.h1>
//           <motion.p
//             className="max-w-md leading-relaxed text-white font-light text-[18px]"
//             variants={parallaxVariants}
//             initial="hidden"
//             animate="visible"
//             transition={{ delay: 0.7 }}
//           >
//             We sell only the most exclusive and high quality products for you.
//             We are the best so come and shop with us.
//           </motion.p>
//         </div>

//         <div className="flex w-full lg:w-2/3">
//           <motion.div
//             className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-xl bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0"
//             variants={parallaxVariants}
//             initial="hidden"
//             animate="visible"
//             transition={{ delay: 1.4 }}
//           >
//             <Image
//               src={"/hero1.webp"}
//               alt="Great Photo"
//               className="h-full w-full object-cover object-center"
//               priority
//               width={500}
//               height={500}
//             />
//           </motion.div>

//           <motion.div
//             className="overflow-hidden rounded-xl bg-gray-100 shadow-lg"
//             variants={parallaxVariants}
//             initial="hidden"
//             animate="visible"
//             transition={{ delay: 2.1 }}
//           >
//             <Image
//               src={"/hero2.webp"}
//               alt="Great Photo"
//               className="h-full w-full object-cover object-center"
//               width={500}
//               height={500}
//               priority
//             />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };
