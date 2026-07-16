/*=========================================================
 AI FACE EXTRACTION STUDIO
 script.js
 Part 1 - Initialization, Theme, Upload & Preview
=========================================================*/

"use strict";

/*=========================================================
 DOM ELEMENTS
=========================================================*/

const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const browseHeroBtn = document.getElementById("browseHeroBtn");
const detectBtn = document.getElementById("detectBtn");
const resetBtn = document.getElementById("resetBtn");

const dropZone = document.getElementById("dropZone");

const previewImage = document.getElementById("previewImage");
const previewPlaceholder = document.getElementById("previewPlaceholder");

const gallery = document.getElementById("gallery");

const loadingOverlay = document.getElementById("loadingOverlay");
const progressBar = document.getElementById("progressBar");
const loadingText = document.getElementById("loadingText");

const faceCount = document.getElementById("faceCount");
const processingTime = document.getElementById("processingTime");
const resolution = document.getElementById("resolution");
const fileSize = document.getElementById("fileSize");

const themeToggle = document.getElementById("themeToggle");

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

const toastContainer = document.getElementById("toastContainer");

const downloadAllBtn = document.getElementById("downloadAllBtn");


/*=========================================================
 GLOBAL VARIABLES
=========================================================*/

let selectedFile = null;
let extractedFaces = [];
let currentProgress = 0;


/*=========================================================
 DARK MODE
=========================================================*/

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}

loadTheme();


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }
    else {

        localStorage.setItem("theme", "light");

        themeToggle.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    }

});


/*=========================================================
 OPEN FILE PICKER
=========================================================*/

browseBtn.addEventListener("click", () => {

    imageInput.click();

});

browseHeroBtn.addEventListener("click", () => {

    imageInput.click();

});


/*=========================================================
 FILE SELECTION
=========================================================*/

imageInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file)
        return;

    loadImage(file);

});


/*=========================================================
 DRAG & DROP
=========================================================*/

[
    "dragenter",
    "dragover"
].forEach(eventName => {

    dropZone.addEventListener(eventName, e => {

        e.preventDefault();

        dropZone.classList.add("drag-active");

    });

});


[
    "dragleave",
    "drop"
].forEach(eventName => {

    dropZone.addEventListener(eventName, e => {

        e.preventDefault();

        dropZone.classList.remove("drag-active");

    });

});


dropZone.addEventListener("drop", e => {

    const file = e.dataTransfer.files[0];

    if (!file)
        return;

    loadImage(file);

});


dropZone.addEventListener("click", () => {

    imageInput.click();

});


/*=========================================================
 LOAD IMAGE
=========================================================*/

function loadImage(file) {

    if (!validateFile(file))
        return;

    // Store the selected file
    selectedFile = file;

    // Reset previous results
    gallery.innerHTML = `

        <div class="placeholder">

            <i class="fa-solid fa-face-smile"></i>

            <p>No faces extracted yet.</p>

        </div>

    `;

    faceCount.textContent = "0";
    processingTime.textContent = "0 sec";
    resolution.textContent = "--";
    fileSize.textContent = "--";

    // Show preview image
    const reader = new FileReader();

    reader.onload = function (e) {

        previewPlaceholder.classList.add("hidden");
        previewImage.hidden = false;

        previewImage.src = e.target.result;

        updateImageStats(file);

        showToast(
            "Image loaded successfully.",
            "success"
        );

    };

    reader.readAsDataURL(file);

}

/*=========================================================
 VALIDATE IMAGE
=========================================================*/

function validateFile(file) {

    const allowed = [

        "image/png",

        "image/jpeg",

        "image/jpg",

        "image/webp"

    ];

    if (!allowed.includes(file.type)) {

        showToast(
            "Please upload a PNG, JPG, JPEG or WEBP image.",
            "error"
        );

        return false;

    }

    if (file.size > 15 * 1024 * 1024) {

        showToast(
            "Maximum file size is 15 MB.",
            "warning"
        );

        return false;

    }

    return true;

}


/*=========================================================
 IMAGE INFORMATION
=========================================================*/

