var MMU = {
    memory: [],
    load: function (mem) {
        MMU.memory = mem.map(function(x){return x;});
    },
    read: function(addr) {
        var ea = (addr & ~CPU.PC_SUPERVISOR) >> 2;
        if (ea > MMU.memory.length) {
            throw new Error("Invalid read: " + (addr & ~CPU.PC_SUPERVISOR));
        }
        return MMU.memory[ea];
    },
    write: function(addr, data) {
        var ea = (addr & ~CPU.PC_SUPERVISOR) >> 2;
        if (ea > MMU.memory.length) {
            throw new Error("Invalid read: " + (addr & ~CPU.PC_SUPERVISOR));
        }
        MMU.memory[ea] = data;
    }
};

try {
    module.exports = MMU;
    var CPU = require('./CPU.js');
} catch (e) {}
