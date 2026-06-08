const upload = document.getElementById("upload");
const preview = document.getElementById("preview");

let cropper;

upload.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

        preview.src = event.target.result;

        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(preview, {
            aspectRatio: 35 / 45,
            viewMode: 1
        });

    };

    reader.readAsDataURL(file);

});

function generatePhotos() {

    if (!cropper) {
        alert("Upload photo first");
        return;
    }

    const sheet = document.getElementById("sheet");
    sheet.innerHTML = "";

    const count = parseInt(
        document.getElementById("photoCount").value
    );

    const croppedCanvas = cropper.getCroppedCanvas({
        width: 600,
        height: 600
    });

    const image = croppedCanvas.toDataURL();



    for(let i = 0; i < count; i++){

        const img = document.createElement("img");

        img.src = image;

        img.classList.add("passport-photo");

        img.style.width = "35mm";

        img.style.height = "45mm";

        sheet.appendChild(img);
    }
}

async function downloadPDF() {

    const sheet = document.getElementById("sheet");

    if (sheet.innerHTML.trim() === "") {
        alert("Please generate photos first");
        return;
    }

    const canvas = await html2canvas(sheet, {
        scale: 1.5
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.8);

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;

    pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight
    );

    pdf.save("passport-photo-sheet.pdf");
}