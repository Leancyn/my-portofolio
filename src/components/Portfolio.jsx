import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Portfolio = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

      if (!error) {
        setProjects(data || []);
      } else {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleLinkClick = (url) => {
    if (!url || url === "#" || url === "https://example.com") {
      toast({
        title: "🚧 Demo Link Placeholder",
        description: "This is a demo placeholder link. In a real app, this would open the live project.",
      });
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="portfolio" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-slate-950" />

      <div className="container mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Portofolio Kami</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Jelajahi proyek terbaru kami dan lihat bagaimana kami membantu bisnis meraih kesuksesan online</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={project.title} src={project.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60" />
              </div>

              <div className="p-6">
                <div className="text-sm text-blue-400 mb-2">{project.category}</div>

                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>

                <p className="text-slate-400 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tags || []).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button size="sm" onClick={() => handleLinkClick(project.demoUrl)} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => handleLinkClick(project.githubUrl)} className="border-slate-700 hover:bg-slate-800">
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
