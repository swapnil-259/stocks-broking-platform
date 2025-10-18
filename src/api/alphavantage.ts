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
        const fallback: StockOverview = {
            symbol: "IBM",
            name: "International Business Machines",
            description:
                "International Business Machines Corporation (IBM) is a prominent American multinational technology company headquartered in Armonk, New York, with operations spanning over 170 countries. Established in 1911, IBM has established itself as a leader in innovation through its diverse offerings in hardware, software, and consulting services, with an increasing emphasis on artificial intelligence, quantum computing, and cloud solutions.",
            exchange: "NYSE",
            currency: "USD",
            country: "USA",
            sector: "TECHNOLOGY",
            industry: "INFORMATION TECHNOLOGY SERVICES",
            marketCap: 257071366000,
            peRatio: 44.51,
            dividendPerShare: 6.69,
            dividendYield: 0.0238,
            eps: 6.2,
            fiftyTwoWeekHigh: 301.04,
            fiftyTwoWeekLow: 197.92,
            fiftyDayMA: 260.37,
            twoHundredDayMA: 256.26,
            officialSite: "https://www.ibm.com",
            beta: "0.724",
            profitMargin: "0.0911",
        };

        console.warn("Using fallback stock overview for:", symbol);
        setCache(cacheKey, fallback, 1000 * 60 * 5);
        return fallback;
    }
};

export const getStockPriceHistory = async (symbol: string): Promise<number[]> => {
    const cacheKey = `history_${symbol}`;
    const cached = getCache<number[]>(cacheKey);
    if (cached) return cached;

    try {
        const dailyUrl = buildUrl({
            function: "TIME_SERIES_DAILY",
            symbol,
            outputsize: "compact",
        });

        const response = await axios.get(dailyUrl);
        let data = response.data["Time Series (Daily)"];
        if (!data) {
            console.warn(`No daily data for ${symbol}. Trying intraday fallback...`);
            const intradayUrl = buildUrl({
                function: "TIME_SERIES_INTRADAY",
                symbol,
                interval: "5min",
                outputsize: "compact",
            });

            const intradayResponse = await axios.get(intradayUrl);
            data = intradayResponse.data["Time Series (5min)"];
        }
        if (!data) {
            console.error(`No data found for ${symbol} even after fallback.`);
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
        console.log(
            "Error fetching stock price history:",
            error instanceof Error ? error.message : String(error)
        );
        const fallbackPrices = [
            281.29, 281.25, 281.22, 281.20, 281.19, 281.06, 281.28,
            281.01, 281.80, 281.89, 281.69, 281.55, 281.30, 281.68,
        ];
        console.warn("Returning fallback prices for chart display.");
        return fallbackPrices;
    }
};


