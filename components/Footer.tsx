"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

function Footer() {
  const path = usePathname();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const dataCompany = [
    { link: "/about_us", name: "About" },
    { link: "/contact-us", name: "Contact" },
    { link: "/faqs", name: "FAQ" },
    { link: "https://solana.com/docs", name: "Documentation" },
  ];

  const dataSocial = [
    { link: "https://x.com/KaktosSol", icon: <FaXTwitter size={24} /> },

    // {
    //   link: "https://www.linkedin.com/in/ryanschwarting/",
    //   icon: <FaLinkedinIn size={24} />,
    // },
    // { link: "https://github.com/ryanschwarting", icon: <FaGithub size={24} /> },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const PORTAL_ID = "46694864";
    const FORM_ID = "d9176a2e-ccfe-4eba-96ae-8dc5ca7d74da";

    if (!email) {
      console.error("Form fields are missing");
      return;
    }

    const requestBody = {
      portalId: PORTAL_ID,
      formGuid: FORM_ID,
      fields: [
        {
          name: "email",
          value: email,
        },
      ],
    };

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("Form submission successful");
        setMessage("Subscription successful");
        setEmail(""); // Reset the email field
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        console.error("Form submission error");
        const responseData = await response.json();
        console.error(responseData);
        setMessage("Subscription failed");
      }
    } catch (error) {
      console.error("There was an error submitting the form", error);
      setMessage("Subscription failed");
    }
  };

  return (
    <div className="flex justify-center items-center px-2 md:px-0  ">
      <div className="bg-black border-t-2 border-l-2 border-r-2 border-sol-green p-10 w-full mt-24 rounded-t-xl">
        <div className="flex flex-wrap justify-between mb-8">
          <div className="w-full lg:w-1/3 mb-8 lg:mb-0">
            <div className="flex flex-col">
              <p className="font-normal text-[14px] text-white leading-[20px] tracking-tight mt-4">
                Contact me directly
              </p>
              <p className="font-normal text-[14px] text-white leading-[20px] tracking-tight">
                with any questions.
              </p>
              <a
                className="mt-4 text-sol-green text-[14px] tracking-tight  "
                href="/contact-us"
              >
                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                >
                  Contact Form
                </motion.button>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <h2 className="ml-0 md:ml-1 font-normal text-white text-[14px] tracking-tight leading-[20px]">
              The latest deals and savings, sent to your inbox.
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex mt-4 items-center bg-gray-900 rounded-full p-1 pr-1"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow p-2 text-[14px] text-sol-green bg-gray-900 border-none outline-none rounded-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-sol-green text-black font-medium text-[14px] leading-[24px] tracking-tight px-4 py-2 rounded-full transform transition-transform duration-300 hover:scale-95"
              >
                Sign Up
              </button>
            </form>
            {message && (
              <p className="text-[#14F195] text-[14px] mt-2">{message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center border-t-2 pt-4 border-sol-green">
          <p className="text-white text-[14px] md:text-[14px] sm:mb-0 mr-2">
            &copy; 2024 Crypto Store. All rights reserved.
          </p>
          <div className="text-white text-[12px] justify-center space-x-4">
            <ul className="flex space-x-6">
              {dataSocial.map((item, index) => (
                <motion.li
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  key={index}
                >
                  <a
                    href={item.link}
                    className="font-normal text-white text-[14px] md:text-[14px] tracking-tight leading-[20px] hover:text-[#14F195]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.icon}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
