import { Code2, Palette, Smartphone, Rocket, Search, ShoppingCart } from "lucide-react";

// Initial Data
const initialServices = [
  {
    id: "1",
    title: "Company Profile Website",
    description: "Website profesional untuk menampilkan profil perusahaan, layanan, portofolio, dan informasi kontak secara terpercaya.",
    iconName: "Code2",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    title: "Landing Page",
    description: "Landing page yang fokus pada konversi, cocok untuk promosi produk, jasa, atau campaign digital.",
    iconName: "Rocket",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    title: "Website UMKM",
    description: "Website sederhana dan efektif untuk UMKM agar bisnis lebih dikenal dan mudah dihubungi secara online.",
    iconName: "ShoppingCart",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "4",
    title: "UI/UX Design",
    description: "Desain tampilan website yang rapi, modern, dan mudah digunakan agar pengunjung nyaman.",
    iconName: "Palette",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "5",
    title: "SEO Basic Optimization",
    description: "Optimasi SEO dasar agar website lebih mudah ditemukan di Google dan mesin pencari lainnya.",
    iconName: "Search",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "6",
    title: "Website Maintenance",
    description: "Perawatan website seperti update konten, perbaikan bug ringan, dan peningkatan performa.",
    iconName: "Smartphone",
    color: "from-indigo-500 to-purple-500",
  },
];

const initialProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "A full-featured online store with payment integration and inventory management.",
    image: "https://images.unsplash.com/photo-1572177812156-58036aae439c",
    tags: ["React", "Node.js", "Stripe"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "2",
    title: "Corporate Website",
    category: "Web Design",
    description: "Professional corporate website with modern design and seamless user experience.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    tags: ["React", "TailwindCSS", "Framer Motion"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "Mobile Banking App",
    category: "Mobile Development",
    description: "Secure and intuitive mobile banking application with real-time transactions.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
    tags: ["React Native", "Firebase", "API"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
];

const initialTestimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    content: "WebCraft transformed our online presence completely. Their attention to detail and commitment to excellence is unmatched.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Founder, E-Shop Solutions",
    content: "Working with WebCraft was a game-changer for our business. They delivered a stunning e-commerce platform.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
];

// Helper to initialize data
const initData = () => {
  if (!localStorage.getItem("services")) {
    localStorage.setItem("services", JSON.stringify(initialServices));
  }
  if (!localStorage.getItem("projects")) {
    localStorage.setItem("projects", JSON.stringify(initialProjects));
  }
  if (!localStorage.getItem("testimonials")) {
    localStorage.setItem("testimonials", JSON.stringify(initialTestimonials));
  }
  if (!localStorage.getItem("messages")) {
    localStorage.setItem("messages", JSON.stringify([]));
  }
};

initData();

// Generic CRUD
export const getData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

export const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch a storage event so hooks can pick it up if needed, though simpler to just force reload or manage state in component
  window.dispatchEvent(new Event("storage"));
};

export const addItem = (key, item) => {
  const data = getData(key);
  const newItem = { ...item, id: Date.now().toString() };
  setData(key, [newItem, ...data]);
  return newItem;
};

export const updateItem = (key, updatedItem) => {
  const data = getData(key);
  const newData = data.map((item) => (item.id === updatedItem.id ? updatedItem : item));
  setData(key, newData);
};

export const deleteItem = (key, id) => {
  const data = getData(key);
  setData(
    key,
    data.filter((item) => item.id !== id)
  );
};

// Auth
export const login = (username, password) => {
  if (username === "admin" && password === "admin") {
    localStorage.setItem("isAdmin", "true");
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("isAdmin");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isAdmin") === "true";
};
