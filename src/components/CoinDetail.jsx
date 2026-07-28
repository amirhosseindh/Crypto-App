import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Api
import { getCoinDetail, getCoinMarketChart } from "../services/api";

// Components
import Loader from "./Loader";
import ScrollToTopButton from "./shared/ScrollToTopButton";

const formatNumber = (num) => {
  if (num === undefined || num === null) return "-";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

const StatBox = ({ label, value }) => (
  <section
    className="flex flex-col gap-1 p-5 rounded-2xl
    bg-cyan-50 shadow-[15px_15px_35px_rgba(8,51,68,0.15),-15px_-15px_35px_rgba(255,255,255,0.9)]
    dark:bg-[linear-gradient(145deg,#0c4c61,#041a21)] dark:shadow-[16px_16px_44px_#041a21,-16px_-16px_44px_#0c4c61]"
  >
    <span className="text-xs text-slate-500 dark:text-gray-400">{label}</span>
    <span className="text-base font-bold text-slate-800 dark:text-gray-100">
      {value}
    </span>
  </section>
);

const CoinDetail = () => {
  const { id } = useParams();

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detail, chart] = await Promise.all([
          getCoinDetail(id),
          getCoinMarketChart(id, 7),
        ]);

        setCoin(detail);

        const formattedChart = chart.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price,
        }));
        setChartData(formattedChart);
      } catch (err) {
        setError("Failed to load coin details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen w-full pb-7 flex flex-col items-center bg-cyan-50 dark:bg-cyan-950">
        <Loader />
      </section>
    );
  }

  if (error || !coin) {
    return (
      <section className="min-h-screen w-full pb-7 flex flex-col items-center justify-center bg-cyan-50 dark:bg-cyan-950">
        <p className="text-red-500">{error || "Coin not found."}</p>
        <Link
          to="/coins"
          className="mt-4 text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
        >
          ← Back to Coins
        </Link>
      </section>
    );
  }

  const marketData = coin.market_data;
  const priceChange24h = marketData?.price_change_percentage_24h ?? 0;
  const isPositive = priceChange24h >= 0;

  return (
    <section className="min-h-screen w-full pb-7 flex flex-col items-center bg-cyan-50 dark:bg-cyan-950">
      <section className="w-[90%] sm:w-[80%] lg:w-[70%] mt-10">
        <Link
          to="/coins"
          className="text-sm text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
        >
          ← Back to Coins
        </Link>
      </section>

      {/* Header */}
      <section className="w-[90%] sm:w-[80%] lg:w-[70%] flex flex-col sm:flex-row sm:items-center gap-4 mt-6 mb-10">
        <img className="w-16 h-16" src={coin.image?.large} alt={coin.name} />
        <section className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-gray-100">
            {coin.name}{" "}
            <span className="text-slate-400 dark:text-gray-500 uppercase text-lg">
              {coin.symbol}
            </span>
          </h1>
          <section className="flex items-baseline gap-3 mt-1">
            <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
              ${marketData?.current_price?.usd?.toLocaleString()}
            </span>
            <span
              className={`text-sm font-bold ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange24h.toFixed(2)}%
            </span>
          </section>
        </section>
      </section>

      {/* Chart */}
      <section
        className="w-[90%] sm:w-[80%] lg:w-[70%] p-6 rounded-2xl mb-10
        bg-cyan-50 shadow-[15px_15px_35px_rgba(8,51,68,0.15),-15px_-15px_35px_rgba(255,255,255,0.9)]
        dark:bg-[linear-gradient(145deg,#0c4c61,#041a21)] dark:shadow-[16px_16px_44px_#041a21,-16px_-16px_44px_#0c4c61]"
      >
        <h2 className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-4">
          Last 7 Days
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0891b2"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Stats */}
      <section className="w-[90%] sm:w-[80%] lg:w-[70%] grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatBox
          label="Market Cap"
          value={formatNumber(marketData?.market_cap?.usd)}
        />
        <StatBox
          label="24h Volume"
          value={formatNumber(marketData?.total_volume?.usd)}
        />
        <StatBox
          label="24h High"
          value={formatNumber(marketData?.high_24h?.usd)}
        />
        <StatBox
          label="24h Low"
          value={formatNumber(marketData?.low_24h?.usd)}
        />
      </section>

      {/* Trade button */}
      <Link
        to={`/trade?coin=${coin.id}`}
        className="px-10 py-3 rounded-xl font-bold text-sm bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors mb-10"
      >
        Trade {coin.symbol?.toUpperCase()}
      </Link>
      <ScrollToTopButton />
    </section>
  );
};

export default CoinDetail;
