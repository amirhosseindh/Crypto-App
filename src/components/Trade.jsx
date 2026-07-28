import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";

// Api
import { getCoin } from "../services/api";

// Components
import Loader from "./Loader";
import Toast from "./shared/Toast";

const formatPrice = (num) => {
  if (num === undefined || num === null || isNaN(num)) return "-";

  // برای قیمت‌های خیلی کوچیک (مثلاً ۰.۰۰۰۰۰۹۸۳)، رقم اعشار کافی نشون بده تا صفر نشه
  if (num > 0 && num < 1) {
    const decimals = Math.max(8, -Math.floor(Math.log10(num)) + 4);
    return `$${num.toFixed(decimals)}`;
  }

  // برای قیمت‌های عادی/بزرگ، جداکننده هزارگان + دو رقم اعشار
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Trade = () => {
  const [searchParams] = useSearchParams();
  const preselectedCoin = searchParams.get("coin");

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [amount, setAmount] = useState("");
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  useEffect(() => {
    if (coins.length > 0) {
      if (preselectedCoin && coins.some((c) => c.id === preselectedCoin)) {
        setSelectedId(preselectedCoin);
      } else if (!selectedId) {
        setSelectedId(coins[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins, preselectedCoin]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const selectedCoin = useMemo(
    () => coins.find((c) => c.id === selectedId),
    [coins, selectedId],
  );

  const filteredCoins = useMemo(() => {
    if (!search) return coins;
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.symbol.toLowerCase().includes(search.toLowerCase()),
    );
  }, [coins, search]);

  const totalPrice = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (!selectedCoin || !numAmount || numAmount <= 0) return 0;
    return numAmount * selectedCoin.current_price;
  }, [amount, selectedCoin]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSelectCoin = (coin) => {
    setSelectedId(coin.id);
    setSearch("");
    setDropdownOpen(false);
  };

  const handleBuy = () => {
    const numAmount = parseFloat(amount);

    if (!selectedCoin || !numAmount || numAmount <= 0) {
      setToast({ type: "error", message: "Please enter a valid amount." });
      return;
    }

    setToast({
      type: "success",
      message: `Successfully bought ${numAmount} ${selectedCoin.symbol.toUpperCase()}!`,
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen w-full pb-7 flex flex-col items-center bg-cyan-50 dark:bg-cyan-950">
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen w-full pb-7 flex flex-col items-center justify-center bg-cyan-50 dark:bg-cyan-950">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full pb-7 flex flex-col items-center bg-cyan-50 dark:bg-cyan-950">
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-gray-100 mt-10 mb-8">
        Trade
      </h1>

      <section
        className="w-[90%] sm:w-[70%] lg:w-[40%] flex flex-col gap-6 p-8 rounded-3xl
        bg-cyan-50 shadow-[15px_15px_35px_rgba(8,51,68,0.15),-15px_-15px_35px_rgba(255,255,255,0.9)]
        dark:bg-[linear-gradient(145deg,#0c4c61,#041a21)] dark:shadow-[16px_16px_44px_#041a21,-16px_-16px_44px_#0c4c61]"
      >
        {/* Coin search + select */}
        <label className="flex flex-col gap-2 relative" ref={dropdownRef}>
          <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
            Select Coin
          </span>

          <div className="relative">
            {selectedCoin && !dropdownOpen && (
              <img
                src={selectedCoin.image}
                alt={selectedCoin.name}
                className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            )}
            <input
              type="text"
              placeholder={
                selectedCoin
                  ? `${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()})`
                  : "Search coin..."
              }
              value={search}
              onFocus={() => setDropdownOpen(true)}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 pr-4 text-sm outline-none cursor-pointer ${
                selectedCoin && !dropdownOpen ? "pl-11" : "pl-4"
              }`}
            />
          </div>

          {dropdownOpen && (
            <section className="absolute top-full mt-2 left-0 right-0 max-h-64 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#041a21] shadow-xl z-50">
              {filteredCoins.length === 0 ? (
                <p className="p-4 text-sm text-slate-500 dark:text-gray-400">
                  No coins found.
                </p>
              ) : (
                filteredCoins.slice(0, 50).map((coin) => (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() => handleSelectCoin(coin)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-cyan-50 dark:hover:bg-cyan-900 transition-colors cursor-pointer"
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 shrink-0"
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-100">
                      {coin.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-gray-500 uppercase ml-auto">
                      {coin.symbol}
                    </span>
                  </button>
                ))
              )}
            </section>
          )}
        </label>

        {/* Live price */}
        {selectedCoin && (
          <section className="flex justify-between items-center px-1">
            <span className="text-sm text-slate-500 dark:text-gray-400">
              Current Price
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-gray-100">
              {formatPrice(selectedCoin.current_price)}
            </span>
          </section>
        )}

        {/* Amount input */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
            Amount ({selectedCoin?.symbol?.toUpperCase()})
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 px-4 text-sm outline-none"
          />
        </label>

        {/* Total price */}
        <section
          className="flex justify-between items-center p-4 rounded-xl
          bg-white dark:bg-[#041a21]"
        >
          <span className="text-sm font-bold text-slate-600 dark:text-gray-300">
            Total
          </span>
          <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {formatPrice(totalPrice)}
          </span>
        </section>

        <button
          onClick={handleBuy}
          disabled={!amount || parseFloat(amount) <= 0}
          className="h-12 rounded-xl font-bold text-sm bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Buy {selectedCoin?.symbol?.toUpperCase()}
        </button>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default Trade;
