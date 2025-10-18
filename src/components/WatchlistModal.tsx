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
            <Pressable
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                onPress={handleClose}
            >
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    className="rounded-t-3xl max-h-[80%] px-4 pt-4 pb-6"
                    style={{ backgroundColor: tokens.background }}
                >
                    <Text className="text-xl font-semibold mb-4" style={{ color: tokens.text }}>
                        Add to Watchlist
                    </Text>

                    <View className="flex-row mb-6">
                        <TextInput
                            placeholder="New watchlist name"
                            value={newName}
                            onChangeText={setNewName}
                            className="flex-1 border rounded-md p-3"
                            style={{
                                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#ddd',
                                color: tokens.text,
                            }}
                            placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#666'}
                        />
                        <TouchableOpacity
                            className={`ml-3 px-4 justify-center rounded-md ${newName.trim() ? 'opacity-100' : 'opacity-50'}`}
                            style={{ backgroundColor: tokens.primary }}
                            onPress={() => {
                                const name = newName.trim();
                                if (!name) return;
                                createList(name);
                                setNewName('');
                            }}
                            disabled={!newName.trim()}
                        >
                            <Text className="text-white font-medium">Create</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={Object.keys(lists)}
                        keyExtractor={(item) => item}
                        style={{ flexGrow: 0 }}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => {
                            const checked = stock ? isInList(item, stock.symbol) : false;
                            return (
                                <Pressable
                                    onPress={() => {
                                        if (!stock) return;
                                        toggleStockInList(item, stock);
                                    }}
                                    className="flex-row items-center px-2 py-3 border-b"
                                    style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#eee' }}
                                >
                                    <View
                                        className="w-6 h-6 rounded-md justify-center items-center mr-3"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: checked
                                                ? tokens.primary
                                                : theme === 'dark'
                                                    ? 'rgba(255,255,255,0.3)'
                                                    : '#ccc',
                                            backgroundColor: checked ? tokens.primary : 'transparent',
                                        }}
                                    >
                                        {checked && <Icon name="check" size={16} color={tokens.background} />}
                                    </View>

                                    <Text className="text-base" style={{ color: tokens.text }}>
                                        {item}
                                    </Text>
                                </Pressable>
                            );
                        }}
                        ListEmptyComponent={() => (
                            <Text className="text-center py-4" style={{ color: tokens.secondary }}>
                                No watchlists yet
                            </Text>
                        )}
                    />
                    <Pressable
                        onPress={handleClose}
                        className="mt-6 items-center py-2 rounded-md"
                        style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0' }}
                    >
                        <Text style={{ color: tokens.secondary, fontWeight: '500' }}>Close</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
