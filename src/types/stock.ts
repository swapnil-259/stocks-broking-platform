export interface Stock {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
    logoUrl?: string;
}

export interface StockOverview {
    symbol: string;
    name: string;
    description: string;
    exchange: string;
    currency: string;
    country: string;
    sector: string;
    industry: string;
    marketCap?: number;
    peRatio?: number;
    dividendPerShare?: number;
    dividendYield?: number;
    eps?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    fiftyDayMA?: number;
    twoHundredDayMA?: number;
    officialSite?: string;
    beta?: string;
    profitMargin?: string;
}


export interface StockResponse {
    ticker: string;
    price: string;
    change_percentage: string;
}