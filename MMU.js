var MMU = {
    memory: [],
    dirty: [],
    load: function (mem) {
        MMU.memory = mem.map(function(x){return x&0xFFFFFFFF;});
        MMU.dirty = mem.map(function(x){return 0;});
    },
    read: function(addr) {
        var ea = (addr & ~CPU.PC_SUPERVISOR) >> 2;
        if (ea >= MMU.memory.length) {
            throw new Error("Invalid read: " + (addr & ~CPU.PC_SUPERVISOR));
        }
        return MMU.memory[ea];
    },
    write: function(addr, data) {
        var ea = (addr & ~CPU.PC_SUPERVISOR) >> 2;
        if (ea >= MMU.memory.length) {
            throw new Error("Invalid read: " + (addr & ~CPU.PC_SUPERVISOR));
        }
        MMU.dirty[ea] = 1;
        MMU.memory[ea] = data;
    },
    clear_dirty: function() {
        var i;
        for (i = 0; i < MMU.dirty.length; i++)
            MMU.dirty[i] = 0;
    }
};

try {
    module.exports = MMU;
    var CPU = require('./CPU.js');
} catch (e) {}
