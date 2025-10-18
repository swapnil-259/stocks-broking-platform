import { Stock } from "../types/stock";

export type RootStackParamList = {
    ExploreScreen: undefined;
    ProductScreen: { symbol: string, price: number };
    WatchlistScreen: undefined;
    ViewAllScreen: { type: "gainers" | "losers"; stocks: Stock[] };
};
