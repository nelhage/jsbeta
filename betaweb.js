var betaTerm;

function initBeta() {
    betaTerm = new Terminal( {handler: termHandler, initHandler: initTerm} );
    betaTerm.charMode = true;
    betaTerm.open();

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
    CPU.run();

    var div = document.getElementById('termDiv');
    div.onmousedown = mouseHandler;
}

function initTerm() {
    this.lock = false;
}
function termHandler() {
    var ch = this.inputChar;
    if (ch == 13) ch = 10;
    CPU.press_key(ch);
}
function mouseHandler(evt) {
    CPU.click(evt.x, evt.y);
}