function updateImageStats(file) {

    fileSize.textContent =
        (file.size / 1024 / 1024).toFixed(2) + " MB";

    const img = new Image();

    img.onload = function () {

        resolution.textContent =
            `${img.width} × ${img.height}`;

    };

    img.src = URL.createObjectURL(file);

}


/*=========================================================
 LOADING
=========================================================*/

function showLoader() {

    loadingOverlay.classList.remove("hidden");

    currentProgress = 0;

    progressBar.style.width = "0%";

    loadingText.textContent =
        "Preparing image...";

}

function hideLoader() {

    loadingOverlay.classList.add("hidden");

}


/*=========================================================
 PROGRESS ANIMATION
=========================================================*/

function animateProgress(target = 100) {

    currentProgress = 0;

    const timer = setInterval(() => {

        currentProgress += 2;

        progressBar.style.width =
            currentProgress + "%";

        if (currentProgress > 25)
            loadingText.textContent =
                "Detecting faces...";

        if (currentProgress > 60)
            loadingText.textContent =
                "Extracting faces...";

        if (currentProgress > 90)
            loadingText.textContent =
                "Almost finished...";

        if (currentProgress >= target) {

            clearInterval(timer);

        }

    }, 40);

}

/*=========================================================
 PART 2
 Flask API Communication
=========================================================*/


/*=========================================================
 EXTRACT FACES
=========================================================*/

detectBtn.addEventListener("click", extractFaces);


async function extractFaces() {

    if (!selectedFile) {

        showToast(
            "Please select an image first.",
            "warning"
        );

        return;
    }

    const startTime = performance.now();

    showLoader();

    animateProgress(95);

    const formData = new FormData();

    formData.append(
        "image",
        selectedFile
    );

    try {

        const response = await fetch(
            "/api/extract-faces",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Processing failed."
            );

        }

        progressBar.style.width = "100%";

        loadingText.textContent =
            "Completed";

        setTimeout(hideLoader,400);

        extractedFaces = data.faces || [];

        buildGallery(extractedFaces);

        faceCount.textContent =
            extractedFaces.length;

        if(data.annotatedImage){

            previewImage.src =
                data.annotatedImage;

        }

        const endTime = performance.now();

        processingTime.textContent =
            ((endTime-startTime)/1000).toFixed(2)+" sec";

        showToast(
            `${extractedFaces.length} face(s) detected.`,
            "success"
        );

    }

    catch(error){

        hideLoader();

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}


/*=========================================================
 BUILD FACE GALLERY
=========================================================*/

function buildGallery(faces){

    gallery.innerHTML="";

    if(faces.length===0){

        gallery.innerHTML=`

            <div class="placeholder">

                <i class="fa-solid fa-face-frown"></i>

                <p>No faces detected.</p>

            </div>

        `;

        return;

    }

    faces.forEach(face=>{

        const card=document.createElement("div");

        card.className="face-card";

        card.innerHTML=`

            <img
                src="${face.image}"
                alt="Face ${face.id}"
                data-image="${face.image}"
            >

            <div class="face-info">

                <h4>Face ${face.id}</h4>

                <p>

                    ${face.box.w} × ${face.box.h}px

                </p>

                <button
                    class="download-btn"
                    onclick="downloadFace('${face.image}','face_${face.id}.jpg')">

                    <i class="fa-solid fa-download"></i>

                    Download

                </button>

            </div>

        `;

        gallery.appendChild(card);

    });

}

resetBtn.addEventListener("click", resetDashboard);

function resetDashboard() {

    selectedFile = null;

    extractedFaces = [];

    imageInput.value = "";

    previewImage.src = "";

    previewImage.classList.add("hidden");

    previewPlaceholder.classList.remove("hidden");

    gallery.innerHTML = `

        <div class="placeholder">

            <i class="fa-solid fa-face-smile"></i>

            <p>No faces extracted yet.</p>

        </div>

    `;

    faceCount.textContent = "0";

    processingTime.textContent = "0 sec";

    resolution.textContent = "--";

    fileSize.textContent = "--";

    progressBar.style.width = "0%";

    hideLoader();

    showToast(

        "Dashboard reset successfully.",

        "success"

    );

}