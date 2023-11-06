import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './Login';
import Signup from './Signup';
import SignComplete from './SignComplete';
import Home from './Home';
import Menu from './Menu';
import Learning from './Learning';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="SignComplete" component={SignComplete} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Learning" component={Learning} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <Menu {...props} />}
                screenOptions={{
                    headerShown: false,
                    drawerType: "front"}}>
                <Drawer.Screen name="MainStack" component={MainStack} />

                
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
