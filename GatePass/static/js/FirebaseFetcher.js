import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getDatabase, ref, increment, child, get, update } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app-check.js';
import { getFirestore, collection, getDoc, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

class VisitorPass {
    constructor(AadharNumber, ComingFrom, DateTime, MobileNumber, Name, PassNumber, Purpose, RequestedPersonName, TokenNumber) {
        this.AadharNumber = AadharNumber;
        this.ComingFrom = ComingFrom;
        this.DateTime = DateTime;
        this.MobileNumber = MobileNumber;
        this.Name = Name;
        this.PassNumber = PassNumber;
        this.Purpose = Purpose;
        this.RequestedPersonName = RequestedPersonName;
        this.TokenNumber = TokenNumber;
    }
}

const PassConverter = {
    toFirestore: (pass) => {
        return {
            AadharNumber: pass.AadharNumber,
            ComingFrom: pass.ComingFrom,
            DateTime: pass.DateTime,
            MobileNumber: pass.MobileNumber,
            Name: pass.Name,
            PassNumber: pass.PassNumber,
            Purpose: pass.Purpose,
            RequestedPersonName: pass.RequestedPersonName,
            TokenNumber: pass.TokenNumber,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new VisitorPass(data.AadharNumber, data.ComingFrom, data.DateTime, data.MobileNumber, data.Name, data.PassNumber, data.Purpose, data.RequestedPersonName, data.TokenNumber);
    }
};

const firebaseConfig = {
    apiKey: "AIzaSyB4_q_ohit0MtR4-CyZSeqd2q_qsQDfB8M",
    authDomain: "gatepass-434c3.firebaseapp.com",
    databaseURL: "https://gatepass-434c3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gatepass-434c3",
    storageBucket: "gatepass-434c3.appspot.com",
    messagingSenderId: "816949543625",
    appId: "1:816949543625:web:71a954cf30704918190318",
    measurementId: "G-6739ZNQWGP"
};


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const dbF = getFirestore(app);
const colRef = collection(dbF, 'Visitors');

const storage = getStorage(app);

self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6LfsrQ4nAAAAADXRXWQXIVj6SxBjRkr-dTmJHN8t'),
    isTokenAutoRefreshEnabled: true
});

var pn = 0;

const btn = document.getElementById("GenerateButton");
const spn = document.getElementById("Spinner");

function UpdatePassNumber() {
    const dbRef = ref(db, 'GatePassNumber/');

    var updates = {
        CurrentPassNumber: increment(1)
    };

    update(dbRef, updates).then(() => {
        document.getElementById("pass_number").value = pn;

        UploadVisitorImage();


    }).catch((error) => {
        console.error(error);

        btn.value = "Generate Pass";
        btn.classList.remove("disabled");
        spn.classList.add("d-none");
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

        btn.value = "Generate Pass";
        btn.classList.remove("disabled");
        spn.classList.add("d-none");
    });

}

function FirestoreFetch() {

    const pass_number = document.getElementById("pass_number").textContent;

    const storageRef = refStorage(storage, "Visitor Images/Pass-" + pass_number + ".jpg");
    getDownloadURL(storageRef).then(url => {
        document.getElementById("user_img").setAttribute('src', url);
    }).catch(e => { console.log(e); });

    const RefToPass = doc(collection(dbF, "Visitors"), "Pass-" + pass_number).withConverter(PassConverter);
    getDoc(RefToPass)
        .then((snapshot) => {
            const pass = snapshot.data();
            console.log(pass);
        }).catch(e => {
            console.log(e);
        });
}

function UploadVisitorData() {
    setDoc(doc(dbF, "Visitors", "Pass-" + pn), {
        AadharNumber: document.getElementById("adhar_number").value,
        ComingFrom: document.getElementById("coming_from").value,
        DateTime: serverTimestamp(),
        HelmetNumber: document.getElementById("helmet_number").value,
        MobileNumber: document.getElementById("mobile_number").value,
        Name: document.getElementById("visitor_name").value,
        PassNumber: pn,
        Purpose: document.getElementById("purpose").value,
        RequestedPersonName: document.getElementById("requested_person").value,
        TokenNumber: document.getElementById("token_number").value
    }).then(docRef => {
        console.log("Data Uploaded Successfully!");
        const indexForm = document.getElementById('form');
        if (indexForm) {
            indexForm.action = "/SmallPass";
            indexForm.method = "post";
            indexForm.submit();
        }
    })
        .catch((error) => {
            console.error("Get Error : " + error);

            btn.value = "Generate Pass";
            btn.classList.remove("disabled");
            spn.classList.add("d-none");
        });
}

function UploadVisitorImage() {
    const file = document.getElementById("imageInput").files[0];
    const storageRef = refStorage(storage, "Visitor Images/Pass-" + pn + ".jpg");
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Image Uploaded Successfully!");
        UploadVisitorData();
    }).catch(error => {
        console.log(error);

        btn.value = "Generate Pass";
        btn.classList.remove("disabled");
        spn.classList.add("d-none");
    });
}

window.GatherData = GatherData;
window.UpdatePassNumber = UpdatePassNumber;
window.UploadVisitorData = UploadVisitorData;
window.FirestoreFetch = FirestoreFetch;