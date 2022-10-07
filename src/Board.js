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
                    //console.log(type)
                } while (countType[type] >= count[type]);
                countType[type]++;
                this.addPokemon(i,j,type+1)
            }
        }
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
        if ((this.previousX == -1 && this.previousY == -1) || this._pokemons[x][y] != this._pokemons[this.previousX][this.previousY] || !this.canConnect(this.previousX, this.previousY, x, y)) {
            return false;
        }
        return true;
    },

    canConnect: function (preX, preY, x , y) {
        // var path = this.findPath(preX, preY, x, y)
        // return path.size() >= 2 && path.size() <= 4
        return true;
    },

    findPath: function (preX, preY, x , y) {
        // //init
        // var e, trace;
        // for (var i = 0; i < this.board.getNRows()+2; i++) {
        //     for (var j = 0; j < this.board.getNColumns()+2; j++) {
        //         e[i][j] = 0
        //         trace[i][j] = cc.p(-1,-1)
        //     }
        // }
        // for (var i = 0; i < this.board.getNRows(); i++) {
        //     for (var j = 0; j < this.board.getNColumns(); j++) {
        //         e[i+1][j+1] = this._pokemons[i][j] != -1
        //     }
        // }
        //
        // var s = cc.p(preX+1, preY+1)
        // var t = cc.p(x+1, y+1)
        // //bfs
        // var dx = [-1, 0, 1, 0]
        // var dy = [0, 1, 0, -1]
        //
        // var q = cc.queue()
        // q.push(t)

    }
})