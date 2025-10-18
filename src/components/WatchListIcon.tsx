
import React from "react";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface WatchlistIconProps {
    added: boolean;
    size?: number;
    color?: string;
}

const WatchlistIcon: React.FC<WatchlistIconProps> = ({ added, size = 28, color }) => {
    return (
        <Pressable>
            <Icon
                name={added ? "bookmark" : "bookmark-outline"}
                size={size}
                color={color || (added ? "#2563eb" : "#6b7280")}
            />
        </Pressable>
    );
};

export default WatchlistIcon;
