let Queue = cc.Class.extend({
    data: [],
    ctor: function () {
        this.data = [];
    },
    isEmpty: function() {
        return this.data.length === 0;
    },
    enqueue: function (item) {
        this.data.push(item);
        return true;
    },
    dequeue: function () {
        if (this.isEmpty()) return undefined;
        return this.data.shift();
    }

})