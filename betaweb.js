var betaTerm;
var betaDiv;
var betaROMs = [];

function BetaROM(desc, path) {
    this.desc = desc;
    this.path = path;
    this.rom  = null;
}

function parseROM(data) {
    var rom = [];
    var i, b;
    var val;
    for (i = 0; i < data.length; ) {
        val = 0;
        for (b = 0; b < 4; b++,i++) {
            val += (data.charCodeAt(i) & 0xFF) << (8 * b);
        }
        rom.push(val);
    }
    return rom;
}

BetaROM.prototype.load = function (success, fail) {
    var rom = this;
    if (this.rom) {
        success(this);
    } else {
        jQuery.get("tests/" + this.path + ".bin",
            function (data, status, xhr) {
                window.xhr = xhr;
                if (data.length % 4) {
                    fail(rom, "Invalid length: " + data.length);
                    return;
                }
                rom.rom = parseROM(data);
                success(rom);
            }).error(function(xhr, textStatus, err) {
                fail(this, err);
            });
    }
}

function initBeta() {
    betaTerm = new Terminal( {handler: termHandler, initHandler: initTerm} );
    betaTerm.charMode = true;
    betaTerm.open();

    betaDiv = document.getElementById('termDiv');
    betaDiv.onmousedown = mouseHandler;

    var select = document.getElementById('romselector');
    var i, option;
    while (select.firstChild)
        select.removeChild(select.firstChild);
    for (i = 0; i < betaROMs.length; i++) {
        option = document.createElement('option');
        option.value = i;
        option.appendChild(document.createTextNode(betaROMs[i].desc));
        select.appendChild(option);
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }
    });

    loadROM();
}

function loadROM() {
    var select = document.getElementById('romselector');
    var rom = betaROMs[select.children[select.selectedIndex].value];
    rom.load(function() {
        resetBeta(rom);
    }, function (rom, err) {
        alert("Unable to load rom: " + err);
    });
}

function resetBeta(rom) {
    betaTerm.clear();

    MMU.load(rom.rom);
    CPU.reset({timer: true,
               write: function(ch){
                   if (ch == 10)
                       betaTerm.newLine();
                   else
                       betaTerm.type(String.fromCharCode(ch));
               },
               halt: function() {
                   betaTerm.type("--- Program terminated ----");
               }});
    playPauseBeta();
}

function playPauseBeta() {
    var button = document.getElementById('playplausebutton');
    if (!button)
        return;
    if(CPU.running()) {
        CPU.pause();
        button.value="run";
    } else {
        CPU.run();
        button.value="pause";
    }
}

function initTerm() {
    this.lock = false;
}
function termHandler() {
    if (!CPU.running()) return;
    var ch = this.inputChar;
    if (ch == 13) ch = 10;
    CPU.press_key(ch);
}
function mouseHandler(evt) {
    if (!CPU.running()) return;
    CPU.click(evt.x, evt.y);
}
