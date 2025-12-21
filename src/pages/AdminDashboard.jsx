import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, getData, addItem, updateItem, deleteItem } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

// Section Header
const SectionHeader = ({ title, onAdd }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {onAdd && (
      <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
        + Add New
      </Button>
    )}
  </div>
);

// Project Form
const ProjectForm = ({ initialData, onSubmit, onClose }) => {
  const [form, setForm] = useState(initialData || { title: "", category: "", description: "", image: "", demoUrl: "", githubUrl: "", tags: [] });
  const [tagsInput, setTagsInput] = useState(form.tags?.join(", ") || "");
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!file && !form.image) {
      toast({ title: "Please select an image to upload", variant: "destructive" });
      return;
    }

    let imageUrl = form.image;

    if (file) {
      const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const filePath = `${user.id}/${safeFileName}`;

      const { data, error } = await supabase.storage.from("projects").upload(filePath, file);
      if (error) {
        console.error("Supabase upload error:", error);
        toast({ title: `Failed to upload image: ${error.message}`, variant: "destructive" });
        return;
      }

      const { data: publicData } = supabase.storage.from("projects").getPublicUrl(filePath);
      imageUrl = publicData.publicUrl;
    }

    onSubmit({
      ...form,
      image: imageUrl,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="space-y-4">
      <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-white" />
      <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Demo URL" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
      <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
      <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Tags (comma separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};

const TestimonialForm = ({ initialData, onSubmit, onClose }) => {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      role: "",
      content: "",
      rating: 5,
      image: "",
    }
  );
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    let imageUrl = form.image;

    if (file) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({ title: "You must be logged in", variant: "destructive" });
        return;
      }

      const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = `testimonials/${user.id}/${safeFileName}`;

      const { error } = await supabase.storage
        .from("projects") // boleh pakai bucket yg sama
        .upload(filePath, file);

      if (error) {
        toast({
          title: `Upload failed: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const { data } = supabase.storage.from("projects").getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    onSubmit({
      ...form,
      image: imageUrl,
    });
  };

  return (
    <div className="space-y-4">
      <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Client Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

      <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Role / Company" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />

      <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="Testimonial Content" rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />

      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-white" />

      <div className="flex items-center gap-2">
        <label className="text-white">Rating:</label>
        <input type="number" min="1" max="5" className="bg-slate-800 border border-slate-700 rounded p-1 text-white w-20" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} />
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("projects");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Data state
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [messages, setMessages] = useState([]);

  // Fetch data
  const fetchData = async () => {
    try {
      const { data: proj } = await supabase.from("projects").select("*");
      const { data: testi } = await supabase.from("testimonials").select("*");
      const { data: msg, error } = await supabase.from("messages").select("*").order("date", { ascending: false });

      if (error) throw error;

      setProjects(proj || []);
      setTestimonials(testi || []);
      setMessages(msg || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to fetch data", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchData();

    const projectSub = supabase.channel("public:projects").on("postgres_changes", { event: "*", schema: "public", table: "projects" }, fetchData).subscribe();
    const testimonialSub = supabase.channel("public:testimonials").on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, fetchData).subscribe();
    const messageSub = supabase.channel("public:messages").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchData).subscribe();

    return () => {
      supabase.removeChannel(projectSub);
      supabase.removeChannel(testimonialSub);
      supabase.removeChannel(messageSub);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const handleAddItem = async (data) => {
    try {
      await addItem(activeTab, data);
      setModalOpen(false);
      toast({ title: "Item Added Successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to add item", variant: "destructive" });
    }
  };

  const handleUpdateItem = async (data) => {
    try {
      await updateItem(activeTab, data);
      setModalOpen(false);
      setEditItem(null);
      toast({ title: "Item Updated Successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to update item", variant: "destructive" });
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Yakin mau hapus?")) return;

    try {
      await deleteItem(activeTab, id);
      toast({ title: "Item berhasil dihapus" });
      fetchData(); // 🔥 WAJIB
    } catch (err) {
      console.error(err);
      toast({
        title: "Gagal menghapus",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const openAddModal = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <>
            <SectionHeader title="Manage Projects" onAdd={openAddModal} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((item) => (
                <div key={item.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded mb-4" />}
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-blue-400 text-xs mb-2">{item.category}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Project" : "Add Project"}>
              <ProjectForm initialData={editItem} onSubmit={editItem ? handleUpdateItem : handleAddItem} onClose={() => setModalOpen(false)} />
            </Modal>
          </>
        );
      case "testimonials":
        return (
          <>
            <SectionHeader title="Manage Testimonials" onAdd={openAddModal} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <div key={item.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <h3 className="text-white font-bold text-sm">{item.name}</h3>
                      <p className="text-slate-500 text-xs">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">"{item.content}"</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Testimonial" : "Add Testimonial"}>
              <TestimonialForm initialData={editItem} onSubmit={editItem ? handleUpdateItem : handleAddItem} onClose={() => setModalOpen(false)} />
            </Modal>
          </>
        );
      case "messages":
        return (
          <>
            <SectionHeader title="Contact Messages" />
            <div className="space-y-4">
              {messages.length === 0 && <p className="text-slate-500">Belum ada pesan masuk.</p>}

              {messages.map((msg) => (
                <div key={msg.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                  <div className="space-y-1">
                    <p className="text-white font-bold">
                      Nama: <span className="font-normal">{msg.name}</span>
                    </p>
                    <p className="text-blue-400 text-sm">Email: {msg.email}</p>
                    <p className="text-slate-400 text-sm">Phone: {msg.phone || "-"}</p>
                  </div>

                  <p className="text-slate-300 mt-4">
                    <span className="font-semibold text-white">Pesan:</span>
                    <br />
                    {msg.message}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
                    <p className="text-slate-600 text-xs">{new Date(msg.date).toLocaleString("id-ID")}</p>

                    <div className="flex gap-2">
                      {/* BALAS EMAIL */}
                      <Button size="sm" variant="outline" onClick={() => (window.location.href = `mailto:${msg.email}?subject=Balasan dari Website&body=Halo ${msg.name},`)}>
                        Balas Email
                      </Button>

                      {/* HAPUS */}
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteItem(msg.id)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  const navItems = [
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "testimonials", label: "Testimonials", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-white font-bold text-lg">Admin Panel</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
            <div className="pt-8 border-t border-slate-800 mt-8">
              <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                <LayoutDashboard size={20} />
                View Live Site
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg">
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
          <span className="text-white font-bold">WebCraft Admin</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
