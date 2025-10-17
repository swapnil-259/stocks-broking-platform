export type RootStackParamList = {
    ExploreScreen: undefined;
    WatchlistScreen: undefined;
    ProductScreen: { symbol: string };
    ViewAllScreen: { section: string } | undefined;
};
