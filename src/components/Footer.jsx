import React from "react";
import { Facebook, MessageCircle, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Services: ["Website Development", "Landing Page", "Website UMKM", "UI/UX Design"],
    Resources: ["Documentation", "Tutorials", "Support", "FAQ"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "License"],
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook" },
    { icon: Instagram, label: "Instagram" },
    { icon: MessageCircle, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-8 h-8" />
              </div>
              <span className="text-white font-bold text-xl">Titik Kode Studio</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">Membangun pengalaman digital luar biasa yang mendorong pertumbuhan bisnis dan inovasi.</p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <button key={index} className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors duration-200" aria-label={social.label}>
                    <Icon className="w-5 h-5 text-slate-400 hover:text-white transition-colors duration-200" />
                  </button>
                );
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <span className="text-white font-bold mb-4 block">{category}</span>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <button className="text-slate-400 hover:text-white transition-colors duration-200">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">© {currentYear} Titik Kode Studio. All rights reserved.</p>
            <p className="text-slate-400 text-sm text-center md:text-right">Crafted with passion and precision</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
