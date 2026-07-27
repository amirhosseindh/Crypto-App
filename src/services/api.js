import axios from "axios";

const API_KEY = import.meta.env.VITE_CG_API_KEY;

const cryptoApi = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "x-cg-demo-api-key": API_KEY,
  },
});

export const getCoin = async (page = 1, perPage = 20) => {
  try {
    const { data } = await cryptoApi.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: perPage,
        page,
        sparkline: false,
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to fetch coin data:", error);
    throw error;
  }
};

export const getGlobalData = async () => {
  try {
    const { data } = await cryptoApi.get("/global");
    return data.data;
  } catch (error) {
    console.error("Failed to fetch global market data:", error);
    throw error;
  }
};

export const getCoinDetail = async (id) => {
  try {
    const { data } = await cryptoApi.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
      },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch coin detail:", error);
    throw error;
  }
};

export const getCoinMarketChart = async (id, days = 7) => {
  try {
    const { data } = await cryptoApi.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: "usd",
        days,
      },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch coin market chart:", error);
    throw error;
  }
};