import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { getStockOverview, getStockPriceHistory } from "../api/alphavantage";
import WatchlistIcon from "../components/WatchListIcon";
import { useWatchlist } from "../context/WatchListContext";

const screenWidth = Dimensions.get("window").width;

type ProductScreenRouteProp = RouteProp<RootStackParamList, "ProductScreen">;

const ProductScreen: React.FC = () => {
    const route = useRoute<ProductScreenRouteProp>();
    const { symbol } = route.params;
    const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

    const [overview, setOverview] = useState<any>(null);
    const [priceData, setPriceData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [overviewData, priceHistory] = await Promise.all([
                    getStockOverview(symbol),
                    getStockPriceHistory(symbol),
                ]);
                setOverview(overviewData);
                setPriceData(priceHistory);
            } catch (error) {
                console.error("Failed to fetch stock data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    const handleWatchlistToggle = () => {
        if (isInWatchlist(symbol)) {
            removeFromWatchlist({ symbol, name: overview?.name || symbol, price: priceData[priceData.length - 1] || 0, changePercent: 0 });
        } else {
            addToWatchlist({ symbol, name: overview?.name || symbol, price: priceData[priceData.length - 1] || 0, changePercent: 0 });
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-700 dark:text-gray-300 mt-3">Loading stock data...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900" contentContainerStyle={{ padding: 16 }}>
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-black dark:text-white">{overview?.name || symbol}</Text>
                    <Text className="text-xl font-semibold mt-1 text-black dark:text-white">${overview?.price || 0}</Text>
                </View>
                <Pressable onPress={handleWatchlistToggle} className="ml-4 mt-1">
                    <WatchlistIcon added={isInWatchlist(symbol)} />
                </Pressable>
            </View>

            {overview?.description && (
                <View className="mb-4">
                    <Text className="text-lg font-semibold text-black dark:text-white mb-1">About</Text>
                    <Text className="text-gray-700 dark:text-gray-300">{overview.description}</Text>
                </View>
            )}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-black dark:text-white mb-2">Price History</Text>
                {priceData.length > 0 ? (
                    <LineChart
                        data={{
                            labels: priceData.map((_, i) => (i % Math.ceil(priceData.length / 6) === 0 ? `${i}` : "")),
                            datasets: [{ data: priceData }],
                        }}
                        width={screenWidth - 32}
                        height={220}
                        yAxisLabel="$"
                        chartConfig={{
                            backgroundGradientFrom: "#f3f4f6",
                            backgroundGradientTo: "#f3f4f6",
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                            propsForDots: { r: "2", strokeWidth: "1", stroke: "#2563eb" },
                        }}
                        bezier
                        style={{ borderRadius: 12 }}
                    />
                ) : (
                    <Text className="text-gray-500 dark:text-gray-400">No price data available</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default ProductScreen;
