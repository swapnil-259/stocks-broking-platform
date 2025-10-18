import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type Props = {
    data: number[];
    height?: number;
};

export default function PriceChart({ data, height = 220 }: Props) {
    const screenWidth = Math.min(Dimensions.get('window').width - 32, 800);

    if (!data || data.length === 0) return null;

    const chartData = {
        labels: data.map((_, i) => i % Math.ceil(data.length / 6) === 0 ? `${i}` : ''),
        datasets: [
            {
                data,
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
