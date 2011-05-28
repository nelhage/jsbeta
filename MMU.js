const PC_SUPERVISOR   = 0x80000000;

var MMU = {
    memory: [],
    load: function (mem) {
        MMU.memory = mem.map(function(x){return x;});
    },
    read: function(addr) {
        var ea = (addr & ~PC_SUPERVISOR) >> 2;
        if (ea > MMU.memory.length) {
            throw new Error("Invalid read: " + (addr & ~PC_SUPERVISOR));
        }
        return MMU.memory[ea];
    },
    write: function(addr, data) {
        var ea = (addr & ~PC_SUPERVISOR) >> 2;
        if (ea > MMU.memory.length) {
            throw new Error("Invalid read: " + (addr & ~PC_SUPERVISOR));
        }
        MMU.memory[ea] = data;
    }
};

if (module !== undefined) {
    module.exports = MMU;
}
