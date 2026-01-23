/* eslint-disable */
import { useRef, useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "Justine",
    phone: "081234567890",
    email: "justine@email.com",
    address: "Jakarta, Indonesia",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saved data:", form);
  };

  const handleLogout = () => {
    console.log("Logout");
  };
const fileInputRef = useRef(null);
const [avatar, setAvatar] = useState("/images/justine-eg.png");
const handleAvatarClick = () => {
  fileInputRef.current.click();
};

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("File harus berupa gambar");
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  setAvatar(previewUrl);

  // nanti untuk backend:
  // formData.append("avatar", file)
};

  return (
    <div className="min-h-screen bg-white dark:bg-black text-text dark:text-textDark flex justify-center items-start py-20 mt-20 px-4">
      <div className="w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-neutral-800">
          <h1 className="text-2xl font-semibold">Profil Saya</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola informasi akun Anda
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8 p-8">

          {/* LEFT - USER INFO */}
          <div className="flex flex-col items-center text-center">
  <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-200 dark:border-neutral-700 mb-4">
    <img
      src={avatar}
      alt="User Avatar"
      className="w-full h-full object-cover"
    />

    {/* overlay hover */}
    <div
      onClick={handleAvatarClick}
      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition"
    >
      <span className="text-white text-xs">Ganti Foto</span>
    </div>
  </div>

  <h2 className="text-lg font-medium">Justine</h2>
  <p className="text-sm text-gray-500 dark:text-gray-400">
    Member Peduli Kita
  </p>

  {/* hidden input */}
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleAvatarChange}
  />
</div>


          {/* RIGHT - FORM */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Nama */}
              <div>
                <label className="block text-sm mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Telepon */}
              <div>
                <label className="block text-sm mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1">Alamat Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 px-4 text-sm cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1">Password Baru</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak diubah"
                  className="w-full h-11 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Alamat</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

            </div>

            {/* ACTION BUTTON */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>

              <button
                onClick={handleSave}
                className="h-11 px-8 rounded-lg bg-primary text-white btn-border-reveal z-10 text-sm font-medium hover:bg-primary/90 transition"
              >
                Simpan Perubahan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
