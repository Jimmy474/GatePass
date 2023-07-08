import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js'
import { getDatabase, ref, increment, child, get, update } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'
import { initializeAppCheck, ReCaptchaV3Provider} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app-check.js';

const firebaseConfig = {
    apiKey: "AIzaSyD3pvlTPCN-lpBF_NivMTgLROV9RsCrMos",
    authDomain: "permitthat.firebaseapp.com",
    databaseURL: "https://permitthat-default-rtdb.firebaseio.com",
    storageBucket: "permitthat.appspot.com",
    messagingSenderId: "743540557771",
    appId: "1:743540557771:web:aba65a23a53cc323e3184e",
    measurementId: "G-JT3YNLYDJW",
    projectId: "permitthat"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
//self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfYxwQnAAAAACpM4CnM1yloIOfRaJdlJ17OW79F'),
    isTokenAutoRefreshEnabled: true
});

var pn = 0;

function UpdatePassNumber() {
    const dbRef = ref(db,'GatePassNumber/');

    var updates = {
        CurrentPassNumber : increment(1)
    };

    update(dbRef, updates).then(() => {
        //console.log("Number Updated");
        document.getElementById("pass_number").value = pn;
        //console.log("New Number Is : " + document.getElementById("pass_number").value);
        const indexForm = document.getElementById('form');
        if (indexForm) {
            indexForm.action = "/Pass";
            indexForm.method = "post";
            indexForm.submit();
        }
    }).catch((error) => {
        console.error(error);
    });
}
function GatherData() {

    if (!navigator.onLine) {
        alert('You are offline Try Again');
        return;
    }

    get(child(ref(getDatabase()), `GatePassNumber/CurrentPassNumber`)).then((snapshot) => {
        if (snapshot.exists()) {
            pn = snapshot.val();
            //console.log("Got The Latest Number");
            UpdatePassNumber();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Get Error : " + error);
    });
    
}

window.GatherData = GatherData;
window.UpdatePassNumber = UpdatePassNumber;