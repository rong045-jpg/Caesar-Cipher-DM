// Language Management
const languageToggle = document.getElementById("languageToggle");
let currentLanguage = localStorage.getItem("language") || "en";

// Initialize language
if (currentLanguage === "kh") {
  languageToggle.checked = true;
  switchToKhmer();
} else {
  languageToggle.checked = false;
  switchToEnglish();
}

languageToggle.addEventListener("change", function () {
  if (this.checked) {
    switchToKhmer();
    localStorage.setItem("language", "kh");
    showTranslationPopup(
      "ភាសាត្រូវបានផ្លាស់ប្តូរទៅជាភាសាខ្មែរ",
      "Language changed to Khmer",
    );
  } else {
    switchToEnglish();
    localStorage.setItem("language", "en");
    showTranslationPopup(
      "Language changed to English",
      "ភាសាត្រូវបានផ្លាស់ប្តូរទៅជាភាសាអង់គ្លេស",
    );
  }
});

function switchToKhmer() {
  document.body.classList.add("khmer");
  updateTextContent("kh");
}

function switchToEnglish() {
  document.body.classList.remove("khmer");
  updateTextContent("en");
}

function updateTextContent(lang) {
  document.querySelectorAll("[data-en], [data-kh]").forEach((element) => {
    if (lang === "kh" && element.hasAttribute("data-kh")) {
      element.textContent = element.getAttribute("data-kh");
    } else if (lang === "en" && element.hasAttribute("data-en")) {
      element.textContent = element.getAttribute("data-en");
    }
  });
}

function showTranslationPopup(messageEn, messageKh) {
  const popup = document.getElementById("translationPopup");
  const popupMessage = document.getElementById("popupMessage");

  if (currentLanguage === "kh") {
    popupMessage.textContent = messageKh;
  } else {
    popupMessage.textContent = messageEn;
  }

  popup.classList.remove("hidden");
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 3000);
}

function closeTranslationPopup() {
  document.getElementById("translationPopup").classList.add("hidden");
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Check for saved theme or preferred scheme
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) && prefersDarkScheme.matches)
) {
  document.documentElement.classList.add("dark");
  darkModeToggle.checked = true;
} else {
  document.documentElement.classList.remove("dark");
  darkModeToggle.checked = false;
}

darkModeToggle.addEventListener("change", function () {
  if (this.checked) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("color-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("color-theme", "light");
  }
});

// Caesar Cipher Functions
function caesarCipher(text, shift, encrypt = true) {
  return text.replace(/[A-Za-z]/g, function (char) {
    const base = char <= "Z" ? 65 : 97;
    const offset = encrypt ? shift : (26 - shift) % 26;
    return String.fromCharCode(
      ((char.charCodeAt(0) - base + offset) % 26) + base,
    );
  });
}

let currentShift = 3;

function updateShift(value) {
  currentShift = Math.min(25, Math.max(1, value));
  document.getElementById("shiftValue").textContent = currentShift;
  document.getElementById("shiftSlider").value = currentShift;
}

function increaseShift() {
  updateShift(currentShift + 1);
}

function decreaseShift() {
  updateShift(currentShift - 1);
}

function encryptText() {
  const input = document.getElementById("encryptInput").value;
  const shift = currentShift;
  const encrypted = caesarCipher(input, shift, true);
  document.getElementById("encryptOutput").value = encrypted;

  // Animation feedback
  const button = event.target.closest("button");
  button.classList.add("scale-95");
  setTimeout(() => button.classList.remove("scale-95"), 300);
}

function decryptText() {
  const input = document.getElementById("decryptInput").value;
  const bruteForce = document.getElementById("bruteForceToggle").checked;

  if (bruteForce) {
    let results = [];
    for (let shift = 1; shift <= 25; shift++) {
      const decrypted = caesarCipher(input, shift, false);
      results.push(`Shift ${shift.toString().padStart(2, "0")}: ${decrypted}`);
    }
    document.getElementById("decryptOutput").value = results.join("\n");
  } else {
    const shift = parseInt(document.getElementById("decryptShift").value) || 3;
    const decrypted = caesarCipher(input, shift, false);
    document.getElementById("decryptOutput").value = decrypted;
  }

  // Animation feedback
  const button = event.target.closest("button");
  button.classList.add("scale-95");
  setTimeout(() => button.classList.remove("scale-95"), 300);
}

function copyToClipboard(elementId) {
  const textarea = document.getElementById(elementId);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  document.execCommand("copy");

  // Visual feedback
  const button = event.target.closest("button");
  const originalIcon = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i>';
  button.classList.add("bg-green-500", "dark:bg-green-600");
  setTimeout(() => {
    button.innerHTML = originalIcon;
    button.classList.remove("bg-green-500", "dark:bg-green-600");
  }, 2000);
}

// Mobile Menu
document.getElementById("mobileMenuBtn").addEventListener("click", function () {
  document.getElementById("mobileMenu").classList.toggle("hidden");
});

// Close mobile menu when clicking links
document.querySelectorAll("#mobileMenu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.add("hidden");
  });
});

// Scroll animations
function checkVisibility() {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      element.classList.add("visible");
    }
  });
}

// Back to Top
function toggleBackToTop() {
  const button = document.getElementById("backToTop");
  if (window.pageYOffset > 300) {
    button.classList.remove("hidden");
  } else {
    button.classList.add("hidden");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize sliders
  document
    .getElementById("shiftSlider")
    .addEventListener("input", function (e) {
      updateShift(parseInt(e.target.value));
    });

  // Sync shift values
  document
    .getElementById("shiftSlider")
    .addEventListener("change", function (e) {
      document.getElementById("decryptShift").value = e.target.value;
    });

  // Scroll events
  window.addEventListener("scroll", function () {
    toggleBackToTop();
    checkVisibility();
  });

  // Initial animations
  checkVisibility();

  // Auto-resize textareas
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  });

  // Add example text for demonstration
  document.getElementById("encryptInput").value = "Veni Vidi Vici";
  document.getElementById("decryptInput").value = "Yhql Ylgl Ylfl";
});

// Auto-encrypt example text on page load
window.addEventListener("load", function () {
  setTimeout(() => {
    if (document.getElementById("encryptInput").value) {
      encryptText();
    }
  }, 1000);
});
