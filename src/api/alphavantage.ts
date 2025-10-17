import axios from "axios";
import { Stock } from "../types/stock";

const API_KEY = "YOUR_ALPHAVANTAGE_API_KEY";
const BASE_URL = "https://www.alphavantage.co/query";

export const getTopGainersLosers = async (): Promise<{
    top_gainers: Stock[];
    top_losers: Stock[];
}> => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                function: "TOP_GAINERS_LOSERS",
                apikey: API_KEY,
            },
        });

        const data = response.data;
        const top_gainers = data["top_gainers"]?.map((item: any) => ({
            symbol: item.ticker,
            name: item.ticker,
            price: parseFloat(item.price),
            changePercent: parseFloat(item.change_percentage),
            logoUrl: `https://logo.clearbit.com/${item.ticker.toLowerCase()}.com`,
        }));

        const top_losers = data["top_losers"]?.map((item: any) => ({
            symbol: item.ticker,
            name: item.ticker,
            price: parseFloat(item.price),
            changePercent: parseFloat(item.change_percentage),
            logoUrl: `https://logo.clearbit.com/${item.ticker.toLowerCase()}.com`,
        }));

        return { top_gainers, top_losers };
    } catch (error) {
        console.error("Error fetching top gainers/losers:", error);
        throw error;
    }
};
