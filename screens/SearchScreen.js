import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';

import * as firebase from 'firebase';
import { ActivityIndicator, useTheme, Button } from 'react-native-paper';
import Header from '../components/Header'
import SingleProduct from '../components/SingleProducts';

class ExploreCategory extends React.Component {
  state = {
    data:[],
    isLoading:true
  }
  
  componentWillUnmount = () => {
    this.unsubscribe()
  }
  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({
        isLoading:true
      });
      //this.getRestaurants(this.props.route.params.name)
      var query = this.props.route.params.key
      const items = firebase.database().ref('products/').orderByChild("name").startAt(query).endAt(query+"\uf8ff")
      //const items = firebase.database().ref('products/-MMpIds11dC43fghQdOI');
      items.on("value", dataSnapshot => {
        //console.log(dataSnapshot.val())
        var tasks = [];
        dataSnapshot.forEach(child => {
          tasks.push({
            //name: child.val().name,
            //desc: child.val().desc,
            //url: child.val().url,
            key: child.key,
            id:child.val().id,
            //imageName: child.val().imageName,
          })
        });
        
        this.setState({
          data: tasks,
          isLoading:false
        });
        
      });
    })
    

    
  }
  componentWillUnmount = () => {

  }
  render() {
    
    const mylist = this.state.data.map(item=>{
      //console.log(item.url)
      return (
        <SingleProduct id={item.id} key={item.id} width={"47%"} navigation={this.props.navigation} />
      )
    });
    return (
      
      <View style={{flex:1}}>
        <Header navigation={this.props.navigation} title="Search" goBack={true} hideSearch={true} />
        {this.state.isLoading?
          <ActivityIndicator size='small' style={{marginTop: 40,}} />
        :
          this.state.data && this.state.data.length?
          <ScrollView contentContainerStyle={{paddingTop:20, paddingBottom: 50}}>
            <View style={styles.qualityFood}>
              {mylist}
            </View>
          </ScrollView>
          :
          <EmptyCart {...this.props} />
        }
      </View>
    )
  }
}
function EmptyCart(props) {
  const { colors } = useTheme();
  return (
  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
    <Image source={require('../image/empty-cart.png')} style={{ width: 180, height: 150}} />
    <Text style={{fontSize: 24,fontWeight:'bold',marginTop:10, color:colors.text}}>Whoops!</Text>
    <Text style={{fontSize: 16,marginTop:10,textAlign:'center',color:colors.text}}>Sorry, but nothing matched your search{'\n'}please try some different keyword.</Text>
    <Button mode="contained" style={{borderRadius: 6,marginTop: 15}} onPress={() => props.navigation.navigate("HomeScreen")}>
        Search New 
    </Button>
  </View>)
}
export default ExploreCategory;

const styles = StyleSheet.create({
  qualityFood : {
    width: '100%',
    flexDirection: 'row',
    flexWrap: "wrap",
    paddingHorizontal:10,
    paddingRight:10,
    
  },
  qFoodBox : {
    width: 120,
    height: 55,
	  backgroundColor: '#f4511e',
	  //clipPath: 'polygon(0 0, 95% 20%, 98% 24%, 100% 31%, 100% 100%, 0 100%)',
    borderRadius: 10,
    margin: 0,
    position: 'relative',
    marginRight:10,
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    padding:5,
  },
  
  qFoodBoxImg : {
    width: 45,
    height: 45,
    alignSelf: "flex-start",
  },
  qFoodBoxText : {
    fontSize: 15,
    color: '#fff',
    textAlign:"right",
    flex: 1,
  }
});