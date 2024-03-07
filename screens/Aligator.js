import { StyleSheet, Text, View, Button,TouchableOpacity,Dimensions, Image, Animated} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useSelector,useDispatch } from 'react-redux';
import { setdarkmode } from '../reducers/darkmodeSlice'


let blackcolor="#202020";
let yellowcolor="yellow";
let whitecolor="#FFFAF0";
let silver = "rgb(128,128,128)";
let purplecolor="#08546C";
let lightblue= "#A0BACC";
export default function Aligator() {


  const navigation = useNavigation();
  const [imageuri, setimageuri]= useState("https://cdn.landesa.org/wp-content/uploads/default-user-image.png");
  const weekArr=["Week 1","Week 2","Week 3","Week 4"];
  const weekData=[[1,3,3,4,4,3,2],[4,3,4,1,10,1,8],[3,10,1,2,5,6,2],[4,4,4,4,6,4,6]];
  const [weekNum, setWeekNum] = useState(0);
  const [isgraphopen, setisgraphopen] = useState(false);
  const [isnameopen, setisnameopen] = useState(false);
  const [username, setusername] = useState('User');
  const [level, setlevel] = useState("");
  const [mh, setmh] = useState(1);
  const [cntopen, setcntopen] = useState(false)
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [position, setPosition] = useState(new Animated.Value(0));
  const [constpos, setconstpos] = useState(60);
  const [rightValue] = useState(new Animated.Value(0));

  const [total, settotal] = useState(0)

  const darkmode = useSelector((state) => state.darkmode);
  const dispatch = useDispatch();

  const handleImageSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });
    if (!result.canceled) {
      setimageuri(result.assets[0].uri);
    }
};

useEffect(() => {
  setTimeout(()=>{
    setcntopen(false);
  },7000);
  if(!darkmode){setconstpos(60);}
}, [])

useEffect(() => {
  checklevel();
  getMaxHeight();
}, [weekNum]);

React.useEffect(() => {
  (async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
    }
  })();
}, []);


const getMaxHeight=()=>{
  let maxh= 0;
  weekData[weekNum].forEach((e)=>{maxh=Math.max(maxh,e)});
  const mult=  Math.floor(200/maxh);
  setmh(mult);
}
const checklevel=()=>{
  let goal=0;
  weekData[weekNum].forEach((element)=>{
    goal+=element;
  });
  if(goal>=14 && goal<21){setlevel('Beginner')}
  else if(goal>=21 && goal<28){setlevel('Intermediate')}
  else if(goal>=28){setlevel('Master')}
  console.log(goal)
  console.log(darkmode)
  settotal(goal);
}

