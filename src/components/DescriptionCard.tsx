import type React from "react"
import { View, Text, Image } from "react-native"
import type { StockOverview } from "../types/stock"

interface DescriptionCardProps {
    overview: StockOverview | null
    price: number
    priceChange?: number
    logo?: string
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ overview, price, priceChange = 0, logo }) => {

    return (
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-8">
            <View className="p-4">

                <Text className="text-lg font-semibold text-black dark:text-white mb-3">
                    About {overview?.name || "Company"}
                </Text>

                <Text className="text-gray-700 dark:text-gray-300 mb-4 leading-6 text-sm">
                    {overview?.description || "No description available."}
                </Text>

                <View className="flex-row flex-wrap ">
                    {overview?.industry && (
                        <View className="bg-orange-100 dark:bg-orange-900/30 rounded-full px-3 py-1 mr-2 mb-2">
                            <Text className="text-orange-700 dark:text-orange-300 text-xs font-medium">
                                Industry: {overview.industry}
                            </Text>
                        </View>
                    )}
                    {overview?.sector && (
                        <View className="bg-orange-100 dark:bg-orange-900/30 rounded-full px-3 py-1 mb-2">
                            <Text className="text-orange-700 dark:text-orange-300 text-xs font-medium">
                                Sector: {overview.sector}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />

                <View className="mb-4">
                    <View className="flex-row mb-2">
                        <View>
                            <Text className="text-gray-500 dark:text-gray-400 text-xs">52-Week Low</Text>
                            <Text className="text-black dark:text-white font-semibold text-sm">
                                ${overview?.fiftyTwoWeekLow || "--"}
                            </Text>
                        </View>
                        <View className="flex-1 mx-4 justify-center">
                            <View className="h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <Text className="text-gray-600 dark:text-gray-400 text-xs text-center mt-1">
                                Current price: ${price.toFixed(2)}
                            </Text>
                        </View>
                        <View >
                            <Text className="text-gray-500 dark:text-gray-400 text-xs ">52-Week High</Text>
                            <Text className="text-black dark:text-white font-semibold text-sm">
                                ${overview?.fiftyTwoWeekHigh || "--"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="h-[1px] bg-gray-200 dark:bg-gray-700 my-4" />

                <View className="flex-row justify-between">
                    <View className="flex-1 mr-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Market Cap</Text>
                        <Text className="text-black dark:text-white font-semibold text-sm">{overview?.marketCap || "--"}</Text>
                    </View>

                    <View className="flex-1 mr-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">P/E Ratio</Text>
                        <Text className="text-black dark:text-white font-semibold text-sm">{overview?.peRatio || "--"}</Text>
                    </View>

                    <View className="flex-1 mr-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Beta</Text>
                        <Text className="text-black dark:text-white font-semibold text-sm">{Number(overview?.beta)?.toFixed(2) || "--"}</Text>
                    </View>

                    <View className="flex-1 mr-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Dividend Yield</Text>
                        <Text className="text-black dark:text-white font-semibold text-sm">{Number(overview?.dividendYield)?.toFixed(2) || "--"}</Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-gray-500 dark:text-gray-400 text-xs">Profit Margin</Text>
                        <Text className="text-black dark:text-white font-semibold text-sm">{Number(overview?.profitMargin)?.toFixed(2) || "--"}</Text>
                    </View>
                </View>

            </View>
        </View>
    )
}

export default DescriptionCard
