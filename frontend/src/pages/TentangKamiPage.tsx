/* eslint-disable */
import { MdHealthAndSafety } from "react-icons/md";
import ShinyText from "../components/fraction/ShinyText";
import DonateSection from "../components/fraction/DonateSection";
import { useMemo, useState } from "react";
import CurvedLoop from "../components/fraction/CurvedLoop";
import ProfileCard from "../components/ProfileCard";

export default function TentangKamiPage() {
  return (
    <div className=" bg-white text-text dark:bg-black dark:text-textDark">
      

      <section className="w-full mt-20 py-24 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tentang
            <ShinyText
              text=" Peduli Kita"
              speed={3}
              color="#016B61"
              shineColor="#70B2B2"
            />
          </h1>

          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            Peduli Kita adalah platform donasi berbasis web yang berfokus pada
            penyaluran bantuan kemanusiaan dan bencana alam, dengan pendekatan
            sociopreneur untuk menciptakan dampak sosial yang berkelanjutan.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">Visi</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Menjadi platform donasi digital yang terpercaya, inklusif, dan
              berkelanjutan dalam mendukung aksi kemanusiaan di Indonesia.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">Misi</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li>
                • Menyediakan sistem donasi yang transparan dan mudah digunakan
              </li>
              <li>
                • Menghubungkan donatur dengan kebutuhan nyata di lapangan
              </li>
              <li>• Mendorong partisipasi sosial melalui teknologi digital</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Tim
            <span className="text-primary ml-2">Kami</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-10">
            <ProfileCard
              name="Justine"
              title="Frontend Developer"
              handle="zerr.ace"
              status="Available"
              contactText="Contact"
              avatarUrl="/images/justine-eg.png"
              showUserInfo
              enableTilt
              enableMobileTilt={false}
            />

            <ProfileCard
              name="M. Heidar A."
              title="Frontend Developer"
              handle="zerr.ace"
              status="Available"
              contactText="Contact"
              avatarUrl="/images/heidar-eg.png"
              showUserInfo
              enableTilt
              enableMobileTilt={false}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Bersama, Kita Bisa Membantu Lebih Banyak
        </h2>
        <p className="max-w-xl mx-auto text-white/90">
          Peduli Kita hadir untuk menjadi jembatan kebaikan antara donatur dan
          mereka yang membutuhkan.
        </p>
      </section>
    </div>
  );
}
