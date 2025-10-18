import { Stock } from "../types/stock";

export type RootStackParamList = {
    ExploreScreen: undefined;
    ProductScreen: { symbol: string };
    WatchlistScreen: undefined;
    ViewAllScreen: { type: "gainers" | "losers"; stocks: Stock[] };
};
