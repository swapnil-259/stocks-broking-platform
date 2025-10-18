import React from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';

type Props = {
    loading?: boolean;
    error?: string | null;
    empty?: boolean;
    onRetry?: () => void;
    children?: React.ReactNode;
};

export default function StateView({ loading, error, empty, onRetry, children }: Props) {
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
                <Text className="mt-2">Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center px-4">
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
            <View className="flex-1 items-center justify-center px-4">
                <Text className="text-text">No data available</Text>
            </View>
        );
    }

    return <>{children}</>;
}
