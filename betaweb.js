var betaTerm;
var betaDiv;
var betaROMs = [];

function BetaROM(name, rom) {
    this.name = name;
    this.rom  = rom;
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
        option.appendChild(document.createTextNode(betaROMs[i].name));
        select.appendChild(option);
    }

    resetBeta();
}

function loadROM() {
    var select = document.getElementById('romselector');
    var rom = betaROMs[select.children[select.selectedIndex].value];
    resetBeta(rom)
}

function resetBeta(rom) {
    if (rom === undefined)
        rom = betaROMs[0];
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
