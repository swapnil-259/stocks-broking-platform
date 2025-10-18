import React from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';

type Props = {
    loading?: boolean;
    error?: string | null;
    empty?: boolean;
    onRetry?: () => void;
    children?: React.ReactNode;
};

export default function StateView({ loading, error, empty, onRetry, children }: Props) {
    const { theme } = useTheme();
    const tokens = colorTokens[theme];
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center" style={{ backgroundColor: tokens.background }}>
                <ActivityIndicator size="large" color={tokens.primary} />
                <Text className="mt-2" style={{ color: tokens.text }}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center px-4" style={{ backgroundColor: tokens.background }}>
                <Text className="text-red-500 mb-3">{error}</Text>
                {onRetry && (
                    <Pressable onPress={onRetry} className="px-4 py-2 bg-primary rounded">
                        <Text className="text-background">Retry</Text>
                    </Pressable>
                )}
            </View>
        );
    }

    if (empty) {
        return (
            <View className="flex-1 items-center justify-center px-4" style={{ backgroundColor: tokens.background }}>
                <Text className="text-text" style={{ color: tokens.text }}>No data available</Text>
            </View>
        );
    }

    return <>{children}</>;
}
