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
import PriceChart from '../components/PriceChart';
import WatchlistIcon from '../components/WatchListIcon';
import { useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';
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
    const { theme } = useTheme();
    const tokens = colorTokens[theme];

    const [overview, setOverview] = useState<StockOverview | null>(null);
    const [priceData, setPriceData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [overviewData, priceHistory] = await Promise.all([
                    getStockOverview(symbol),
                    getStockPriceHistory(symbol),
                ]);
                setOverview(overviewData);

                const prices = (priceHistory || []).map((n) => Number(n)).filter((n) => Number.isFinite(n));
                if (!prices.length) {
                    console.warn('ProductScreen: priceHistory returned no valid numeric points', priceHistory);
                }
                console.log('ProductScreen: raw priceHistory sample:', Array.isArray(priceHistory) ? priceHistory.slice(0, 6) : priceHistory);
                console.log('ProductScreen: sanitized prices sample:', prices.slice(0, 8), 'length=', prices.length);
                setPriceData(prices.length ? prices : [price || 0]);
            } catch (err) {
                console.warn(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [symbol]);

    const latestPrice = priceData[priceData.length - 1] || 0;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: tokens.background }}>
                <ActivityIndicator size="large" color={tokens.primary} />
                <Text className="mt-2" style={{ color: tokens.text }}>Loading...</Text>
            </View>
        );
    }
    const fallbackPrices = [
        281.29, 281.25, 281.22, 281.20, 281.19, 281.06, 281.28,
        281.01, 281.80, 281.89, 281.69, 281.55, 281.30, 281.68,
    ];

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
                <PriceChart data={fallbackPrices} height={220} />

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
