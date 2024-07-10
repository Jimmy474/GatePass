window.jsPDF = window.jspdf.jsPDF;

function SelectImage() {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
}

//function changeImage() {
//    const imageInput = document.getElementById('imageInput');
//    const file = imageInput.files[0];

//    console.dir(file);
//    if (file.type.indexOf("image/") > -1) {
//        let img = document.getElementById("user_img");
//        img.src = window.URL.createObjectURL(file);
//        reder.readAsDataURL(cropImageToSquare(img));
//        document.getElementById("img_url").value = img.src;
//        console.log(document.getElementById("img_url").value);
//    }
//}

function changeImage() {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    if (file.type.indexOf("image/") > -1) {
        const img = document.getElementById("user_img");

        const reader = new FileReader();
        reader.onload = function (e) {
            const imgData = e.target.result;

            // Create a temporary image element
            const tempImg = new Image();
            tempImg.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set the canvas size to the square size (1:1 aspect ratio)
                const size = Math.min(tempImg.width, tempImg.height);
                canvas.width = size;
                canvas.height = size;

                // Calculate the cropping position
                const x = (tempImg.width - size) / 2;
                const y = (tempImg.height - size) / 2;

                // Draw the cropped image onto the canvas
                ctx.drawImage(tempImg, x, y, size, size, 0, 0, size, size);

                // Get the data URL of the cropped image
                const croppedImgData = canvas.toDataURL('image/jpeg');

                // Set the cropped image as the source of the image element
                img.src = croppedImgData;

                // Store the cropped image data URL
                document.getElementById("img_url").value = croppedImgData;
            };

            // Set the temporary image source to the uploaded image data
            tempImg.src = imgData;
        };

        // Read the uploaded image data as a data URL
        reader.readAsDataURL(file);
    }
}

function cropImageToSquare(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const originalWidth = imageElement.naturalWidth;
    const originalHeight = imageElement.naturalHeight;

    const size = Math.min(originalWidth, originalHeight);

    canvas.width = size;
    canvas.height = size;

    const x = (originalWidth - size) / 2;
    const y = (originalHeight - size) / 2;

    ctx.drawImage(imageElement, 0, 0, size, size, 0, 0, size, size);

    const croppedDataURL = canvas.toDataURL();

    return croppedDataURL;
}


function changeLink(link) {
    document.getElementById('VideoFrame').src = link;
}

function formatNumber(input) {
    let number = input.value.replace(/\D/g, '');

    number = number.slice(0, 12);

    let formattedNumber = '';
    for (let i = 0; i < number.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedNumber += ' ';
        }
        formattedNumber += number.charAt(i);
    }

    input.value = formattedNumber;
}

function Generate() {

    const btn = document.getElementById("GenerateButton");
    const spn = document.getElementById("Spinner");

    var name = document.getElementById("visitor_name");
    var comingFrom = document.getElementById("coming_from");
    var adhar = document.getElementById("adhar_number");
    var mobileNum = document.getElementById("mobile_number");
    var mobileToken = document.getElementById("token_number");
    var helmet = document.getElementById("helmet_number");
    var requestedName = document.getElementById("requested_person");
    var purpose = document.getElementById("purpose");
    var imageInput = document.getElementById('imageInput');
    var photoError = document.getElementById('photo_error');
    var file = imageInput.files[0];

    NeutralizeField(name);
    NeutralizeField(comingFrom);
    NeutralizeField(adhar);
    NeutralizeField(mobileNum);
    NeutralizeField(mobileToken);
    NeutralizeField(helmet);
    NeutralizeField(requestedName);
    NeutralizeField(purpose);
    NeutralizeField(imageInput);

    const namePattern = /^[A-Za-z\s]+$/;
    const mobilePattern = new RegExp(`^[0-9]{10}$`);
    const adharPattern = /^\d{4} \d{4} \d{4}$/;
    const numberPattern = /^[0-9]+$/;
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB



    if (!file) {
        imageInput.classList.add("is-invalid");
        photoError.textContent = "Please Upload Your Photo";
        return;
    } else if (!allowedTypes.includes(file.type)) {
        imageInput.classList.add("is-invalid");
        photoError.textContent = "Image Type Is Not Allowed.Valid Types Are JPEG/PNG";
        return;
    } else if (file.size > maxSizeInBytes) {
        imageInput.classList.add("is-invalid");
        photoError.textContent = "Image Size Is Too Large. Max Allowed Size Is 2 MB"
        return;
    } else {
        imageInput.classList.add("is-valid");
    }

    if (validatePatternField(name, namePattern)) return;
    if (validateTextField(comingFrom)) return;
    if (validatePatternField(adhar, adharPattern)) return;
    if (validatePatternField(mobileNum, mobilePattern)) return;
    if (validatePatternField(mobileToken, numberPattern)) return;
    if (validatePatternField(helmet, numberPattern)) return;

    if (requestedName.value === "") {
        requestedName.classList.add("is-invalid");
        return;
    } else {
        requestedName.classList.add("is-valid");
    }

    if (purpose.value === "") {
        purpose.classList.add("is-invalid");
        return;
    } else {
        purpose.classList.add("is-valid");
    }


    console.log("Everything is Valid!");

    btn.value = "Generating Pass";
    btn.classList.add("disabled");
    spn.classList.remove("d-none");

    GatherData();
}

function imageToBase64(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
    });
}

function NeutralizeField(inp) {
    inp.classList.remove("is-invalid");
    inp.classList.remove("is-valid");
}

function validateTextField(inp) {
    if (inp.value.trim() === '') {
        inp.classList.add("is-invalid");
        inp.focus();
        return true;
    } else {
        inp.classList.add("is-valid");
        return false;
    }
}

function validatePatternField(inp, pattern) {
    if (inp.value.trim() === '') {
        inp.classList.add("is-invalid");
        inp.focus();
        return true;
    } else if (!pattern.test(inp.value.trim())) {
        inp.classList.add("is-invalid");
        inp.focus();
        return true;
    } else {
        inp.classList.add("is-valid");
        return false;
    }
}