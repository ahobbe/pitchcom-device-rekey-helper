// REDONE LAYOUT
function addNewLine(previousLine) {
  const line = document.createElement("div");
  line.className = "d-flex gap-2 flex-wrap" // Same as original
  line.style = "padding-top: 1rem";
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
shortKeyDisplay.style = "max-width:64px";

// Add a full key field
const fullKeyDisplayText = `<input id="fullKey" class="form-control" style="max-width:320px">`;
line3.insertAdjacentHTML("beforeend", fullKeyDisplayText);

// Add a "Load Key" button
const loadKeyButton = `<button id="bKeyLoad" class="btn btn-primary">Load Key</button>`;
line3.insertAdjacentHTML("beforeend", loadKeyButton);

// Add a "Copy Key" button
const copyKeyButton = `<button id="bKeyCopy" class="btn btn-primary" disabled>Copy Key</button>`;
line3.insertAdjacentHTML("beforeend", copyKeyButton);

// LINE 4
// Move "Write" button to its own line
line4.append(writeButton);

// Change text from "Generate" to "Generate Key"
writeButton.textContent = "Write Key";

// NEW FUNCTIONALITY
// Current key
let fullKey;
let fullKeyHex;

// Full key field
const fullKeyDisplay = document.getElementById("fullKey");

// Output
const output = document.getElementById("output");

// New buttons
const loadButton = document.getElementById("bKeyLoad");
const copyButton = document.getElementById("bKeyCopy");

function addMessage(message, color) {
  // Create a new span element
  const outputMessage = document.createElement("span");
  outputMessage.textContent = message;
  outputMessage.style.color = color;

  // Append the span to the output element
  output.appendChild(outputMessage);

  // Add a line break after each span
  output.appendChild(document.createElement("br"));
}

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

  // Enable copy button
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

function loadKey() {
  if (!isValidKey()) {
    addMessage("Key invalid, load unsuccessful. Double check that the key is correct, or generate a new one.", "red");
    return;
  }

  // Set new key
  fullKey = handler.key = new Uint8Array(fullKeyDisplay.value.match(/.{1,2}/g).map(b => parseInt(b, 16)));

  // Redo KeyID
  keyID = handler.crc8Java(fullKey);

  // Redo visual
  shortKeyDisplay.value = keyID.toString(16)
    .padStart(2, "0")
    .toUpperCase()

  addMessage(`Key loaded, KeyID: ${shortKeyDisplay.value}`, "green");
}

async function copyKey() {
  if (!isValidKey()) {
    addMessage("Key invalid, copy unsuccessful. Double check that the key is correct, or generate a new one.", "red");
    return;
  }

  try {
    await navigator.clipboard.writeText(fullKeyHex);
    addMessage(`Key copied to clipboard, KeyID: ${shortKeyDisplay.value}`, "green");
  }

  catch {
    addMessage(`Key failed to copy, KeyID: ${shortKeyDisplay.value}`, "red");
  }
}

// LISTENERS
// Update full key field
generateButton.addEventListener("click", () => generateKey());
loadButton.addEventListener("click", () => loadKey());
copyButton.addEventListener("click", () => copyKey());

// For testing without actual device connected
// generateButton.disabled = false;