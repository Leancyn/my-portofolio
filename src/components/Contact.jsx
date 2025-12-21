import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { addItem } from "@/lib/data";

const Contact = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    const { error } = await supabase.from("messages").insert([payload]);

    if (error) {
      toast({
        title: "Gagal Mengirim ❌",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Pesan Terkirim",
      description: "Pesan kamu sudah masuk dan akan kami balas secepatnya.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "halo@webcraft.id",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      content: "+62 812-3456-7890",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Alamat",
      content: "Indonesia",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-slate-950" />

      <div className="container mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Hubungi Kami</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Punya ide atau project? Kirim pesan dan kami akan segera menghubungi Anda</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{info.title}</h3>
                    <p className="text-slate-400">{info.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
            <div className="space-y-6">
              <input name="name" placeholder="Nama Anda" required onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              <input name="phone" placeholder="Nomor WhatsApp" onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" />
              <textarea name="message" rows={5} required placeholder="Pesan" onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none" />

              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Kirim Pesan
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
