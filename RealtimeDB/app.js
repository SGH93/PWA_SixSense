// Initialize Firebase
var config = {
  apiKey: "AIzaSyDSsRxhW2Vte1Bt5JvudfooPJV9L6eL4fQ",
  authDomain: "pwa-test-01.firebaseapp.com",
  databaseURL: "https://pwa-test-01.firebaseio.com",
  projectId: "pwa-test-01",
  storageBucket: "pwa-test-01.appspot.com",
  messagingSenderId: "481882682337"
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