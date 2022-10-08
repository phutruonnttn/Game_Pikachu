let Board = cc.Class.extend( {
    n_rows: 10,
    n_columns: 10,
    _pokemons: {},
    previousX: -1,
    previousY: -1,

    ctor: function (n_rows, n_column, n_types, count){
        this.n_rows = n_rows;
        this.n_columns = n_column;

        for (var i = 0; i < n_rows; i++){
            this._pokemons[i] = [];
            for (var j = 0; j < n_column; j++){
                this._pokemons[i][j] = -1;
            }
        }

        var countType = {};
        for (var i = 0; i< n_types; i++) {
            countType[i] = 0;
        }
        for (var i = 0; i < n_rows; i++) {
            for (var j = 0; j < n_column; j++) {
                var type;
                do {
                    type = Math.floor(Math.random() * 10) % n_types;
                } while (countType[type] >= count[type]);
                countType[type]++;
                this.addPokemon(i,j,type+1)
            }
        }
    },

    getPreviousX: function (){
        return this.previousX
    },

    getPreviousY: function (){
        return this.previousY
    },

    setPreviousX: function (x){
        this.previousX = x
    },

    setPreviousY: function (y){
        this.previousY = y
    },

    getNRows: function (){
        return this.n_rows;
    },

    getNColumns: function (){
        return this.n_columns;
    },

    addPokemon: function (x,y,type){
        this._pokemons[x][y] = type;
    },

    getPokemon: function (x,y){
        return this._pokemons[x][y];
    },

    removePokemon: function (x,y){
        this._pokemons[x][y] = -1;
    },

    selectPokemon: function (x,y){
        if ((this.previousX == -1 && this.previousY == -1) || this._pokemons[x][y] != this._pokemons[this.previousX][this.previousY]
            || !this.canConnect(this.previousX, this.previousY, x, y)
            || (this.previousX == x && this.previousY == y)) {
            return false;
        }
        return true;
    },

    canConnect: function (preX, preY, x , y) {
        var path = this.findPath(preX, preY, x, y)
        return path.length >= 2 && path.length <= 4
    },

    findPath: function (preX, preY, x , y) {
        //init
        var e = [], trace = [];
        for (var i = 0; i < this.getNRows()+2; i++) {
            e[i] = []
            trace[i] = []
            for (var j = 0; j < this.getNColumns()+2; j++) {
                e[i][j] = 0
                trace[i][j] = cc.p(-1,-1)
            }
        }
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++) {
                e[i+1][j+1] = this._pokemons[i][j] != -1
            }
        }

        var s = cc.p(preX+1, preY+1)
        var t = cc.p(x+1, y+1)
        //bfs
        var dx = [-1, 0, 1, 0]
        var dy = [0, 1, 0, -1]

        var q = new Queue();
        q.enqueue(t)
        trace[t.x][t.y] = cc.p(-2,-2)
        e[s.x][s.y] = 0;
        e[t.x][t.y] = 0;
        while (!q.isEmpty()) {
            var u = q.dequeue();
            if (u.x == s.x && u.y == s.y) break;
            for (var i = 0; i < 4; i++) {
                var x = u.x + dx[i];
                var y = u.y + dy[i];
                while (x >= 0 && x < this.getNRows()+2 && y>=0 && y < this.getNColumns()+2) {
                    if (e[x][y] == 0) {
                        if (trace[x][y].x == -1) {
                            trace[x][y] = u;
                            q.enqueue(cc.p(x, y))
                        }
                        x += dx[i]
                        y += dy[i]
                    } else {
                        break;
                    }
                }
            }
        }

        //trace back
        var res = new Array()
        if (trace[s.x][s.y].x != -1) {
            while (s.x != -2)
            {
                res.push(cc.p(s.x-1, s.y-1))
                s = trace[s.x][s.y]
            }
        }
        return res;
    }
})