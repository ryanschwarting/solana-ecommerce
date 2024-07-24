"use client";
import { NavBar } from "@/components/NavBar";
import React, { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function Pages() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);

    const hubspotData = {
      fields: [
        { name: "firstname", value: formState.firstName },
        { name: "lastname", value: formState.lastName },
        { name: "email", value: formState.email },
        { name: "phone", value: formState.mobile },
        { name: "company", value: formState.company },
        { name: "message", value: formState.message },
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
    };

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/46694864/19ab94d9-652c-4c9b-81b6-4e2d28341567`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hubspotData),
        }
      );

      if (response.ok) {
        setSubmitted(true); // Set the submitted state to true on successful submit
        console.log("Form submitted successfully");
      } else {
        console.error("Form submission error:", response.statusText);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <>
      <div className="py-4">
        <NavBar />
      </div>

      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 pt-10">
        <div className="flex flex-col p-4 md:p-0 lg:p-0 items-center space-y-4 md:space-y-0 md:items-start">
          <h2 className="font-poppins text-white font-medium md:text-[32px] text-[24px] pb-4 relative">
            Write Me
            <span className="absolute left-0 bottom-[0px] md:left-5 md:bottom-[8px] w-[100px] h-[2px] bg-[#14F195]"></span>
          </h2>
          <a
            href="mailto:0xKaktos@gmail.com"
            className="text-[#14F195] pt-8 inline-block underline text-[14px] tracking-tight transform transition-transform duration-300 hover:scale-95"
          >
            0xKaktos@gmail.com
          </a>
        </div>

        <div className="flex flex-col w-full p-4 md:p-4 lg:p-0 md:w-[530px] md:h-[786px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
            <div className="w-full">
              <label
                className="block text-white mb-2 font-medium text-[12px] lg:text-[14px]"
                htmlFor="firstName"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formState.firstName}
                onChange={handleChange}
                className="p-2 rounded-xl w-full h-[44px] text-sol-green bg-gray-900"
                required
              />
            </div>
            <div className="w-full">
              <label
                className="block text-white mb-2 font-medium text-[12px] lg:text-[14px]"
                htmlFor="lastName"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formState.lastName}
                onChange={handleChange}
                className="p-2 rounded-xl w-full h-[44px] text-sol-green bg-gray-900"
                required
              />
            </div>
            <div className="w-full">
              <label
                className="block text-white mb-2 font-medium text-[12px] lg:text-[14px]"
                htmlFor="email"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="p-2 rounded-xl w-full h-[44px] text-sol-green bg-gray-900"
                required
              />
            </div>
            <div className="w-full">
              <label
                className="block text-white mb-2 font-medium text-[12px] lg:text-[14px]"
                htmlFor="mobile"
              >
                Mobile{" "}
                <span className="text-white text-opacity-60">(Optional)</span>
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={formState.mobile}
                onChange={handleChange}
                className="p-2 rounded-xl w-full h-[44px] text-sol-green bg-gray-900"
              />
            </div>
            <div className="w-full">
              <label
                className="block text-white mb-2 font-medium text-[12px] lg:text-[14px]"
                htmlFor="company"
              >
                Company{" "}
                <span className="text-white text-opacity-60">(Optional)</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formState.company}
                onChange={handleChange}
                className="p-2 rounded-xl w-full h-[44px] text-sol-green bg-gray-900"
              />
            </div>
            <div className="w-full">
              <label
                className="block text-white mb-2 font-medium text-[12px] lg:text-[14px]"
                htmlFor="message"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message"
                value={formState.message}
                onChange={handleChange}
                className="p-2 w-full h-48 rounded-xl text-sol-green bg-gray-900 text-[12px] md:text-[14px]"
                required
              />
            </div>

            <div className="w-full flex flex-col items-end md:flex-row md:justify-between space-y-4 md:space-y-0">
              {submitted && (
                <div className="w-[160px] h-[32px] flex justify-center items-center font-semibold text-[12px] lg:text-[12px] text-[#14F195] bg-[#9945FF] border-l-2 border-l-[#14F195]">
                  Submitted Successfully!
                </div>
              )}
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                type="submit"
                className="bg-[#14F195] text-black py-2 px-6 h-[44px] rounded-full flex items-center"
              >
                <span className="mr-2 font-medium text-[12px] lg:text-[12px]">
                  Submit
                </span>
                <IoMdArrowDropright />
              </motion.button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
