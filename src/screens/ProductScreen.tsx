import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { getStockOverview, getStockPriceHistory } from "../api/alphavantage";
import WatchlistIcon from "../components/WatchListIcon";
import { useWatchlist } from "../context/WatchListContext";
import DescriptionCard from "../components/DescriptionCard";
import { Stock, StockOverview } from "../types/stock";

const screenWidth = Dimensions.get("window").width - 32;

type ProductScreenRouteProp = RouteProp<RootStackParamList, "ProductScreen">;

const ProductScreen: React.FC = () => {
    const route = useRoute<ProductScreenRouteProp>();
    const { symbol, price } = route.params;
    console.log("Received price:", price);

    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

    const [overview, setOverview] = useState<StockOverview | null>(null);
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
                setPriceData(priceHistory || []);
            } catch (error) {
                console.error("Failed to fetch stock data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    const handleWatchlistToggle = () => {
        const latestPrice = priceData[priceData.length - 1] || 0;
        if (isInWatchlist(symbol)) {
            removeFromWatchlist({
                symbol,
                name: overview?.name || symbol,
                price: latestPrice,
                changePercent: 0,
            });
        } else {
            addToWatchlist({
                symbol,
                name: overview?.name || symbol,
                price: latestPrice,
                changePercent: 0,
            });
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-700 dark:text-gray-300 mt-3">
                    Loading stock data...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-gray-100 dark:bg-gray-900"
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-black dark:text-white">
                        {overview?.name || symbol}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300">
                        {overview?.symbol?.toUpperCase() || symbol}
                    </Text>
                    <Text className="text-2xl font-semibold mt-3 text-blue-600 dark:text-blue-400">
                        ${price || priceData[priceData.length - 1] || 0}
                    </Text>
                </View>

                <Pressable
                    onPress={handleWatchlistToggle}
                    className="ml-3 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
                >
                    <WatchlistIcon added={isInWatchlist(symbol)} />
                </Pressable>
            </View>
            <View className="mb-6">
                <Text className="text-lg font-semibold text-black dark:text-white mb-2">
                    Price History
                </Text>
                {priceData.length > 0 ? (
                    <LineChart
                        data={{
                            labels: priceData.map((_, i) =>
                                i % Math.ceil(priceData.length / 6) === 0 ? `${i}` : ""
                            ),
                            datasets: [{ data: priceData }],
                        }}
                        width={screenWidth}
                        height={220}
                        yAxisLabel="$"
                        chartConfig={{
                            backgroundGradientFrom: "#f3f4f6",
                            backgroundGradientTo: "#f3f4f6",
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                            propsForDots: { r: "3", strokeWidth: "2", stroke: "#2563eb" },
                        }}
                        bezier
                        style={{ borderRadius: 12 }}
                    />
                ) : (
                    <Text className="text-gray-500 dark:text-gray-400">
                        No price data available
                    </Text>
                )}
            </View>
            <DescriptionCard overview={overview} price={price} />
        </ScrollView>
    );
};

export default ProductScreen;
