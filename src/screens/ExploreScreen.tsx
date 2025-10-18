import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    ScrollView,
    Pressable,
    TextInput,
    Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTopGainersLosers, symbolSearch } from "../api/alphavantage";
import { Stock } from "../types/stock";
import StockCard from "../components/StockCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import StateView from "../components/StateView";
import { useTheme } from "../providers/ThemeProvider";
import { colorTokens } from "../utils/color-theme";
import {
    getRecentSearches,
    addRecentSearch,
    RecentSearch,
} from "../utils/recentSearches";

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

const ExploreScreen: React.FC = () => {
    const [topGainers, setTopGainers] = useState<Stock[]>([]);
    const [topLosers, setTopLosers] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { theme } = useTheme();
    const tokens = colorTokens[theme];

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Stock[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
    useEffect(() => {
        setRecentSearches(getRecentSearches());
    }, []);

    const onSelectRecentSearch = (item: RecentSearch) => {
        navigation.navigate("ProductScreen", { symbol: item.symbol, price: 0 });
        addRecentSearch({ ...item, timestamp: Date.now() });
        setRecentSearches(getRecentSearches());
        setShowDropdown(false);
        setSearchQuery(item.symbol);
    };

    // Debounced search
    const debouncedSearch = useMemo(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        return (q: string) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(async () => {
                if (!q || q.trim().length < 2) {
                    setSearchResults([]);
                    setSearching(false);
                    setShowDropdown(false);
                    return;
                }
                try {
                    setSearching(true);
                    const res = await symbolSearch(q.trim());
                    setSearchResults(res);
                    setShowDropdown(true);
                } catch (e) {
                    console.warn("Search failed", e);
                    setSearchResults([]);
                    setShowDropdown(false);
                } finally {
                    setSearching(false);
                }
            }, 500);
        };
    }, []);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { top_gainers, top_losers } = await getTopGainersLosers();
                if (top_gainers?.length && top_losers?.length) {
                    setTopGainers(top_gainers);
                    setTopLosers(top_losers);
                } else {
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

    if (loading) return <StateView loading />;

    const renderHeader = (title: string, onViewAll?: () => void) => (
        <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold text-black dark:text-white">{title}</Text>
            {onViewAll && (
                <Pressable onPress={onViewAll}>
                    <Text className="text-gray-600 dark:text-gray-400 font-bold">View All</Text>
                </Pressable>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100 dark:bg-gray-900">
            <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
                {error && (
                    <Text className="text-yellow-600 dark:text-yellow-400 text-center text-sm mb-2">
                        ⚠ {error}
                    </Text>
                )}

                <View className="px-4 mb-3">
                    <View className="flex-row items-center">
                        <TextInput
                            placeholder="Search by symbol"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 rounded-md p-3 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-white/10"
                            placeholderTextColor={theme === "dark" ? "rgba(255,255,255,0.6)" : "#666"}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable
                                onPress={() => {
                                    setSearchQuery("");
                                    setShowDropdown(false);
                                }}
                                className="ml-2 p-2"
                            >
                                <Icon
                                    name="close"
                                    size={18}
                                    color={theme === "dark" ? "rgba(255,255,255,0.7)" : "#666"}
                                />
                            </Pressable>
                        )}
                    </View>
                    {searching && <Text className="text-sm text-gray-500 mt-2">Searching...</Text>}
                </View>
                {recentSearches.length > 0 && (
                    <View className="px-4 mb-3">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-lg font-semibold text-black dark:text-white">
                                Recent Searches
                            </Text>
                            <Pressable onPress={() => setShowDropdown(true)}>
                                <Text className="text-gray-600 dark:text-gray-400 font-bold">View All</Text>
                            </Pressable>
                        </View>

                        {recentSearches.slice(0, 3).map((item) => (
                            <Pressable
                                key={item.symbol + item.timestamp}
                                onPress={() => onSelectRecentSearch(item)}
                                className="px-3 py-2 border-b border-gray-200 dark:border-gray-700"
                            >
                                <Text className="text-sm font-semibold text-black dark:text-white">{item.symbol}</Text>
                                {item.name && <Text className="text-xs text-gray-600 dark:text-gray-300">{item.name}</Text>}
                            </Pressable>
                        ))}
                    </View>
                )}
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
            {searchResults.length > 0 && (<Modal
                visible={showDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
            >
                <Pressable
                    className="flex-1 bg-black/20"
                    onPress={() => setShowDropdown(false)}
                >
                    <View className={`mt-32 mx-4 rounded-md border ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} max-h-96`}>
                        <ScrollView>
                            {(() => {
                                const dropdownItems: RecentSearch[] = searchResults.length > 0
                                    ? searchResults.map((s) => ({ symbol: s.symbol, name: s.name, timestamp: Date.now() }))
                                    : getRecentSearches();
                                return dropdownItems.map((item) => (
                                    <Pressable
                                        key={item.symbol + item.timestamp}
                                        onPress={() => onSelectRecentSearch(item)}
                                        className="px-3 py-2 border-b border-gray-200 dark:border-gray-700"
                                    >
                                        <Text className="text-sm font-semibold text-black dark:text-white">{item.symbol}</Text>
                                        {item.name && <Text className="text-xs text-gray-600 dark:text-gray-300">{item.name}</Text>}
                                    </Pressable>
                                ));
                            })()}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>)}
        </View>
    );
};

export default ExploreScreen;
