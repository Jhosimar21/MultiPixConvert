// MultiPixConvert PDF Exporter Module
// Este módulo permite seleccionar imágenes, previsualizarlas y generar un PDF

const $ = (id) => document.getElementById(id);

const imageInput = $("image-input");
const uploadBtn = $("upload-btn");
const previewArea = $("preview-area");
const form = $("pdf-form");

let selectedImages = [];

// Eventos para arrastrar imágenes
uploadBtn.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBtn.classList.add("dragover");
});

uploadBtn.addEventListener("dragleave", () => {
  uploadBtn.classList.remove("dragover");
});

uploadBtn.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBtn.classList.remove("dragover");
  const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
  if (files.length) handleFiles(files);
});

imageInput.addEventListener("change", () => {
  handleFiles(Array.from(imageInput.files));
});

function handleFiles(files) {
  selectedImages = files;
  previewArea.innerHTML = "";
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      previewArea.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// Convertir imágenes a PDF
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!selectedImages.length) {
    alert("Primero selecciona imágenes.");
    return;
  }

  const pdf = new jsPDF();
  let pending = selectedImages.length;

  selectedImages.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        if (index > 0) pdf.addPage();

        const format = file.type.includes("png") ? "PNG" : "JPEG";
        pdf.addImage(img, format, x, y, imgWidth, imgHeight);
        pending--;

        if (pending === 0) pdf.save("imagenes_convertidas.pdf");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
});
