import React from "react";
import { View, Text } from "react-native";
import { StockOverview } from "../types/stock";

interface DescriptionCardProps {
    overview: StockOverview | null;
    price: number;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ overview, price }) => {
    return (
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-8">
            <Text className="text-xl font-semibold text-black dark:text-white mb-2">
                About {overview?.name || "Company"}
            </Text>

            <Text className="text-gray-700 dark:text-gray-300 mb-4 leading-6">
                {overview?.description || "No description available."}
            </Text>
            <View className="flex-row flex-wrap mb-4">
                {overview?.industry && (
                    <View className="bg-orange-200 dark:bg-orange-600/30 rounded-full px-3 py-1 mr-2 mb-2">
                        <Text className="text-orange-800 dark:text-orange-300 text-sm font-medium">
                            Industry: {overview.industry}
                        </Text>
                    </View>
                )}
                {overview?.sector && (
                    <View className="bg-orange-200 dark:bg-orange-600/30 rounded-full px-3 py-1 mb-2">
                        <Text className="text-orange-800 dark:text-orange-300 text-sm font-medium">
                            Sector: {overview.sector}
                        </Text>
                    </View>
                )}
            </View>
            <View className="h-[1px] bg-gray-200 dark:bg-gray-700 mb-3" />
            <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 dark:text-gray-400 text-sm">52-Week Low</Text>
                <Text className="text-black dark:text-white font-semibold">
                    ${overview?.fiftyTwoWeekLow || "--"}
                </Text>
            </View>

            <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 dark:text-gray-400 text-sm">Current Price</Text>
                <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                    ${price || "--"}
                </Text>
            </View>

            <View className="flex-row justify-between mb-4">
                <Text className="text-gray-500 dark:text-gray-400 text-sm">52-Week High</Text>
                <Text className="text-black dark:text-white font-semibold">
                    ${overview?.fiftyTwoWeekHigh || "--"}
                </Text>
            </View>
            <View className="h-[1px] bg-gray-200 dark:bg-gray-700 mb-3" />
            <View className="flex-row flex-wrap justify-between">
                <View className="w-[48%] mb-3">
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">Market Cap</Text>
                    <Text className="text-black dark:text-white font-semibold">
                        {overview?.marketCap || "--"}
                    </Text>
                </View>

                <View className="w-[48%] mb-3">
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">P/E Ratio</Text>
                    <Text className="text-black dark:text-white font-semibold">
                        {overview?.peRatio || "--"}
                    </Text>
                </View>

                <View className="w-[48%] mb-3">
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">Beta</Text>
                    <Text className="text-black dark:text-white font-semibold">
                        {overview?.beta || "--"}
                    </Text>
                </View>

                <View className="w-[48%] mb-3">
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">Dividend Yield</Text>
                    <Text className="text-black dark:text-white font-semibold">
                        {overview?.dividendYield || "--"}
                    </Text>
                </View>

                <View className="w-[48%] mb-1">
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">Profit Margin</Text>
                    <Text className="text-black dark:text-white font-semibold">
                        {overview?.profitMargin || "--"}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default DescriptionCard;
