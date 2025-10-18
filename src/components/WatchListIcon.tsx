
import React from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWatchlist } from '../context/WatchListContext';
import { useWatchlists } from '../context/WatchlistsCollectionContext';

interface WatchlistIconProps {
    symbol?: string;
    size?: number;
    color?: string;
    onPress?: () => void;
}

const WatchlistIcon: React.FC<WatchlistIconProps> = ({ symbol, size = 28, color, onPress }) => {
    const { isInWatchlist } = useWatchlist();
    const { isInAnyList } = useWatchlists();

    const added = symbol ? isInWatchlist(symbol) || isInAnyList(symbol) : false;

    return (
        <Pressable onPress={onPress}>
            <Icon name={added ? 'bookmark' : 'bookmark-outline'} size={size} color={color || (added ? '#2563eb' : '#6b7280')} />
        </Pressable>
    );
};

export default WatchlistIcon;
