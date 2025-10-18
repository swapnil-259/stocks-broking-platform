import React, { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, ScrollView, Pressable, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getTopGainersLosers, symbolSearch, getStockOverview, getStockPriceHistory } from "../api/alphavantage";
import { Stock } from "../types/stock";
import StockCard from "../components/StockCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import StateView from "../components/StateView";
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';

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
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useTheme();
    const tokens = colorTokens[theme];
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Stock[]>([]);
    const [searching, setSearching] = useState(false);
    const debouncedSearch = useMemo(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        return (q: string) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(async () => {
                if (!q || q.trim().length < 2) {
                    setSearchResults([]);
                    setSearching(false);
                    return;
                }
                try {
                    setSearching(true);
                    const res = await symbolSearch(q.trim());
                    setSearchResults(res);
                } catch (e) {
                    console.warn('Search failed', e);
                    setSearchResults([]);
                } finally {
                    setSearching(false);
                }
            }, 500);
        };
    }, []);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    const onSelectResult = (sym: string) => {
        setSearchResults([]);
        setSearchQuery(sym);
        navigation.getParent()?.navigate('ProductScreen', { symbol: sym, price: 0 });
    };

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
                console.warn("Failed to load top gainers/losers:", error);
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
        return <StateView loading />;
    }

    const renderHeader = (title: string, onViewAll?: () => void) => (
        <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold text-black dark:text-white">
                {title}
            </Text>
            {onViewAll && (
                <Pressable onPress={onViewAll}>
                    <Text className="text-gray-600 dark:text-gray-400 font-bold" >View All</Text>
                </Pressable>
            )}
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900" contentContainerStyle={{ paddingVertical: 8 }}>
            {error && (
                <Text className="text-yellow-600 dark:text-yellow-400 text-center text-sm mb-2">
                    ⚠ {error}
                </Text>
            )}
            <View className="px-4 mb-3 relative">
                <View className="flex-row items-center">
                    <TextInput
                        placeholder="Search by symbol"
                        value={searchQuery}
                        onChangeText={setSearchQuery}

                        className="flex-1 rounded-md p-3 bg-white dark:bg-transparent text-black dark:text-white border border-gray-200 dark:border-white/10"
                        placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#666'}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')} className="ml-2 p-2" accessibilityLabel="Clear search">
                            <Icon name="close" size={18} color={theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#666'} />
                        </Pressable>
                    )}
                </View>
                {searching && (
                    <Text className="text-sm text-gray-500 mt-2">Searching...</Text>
                )}

                {searchResults.length > 0 && (
                    <View className="absolute left-4 right-4 top-16 z-50">
                        <View
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                            style={{ maxHeight: 256 }}
                            pointerEvents="box-none"
                        >
                            <ScrollView nestedScrollEnabled>
                                {searchResults.map((item) => (
                                    <Pressable
                                        key={item.symbol}
                                        onPress={() => {
                                            console.log("Pressed:", item.symbol);
                                            navigation.navigate('ProductScreen', { symbol: item.symbol, price: 0 });
                                        }}
                                        className="px-3 py-2 border-b border-gray-100 dark:border-gray-700"
                                    >
                                        <Text className="text-sm font-semibold text-black dark:text-white">{item.symbol}</Text>
                                        <Text className="text-xs text-gray-600 dark:text-gray-300">{item.name}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

            </View>

            <View className="px-4 mb-3">
                {renderHeader("Top Gainers", () =>
                    navigation.getParent()?.navigate("ViewAllScreen", { type: "gainers", stocks: topGainers })
                )}
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
                {renderHeader("Top Losers", () =>
                    navigation.getParent()?.navigate("ViewAllScreen", { type: "losers", stocks: topLosers })
                )}
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
