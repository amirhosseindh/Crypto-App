import React, { useState, useEffect } from "react";

// Api
import { getCoin } from "../services/api";

// Components
import Loader from "./Loader";
import Coin from "./Coin";
import Pagination from "./shared/Pagination";
import ScrollToTopButton from "./shared/ScrollToTopButton";

const ITEMS_PER_PAGE = 20;

const Landing = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCoin(1, 250);
        setCoins(data);
      } catch (err) {
        setError("Failed to load coin data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCoins.length / ITEMS_PER_PAGE) || 1;

  const paginatedCoins = filteredCoins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="min-h-screen w-full pb-7 flex flex-col items-center bg-cyan-50 dark:bg-cyan-950">
      <section className="w-[70%] flex items-center gap-4 mb-12 mt-6">
        <input
          className="h-12 flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 px-4 text-sm outline-none cursor-pointer"
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={handleSearchChange}
        />
      </section>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <Loader />
      ) : filteredCoins.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">No coins found.</p>
      ) : (
        <>
          <section className="w-[70%] grid grid-cols-1 gap-10">
            {paginatedCoins.map((coin) => (
              <Coin key={coin.id} data={coin} />
            ))}
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={handlePageChange}
          />
        </>
      )}
      <ScrollToTopButton />
    </section>
  );
};

export default Landing;
