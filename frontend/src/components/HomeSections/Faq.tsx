"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Shield, Users, Target, Globe } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "Apa itu PeduliKita?",
      answer:
        "PeduliKita adalah platform digital yang menghubungkan kepedulian masyarakat dengan kebutuhan kemanusiaan di Indonesia. Kami menyediakan informasi terpusat tentang krisis kemanusiaan dan memfasilitasi penggalangan dana yang transparan dan terpercaya.",
      icon: <Heart className="w-5 h-5 text-primary" />,
    },
    {
      question: "Bagaimana cara saya berkontribusi melalui PeduliKita?",
      answer:
        "Anda dapat berkontribusi dengan menjadi donatur, relawan, atau sekadar menyebarkan informasi. Untuk donasi, cukup pilih kampanye yang ingin Anda dukung, lalu lakukan pembayaran melalui metode yang tersedia. Semua proses dapat dilakukan secara online.",
      icon: <Users className="w-5 h-5 text-primary" />,
    },
    {
      question:
        "Bagaimana PeduliKita memastikan transparansi penyaluran bantuan?",
      answer:
        "Kami menerapkan sistem pelaporan terbuka di mana setiap donasi dapat dilacak. Donatur akan menerima update berkala tentang penggunaan dana, foto bukti penyaluran, dan laporan evaluasi dampak dari setiap kampanye yang mereka dukung.",
      icon: <Shield className="w-5 h-5 text-primary" />,
    },
    {
      question:
        "Apakah donasi di PeduliKita 100% disalurkan kepada yang membutuhkan?",
      answer:
        "Ya, minimal 95% dari setiap donasi langsung disalurkan untuk program bantuan. Sisanya digunakan untuk operasional platform dan pengembangan sistem untuk memastikan keberlanjutan layanan kami.",
      icon: <Target className="w-5 h-5 text-primary" />,
    },
    {
      question: "Wilayah mana saja yang telah terjangkau oleh PeduliKita?",
      answer:
        "Saat ini PeduliKita telah beroperasi di seluruh wilayah Indonesia dengan fokus pada daerah-daerah yang mengalami krisis kemanusiaan seperti bencana alam, konflik sosial, dan keadaan darurat lainnya.",
      icon: <Globe className="w-5 h-5 text-primary" />,
    },
    {
      question: "Bagaimana cara menjadi relawan di PeduliKita?",
      answer:
        "Anda dapat mendaftar sebagai relawan melalui halaman 'Bergabung' di website kami. Kami membutuhkan berbagai keahlian mulai dari koordinasi lapangan, komunikasi, hingga dukungan teknis digital.",
      icon: <Users className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-20 px-10 md:px-20 bg-primary/5"
      id="faq"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="container mx-auto relative z-999999999999">
        <div className="flex flex-col lg:flex-row justify-between gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 lg:w-1/2 ">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
              Pertanyaan yang{" "}
              <span className="text-primary">Sering Diajukan</span>
            </h2>

            <p className="text-foreground text-lg leading-relaxed">
              Temukan jawaban untuk pertanyaan umum seputar PeduliKita. <br />{" "}
              Jika Anda memiliki pertanyaan lain, jangan ragu untuk <br />{" "}
              menghubungi tim kami.
            </p>
          </div>

          {/* Right FAQ Accordion */}
          <div className="lg:flex-1 w-full max-w-2xl">
            <div className="md:sticky md:top-20">
              <div className="overflow-y-auto max-h-[calc(100vh-5rem)] pr-2">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-white border border-gray-200 rounded-xl px-6 hover:border-primary/50 transition-all duration-300 hover:shadow-md data-[state=open]:border-primary data-[state=open]:shadow-lg"
                    >
                      <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-primary py-4 hover:no-underline transition-colors duration-200 group">
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex-shrink-0">{faq.icon}</div>
                          <span className="group-hover:text-primary transition-colors duration-200">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4 pl-8 leading-relaxed animate-accordion-down">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
