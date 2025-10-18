import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import StockCard from "../components/StockCard";

type ViewAllRouteProp = RouteProp<RootStackParamList, "ViewAllScreen">;

const ITEMS_PER_PAGE = 6;

const ViewAllScreen = () => {
    const route = useRoute<ViewAllRouteProp>();
    const { type, stocks } = route.params;

    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(stocks.length / ITEMS_PER_PAGE);
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const currentStocks = stocks.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
        <View className="flex-1 bg-gray-100 dark:bg-gray-900 px-4 pt-3">
            <Text className="text-2xl font-semibold text-black dark:text-white mb-3">
                {type === "gainers" ? "Top Gainers" : "Top Losers"}
            </Text>

            <FlatList
                data={currentStocks}
                keyExtractor={(item) => item.symbol}
                numColumns={2}
                renderItem={({ item }) => <StockCard stock={item} />}
                columnWrapperStyle={{ justifyContent: "space-between" }}
            />

            <View className="flex-row items-center justify-between mt-6 mb-6 px-4">
                <Pressable
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-5 py-2 rounded-lg border border-1 border-white ${page === 1 ? "bg-transparent" : "bg-gray-600"
                        }`}
                >
                    <Text className="text-white font-semibold text-base">Prev</Text>
                </Pressable>

                <Text className="text-black dark:text-white text-base font-medium">
                    Page {page} of {totalPages}
                </Text>

                <Pressable
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-5 py-2 rounded-lg border border-1 border-white ${page === totalPages ? "bg-transparent" : "bg-gray-600"
                        }`}
                >
                    <Text className="text-white font-semibold text-base">Next</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default ViewAllScreen;
