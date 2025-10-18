import axios from "axios";
import { Stock, StockOverview, StockResponse } from "../types/stock";
import { getCache, setCache } from "../utils/cache";

const API_KEY = "1R2SZV1GSJV1VOT6";
const BASE_URL = "https://www.alphavantage.co/query";

const buildUrl = (params: Record<string, string | number>) => {
    const url = `${BASE_URL}?${new URLSearchParams({
        ...params,
        apikey: "demo"
    } as Record<string, string>).toString()}`;
    console.log("Request URL:", url);
    return url;
};

export const getTopGainersLosers = async (): Promise<{
    top_gainers: Stock[];
    top_losers: Stock[];
}> => {
    const cacheKey = 'top_gainers_losers';
    const cached = getCache<{ top_gainers: Stock[]; top_losers: Stock[] }>(cacheKey);
    if (cached) return cached;

    try {
        const url = buildUrl({ function: "TOP_GAINERS_LOSERS" });
        const response = await axios.get(url);
        console.log("Top Gainers/Losers Response:", response.data);

        const data = response.data;

        const top_gainers: Stock[] = data?.top_gainers?.map((item: StockResponse) => ({
            symbol: item.ticker,
            name: item.ticker,
            price: parseFloat(item.price),
            changePercent: parseFloat(item.change_percentage),
            logoUrl: `https://logo.clearbit.com/${item.ticker.toLowerCase()}.com`,
        })) || [];

        const top_losers: Stock[] = data?.top_losers?.map((item: StockResponse) => ({
            symbol: item.ticker,
            name: item.ticker,
            price: parseFloat(item.price),
            changePercent: parseFloat(item.change_percentage),
            logoUrl: `https://logo.clearbit.com/${item.ticker.toLowerCase()}.com`,
        })) || [];

        const result = { top_gainers, top_losers };
        setCache(cacheKey, result, 1000 * 60 * 5);
        return result;
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.log("Error fetching top gainers/losers:", errMsg);
        return { top_gainers: [], top_losers: [] };
    }
};


export const getStockOverview = async (symbol: string): Promise<StockOverview> => {
    const cacheKey = `overview_${symbol}`;
    const cached = getCache<StockOverview>(cacheKey);
    if (cached) return cached;

    try {
        const url = buildUrl({ function: "OVERVIEW", symbol });
        const response = await axios.get(url);

        const data = response.data;
        console.log("Stock Overview Response for", symbol, ":", data);

        if (!data || !data.Symbol) {
            throw new Error("No data found for symbol: " + symbol);
        }

        const result: StockOverview = {
            symbol: data.Symbol,
            name: data.Name,
            description: data.Description,
            exchange: data.Exchange,
            currency: data.Currency,
            country: data.Country,
            sector: data.Sector,
            industry: data.Industry,
            marketCap: data.MarketCapitalization ? parseFloat(data.MarketCapitalization) : undefined,
            peRatio: data.PERatio ? parseFloat(data.PERatio) : undefined,
            dividendPerShare: data.DividendPerShare ? parseFloat(data.DividendPerShare) : undefined,
            dividendYield: data.DividendYield ? parseFloat(data.DividendYield) : undefined,
            eps: data.EPS ? parseFloat(data.EPS) : undefined,
            fiftyTwoWeekHigh: data["52WeekHigh"] ? parseFloat(data["52WeekHigh"]) : undefined,
            fiftyTwoWeekLow: data["52WeekLow"] ? parseFloat(data["52WeekLow"]) : undefined,
            fiftyDayMA: data["50DayMovingAverage"] ? parseFloat(data["50DayMovingAverage"]) : undefined,
            twoHundredDayMA: data["200DayMovingAverage"] ? parseFloat(data["200DayMovingAverage"]) : undefined,
            officialSite: data.OfficialSite || undefined,
        };

        setCache(cacheKey, result, 1000 * 60 * 5);
        return result;
    } catch (error: any) {
        console.log("Error fetching stock overview:", error?.message || error);
        throw new Error(error?.message || 'Failed to fetch overview');
    }
};

export const getStockPriceHistory = async (symbol: string): Promise<number[]> => {
    const cacheKey = `history_${symbol}`;
    const cached = getCache<number[]>(cacheKey);
    if (cached) return cached;

    try {
        const url = buildUrl({
            function: "TIME_SERIES_DAILY",
            symbol,
            outputsize: "compact",
        });

        const response = await axios.get(url);

        const data = response.data["Time Series (Daily)"];
        if (!data) {
            console.warn("No historical data found for", symbol);
            return [];
        }
        const sortedDates = Object.keys(data).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        const prices = sortedDates.map((date) =>
            parseFloat(data[date]["4. close"])
        );

        setCache(cacheKey, prices, 1000 * 60 * 5);
        return prices;
    } catch (error: unknown) {
        console.log("Error fetching stock price history:", error instanceof Error ? error.message : String(error));
        return [];
    }
};

