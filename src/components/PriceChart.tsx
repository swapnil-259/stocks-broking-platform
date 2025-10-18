import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';

type Props = {
    data: number[];
    height?: number;
};

export default function PriceChart({ data, height = 220 }: Props) {
    const screenWidth = Math.min(Dimensions.get('window').width - 32, 800);

    if (!data || data.length === 0) return null;
    const sanitized = data.map((d) => Number(d)).filter((n) => !Number.isNaN(n));
    console.log('PriceChart: incoming data length=', data?.length, 'sanitized length=', sanitized.length, 'sample=', sanitized.slice(0, 6));

    if (sanitized.length === 0) return null;
    const { theme } = useTheme();
    const tokens = colorTokens[theme];
    const chartValues = sanitized.length === 1 ? Array(4).fill(sanitized[0]) : sanitized;

    const labelStep = Math.max(1, Math.ceil(chartValues.length / 6));
    const chartLabels = chartValues.map((_, i) => {
        if (i === 0 || i === chartValues.length - 1) return `${i}`;
        return i % labelStep === 0 ? `${i}` : '';
    });

    const chartData = {
        labels: chartLabels,
        datasets: [{ data: chartValues, strokeWidth: 2 }],
    };
    const lineColor = theme === 'dark' ? (tokens?.primary || '#6364f1') : '#2563eb';
    const bgFrom = tokens?.background || (theme === 'dark' ? '#000' : '#fff');
    const bgTo = bgFrom;

    const hexToRgba = (hex: string, opacity = 1) => {
        if (!hex) return `rgba(37,99,235,${opacity})`;
        let h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map((c) => c + c).join('');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return `rgba(${r},${g},${b},${opacity})`;
    };

    return (
        <View className="mb-4">
            <LineChart
                data={chartData}
                width={screenWidth}
                height={height}
                withDots={true}
                withShadow={false}
                withVerticalLines={false}
                withInnerLines={false}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                fromZero={false}
                chartConfig={{
                    backgroundGradientFrom: bgFrom,
                    backgroundGradientTo: bgTo,
                    decimalPlaces: 2,
                    color: (opacity = 1) => hexToRgba(lineColor, opacity),
                    labelColor: (opacity = 1) => hexToRgba(tokens?.text || (theme === 'dark' ? '#fff' : '#000'), 0.7),
                    propsForDots: { r: '3', strokeWidth: '0', stroke: hexToRgba(tokens?.background || '#fff', 1) },
                }}
                bezier={false}
                style={{ borderRadius: 8, backgroundColor: 'transparent' }}
            />
        </View>
    );
}
