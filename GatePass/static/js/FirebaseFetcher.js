import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD3pvlTPCN-lpBF_NivMTgLROV9RsCrMos",
    authDomain: "permitthat.firebaseapp.com",
    databaseURL: "https://permitthat-default-rtdb.firebaseio.com",
    projectId: "permitthat",
    storageBucket: "permitthat.appspot.com",
    messagingSenderId: "743540557771",
    appId: "1:743540557771:web:aba65a23a53cc323e3184e",
    measurementId: "G-JT3YNLYDJW"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Get a reference to the root of the database
const dbRef = app.database().ref();

function FetchData() {
    // Read data from the database
    dbRef.child('GatePassNumber').get().then((snapshot) => {
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            console.log(usersData);
        } else {
            console.log('No data available');
        }
    }).catch((error) => {
        console.error(error);
    });
}

