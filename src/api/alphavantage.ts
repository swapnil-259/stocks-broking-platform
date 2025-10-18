import axios from "axios";
import { Stock, StockOverview } from "../types/stock";

const API_KEY = "YOUR_ALPHAVANTAGE_API_KEY";
const BASE_URL = "https://www.alphavantage.co/query";

const buildUrl = (params: Record<string, string | number>) => {
    const url = `${BASE_URL}?${new URLSearchParams({
        ...params,
        apikey: API_KEY
    } as any).toString()}`;
    console.log("Request URL:", url);
    return url;
};

export const getTopGainersLosers = async (): Promise<{
    top_gainers: Stock[];
    top_losers: Stock[];
}> => {
    try {
        const url = buildUrl({ function: "TOP_GAINERS_LOSERS" });
        const response = await axios.get(url);
        console.log("Top Gainers/Losers Response:", response.data);

        const data = response.data;

        const top_gainers: Stock[] = data.top_gainers?.map((item: any) => ({
            symbol: item.ticker,
            name: item.ticker,
            price: parseFloat(item.price),
            changePercent: parseFloat(item.change_percentage),
            logoUrl: `https://logo.clearbit.com/${item.ticker.toLowerCase()}.com`,
        })) || [];

        const top_losers: Stock[] = data.top_losers?.map((item: any) => ({
            symbol: item.ticker,
            name: item.ticker,
            price: parseFloat(item.price),
            changePercent: parseFloat(item.change_percentage),
            logoUrl: `https://logo.clearbit.com/${item.ticker.toLowerCase()}.com`,
        })) || [];

        return { top_gainers, top_losers };
    } catch (error) {
        console.error("Error fetching top gainers/losers:", error);
        throw error;
    }
};


export const getStockOverview = async (symbol: string): Promise<StockOverview> => {
    try {
        const url = buildUrl({ function: "OVERVIEW", symbol });
        const response = await axios.get(url);

        const data = response.data;
        console.log("Stock Overview Response for", symbol, ":", data);

        if (!data || !data.Symbol) {
            throw new Error("No data found for symbol: " + symbol);
        }

        return {
            symbol: data.Symbol,
            name: data.Name,
            description: data.Description,
            exchange: data.Exchange,
            currency: data.Currency,
            country: data.Country,
            sector: data.Sector,
            industry: data.Industry,
            marketCap: parseFloat(data.MarketCapitalization),
            peRatio: parseFloat(data.PERatio),
            dividendPerShare: data.DividendPerShare ? parseFloat(data.DividendPerShare) : undefined,
            dividendYield: data.DividendYield ? parseFloat(data.DividendYield) : undefined,
            eps: data.EPS ? parseFloat(data.EPS) : undefined,
            fiftyTwoWeekHigh: data["52WeekHigh"] ? parseFloat(data["52WeekHigh"]) : undefined,
            fiftyTwoWeekLow: data["52WeekLow"] ? parseFloat(data["52WeekLow"]) : undefined,
            fiftyDayMA: data["50DayMovingAverage"] ? parseFloat(data["50DayMovingAverage"]) : undefined,
            twoHundredDayMA: data["200DayMovingAverage"] ? parseFloat(data["200DayMovingAverage"]) : undefined,
            officialSite: data.OfficialSite || undefined,
        };
    } catch (error) {
        console.error("Error fetching stock overview:", error);
        throw error;
    }
};

export const getStockPriceHistory = async (symbol: string): Promise<number[]> => {
    try {
        const url = buildUrl({
            function: "TIME_SERIES_DAILY_ADJUSTED",
            symbol,
            outputsize: "compact"
        });
        const response = await axios.get(url);

        const data = response.data["Time Series (Daily)"];
        if (!data) {
            console.warn("No historical data found for", symbol);
            return [];
        }

        const sortedDates = Object.keys(data).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        const prices = sortedDates.map((date) => parseFloat(data[date]["4. close"]));
        return prices;
    } catch (error) {
        console.error("Error fetching stock price history:", error);
        return [];
    }
};
