import fs from "fs";
import path from "path";

const folderPath = "assets"

// -----------------------
// Rename images name 104
// -----------------------
const prefix = "img_";
fs.readdir(folderPath, (err, files) => {
  if (err) return console.error("Error reading folder:", err);

  files.forEach((file, index) => {
    const ext = path.extname(file);
    const oldPath = path.join(folderPath, file);
    const newPath = path.join(folderPath, `${prefix}${index + 1}${ext}`);

    fs.rename(oldPath, newPath, (err) => {
      if (err) console.error("Error renaming file:", err);
      else console.log(`✅ Renamed: ${file} → ${prefix}${index + 1}${ext}`);
    });
  });
});


