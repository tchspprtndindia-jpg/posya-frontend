"use client";

import { motion } from "framer-motion";

export default function OrganicProducts() {
  return (
    <section className="relative w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center why-us text-white px-8 md:px-16 py-12"
        >
          <p className="text-md tracking-widest theme-white-color">
            Why Choose us?
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-bold leading-tight theme-white-color">
            Our Organic Products
          </h2>
          <p className="mt-6 text-lg text-gray-200 leading-relaxed max-w-md ">
            The year 2020 was a game changer for everyone. For me, it was the
            chance to build my dreams in the high mountains of the Himalayas. A
            journey that began with passion and continues with purity…
          </p>
          <a
            href="#about"
            className="mt-8 w-50 inline-block px-8 py-3 bg-yellow-400 text-green-900 font-semibold rounded-full shadow-lg theme-white-bg-color transition-all duration-300"
          >
            Know More...
          </a>
        </motion.div>

        {/* Right Side Background Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/certified-organic.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/10" /> {/* subtle overlay */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
