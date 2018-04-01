// Initialize Firebase 
var config = {
    apiKey: "AIzaSyBoQXWAApVbsnlP0Yf9opjzaNjWE9Dhvwk",
    authDomain: "web-quickstart-140a4.firebaseapp.com",
    databaseURL: "https://web-quickstart-140a4.firebaseio.com",
    projectId: "web-quickstart-140a4",
    storageBucket: "web-quickstart-140a4.appspot.com",
    messagingSenderId: "631038370121"
};
firebase.initializeApp(config);

const messaging=firebase.messaging();   // give access to all messaging service
messaging.requestPermission()       // request permission from user
.then(function(){
  console.log('Have permission');
  return messaging.getToken();
})
.then(function(token){
  console.log(token);
})
.catch(function(err){
  console.log('Error Occured');
})