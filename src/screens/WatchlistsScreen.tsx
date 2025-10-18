import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useWatchlists } from '../context/WatchlistsCollectionContext';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';

const WatchlistsScreen = () => {
    const { lists } = useWatchlists();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [query, setQuery] = useState('');
    const names = Object.keys(lists).filter((n) => n.toLowerCase().includes(query.toLowerCase()));

    const { theme } = useTheme();
    const tokens = colorTokens[theme];

    return (
        <View className="flex-1 bg-gray-100 dark:bg-gray-900">
            <FlatList
                data={names}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
                ListHeaderComponent={() => (
                    <View style={{ marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                placeholder="Search watchlists"
                                value={query}
                                onChangeText={setQuery}
                                className="flex-1 rounded-md p-3 bg-white dark:bg-transparent text-black dark:text-white border border-gray-200 dark:border-white/10"
                                placeholderTextColor={"#666"}

                            />
                            {query.length > 0 && (
                                <Pressable onPress={() => setQuery('')} style={{ marginLeft: 8, padding: 8 }} accessibilityLabel="Clear search">
                                    <Icon name="close" size={18} color={'#666'} />
                                </Pressable>
                            )}
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <Pressable
                        className="p-4 bg-white dark:bg-gray-800 rounded mb-3"
                        onPress={() => (navigation as any).navigate('WatchlistDetail', { listName: item })}
                    >
                        <Text className="text-lg text-black dark:text-white">{item}</Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-300">{(lists[item] || []).length} items</Text>
                    </Pressable>
                )}
                ListEmptyComponent={() => (
                    <View className="items-center mt-10">
                        <Text className="text-gray-500 dark:text-gray-400">No watchlists yet</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default WatchlistsScreen;
