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
const loadKeyButton = `<button id="bKeyLoad" class="btn btn-primary" disabled="">Load Key</button>`;
line3.insertAdjacentHTML("beforeend", loadKeyButton);

// Add a "Copy Key" button
const copyKeyButton = `<button id="bKeyCopy" class="btn btn-primary" disabled="">Copy Key</button>`;
line3.insertAdjacentHTML("beforeend", copyKeyButton);

// LINE 4
// Move "Write" button to its own line
line4.append(writeButton);

// Change text from "Generate" to "Generate Key"
writeButton.textContent = "Write Key";