import React from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useWatchlists } from '../context/WatchlistsCollectionContext';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';

const WatchlistsScreen = () => {
    const { lists } = useWatchlists();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const names = Object.keys(lists);

    const { theme } = useTheme();
    const tokens = colorTokens[theme];

    return (
        <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900" contentContainerStyle={{ paddingVertical: 8 }}>
            <View className="px-4">
                <FlatList
                    data={names}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <Pressable
                            className="p-4 bg-white dark:bg-gray-800 rounded mb-3"
                            onPress={() => (navigation as any).navigate('WatchlistDetail', { listName: item })}
                        >
                            <Text className="text-lg text-black dark:text-white">{item}</Text>
                            <Text className="text-sm text-gray-500 dark:text-gray-300">{lists[item].length} items</Text>
                        </Pressable>
                    )}
                    ListEmptyComponent={() => (
                        <View className="items-center mt-10">
                            <Text className="text-gray-500 dark:text-gray-400">No watchlists yet</Text>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
};

export default WatchlistsScreen;
