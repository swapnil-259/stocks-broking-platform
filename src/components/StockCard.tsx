import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Stock } from "../types/stock";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";

interface StockCardProps {
    stock: Stock;
    onPress?: () => void;
}

const DEFAULT_ICON =
    "https://cdn-icons-png.flaticon.com/512/833/833524.png";

const StockCard: React.FC<StockCardProps> = ({ stock, onPress }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [imageError, setImageError] = useState(false);

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.navigate("ProductScreen", {
                symbol: stock.symbol,
                price: stock.price,
            });
        }
    };

    const changeColor = stock.changePercent >= 0 ? "text-green-500" : "text-red-500";
    const imageUri =
        !imageError && stock.logoUrl
            ? stock.logoUrl
            : DEFAULT_ICON;

    return (
        <Pressable
            onPress={handlePress}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 m-2 w-[45%] shadow-md"
        >
            <View className="flex items-center">
                <Image
                    source={{ uri: imageUri }}
                    className="w-12 h-12 mb-3"
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
                <Text
                    className="text-lg font-semibold text-black dark:text-white"
                    numberOfLines={1}
                >
                    {stock.name}
                </Text>
                <Text className="text-gray-500 dark:text-gray-300">
                    ${stock.price.toFixed(2)}
                </Text>
                <Text className={`${changeColor} font-medium`}>
                    {stock.changePercent.toFixed(2)}%
                </Text>
            </View>
        </Pressable>
    );
};

export default StockCard;
