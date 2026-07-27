import React from "react";
import { useNavigate } from "react-router-dom";

const Coin = ({ data }) => {
  const navigate = useNavigate();
  const change = data.price_change_percentage_24h;

  const changeColor =
    change > 0
      ? "text-green-500"
      : change < 0
        ? "text-red-500"
        : "text-slate-700 dark:text-gray-100";

  const handleClick = () => {
    navigate(`/coin/${data.id}`);
  };

  return (
    <>
      <section
        onClick={handleClick}
        className="lg:hidden cursor-pointer flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 p-8 rounded-3xl transition-all duration-300
         bg-cyan-50 shadow-[15px_15px_35px_rgba(8,51,68,0.15),-15px_-15px_35px_rgba(255,255,255,0.9)] hover:shadow-2xl dark:bg-[linear-gradient(145deg,#0c4c61,#041a21)] dark:shadow-[16px_16px_44px_#041a21,-16px_-16px_44px_#0c4c61]
        dark:hover:shadow-2xl
      "
      >
        <section className="w-full h-20 sm:w-20 sm:h-20 flex justify-center items-center sm:shrink-0">
          <img className="w-16 h-16" src={data.image} alt={data.name} />
        </section>

        <section className="w-full sm:flex-1 flex flex-col sm:grid sm:grid-cols-2 gap-5 sm:gap-6">
          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            Name:
            <span className="text-slate-700 dark:text-gray-100 font-normal break-words">
              {data.name}
            </span>
          </p>
          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            Symbol:
            <span className="text-slate-700 dark:text-gray-100 font-normal uppercase">
              {data.symbol}
            </span>
          </p>

          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            Price:
            <span className="text-slate-700 dark:text-gray-100 font-normal break-words">
              {data.current_price}$
            </span>
          </p>
          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            24h changes:
            <span className={`font-normal ${changeColor}`}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          </p>
        </section>
      </section>

      <section
        onClick={handleClick}
        className="hidden lg:flex w-full items-center gap-6 p-8 rounded-3xl transition-all duration-300 cursor-pointer
        bg-cyan-50 shadow-[15px_15px_35px_rgba(8,51,68,0.15),-15px_-15px_35px_rgba(255,255,255,0.9)] hover:shadow-2xl
        dark:bg-[linear-gradient(145deg,#0c4c61,#041a21)] dark:shadow-[16px_16px_44px_#041a21,-16px_-16px_44px_#0c4c61]
        dark:hover:shadow-2xl
      "
      >
        <section className="w-20 h-20 flex justify-center items-center shrink-0">
          <img className="w-16 h-16" src={data.image} alt={data.name} />
        </section>

        <section className="flex-1 flex flex-row flex-wrap justify-between gap-6">
          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            Name:
            <span className="text-slate-700 dark:text-gray-100 font-normal break-words">
              {data.name}
            </span>
          </p>
          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            Symbol:
            <span className="text-slate-700 dark:text-gray-100 font-normal uppercase">
              {data.symbol}
            </span>
          </p>

          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            Price:
            <span className="text-slate-700 dark:text-gray-100 font-normal break-words">
              {data.current_price}$
            </span>
          </p>
          <p className="flex flex-row items-baseline gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
            24h changes:
            <span className={`font-normal ${changeColor}`}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          </p>
        </section>
      </section>
    </>
  );
};

export default Coin;