const changemode=()=>{
  const newDarkMode = !darkmode;
  dispatch(setdarkmode(newDarkMode));
  if(darkmode){
    Animated.timing(position, {
      toValue: 60,
      duration: 200, 
      useNativeDriver: true, 
    }).start();
    yellowcolor=purplecolor;
    blackcolor=whitecolor;
    silver=lightblue;
    setTimeout(() => {
      Animated.timing(rightValue, {
        toValue: 20, // Final value
        duration: 500, // Animation duration
        useNativeDriver: false,
      }).start();
    }, 200);
  }
  else{
    Animated.timing(position, {
      toValue: 0,
      duration: 200, 
      useNativeDriver: true, 
    }).start();
    yellowcolor="yellow";
    blackcolor="#202020";
    whitecolor="#FFFAF0";
    silver = "rgb(128,128,128)";
    purplecolor="#08546C";
    setTimeout(() => {
      Animated.timing(rightValue, {
        toValue: 0, // Final value
        duration: 500, // Animation duration
        useNativeDriver: false,
      }).start();
    }, 200);
  }

}

  return (
    <ScrollView style={[styles.container,{backgroundColor:blackcolor}]} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
      <View style={{flexDirection:"row",top:0,position:"absolute",marginLeft:20,marginTop:30,width:"100%",gap:80}}>
      <TouchableOpacity style={[styles.backArrow,{backgroundColor:yellowcolor}]}>
            <Icon
              name='arrow-back'
              size={28}
              onPress={() => navigation.goBack()}
              color={(darkmode)?blackcolor:whitecolor}
            />      
        </TouchableOpacity>
        <Text style={styles.header}></Text>
      </View>

      <View style={[styles.modecontainer,{backgroundColor:silver}]}>
        {/* <Animated.View style={{ transform: [{ translateX:position}]}}>
          <TouchableOpacity style={{height:40,width:40,borderRadius:20,backgroundColor:yellowcolor,position:'absolute'}} onPress={changemode}></TouchableOpacity>
        </Animated.View> */}
        <TouchableOpacity style={{height:40,width:40,borderRadius:20,backgroundColor:yellowcolor, left:(darkmode)?0:60, position:'absolute'}} onPress={changemode}></TouchableOpacity>
      </View>

      <View style={{width:"100%"}}>
         <Image source={{uri: imageuri}} style={[styles.image,{borderColor:yellowcolor}]}/>
          <TouchableOpacity style={[styles.cameracontainer,{backgroundColor:yellowcolor}]}>
                <Icon name='camera'size={34}onPress={handleImageSelection}color={(darkmode)?blackcolor:whitecolor}/>
            </TouchableOpacity>
        <View style={{flexDirection:'row',gap:20,justifyContent:'center',margin:30,alignItems:'center'}}>
          <Text style={{color:(!darkmode)?"#202020":whitecolor,fontSize:26}}>{username}</Text>
          <View style={{height:24,width:24,borderRadius:5,backgroundColor:silver,justifyContent:'center',alignItems:'center'}}>
            <Icon name='edit' size={20} color={"white"} onPress={()=>setisnameopen(!isnameopen)}/>
          </View>
          {(isnameopen) && (
          <View style={[styles.namechangedabba,{backgroundColor:silver}]}> 
            <TextInput onChangeText={text=>setusername(text)} placeholder='Username'></TextInput>
            <TouchableOpacity onPress={()=>setisnameopen(!isnameopen)} style={[styles.savebutton,{backgroundColor:yellowcolor}]}>
              <Text style={{color:(darkmode)?"#202020":whitecolor,fontSize:16}}>save</Text>
            </TouchableOpacity>
          </View>
          )}
        </View>
      </View>

      <View style={[styles.medaldabba,{backgroundColor:silver}]}>
        {(level==='Beginner') && (
          <View style={styles.medalContainer}>
            <Image source={require('../assets/bronze.png')} style={styles.medal}/>
          </View>
        )}
        {(level==='Intermediate') && (
          <View style={styles.medalContainer}>
            <Image source={require('../assets/silver.png')} style={styles.medal}/>
            <Image source={require('../assets/silver.png')} style={styles.medal}/>
          </View>
        )}
        {(level==='Master') && (
          <View style={styles.medalContainer}>
            <Image source={require('../assets/gold.png')} style={styles.medal}/>
            <Image source={require('../assets/gold.png')} style={styles.medal}/>
            <Image source={require('../assets/gold.png')} style={styles.medal}/>
          </View>
        )}

        <View style={styles.level}>
          <Text style={{color:whitecolor,fontSize:17,textAlign:'center'}}>Your level is {level}</Text>
        </View>
      </View>

      <View style={[styles.dabba,{backgroundColor:silver}]}>
        <Text style={{color:whitecolor,fontSize:20}}>Weekly report</Text>
        <TouchableOpacity style={[styles.changeGraph,{backgroundColor:silver}]} onPress={()=>setisgraphopen(!isgraphopen)}>
            <Text style={{color:whitecolor,fontSize:17}}>Week {weekNum+1}▼</Text>
        </TouchableOpacity>
        {(isgraphopen) && (
          <View style={[styles.changegraphcontent,{backgroundColor:silver}]}>
          {weekArr.map((week, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={()=>{setisgraphopen(!isgraphopen);setWeekNum(index);}}
              style={{width:"100%"}}
            >
              <Text style={{color:whitecolor,fontSize:17,textAlign:'center'}}>{week}</Text>
            </TouchableOpacity>
          ))}
        </View>
        )}
        <View style={styles.chart}>
          {weekData[weekNum].map((ht, index) => (
                <View key={index}>
                  {(selectedHeight === index && cntopen) && <View style={[styles.htcontainer,{backgroundColor:yellowcolor}]}><Text style={{color:(darkmode)?"#202020":whitecolor,fontSize:16}}>{ht}</Text></View>}
                  <TouchableOpacity  style={[styles.chartLine, {height:ht*mh,backgroundColor:yellowcolor}]} onPress={()=>{setcntopen(true);setSelectedHeight(index)}}></TouchableOpacity>
                </View>
            ))}
        </View>
      </View>

      <View style={[styles.avgdabba,{backgroundColor:(darkmode)?silver:lightblue}]}>
            <Text style={{color:whitecolor,fontSize:16,textAlign:'center'}}>This week the total water intake was</Text>
            <Text style={{color:whitecolor,fontSize:36}}> {total}<Text style={{fontSize:16}}>Ltr(s)</Text></Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backArrow:{
    height:40,
    width:40, 
    borderRadius:20, 
    justifyContent:'center',
    alignItems:'center',
    marginLeft:30,
  },
  header:{
    fontSize:30,
    color:whitecolor,
    textAlign:'center',
    justifyContent:'center',
  },
  dabba:{
    padding:20,
    borderRadius:20,
    width:"90%",
    alignItems:'center',
    marginTop:30,
    height:270,
    padding:10
  },
  chart:{
    flexDirection:'row',
    gap:30,
    alignItems:'flex-end',
    position:'absolute',
    bottom:0,
    marginBottom:20
  },
  chartLine:{
    borderRadius:5,
    width:15,
  },
  changeGraph:{
    height:25,
    width:80,
    borderRadius:5,
    position:"absolute",
    right:0,
    margin:10,
    alignItems:'center',
  },
  changegraphcontent:{
    position:"absolute",
    width:90,
    borderRadius:10,
    right:0,
    margin:10,
    flexWrap: 'wrap',
    justifyContent:'center',
    zIndex:2
  },
  image: {
    height: 150,
    width:150,
    resizeMode: 'cover',
    borderRadius: 100,
    borderWidth: 2,
    alignSelf:'center',
    marginTop:60,
  },
  cameracontainer:{
    height:50,
    width:50,
    borderRadius:50,
    zIndex:1,
    position:'absolute',
    left:0,
    marginLeft:240,
    marginTop:160,
    justifyContent:'center',
    alignItems:'center',
    borderWidth: 1,
    borderColor: "white",
  },
  namechangedabba:{
    height:80,
    width:"90%",
    position:"absolute",
    alignItems:'center',
    borderRadius:20,
    justifyContent:'center',
  },
  savebutton:{
    height:30,
    width:70,
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
  },
  level:{

  },
  medal:{
    height:50,
    width:50,
  },
  medaldabba:{
    height:100, 
    width:"90%",
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    padding:10
  },
  medalContainer:{
    flexDirection:'row',
  },
  htcontainer:{
    height:30,
    width:30,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    position:'absolute',
    marginTop:-50,
    marginLeft:-8
  },
  modecontainer:{
    height:40,
    width:100,
    borderRadius:25,
    position:'absolute',
    top:0,
    right:0,
    margin:30,
  },
  avgdabba:{
    width:"90%",
    borderRadius:20,
    margin:30,
    justifyContent:'center',
    alignItems:'center',
    padding:10
  }
});
