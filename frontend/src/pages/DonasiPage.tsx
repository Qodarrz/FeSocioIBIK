/* eslint-disable */
import { MdHealthAndSafety } from "react-icons/md";
import ShinyText from "../components/fraction/ShinyText";
import DonateSection from "../components/fraction/DonateSection";
import { useMemo, useState } from "react";
import CurvedLoop from "../components/fraction/CurvedLoop";


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
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
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
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
	items: demoCarousel,
},
{
	title: "Bencana Lombok Timur",
	id: 3,
	description: "Banjir dan longsor telah melanda lombok timur...",
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


export default function DonasiPage() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");

	const filteredDonateData = useMemo(() => {
		return donateData.filter((item) =>
			item.title.toLowerCase().includes(search.toLowerCase()) ||
			item.description.toLowerCase().includes(search.toLowerCase())
		);
	}, [search, donateData]);

	
	return (
		<div className=" bg-white text-text dark:bg-black dark:text-textDark">
	      	<section className="w-full h-[300px] flex justify-center relative items-center text-white text-center bg-primary">
				
					<div className="absolute w-full left-0  -bottom-8">
						
						<h1 className="mb-10 font-bold text-6xl">Mari 
							<ShinyText
							text="Peduli"
							speed={3}
							delay={0}
							color="#ffffff"
							className=" mx-2"
							shineColor="#70B2B2"
							spread={120}
							direction="left"
							yoyo={false}
							pauseOnHover={false}
							/>
							Berdonasi</h1>
						<form className="w-[70%] mx-5 md:mx-auto">
							<div className="relative flex items-center">
								{/* Search Icon */}
								<span className="absolute left-4 text-gray-400 pointer-events-none">
								<svg
									className="w-5 h-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
									/>
								</svg>
								</span>

								{/* Input */}
								<input
								type="text"
								placeholder="Cari jenis donasi disini"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								className="
									w-full
									h-16
									pl-11
									pr-24
									bg-white
									dark:bg-gray-900
									rounded-full
									dark:border-none
									dark:text-white
									border border-gray-200
									text-sm
									text-gray-700
									placeholder-gray-400
									focus:outline-none
									focus:ring-2
									focus:ring-transparent
									focus:border-transparent
									
								"
								/>

								{/* Button */}
								<div className="absolute
									right-1.5">

									<button
									type="button"
									className="
										h-12
										cursor-pointer
										px-5
										rounded-full
										bg-[#016B61]
										text-white
										text-sm
										font-medium
										active:!border-none
										focus:!border-none
										hover:!border-none
										hover:bg-[#016B61]
										btn-border-reveal
										z-10
									"
  									onClick={() => setSearch(searchInput)}
									>
									{/* <BsArrowUpRightCircleFill size={10} /> */}
									{/* <FiArrowUpRight /> */}
									Temukan
									</button>
								</div>
							</div>
						</form>
					</div>
			</section>
			
			<div className="mt-20">
				<DonateSection data={filteredDonateData} />
			</div>

			<section>
				<CurvedLoop className="!text-black" marqueeText="Bersatu Kita Bisa ✦ #prayforaceh ✦ #prayforsumatra ✦ " />
			</section>

		</div>
	);
}
