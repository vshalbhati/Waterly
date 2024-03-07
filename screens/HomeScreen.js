import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {PanResponder, Animated, TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector,useDispatch } from 'react-redux';
import { setdarkmode } from '../reducers/darkmodeSlice'


let blackcolor="#202020";
let yellowcolor="yellow";
let whitecolor="#FFFAF0";
let silver = "rgb(128,128,128)";
let purplecolor="#08546C";
let lightblue= "#A0BACC";

const strings= ["Sunoo... Pani pilo","Baby, Pani piya apne?","Jaan! Pani pilo na.","Baby! Drink water"];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


async function schedulePushNotification(bodyMessage) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "DRINK YOUR WATER!",
      body: bodyMessage,
      data: { data: 'goes here' },
    },
    trigger: null,
  });
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%"
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 90,
    letterSpacing:4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap:30,
  },
  button: {
    width:60,
    height:60,
    borderRadius:30,
    alignItems: 'center',
    padding:15,
  },
  notifyInterval: {
    fontSize: 20,
    marginBottom: 60,
    color:'white'
  },
  startbutton:{
    backgroundColor: "yellow",
    width:300,
    marginBottom: 30,
    alignItems: 'center',
    padding:15,
    borderRadius:30,
  },
  input: {
    fontSize: 20,
    textAlign: 'center',
    color:'white'

  },
  goalinput:{
    fontSize: 40,
    textAlign: 'center',
    marginTop: 150,
    color:'white'
  },
  stopbutton:{
    backgroundColor: "yellow",
    width:150,
    marginBottom: 30,
    alignItems: 'center',
    padding:15,
    borderBottomLeftRadius:30,
    borderTopLeftRadius:30
  },
  resetbutton:{
    backgroundColor: "yellow",
    width:150,
    marginBottom: 30,
    alignItems: 'center',
    padding:15,
    borderBottomRightRadius:30,
    borderTopRightRadius:30
  },
  user:{
    height:50,
    width:50,
    borderRadius:30,
    backgroundColor:"#1C1C1C",
    position:'absolute',
    top:0,
    right:0,
    margin:30,
    alignItems: 'center',
    justifyContent:'center'
  }
});

const RADIUS=150;
const DIAMETER =300;


