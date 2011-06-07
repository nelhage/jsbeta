const OPC = 0x01; // Constant parameter
const OPI = 0x02; // Invalid

function I(mnemonic, flags) {
    return { mnemonic: mnemonic,
             flags: flags
           };
}

function IC(mnemonic) {
    return I(mnemonic + "c", OPC);
}

const INV = I("invalid", OPI);

function ARITH(c) {return c | 0x20;}
function ARITHC(c) {return c | 0x30;}


var Disassemble = {
    itab: [
        I("callout", OPC),
        // opcode class 0x00 is invalid except for callout
        INV, INV, INV, INV, INV, INV, INV, INV, INV, INV, INV, INV, INV, INV, INV,
        // opcode class 0x10: "other"
        INV, INV, INV, INV, INV, INV, INV, INV,
        /* 0x18 */ I("ld"),
        /* 0x19 */ I("st"),
        /* 0x1A */ INV,
        /* 0x1B */ I("jmp"),
        /* 0x1C */ INV,
        /* 0x1D */ I("bf"),
        /* 0x1E */ I("bt"),
        /* 0x1F */ I("ldr"),
        // opcode class 0x20: arithmetic
        /* 0x20 */ I("add"),
        /* 0x21 */ I("sub"),
        /* 0x22 */ I("mul"),
        /* 0x23 */ I("div"),
        /* 0x24 */ I("cmpeq"),
        /* 0x25 */ I("cmplt"),
        /* 0x26 */ I("cmple"),
        /* 0x27 */ INV,
        /* 0x28 */ I("and"),
        /* 0x29 */ I("or"),
        /* 0x2A */ I("xor"),
        /* 0x2B */ INV,
        /* 0x2C */ I("shl"),
        /* 0x2D */ I("shr"),
        /* 0x2E */ I("sra"),
        /* 0x2F */ INV,
        // opcode class 0x30: arithmetic with a constant
        /* 0x30 */ IC("add"),
        /* 0x31 */ IC("sub"),
        /* 0x32 */ IC("mul"),
        /* 0x33 */ IC("div"),
        /* 0x34 */ IC("cmpeq"),
        /* 0x35 */ IC("cmplt"),
        /* 0x36 */ IC("cmple"),
        /* 0x37 */ INV,
        /* 0x38 */ IC("(and"),
        /* 0x39 */ IC("(or"),
        /* 0x3A */ IC("(xor"),
        /* 0x3B */ INV,
        /* 0x3C */ IC("shl"),
        /* 0x3D */ IC("shr"),
        /* 0x3E */ IC("sra"),
        /* 0x3F */ INV
    ],
    opcodes: {
        ADD:         ARITH(0x00),
        ADDC:        ARITHC(0x00),
        AND:         ARITH(0x08),
        ANDC:        ARITHC(0x08),
        MUL:         ARITH(0x02),
        MULC:        ARITHC(0x02),
        DIV:         ARITH(0x03),
        DIVC:        ARITHC(0x03),
        OR:          ARITH(0x09),
        ORC:         ARITHC(0x09),
        SHL:         ARITH(0x0C),
        SHLC:        ARITHC(0x0C),
        SHR:         ARITH(0x0D),
        SHRC:        ARITHC(0x0D),
        SRA:         ARITH(0x0E),
        SRAC:        ARITHC(0x0E),
        SUB:         ARITH(0x01),
        SUBC:        ARITHC(0x01),
        XOR:         ARITH(0x0A),
        XORC:        ARITHC(0x0A),
        CMPEQ:       ARITH(0x04),
        CMPEQC:      ARITHC(0x04),
        CMPLE:       ARITH(0x06),
        CMPLEC:      ARITHC(0x06),
        CMPLT:       ARITH(0x05),
        CMPLTC:      ARITHC(0x05),
        JMP:         0x1B,
        BT:          0x1E,
        BF:          0x1D,
        LD:          0x18,
        ST:          0x19,
        LDR:         0x1F,
    }
};

try {
    module.exports = Disassemble;
    var CPU = require('./CPU.js');
} catch (e) {};
