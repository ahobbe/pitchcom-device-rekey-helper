// LAYOUT
function addNewLine(previousLine) {
  const line = document.createElement("div");
  line.className = "d-flex gap-2 flex-wrap" // Same as original
  line.style.paddingTop = "1rem";
  previousLine.insertAdjacentElement("afterend", line);

  return line;
}

// Get existing buttons, fields, and original line
const shortKeyDisplay = document.getElementById("eKey"); // This value is set to handler.eKey.value
const generateButton = document.getElementById("bKeyGenerate");
const writeButton = document.getElementById("bKeyWrite");
const line1 = shortKeyDisplay.parentElement;

// Remove weird extra spacing from buttons
generateButton.classList.remove("ms-2");
writeButton.classList.remove("ms-2");

// Add three more lines
const line2 = addNewLine(line1);
const line3 = addNewLine(line2);
const line4 = addNewLine(line3);

// LINE 2
// Move "Generate" button to its own line
line2.append(generateButton);

// Change text from "Generate" to "Generate Key"
generateButton.textContent = "Generate Key";

// LINE 3
// Move shortened key field below "Generate Key"
line3.append(shortKeyDisplay);

// Unhide it (remove type="hidden")
shortKeyDisplay.removeAttribute("type");

// Make it shorter
shortKeyDisplay.style.maxWidth = "64px";

// Add a field for the full key
const fullKeyDisplay = document.createElement("input");
fullKeyDisplay.id = "fullKey";
fullKeyDisplay.className = "form-control";
fullKeyDisplay.style.maxWidth = "320px";

function createButton(id, text) {
  const button = document.createElement("button");
  button.id = id;
  button.className = "btn btn-primary";
  button.textContent = text;
  button.disabled = true;

  return button;
}

// Add "Load Key" and "Copy Key" buttons
const loadButton = createButton("bKeyLoad", "Load Key");
const copyButton = createButton("bKeyCopy", "Copy Key");

line3.append(fullKeyDisplay, loadButton, copyButton);

// LINE 4
// Move "Write" button to its own line
line4.append(writeButton);

// Change text from "Generate" to "Generate Key"
writeButton.textContent = "Write Key";

// OUTPUT
const output = document.getElementById("output");

function addMessage(message, color) {
  // Create a new span element
  const outputMessage = document.createElement("span");
  outputMessage.textContent = message;
  outputMessage.style.color = color;

  // Append the span and a line break to the output element
  output.append(outputMessage, document.createElement("br"));
}

// NEW FUNCTIONALITY
// Current key
let fullKey;
let fullKeyHex;

function generateKey() {
  // Full key
  fullKey = handler.key;
  fullKeyHex = Array
    .from(handler.key)
    .map(b => b.toString(16)
    .padStart(2, "0"))
    .join("")
    .toUpperCase();

  // Update field
  fullKeyDisplay.value = fullKeyHex;

  // Add message
  addMessage(`Key generated, KeyID: ${shortKeyDisplay.value}`, "green");

  // Enable buttons
  loadButton.disabled = false;
  copyButton.disabled = false;
}

function isValidKey() {
  const trimmedKey = fullKeyDisplay.value.trim();
  const isHex = /^[0-9a-fA-F]{16}$/.test(trimmedKey);

  // Formatting check
  if (!isHex) {
    return false;
  }
  
  return true;
}

function toggleButtons() {
  loadButton.disabled = fullKeyDisplay.value.trim() == "";
  copyButton.disabled = !isValidKey();
}

function loadKey() {
  if (!isValidKey()) {
    addMessage("Key invalid, load unsuccessful. Double check that the key is correct, or generate a new one.", "red");
    return;
  }

  // Set new key
  fullKeyDisplay.value = fullKeyDisplay.value.toUpperCase();
  fullKeyHex = fullKeyDisplay.value;
  fullKey = handler.key = new Uint8Array(fullKeyHex.match(/.{1,2}/g).map(b => parseInt(b, 16)));

  // Redo KeyID
  keyID = handler.crc8Java(fullKey);

  // Redo visual
  shortKeyDisplay.value = keyID.toString(16)
    .padStart(2, "0")
    .toUpperCase()

  // Allow key to be copied
  copyButton.disabled = false;

  addMessage(`Key loaded, KeyID: ${shortKeyDisplay.value}`, "green");
}

async function copyKey() {
  if (!isValidKey()) {
    addMessage("Key invalid, copy unsuccessful. Double check that the key is correct, or generate a new one.", "red");
    return;
  }

  try {
    await navigator.clipboard.writeText(fullKeyDisplay.value.trim().toUpperCase());
    addMessage(`Key copied to clipboard, KeyID: ${shortKeyDisplay.value}`, "green");
  }

  catch {
    addMessage(`Key failed to copy, KeyID: ${shortKeyDisplay.value}`, "red");
  }
}

// LISTENERS
generateButton.addEventListener("click", generateKey); // Update full key field
fullKeyDisplay.addEventListener("input", toggleButtons);
loadButton.addEventListener("click", loadKey);
copyButton.addEventListener("click", copyKey);