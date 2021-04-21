import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity ,ScrollView} from 'react-native';
import firebase from 'firebase';
import { Card, Icon, ListItem } from "react-native-elements";
import db from '../config';
import MyHeader from '../components/MyHeader';



export default class ListOfNotes extends Component{

    constructor() {
        super();
        this.state = {
          userId: firebase.auth().currentUser.email,
          userName: "",
          allNotes: [],
        };
        this.requestRef = null;
      }

      getAllNotesForCurrentUser=()=>{
            this.requestRef = db.collection("New_Notes")
            .where("user_id","==",this.state.userId)
            .onSnapshot((snapshot)=>{
                var allNotes = [];
                snapshot.docs.map((doc)=>{
                    var note = doc.data();
                    allNotes["request_id"]=doc.id;
                    allNotes.push(note);

                })

                this.setState({
                    allNotes : allNotes,
                });
            });
      }


      getUserDetails=(userId)=>{
          db.collection("users")
          .where("email_id","==",userId)
          .get()
          .then((snapshot)=>{
              snapshot.forEach((doc)=>{
                  this.setState({
                      userName : doc.data().first_name+" "+doc.data().last_name
                  })
              })
          })
      }

 keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={item.Note_Title}
      subtitle={
        "Note content : " +
        item.Note_Content 
      }
      leftElement={<Icon name="book" type="font-awesome" color="#696969" />}
      titleStyle={{ color: "black", fontWeight: "bold" }}
      rightElement={
        <Text> By {this.state.userName}</Text>
      }
      bottomDivider
    />
  );

      componentDidMount(){
          this.getUserDetails(this.state.userId);
          this.getAllNotesForCurrentUser();

      }
    
render(){
    return (
        <View style={{ flex: 1 }}>
          <MyHeader navigation={this.props.navigation} title="My Notes" />
          <View style={{ flex: 1 }}>
            {this.state.allNotes.length === 0 ? (
              <View style={styles.subtitle}>
                <Text style={{ fontSize: 20 }}>List of all Notes</Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allNotes}
                renderItem={this.renderItem}
              />
            )}
          </View>
        </View>
      );

}
}

const styles = StyleSheet.create({
    button: {
      width: 100,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 16,
    },
    subtitle: {
      flex: 1,
      fontSize: 20,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  