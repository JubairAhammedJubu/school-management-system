"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[720px] mt-16 overflow-hidden bg-[#10001f] text-white">
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large diagonal strips */}
        <div className="absolute -left-20 -top-24 h-[340px] w-[120px] rotate-[40deg] rounded-[70px] bg-[#19082c]" />

        <div className="absolute left-[130px] -top-20 h-[350px] w-[105px] rotate-[40deg] rounded-[70px] bg-[#19082c]" />

        <div className="absolute right-[120px] -top-28 h-[360px] w-[110px] rotate-[40deg] rounded-[70px] bg-[#19082c]" />

        <div className="absolute right-[-40px] -top-32 h-[380px] w-[115px] rotate-[40deg] rounded-[70px] bg-[#19082c]" />

        {/* Bottom diagonal strips */}
        <div className="absolute -bottom-32 -left-10 h-[370px] w-[115px] rotate-[40deg] rounded-[70px] bg-[#19082c]" />

        <div className="absolute -bottom-36 right-[90px] h-[390px] w-[120px] rotate-[40deg] rounded-[70px] bg-[#19082c]" />

        <div className="absolute -bottom-32 right-[-30px] h-[390px] w-[120px] rotate-[40deg] rounded-[70px] bg-[#19082c]" />

        {/* Subtle ambient glow */}
        <div className="absolute left-1/2 top-[25%] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-[140px]" />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1200px] flex-col items-center px-5 pt-14 sm:px-8 lg:pt-16">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[760px] text-center"
        >
          <h1 className="text-[40px] font-bold leading-[1.05] tracking-[-0.045em] sm:text-[52px] md:text-[58px] lg:text-[62px]">
            Powerful Tools for Effective
            <br />
            School Management.
          </h1>

          <p className="mx-auto mt-5 max-w-[650px] text-[13px] leading-[1.7] text-[#aaa0b8] sm:text-[14px]">
            Your ultimate saas solution for effortless school administration
            and academic
            <br className="hidden sm:block" />
            excellence.simplify administrative tasks, enhance
          </p>
        </motion.div>

        {/* Buttons */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="mt-6 flex items-center gap-3"
        >
          <Link
            href="/register"
            className="
              group
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-full
              bg-gradient-to-r
              from-[#8c29ff]
              to-[#a02eff]
              px-7
              text-[12px]
              font-medium
              text-white
              shadow-[0_8px_25px_rgba(147,51,234,0.25)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_12px_30px_rgba(147,51,234,0.4)]
            "
          >
            Get started

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="#how-it-works"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-white/70
              px-5
              text-[12px]
              font-medium
              text-white
              transition-all
              duration-300
              hover:border-white
              hover:bg-white/10
            "
          >
            See How it works

            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/80">
              <Play
                size={7}
                fill="currentColor"
                className="ml-[1px]"
              />
            </span>
          </Link>
        </motion.div>

        {/* =========================================================
            BOTTOM VISUALS
        ========================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.25,
            ease: "easeOut",
          }}
          className="
            relative
            mt-8
            flex
            h-[300px]
            w-full
            max-w-[1040px]
            items-end
            justify-center
            gap-3
            sm:mt-9
            sm:gap-4
          "
        >
          {/* =====================================================
              CARD 1 — TEXT CARD
          ===================================================== */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              hidden
              h-[285px]
              w-[195px]
              overflow-hidden
              rounded-[27px]
              bg-[#f4f1f8]
              p-5
              text-[#303047]
              sm:block
            "
          >
            {/* Decorative wave */}

            <div className="absolute left-0 top-0 h-[105px] w-full overflow-hidden">
              <svg
                viewBox="0 0 260 110"
                className="absolute left-[-20px] top-0 h-full w-[290px]"
                fill="none"
              >
                {Array.from({ length: 11 }).map((_, index) => (
                  <path
                    key={index}
                    d={`M-20 ${20 + index * 7} C 50 ${
                      -10 + index * 5
                    }, 90 ${85 + index * 3}, 165 ${
                      42 + index * 5
                    } C 205 ${15 + index * 6}, 230 ${
                      65 + index * 4
                    }, 280 ${30 + index * 5}`}
                    stroke="#b7b1bc"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                ))}
              </svg>
            </div>

            <div className="absolute left-5 top-[112px]">
              <ArrowRight
                size={29}
                strokeWidth={1.5}
                className="text-[#3b3852]"
              />
            </div>

            <p className="absolute bottom-7 left-5 right-5 text-[14px] leading-[1.45]">
              Empower Your
              <br />
              Educational
              <br />
              Institution with
              <br />
              School Manager Pro
            </p>
          </motion.div>

          {/* =====================================================
              CARD 2 — 260%
          ===================================================== */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="
              hidden
              h-[200px]
              w-[112px]
              flex-col
              items-center
              justify-center
              rounded-[26px]
              bg-[#f1f2f5]
              text-center
              sm:flex
            "
          >
            <span className="text-[18px] font-semibold text-[#11111b]">
              260%
            </span>

            <p className="mt-1 px-3 text-[8px] leading-[1.35] text-[#88848e]">
              Your ultimate saas
              <br />
              solution for effortless
            </p>
          </motion.div>

          {/* =====================================================
              CARD 3 — CLASSROOM IMAGE
          ===================================================== */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              h-[145px]
              w-[185px]
              overflow-hidden
              rounded-[25px]
              bg-[#ddd]
              sm:h-[150px]
              sm:w-[200px]
            "
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85"
              alt="Team collaborating in a modern workspace"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/5" />
          </motion.div>

          {/* =====================================================
              CARD 4 — 98%
          ===================================================== */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="
              hidden
              h-[200px]
              w-[112px]
              flex-col
              items-center
              justify-center
              rounded-[26px]
              bg-[#f1f2f5]
              text-center
              sm:flex
            "
          >
            <span className="text-[18px] font-semibold text-[#11111b]">
              98%
            </span>

            <p className="mt-1 px-3 text-[8px] leading-[1.35] text-[#88848e]">
              our comprehensive suite
              <br />
              of tools and support.
            </p>
          </motion.div>

          {/* =====================================================
              CARD 5 — STUDENT IMAGE
          ===================================================== */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              hidden
              h-[285px]
              w-[200px]
              overflow-hidden
              rounded-[50px]
              sm:block
            "
          >
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=85"
              alt="Student studying with a laptop"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Second overlapping student shape */}

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              hidden
              h-[285px]
              w-[105px]
              overflow-hidden
              rounded-[50px]
              sm:block
            "
          >
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=500&q=85"
              alt="Student working on a laptop"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}