var fs = require('fs');

var CPU = require('./CPU.js');
var MMU = require('./MMU.js');

function parseRom(path, cb) {
    fs.readFile(path, function (err, buffer) {
                    if (err) {
                        return cb(err);
                    }
                    if (buffer.length % 4) {
                        return cb(new Error("Invalid ROM file (length " + buffer.length + ")"));
                    }

                    var rom = [];
                    var i, b;
                    var val;
                    for (i = 0; i < buffer.length; ) {
                        val = 0;
                        for (b = 0; b < 4; b++,i++) {
                            val += (buffer[i] << (8*b));
                        }
                        rom.push(val);
                    }

                    cb(null, rom);
                });
}


if (process.argv.length < 3){
    console.log("Usage: " + process.argv[0] + " file.bin");
} else {
    parseRom(process.argv[2], function (e, rom) {
                 if (e) throw e;
                 MMU.load(rom);
                 CPU.reset();
                 while (1) {
                     CPU.step();
                 }
             })
}
