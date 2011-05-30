var betaTerm;
var betaDiv;

function initBeta() {
    betaTerm = new Terminal( {handler: termHandler, initHandler: initTerm} );
    betaTerm.charMode = true;
    betaTerm.open();

    betaDiv = document.getElementById('termDiv');
    betaDiv.onmousedown = mouseHandler;
    resetBeta();
}

function resetBeta() {
    betaTerm.clear();

    MMU.load(lab8_rom);
    CPU.reset({timer: true,
               write: function(ch){
                   if (ch == 10)
                       betaTerm.newLine();
                   else
                       betaTerm.type(String.fromCharCode(ch));
               },
               halt: function() {
                   term.type("--- Program terminated ----");
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
