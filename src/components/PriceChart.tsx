import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type Props = {
    data: number[];
    height?: number;
};

export default function PriceChart({ data, height = 220 }: Props) {
    const screenWidth = Math.min(Dimensions.get('window').width - 32, 800);

    if (!data || data.length === 0) return null;
    const sanitized = data.map((d) => Number(d)).filter((n) => !Number.isNaN(n));

    if (sanitized.length === 0) return null;
    if (sanitized.length === 1) {
        return (
            <View className="px-4">
                <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                    <Text className="text-lg text-text">${sanitized[0].toFixed(2)}</Text>
                </View>
            </View>
        );
    }

    const labelStep = Math.max(1, Math.ceil(sanitized.length / 6));
    const chartData = {
        labels: sanitized.map((_, i) => (i % labelStep === 0 ? `${i}` : '')),
        datasets: [
            {
                data: sanitized,
                strokeWidth: 2,
            },
        ],
    };

    return (
        <View className="px-4">
            <LineChart
                data={chartData}
                width={screenWidth}
                height={height}
                withDots={false}
                withShadow={false}
                withVerticalLines={false}
                withInnerLines={false}
                chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    strokeWidth: 2,
                }}
                bezier
                style={{ borderRadius: 8 }}
            />
        </View>
    );
}