const HomeScreen = () => {
  const navigation = useNavigation();
  const [cnt, setCnt] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [timesValue, setTimesValue] = useState(0);
  const [notifInterval, setNotifInterval] = useState(0);
  const [finalNotif, setFinalNotif] = useState(0)
  const [start, setstart] = useState(false);
  const [index, setindex] = useState(0)

  const darkmode = useSelector((state) => state.darkmode);
  const dispatch = useDispatch();


  const startTheTimer = () => {
    setstart(true);
    setFinalNotif(notifInterval)
    if (intervalId === null) {
      const id = setInterval(() => {
        setCnt(prevCnt => {
          if (finalNotif > 0  && prevCnt % finalNotif === 0) {
            schedulePushNotification(strings[index]);
            const newindex =(index+1)%(strings.length);
            setindex(newindex);
          }
          return prevCnt + 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  };
  
  useEffect(() => {
    if (finalNotif > 0 &&  cnt % finalNotif === 0) {
      schedulePushNotification(strings[index]);
      const newindex =(index+1)%(strings.length);
      setindex(newindex);
    }
    else if(cnt===(16*60*60))schedulePushNotification("Congratulations! You achieved the goal.");
  }, [cnt, finalNotif]);

  const stopTheTimer = () => {
    setstart(false);
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };
  const resetTheTimer=()=>{
    setCnt(0);
    setFinalNotif(0);
    setGoalInterval(0);
    setNotifInterval(0);
    setTimesValue(0);
    stopTheTimer();
    pan.setValue({ x: 0, y: 0 });
  }

  const increaseGoal = () => {
    setGoalInterval(prevGoal => prevGoal + 1);
    const times = Math.ceil(16 / goalInterval);
    setTimesValue(times);
    const notifInterval = goalInterval !== 1 ? (times * 1440) / (goalInterval) : 11520;
    setNotifInterval(notifInterval);
    pan.setValue({ x: pan.x._value + 1, y: pan.y._value });
  };

  const decreaseGoal = () => {
    if (goalInterval > 0) {
      setGoalInterval(prevGoal => prevGoal - 1);
      const times = Math.ceil(16 / goalInterval);
      setTimesValue(times);
      const notifInterval = goalInterval !== 1 ? (times * 1440) / (goalInterval) : 11520;
      setNotifInterval(notifInterval);
    }
    else if(goalInterval===1){
      setNotifInterval(0);
    }
    pan.setValue({ x: pan.x._value - 1, y: pan.y._value });
  };
  

  const [goalInterval, setGoalInterval] = useState(0);

  const pan = useRef(new Animated.ValueXY()).current;
  const [angle, setAngle] = useState(0);
  const calculateValue = (x, y) => {
    const angle = Math.atan2(y, x);
    const normalizedAngle = angle >= 0 ? angle : (2 * Math.PI) + angle;
    const normalizedInterval = (normalizedAngle / (2 * Math.PI)) * 8;
    return Math.round(normalizedInterval);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let { dx, dy } = gestureState;
      let r = Math.hypot(dx, dy); 
      let alpha = Math.atan2(dy, dx); 
      let x = RADIUS * Math.cos(alpha);
      let y = RADIUS * Math.sin(alpha);
      pan.setValue({ x: x, y: y });
      setAngle(calculateValue(x, y));
    },
    onPanResponderRelease: () => {
      const value = calculateValue(pan.x._value, pan.y._value);
      setGoalInterval(value);
      const times = Math.ceil(16 / goalInterval);
      setTimesValue(times);
      const notifInterval = value !== 1 ? ((16 / value) * 1440) / (value) : 11520;
      setNotifInterval(notifInterval);
    }
  });

  
  return (
    <SafeAreaView style={[styles.container,{backgroundColor:(darkmode)?blackcolor:whitecolor}]}>

      <TouchableOpacity style={[styles.user,{backgroundColor:(darkmode)?yellowcolor:purplecolor}]} onPress={() => {navigation.navigate('ali')}}>
      <Icon name='person' size={40} color={(darkmode)?blackcolor:whitecolor}/>
      </TouchableOpacity>
     
      <Text style={[styles.title,{color:(!darkmode)?"#202020":whitecolor}]}>Drink your water!</Text>
      <Text style={{fontSize:20,color:(!darkmode)?"#202020":whitecolor}}>Set your goal!</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={decreaseGoal} style={[styles.button,{backgroundColor:(goalInterval===0?silver:(darkmode)?yellowcolor:purplecolor)}]} disabled={goalInterval === 0}>
          <Text style={{fontSize:20,color:(darkmode)?"#202020":whitecolor}}>-</Text>
        </TouchableOpacity>
        <TextInput
          value={goalInterval.toString()}
          onChangeText={text => setGoalInterval(parseInt(text))}
          keyboardType='numeric'
          style={[styles.input, { marginRight: 0,color:(!darkmode)?"#202020":whitecolor }]}
        />
        <TouchableOpacity onPress={increaseGoal} style={[styles.button,{backgroundColor:(darkmode)?yellowcolor:purplecolor}]} ><Text style={{fontSize:20,color:(darkmode)?"#202020":whitecolor}}>+</Text></TouchableOpacity>
      </View>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{ width: DIAMETER, height: DIAMETER, borderRadius: DIAMETER / 2, borderWidth: 15, borderColor:(darkmode)?silver:lightblue, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), { width: 30, height: 30, borderRadius: 15, backgroundColor:(darkmode)?yellowcolor:purplecolor, position: 'absolute',marginLeft:120,marginTop:120 }]} />
          <Text style={[styles.goalinput,{color:(!darkmode)?"#202020":whitecolor}]}>{goalInterval}</Text>
        </View>
      </View>
      {/* <Text style={{color:'white'}}>{notifInterval}  {goalInterval}</Text> */}
      {(finalNotif>0)?(      
      <Text style={[styles.notifyInterval,{color:(!darkmode)?"#202020":whitecolor}]}>You will be notified in every {notifInterval} seconds</Text>
      ):(
      <Text style={[styles.notifyInterval,{color:(!darkmode)?"#202020":whitecolor}]}>Start the challenge!</Text>
      )}
      <View style={{ flexDirection: 'row',gap:60 }}>
      {(!start)?(
        <TouchableOpacity 
        onPress={startTheTimer} 
        style={[styles.startbutton,{backgroundColor:(goalInterval===0)?'grey':(darkmode)?yellowcolor:purplecolor}]} disabled={goalInterval === 0}><Text style={{color:(darkmode)?"#202020":whitecolor}}>START</Text></TouchableOpacity>
      ):(
        <View style={{flexDirection:'row',gap:1}}>
          <TouchableOpacity onPress={stopTheTimer} style={[styles.stopbutton,{backgroundColor:(darkmode)?yellowcolor:purplecolor}]}><Text style={{color:(darkmode)?"#202020":whitecolor}}>STOP</Text></TouchableOpacity>
          <TouchableOpacity onPress={resetTheTimer} style={[styles.resetbutton,{backgroundColor:(darkmode)?yellowcolor:purplecolor}]}><Text style={{color:(darkmode)?"#202020":whitecolor}}>RESET</Text></TouchableOpacity>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
