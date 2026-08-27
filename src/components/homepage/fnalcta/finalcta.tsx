"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="w-full bg-white px-5 py-20 sm:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-[1055px] flex-col items-center text-center"
      >
        {/* Heading */}
        <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.045em] text-[#17171b] sm:text-[38px]">
          It&apos;s easy to get started
        </h2>

        {/* Reviews */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[13px] font-medium text-[#96969c] sm:text-[14px]">
            432,000+
          </span>

          <div className="flex items-center gap-[2px]">
            {[1, 2, 3, 4].map((star) => (
              <Star
                key={star}
                className="h-[14px] w-[14px] fill-[#ff8a19] text-[#ff8a19]"
                strokeWidth={1.5}
              />
            ))}

            <Star
              className="h-[14px] w-[14px] fill-[#d8d8dc] text-[#d8d8dc]"
              strokeWidth={1.5}
            />
          </div>

          <span className="text-[13px] text-[#96969c] sm:text-[14px]">
            reviews on Google Play and App Store
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group flex h-[42px] min-w-[150px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9235f5] to-[#8b2cf2] px-7 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(143,48,244,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(143,48,244,0.28)]"
          >
            Get started

            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/#how-it-works"
            className="flex h-[42px] min-w-[140px] items-center justify-center rounded-full border border-[#a9a9ad] bg-white px-7 text-[11px] font-medium text-[#57575d] transition-all duration-300 hover:border-[#7f7f84] hover:bg-[#fafafa]"
          >
            See How it works
          </Link>
        </div>
      </motion.div>
    </section>
  );
}