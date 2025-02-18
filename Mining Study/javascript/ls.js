const { Command } = require("../commands");

function generateSpaces(amount) {
  return "&nbsp;".repeat(amount);
}

// TODO: Add multiple drive support
module.exports = {
  name: "ls",
  description: "Lists chosen data",
  execute: (args, terminal, call) => {
    const fs = require("fs");
    const path = require("path");

    const dir = path.join(terminal.terminalDirPath, args.join(" "));

    const files = fs.readdirSync(dir);

    terminal.setTerminalDirPath(dir);
    terminal.cWrite(`Listing files in <co>${dir}</co>`);

    const max = 80;
    var longestFileName = 0;
    var maxPerRow = 2;

    if (files.length < 1) return terminal.cWrite("No files found");

    if (files.length > max) {
      terminal.cWrite(
        `Displaying more than <cg>${max}</cg> files may degrade performance.`,
      );
      terminal.cWrite(`Showing first <cg>${max}</cg> files...`);
      files.length = max;
    }

    files.forEach((file) => {
      var type;

      if (file.length > longestFileName) longestFileName = file.length;

      try {
        type = fs.lstatSync(path.join(dir, file)).isDirectory();
      } catch (error) {
        type = true;
      }
    });

    // thanks copilot, should probably rewrite this
    var rows = Math.ceil(files.length / maxPerRow);

    var output = "";

    for (var i = 0; i < rows; i++) {
      var row = files.slice(i * maxPerRow, i * maxPerRow + maxPerRow);

      row.forEach((file) => {
        console.log(longestFileName)
        var type;
        try {
          type = fs.lstatSync(path.join(dir, file)).isDirectory();
        } catch (error) {
          type = true;
        }
        output += `${type ? "📁" : "📘"}${file.padEnd(longestFileName + 2, " ")} ${generateSpaces(longestFileName - file.length)}`;
      });
      
      terminal.cWrite(output);
      output = "";
    }

    call(0);

  },
};
