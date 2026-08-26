"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "EduGenius has truly transformed how we manage our school's operations. The platform is intuitive, easy to use, and has streamlined our daily workflow.",
    name: "Theresa Webb",
    role: "CEO at wolf-pixel",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "As an educator, I've used many management systems, but EduGenius stands out for its comprehensive features and excellent customer support.",
    name: "Devon Lane",
    role: "CEO at Groupon",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "Our school has seen a significant improvement in communication and collaboration since implementing EduGenius. Parents and teachers love it.",
    name: "Esther Howard",
    role: "CEO at Puzzle Huddle",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
  },
];

export default function CustomerFeedback() {
  return (
    <section className="w-full bg-white px-6 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[760px] text-center"
        >
          <h2 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.045em] text-[#4b4b4f] sm:text-[42px] lg:text-[46px]">
            Customer Feedback
          </h2>

          <p className="mx-auto mt-5 max-w-[700px] text-[13px] leading-[1.65] text-[#77777e] sm:text-[14px]">
            Hear firsthand accounts of how our school management solution has
            revolutionized
            <br className="hidden sm:block" />
            education management for institutions everywhere.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
              }}
              className="flex min-h-[205px] flex-col justify-between rounded-[12px] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.11)]"
            >
              {/* Quote */}
              <p className="text-[13px] leading-[1.65] text-[#57575f] sm:text-[14px]">
                {testimonial.quote}
              </p>

              {/* Customer */}
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-[48px] w-[48px] shrink-0 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-[13px] font-semibold leading-tight text-[#35353b]">
                    {testimonial.name}
                  </h3>

                  <p className="mt-1 text-[11px] leading-tight text-[#77777f]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}