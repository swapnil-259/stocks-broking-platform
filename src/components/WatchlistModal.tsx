import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    FlatList,
    Pressable,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { useWatchlists } from '../context/WatchlistsCollectionContext';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Stock } from '../types/stock';

type Props = {
    visible: boolean;
    onClose: () => void;
    stock?: Stock;
};

export default function WatchlistModal({ visible, onClose, stock }: Props) {
    const { lists, createList, toggleStockInList, isInList } = useWatchlists();
    const [newName, setNewName] = useState('');

    const handleClose = () => {
        setNewName('');
        onClose();
    };

    useEffect(() => {
        if (!visible) setNewName('');
    }, [visible]);

    const { theme } = useTheme();
    const tokens = colorTokens[theme];
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
            <Pressable className="flex-1 justify-end bg-black/30" onPress={handleClose}>
                <Pressable onPress={(e) => e.stopPropagation()} className="rounded-t-3xl max-h-[80%] px-4 pt-4 pb-6 bg-white dark:bg-gray-900">
                    <Text className="text-xl font-semibold mb-4 text-black dark:text-white">Add to Watchlist</Text>

                    <View className="flex-row mb-6">
                        <TextInput
                            placeholder="New watchlist name"
                            value={newName}
                            onChangeText={setNewName}
                            className="flex-1 rounded-md p-3 border border-gray-200 dark:border-white/10 text-black dark:text-white"
                            placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#666'}
                        />
                        <TouchableOpacity
                            className={`ml-3 px-4 justify-center rounded-md ${newName.trim() ? 'opacity-100' : 'opacity-50'}`}
                            onPress={() => {
                                const name = newName.trim();
                                if (!name) return;
                                createList(name);
                                setNewName('');
                            }}
                            disabled={!newName.trim()}
                        >
                            <View className="bg-blue-600 rounded-md px-4 py-2">
                                <Text className="text-white font-medium">Create</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={Object.keys(lists)}
                        keyExtractor={(item) => item}
                        className="flex-grow-0"
                        keyboardShouldPersistTaps="always"
                        renderItem={({ item }) => {
                            const checked = stock ? isInList(item, stock.symbol) : false;
                            console.log('Rendering list item:', item, 'checked=', checked);
                            return (
                                <Pressable
                                    onPress={() => {
                                        if (!stock) return;
                                        toggleStockInList(item, stock);
                                    }}
                                    className="flex-row items-center px-2 py-3 border-b border-gray-200 dark:border-white/10"
                                >
                                    <View
                                        className={`w-6 h-6 rounded-md justify-center items-center mr-3 ${checked ? 'border-2 border-blue-600 bg-blue-600' : 'border-2 border-gray-300 dark:border-white/30 bg-transparent'}`}
                                    >
                                        {checked && <Icon name="check" size={16} color="#fff" />}
                                    </View>

                                    <Text className="text-base text-black dark:text-white">{item}{' '}</Text>
                                </Pressable>
                            );
                        }}
                        ListEmptyComponent={() => (
                            <Text className="text-center py-4 text-gray-500 dark:text-gray-400">No watchlists yet</Text>
                        )}
                    />


                    <Pressable onPress={handleClose} className="mt-6 items-center py-2 rounded-md bg-gray-100 dark:bg-white/5">
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">Close</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
