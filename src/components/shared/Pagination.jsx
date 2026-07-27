import React from "react";

const getPageNumbers = (currentPage, totalPages) => {
  const delta = 1;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
};

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (!totalPages || totalPages < 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const baseBtn =
    "w-10 h-10 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const activeBtn = "bg-cyan-500 text-white shadow-lg";
  const inactiveBtn = "bg-cyan-900 text-cyan-300 hover:bg-cyan-800";

  return (
    <section className="flex justify-center items-center gap-2 mt-10 flex-wrap">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${baseBtn} ${inactiveBtn}`}
      >
        ‹
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="w-10 h-10 flex items-center justify-center text-cyan-500"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`${baseBtn} ${
              currentPage === page ? activeBtn : inactiveBtn
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${baseBtn} ${inactiveBtn}`}
      >
        ›
      </button>
    </section>
  );
};

export default Pagination;