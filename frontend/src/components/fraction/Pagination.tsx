import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  perpage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, perpage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-10 w-full  flex items-center justify-between gap-2">
        <span className="text-gray-400">Menampilkan {currentPage} sampai {perpage} dari {totalPages} data.</span>
        <div className="flex gap-2">
            {/* PREV */}
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed btn-border-reveal
                hover:bg-gray-100"
            >
             <MdKeyboardDoubleArrowLeft />
            </button>

            {/* PAGE NUMBER */}
            {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition
                    ${
                        currentPage === page
                        ? "bg-[#016B61] text-white"
                        : "border hover:bg-gray-100"
                    }`}
                >
                    {page}
                </button>
                );
            })}

            {/* NEXT */}
            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md  text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed btn-border-reveal
                hover:bg-gray-100"
            >
                <MdKeyboardDoubleArrowRight />
            </button>
        </div>
    </div>
  );
}
