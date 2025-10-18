import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feather from '@react-native-vector-icons/feather';
import { useTheme } from '../providers/ThemeProvider';
import { colorTokens } from '../utils/color-theme';
import ThemeToggle from '../components/ThemeToggle';
import ExploreScreen from '../screens/ExploreScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import ProductScreen from '../screens/ProductScreen';
import ViewAllScreen from '../screens/ViewAllScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
    const { theme } = useTheme();
    const tokens = colorTokens[theme];

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerRight: () => <ThemeToggle />,
                headerStyle: { backgroundColor: tokens.background },
                headerTintColor: tokens.text,
                tabBarStyle: { backgroundColor: tokens.background },
                tabBarActiveTintColor: tokens.primary,
                tabBarInactiveTintColor: tokens.secondary,
                tabBarIcon: ({ color, size }) => {
                    const name = route.name === 'Explore' ? 'bar-chart-2' : 'star';
                    return <Feather name={name} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Explore" component={ExploreScreen} />
            <Tab.Screen name="Watchlist" component={WatchlistScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { theme } = useTheme();
    const tokens = colorTokens[theme];
    return (
        <NavigationContainer >
            <Stack.Navigator screenOptions={{
                headerRight: () => <ThemeToggle />,
                headerStyle: { backgroundColor: tokens.background },
                headerTintColor: tokens.text,
            }}>
                <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                <Stack.Screen
                    name="ProductScreen"
                    component={ProductScreen}
                    options={{ headerShown: true }}
                />
                <Stack.Screen name="ViewAllScreen" component={ViewAllScreen} options={{ headerShown: true }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
