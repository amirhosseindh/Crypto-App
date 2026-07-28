import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Api
import { getGlobalData, getCoin } from "../services/api";

// components
import Loader from "./Loader";
import Coin from "./Coin";
import ScrollToTopButton from "./shared/ScrollToTopButton";

const formatNumber = (num) => {
  if (!num) return "-";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num}`;
};

const StatCard = ({ label, value }) => (
  <section
    className="flex flex-col items-center justify-center gap-1 p-5 rounded-2xl text-center
    bg-cyan-50 shadow-[15px_15px_35px_rgba(8,51,68,0.15),-15px_-15px_35px_rgba(255,255,255,0.9)]
    dark:bg-[linear-gradient(145deg,#0c4c61,#041a21)] dark:shadow-[16px_16px_44px_#041a21,-16px_-16px_44px_#0c4c61]"
  >
    <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400">
      {value}
    </span>
    <span className="text-xs text-slate-500 dark:text-gray-400">{label}</span>
  </section>
);

const FeatureCard = ({ title, description }) => (
  <section
    className="flex flex-col gap-2 p-6 rounded-2xl
    bg-cyan-50 shadow-[15px_15px_35px_rgba(8,51,68,0.15),-15px_-15px_35px_rgba(255,255,255,0.9)]
    dark:bg-[linear-gradient(145deg,#0c4c61,#041a21)] dark:shadow-[16px_16px_44px_#041a21,-16px_-16px_44px_#0c4c61]"
  >
    <h3 className="font-bold text-slate-800 dark:text-gray-100">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-gray-400">{description}</p>
  </section>
);

const Home = () => {
  const [globalData, setGlobalData] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [global, coins] = await Promise.all([
          getGlobalData(),
          getCoin(1, 5),
        ]);
        setGlobalData(global);
        setTrending(coins);
      } catch (err) {
        setError("Failed to load market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="min-h-screen w-full pb-7 flex flex-col items-center bg-cyan-50 dark:bg-cyan-950">
      {/* Hero */}
      <section className="w-[90%] sm:w-[80%] lg:w-[70%] flex flex-col items-center text-center gap-6 mt-16 mb-20">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 dark:text-gray-100 leading-tight">
          Track, Explore, and Trade
          <span className="text-cyan-600 dark:text-cyan-400"> Crypto</span> in
          Real Time
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-gray-400 max-w-xl">
          Live prices, market data, and a simple trading experience for
          thousands of cryptocurrencies — all in one place.
        </p>

        <section className="flex flex-wrap justify-center gap-4 mt-4">
          <Link
            to="/coins"
            className="px-8 py-3 rounded-xl font-bold text-sm bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors"
          >
            Explore Coins
          </Link>
          <Link
            to="/trade"
            className="px-8 py-3 rounded-xl font-bold text-sm bg-white dark:bg-transparent border border-cyan-600 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
          >
            Start Trading
          </Link>
        </section>
      </section>

      {error && <p className="text-red-500 mb-10">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Global stats */}
          {globalData && (
            <section className="w-[90%] sm:w-[80%] lg:w-[70%] grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20">
              <StatCard
                label="Market Cap"
                value={formatNumber(globalData.total_market_cap?.usd)}
              />
              <StatCard
                label="24h Volume"
                value={formatNumber(globalData.total_volume?.usd)}
              />
              <StatCard
                label="BTC Dominance"
                value={`${globalData.market_cap_percentage?.btc?.toFixed(1)}%`}
              />
              <StatCard
                label="Cryptocurrencies"
                value={globalData.active_cryptocurrencies}
              />
            </section>
          )}

          {/* Trending coins preview */}
          {trending.length > 0 && (
            <section className="w-[90%] sm:w-[80%] lg:w-[70%] mb-20">
              <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-6">
                Top Cryptocurrencies
              </h2>

              <section className="grid grid-cols-1 gap-10">
                {trending.map((coin) => (
                  <Coin key={coin.id} data={coin} />
                ))}
              </section>

              <div className="flex justify-center mt-8">
                <Link
                  to="/coins"
                  className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  View all coins →
                </Link>
              </div>
            </section>
          )}
        </>
      )}

      {/* Features */}
      <section className="w-[90%] sm:w-[80%] lg:w-[70%] grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          title="Real-Time Prices"
          description="Get up-to-date prices and market data for thousands of cryptocurrencies."
        />
        <FeatureCard
          title="Simple Trading"
          description="Buy and sell your favorite coins in just a few clicks, no complexity."
        />
        <FeatureCard
          title="Dark Mode Ready"
          description="A comfortable experience day or night, on any device."
        />
      </section>

      <ScrollToTopButton />
    </section>
  );
};

export default Home;
