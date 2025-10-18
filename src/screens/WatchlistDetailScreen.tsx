import React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useWatchlists } from '../context/WatchlistsCollectionContext';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';
import StockCard from '../components/StockCard';

type RoutePropType = RouteProp<RootStackParamList, keyof RootStackParamList>;

const WatchlistDetailScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const { listName } = route.params as unknown as { listName: string };
    const { lists } = useWatchlists();

    const items = lists[listName] || [];

    const { theme } = useTheme();
    const tokens = colorTokens[theme];

    return (
        <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900" contentContainerStyle={{ paddingVertical: 8 }}>
            <View className="px-4">
                <Text className="text-2xl font-semibold text-black dark:text-white mb-4 text-center">{listName}</Text>

                <FlatList
                    data={items}
                    keyExtractor={(i) => i.symbol}
                    numColumns={2}
                    renderItem={({ item }) => <StockCard stock={item} />}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    scrollEnabled={false}
                    ListEmptyComponent={() => <Text className="text-gray-500 dark:text-gray-400">No stocks in this list</Text>}
                />
            </View>
        </ScrollView>
    );
};

export default WatchlistDetailScreen;
