import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@react-native-vector-icons/feather';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';
import ThemeToggle from '../components/ThemeToggle';
import ExploreScreen from '../screens/ExploreScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const { theme } = useTheme();
    const tokens = colorTokens[theme];

    return (
        <NavigationContainer key={theme}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerRight: () => <ThemeToggle />,
                    headerStyle: { backgroundColor: tokens.background },
                    headerTintColor: tokens.text,
                    tabBarStyle: { backgroundColor: tokens.background },
                    tabBarActiveTintColor: tokens.primary,
                    tabBarInactiveTintColor: tokens.secondary,
                    tabBarIcon: ({ color, size }) => {
                        const name = route.name === 'Stocks' ? 'bar-chart-2' : 'star';
                        return <Feather name={name} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Explore" component={ExploreScreen} />
                <Tab.Screen name="Watchlist" component={WatchlistScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
