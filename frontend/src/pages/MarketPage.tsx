/* eslint-disable */
import { MdHealthAndSafety } from "react-icons/md";
import ShinyText from "../components/fraction/ShinyText";
import DonateSection from "../components/fraction/DonateSection";
import { useMemo, useState } from "react";
import CurvedLoop from "../components/fraction/CurvedLoop";
import ProfileCard from "../components/ProfileCard";
import SpotlightCard from "@/components/fraction/SpotlightCard";
import ListRiwayatDonate from "@/components/ListRiwayatDonate";
import ListPesanRiwayatDonate from "@/components/ListPesanRiwayatDonate";
import CardKomunitas from "@/components/CardKomunitas";
import CardTrenKomunitas from "@/components/CardTrenKomunitas";


const demoCarousel = [
  {
	id: 1,
	image: '/images/bencana/b1.jpg',
	icon: <MdHealthAndSafety className="h-[16px] w-[16px] text-white" />
  },
  {
	id: 2,
	image: '/images/bencana/b2.jpg',
	icon: <MdHealthAndSafety className="h-[16px] w-[16px] text-white" />
  },
  {
	id: 3,
	image: '/images/bencana/b3.jpg',
	icon: <MdHealthAndSafety className="h-[16px] w-[16px] text-white" />
  },
];

const donateData = [
{
	title: "Bencana Aceh",
	id: 1,
	description: "Banjir dan longsor telah melanda aceh...",
	items: demoCarousel,
},
{
	title: "Bencana Lampung",
	id: 2,
	description: "Banjir dan longsor telah melanda lampung...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
// tambah data bebas
];


const itemsPesanOrangBaik = [
  {
    name: "agus",
	id: 123,
    pesan:
	"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, alias dolores? Itaque, ullam molestiae expedita nam velit maxime sapiente id ad provident aliquid tempore maiores fuga ex doloribus, totam suscipit?",
	images: ['/images/bencana/b1.jpg','/images/bencana/b1.jpg'],
    createdAt: "2026-01-01T14:30:00.000Z",
},
{
	name: "dimas",
	id: 252,
	images: ['/images/bencana/b1.jpg'],
    pesan:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, alias dolores? Itaque, ullam molestiae expedita nam velit maxime sapiente id ad provident aliquid tempore maiores fuga ex doloribus, totam suscipit?",
    createdAt: "2026-01-02T14:30:00.000Z",
  },
];


const items = [
  {
    name: "agus",
	id: 123,
    banner: "/images/bencana/b1.jpg",
    description: "loremdsjfdsjfsd",
    amount: 15000,
    createdAt: "2026-01-01T14:30:00.000Z",
},
{
	id: 234,
	name: "dimas",
	banner: "/images/bencana/b2.jpg",
	description: "loremdsjfdsjfsd",
    amount: 15000,
    createdAt: "2026-01-02T14:30:00.000Z",
  },
];

export default function MarketPage() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");

	const filteredDonateData = useMemo(() => {
		return donateData.filter((item) =>
			item.title.toLowerCase().includes(search.toLowerCase()) ||
			item.description.toLowerCase().includes(search.toLowerCase())
		);
	}, [search, donateData]);
	
	  const sortedItems = items;

	
	return (
		<div className="bg-white text-text dark:bg-black dark:text-textDark">
			<section className="w-full h-auto py-20 flex relative items-center text-black dark:text-white ">
				<div className="mt-5 mx-5 md:mx-10">
				<div className="mt-10">
					<div className="flex gap-4 w-full">
					{/* Messages Section */}
					<div className="w-full">
						<div className="pb-4 w-full">
						<h1 className="text-xl font-semibold text-black dark:text-white">
							Market
						</h1>
						</div>
						<CardKomunitas
						items={itemsPesanOrangBaik}
						onItemSelect={(item, index) => console.log(item, index)}
						showGradients={true}
						enableArrowNavigation={true}
						displayScrollbar={true}
						/>
					</div>

					{/* Donation History Section */}
					<div className="w-[40%]">
						<h1 className="text-xl font-semibold pb-4 text-black dark:text-white">
							Trend Terkini
						</h1>
						<CardTrenKomunitas
						items={sortedItems}
						onItemSelect={(item, index) => console.log(item, index)}
						showGradients={true}
						enableArrowNavigation={true}
						displayScrollbar={true}
						/>
					</div>
					</div>
				</div>
				</div>
			</section>
		</div>
	);
}
