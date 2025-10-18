import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import WatchlistIcon from '../components/WatchListIcon';
import { useRoute, RouteProp } from "@react-navigation/native";
import { getStockOverview, getStockPriceHistory } from "../api/alphavantage";
import DescriptionCard from "../components/DescriptionCard";
import { useWatchlist } from "../context/WatchListContext";
import { useWatchlists } from '../context/WatchlistsCollectionContext';
import WatchlistModal from "../components/WatchlistModal";
import { StockOverview } from "../types/stock";
import { RootStackParamList } from "../navigation/types";

const screenWidth = Dimensions.get("window").width - 32;

type ProductScreenRouteProp = RouteProp<RootStackParamList, "ProductScreen">;

const ProductScreen: React.FC = () => {
    const route = useRoute<ProductScreenRouteProp>();
    const { symbol, price } = route.params;
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const { isInAnyList } = useWatchlists();

    const [overview, setOverview] = useState<StockOverview | null>(null);
    const [priceData, setPriceData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [overviewData, priceHistory] = await Promise.all([
                    getStockOverview(symbol),
                    getStockPriceHistory(symbol),
                ]);
                setOverview(overviewData);
                const prices = (priceHistory || []).filter((n) => typeof n === "number");
                setPriceData(prices.length ? prices : [price || 0]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [symbol]);

    const latestPrice = priceData[priceData.length - 1] || 0;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 dark:bg-gray-900">
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-black dark:text-white">
                            {overview?.name || symbol}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                            {symbol.toUpperCase()}
                        </Text>
                        <Text className="text-2xl font-semibold mt-3 text-blue-600">
                            ${price || latestPrice}
                        </Text>
                    </View>

                    <View className="ml-3 p-2 rounded-full bg-gray-200 dark:bg-gray-800">
                        <WatchlistIcon symbol={symbol} size={28} onPress={() => setModalVisible(true)} />
                    </View>
                </View>

                <DescriptionCard overview={overview} price={price} />
            </ScrollView>
            <WatchlistModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                stock={{
                    symbol,
                    name: overview?.name || symbol,
                    price: latestPrice,
                    changePercent: 0,
                }}
            />
        </View>
    );
};

export default ProductScreen;
