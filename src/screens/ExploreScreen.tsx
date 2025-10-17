import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { getTopGainersLosers } from "../api/alphavantage";
import { Stock } from "../types/stock";
import StockCard from "../components/StockCard";

const fallbackData = {
    top_gainers: [
        { symbol: "AAPL", name: "Apple Inc.", price: 185.32, changePercent: 1.2 },
        { symbol: "GOOGL", name: "Alphabet Inc.", price: 135.8, changePercent: 0.8 },
        { symbol: "MSFT", name: "Microsoft Corp.", price: 310.5, changePercent: 1.0 },
        { symbol: "NVDA", name: "NVIDIA Corp.", price: 460.2, changePercent: 2.1 },
        { symbol: "META", name: "Meta Platforms", price: 230.7, changePercent: 0.9 },
    ],
    top_losers: [
        { symbol: "TSLA", name: "Tesla Inc.", price: 250.5, changePercent: -1.4 },
        { symbol: "AMZN", name: "Amazon.com", price: 127.1, changePercent: -0.6 },
        { symbol: "NFLX", name: "Netflix Inc.", price: 420.8, changePercent: -1.2 },
        { symbol: "BABA", name: "Alibaba Group", price: 90.3, changePercent: -0.9 },
        { symbol: "INTC", name: "Intel Corp.", price: 52.7, changePercent: -0.7 },
    ],
};

const ExploreScreen = () => {
    const [topGainers, setTopGainers] = useState<Stock[]>([]);
    const [topLosers, setTopLosers] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { top_gainers, top_losers } = await getTopGainersLosers();

                if (top_gainers?.length && top_losers?.length) {
                    setTopGainers(top_gainers);
                    setTopLosers(top_losers);
                } else {
                    console.warn("API returned empty data. Using fallback.");
                    setTopGainers(fallbackData.top_gainers);
                    setTopLosers(fallbackData.top_losers);
                    setError("Showing fallback data due to API issue.");
                }
            } catch (error) {
                console.error("Failed to load top gainers/losers:", error);
                setTopGainers(fallbackData.top_gainers);
                setTopLosers(fallbackData.top_losers);
                setError("Unable to fetch live data. Showing static stocks.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-700 dark:text-gray-300 mt-3">
                    Fetching top gainers & losers...
                </Text>
            </View>
        );
    }

    const renderHeader = (title: string, onViewAll?: () => void) => (
        <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold text-black dark:text-white">
                {title}
            </Text>
            {onViewAll && (
                <Pressable onPress={onViewAll}>
                    <Text className="text-gray-600 dark:text-gray-400 font-medium">View All</Text>
                </Pressable>
            )}
        </View>
    );

    return (
        <ScrollView
            className="flex-1 bg-gray-100 dark:bg-gray-900"
            contentContainerStyle={{ paddingVertical: 8 }}
        >
            {error && (
                <Text className="text-yellow-600 dark:text-yellow-400 text-center text-sm mb-2">
                    ⚠ {error}
                </Text>
            )}

            <View className="px-4 mb-3">
                {renderHeader("Top Gainers", () => console.log("View All Gainers"))}
                <FlatList
                    data={topGainers.slice(0, 4)}
                    keyExtractor={(item) => item.symbol}
                    numColumns={2}
                    renderItem={({ item }) => <StockCard stock={item} />}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    scrollEnabled={false}
                />
            </View>

            <View className="px-4 mb-4">
                {renderHeader("Top Losers", () => console.log("View All Losers"))}
                <FlatList
                    data={topLosers.slice(0, 4)}
                    keyExtractor={(item) => item.symbol}
                    numColumns={2}
                    renderItem={({ item }) => <StockCard stock={item} />}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    scrollEnabled={false}
                />
            </View>
        </ScrollView>
    );
};

export default ExploreScreen;
