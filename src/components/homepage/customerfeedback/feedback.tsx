"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, Sparkles, ShieldCheck, Zap, Users } from "lucide-react";

const testimonials = [
  {
    quote:
      "EduNexus has truly transformed how we manage our school's operations. The platform is intuitive, easy to use, and has streamlined our daily workflow.",
    name: "Theresa Webb",
    role: "CEO at wolf-pixel",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    rating: 5,
    badge: "Verified Client",
  },
  {
    quote:
      "As an educator, I've used many management systems, but EduNexus stands out for its comprehensive features and excellent customer support.",
    name: "Devon Lane",
    role: "CEO at Groupon",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    rating: 5,
    badge: "Verified Institution",
  },
  {
    quote:
      "Our school has seen a significant improvement in communication and collaboration since implementing EduNexus. Parents and teachers love it.",
    name: "Esther Howard",
    role: "CEO at Puzzle Huddle",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
    rating: 5,
    badge: "Verified Partner",
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "100% Secure & Reliable",
    description: "Enterprise-grade data security ensuring complete protection for student and institution records.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Workflow",
    description: "Optimized performance to handle administrative tasks, grading, and scheduling in seconds.",
  },
  {
    icon: Users,
    title: "Seamless Collaboration",
    description: "Bridging the gap between teachers, students, and parents with real-time updates.",
  },
];

export default function CustomerFeedback() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-300 px-6 py-24 sm:px-8 lg:px-12">
      
      {/* Background ambient glowing shapes */}
      <div className="pointer-events-none absolute left-1/2 -top-40 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[150px]" />

      <div className="relative mx-auto max-w-[1280px]">
        
        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[760px] text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/35 bg-indigo-50/80 dark:bg-indigo-950/50 px-4 py-1.5 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Trusted Worldwide by Leaders
            </span>
          </div>

          <h2 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-[42px] lg:text-[48px]">
            What Our Customers Say
          </h2>

          <p className="mx-auto max-w-[700px] text-[14px] leading-[1.7] text-slate-600 dark:text-slate-400 sm:text-[16px]">
            Discover how our advanced school management ecosystem is driving productivity, 
            <br className="hidden sm:block" />
            collaboration, and success across institutions globally.
          </p>
        </motion.div>

        {/* Testimonials Cards Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.15,
              }}
              className="relative flex flex-col justify-between rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-500/10 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 group"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-6 right-6 text-slate-100 dark:text-slate-800/50 group-hover:text-indigo-50 dark:group-hover:text-indigo-950/30 transition-colors pointer-events-none">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    {testimonial.badge}
                  </span>
                </div>

                <p className="text-[14px] sm:text-[15px] leading-[1.75] text-slate-700 dark:text-slate-300 font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-indigo-500/30 shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {testimonial.name}
                  </h3>
                  <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Modern Highlights / Value Props Grid (Replaced the Banner) */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md hover:border-indigo-500/40 transition-all duration-300 group"
              >
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}