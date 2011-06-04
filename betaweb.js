var BETA = {
    term: null,
    div: null,
    ROMs: [],
    regCells: [],
    memTab: null,
};

function toHex(x) {
    if (x < 0) x += 0x80000000;
    var str = x.toString(16);
    while (str.length < 8)
        str = '0' + str;
    return str;
}

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
    BETA.term = new Terminal( {handler: termHandler, initHandler: initTerm} );
    BETA.term.charMode = true;
    BETA.term.open();

    BETA.div = document.getElementById('termDiv');
    BETA.div.onmousedown = mouseHandler;

    var select = document.getElementById('romselector');
    var i, j, option;
    while (select.firstChild)
        select.removeChild(select.firstChild);
    for (i = 0; i < BETA.ROMs.length; i++) {
        option = document.createElement('option');
        option.value = i;
        option.appendChild(document.createTextNode(BETA.ROMs[i].desc));
        select.appendChild(option);
    }

    var table = document.getElementById('regtab');
    var rows = table.rows;
    var cells;
    for (i = 0; i < rows.length; i++){
        cells = rows[i].cells;
        for (j = 0; j < cells.length; j++) {
            if (cells[j].nodeName == 'TD')
                BETA.regCells.push(cells[j].firstChild);
        }
    }
    
    BETA.memTab = document.getElementById('memtab').tBodies[0];

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }
    });

    loadROM();
}

function loadROM() {
    var select = document.getElementById('romselector');
    var rom = BETA.ROMs[select.children[select.selectedIndex].value];
    rom.load(function() {
        resetBeta(rom);
    }, function (rom, err) {
        alert("Unable to load rom: " + err);
    });
}

function resetBeta(rom) {
    var i;
    BETA.term.clear();

    MMU.load(rom.rom);
    CPU.reset({timer: true,
               write: function(ch){
                   if (ch == 10)
                       BETA.term.newLine();
                   else
                       BETA.term.type(String.fromCharCode(ch));
               },
               halt: function() {
                   BETA.term.type("--- Program terminated ----");
                   refreshDisplay();
               }});

    while (BETA.memTab.firstChild)
        BETA.memTab.removeChild(BETA.memTab.firstChild);
    for (i = 0; i < rom.rom.length; i++) {
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var td = document.createElement('td');
        th.textContent = toHex(i) + ":";
        td.appendChild(document.createTextNode())
        tr.appendChild(th);
        tr.appendChild(td);
        BETA.memTab.appendChild(tr);
    }

    playPauseBeta();
}

function playPauseBeta() {
    if(CPU.running())
        CPU.pause();
    else
        CPU.run();
    refreshDisplay();
}

function refreshDisplay() {
    var div = document.getElementById('pcval');
    var button = document.getElementById('playpausebutton');
    var i;

    if (CPU.halt) {
        div.textContent = "<stopped>";
        button.disabled = true;
    } else {
        button.disabled = false;
        if (CPU.running()) {
            div.textContent = "<running>";
            button.value = "pause";
        } else {
            div.textContent = toHex(CPU.PC);
            button.value = "run";
        }
    }

    for (i = 0; i < 31; i++)
        BETA.regCells[i].textContent = toHex(CPU.regs[i]);
    for (i = 0; i < MMU.memory.length; i++)
        BETA.memTab.rows[i].cells[1].firstChild.textContent = toHex(MMU.memory[i]);
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
