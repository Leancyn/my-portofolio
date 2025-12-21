import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
});
// ----------------------------
// Auth
// ----------------------------
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, user: data.user };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// ----------------------------
// Generic CRUD
// ----------------------------

// Ambil data dari table
export const getData = async (table) => {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw error;
  return data;
};

// Tambah item
export const addItem = async (table, item) => {
  const { data, error } = await supabase.from(table).insert([item]).select();
  if (error) throw error;
  return data[0];
};

// Update item
export const updateItem = async (table, item) => {
  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq("id", item.id)
    .select();
  if (error) throw error;
  return data[0];
};

// Hapus item
export const deleteItem = async (table, id) => {
  const { data, error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
  return data;
};
