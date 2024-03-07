import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import Aligator from './screens/Aligator';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable'
const {height} = Dimensions.get('window');
import { SafeAreaView, Dimensions } from 'react-native'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers/darkmodeSlice';

const store = createStore(rootReducer);


export default function App() {
  const Stack = createStackNavigator();
  const [showStackNavigator, setShowStackNavigator] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowStackNavigator(true);
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
    <NavigationContainer>
      {showStackNavigator?(
        <Stack.Navigator>
          <Stack.Screen name='home' component={HomeScreen} options={{ presentation: 'modal', headerShown: false }}/>
          <Stack.Screen name='ali' component={Aligator} options={{ presentation: 'modal', headerShown: false }}/>
        </Stack.Navigator>
      ):(
          <SafeAreaView style={{backgroundColor:'black', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Animatable.Image
                source={require('./assets/splash.gif')}
                animation="fadeInUp"
                iterationCount={1}
                style={{height:height,width:'100%'}}
              />        
          </SafeAreaView>
      )}
      
    </NavigationContainer>
    </Provider>
  );
}
