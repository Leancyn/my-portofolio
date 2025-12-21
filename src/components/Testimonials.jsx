import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setTestimonials(data || []);
      } else {
        console.error("Failed to fetch testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Apa Kata Klien Kami
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Jangan hanya mengambil kata kami - dengarkan dari klien puas kami
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-500/20" />

              <div className="flex items-center gap-4 mb-6">
                <img
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/20"
                  alt={testimonial.name}
                  src={testimonial.image}
                />
                <div>
                  <h3 className="text-white font-bold">
                    {testimonial.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(Number(testimonial.rating || 5))].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
