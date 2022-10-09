let Board = cc.Class.extend( {
    //Số hàng của bảng chứa type từng pokemon
    n_rows: 10,
    //Số cột của bảng chứa type từng pokemon
    n_columns: 10,
    //Bảng row x column type của từng pokemon
    _pokemons: {},
    //Tọa độ x của pokemon đang được chọn
    previousX: -1,
    //Tọa độ y của pokemon đang được chọn
    previousY: -1,
    //Số lượng pokemon còn lại của mỗi type
    countType: {},
    //Số lượng type pokemon
    types: 16,
    //Vị trí từng pokemon theo mỗi type
    typePositions: {},
    //Số pokemon còn lại trên bàn chơi
    countRemainingPokemon: 0,

    ctor: function (n_rows, n_column, n_types, count){
        this.n_rows = n_rows;
        this.n_columns = n_column;
        this.countType = count
        this.types = n_types
        this.countRemainingPokemon = n_rows * n_column
        for (var i = 0; i < n_rows; i++){
            this._pokemons[i] = [];
            for (var j = 0; j < n_column; j++){
                this._pokemons[i][j] = -2;
            }
        }
        this.generateTablePokemons()
    },

    generateTablePokemons: function () {
        var countType = {}
        this.typePositions = new Array()
        for (var i = 0; i< this.types; i++) {
            countType[i] = 0;
            this.typePositions.push([])
        }
        for (var i = 0; i < this.n_rows; i++) {
            for (var j = 0; j < this.n_columns; j++) {
                if (this._pokemons[i][j] != -1) {
                    var type;
                    do {
                        type = Math.floor(Math.random() * 100) % this.types;
                    } while (countType[type] >= this.countType[type]);
                    countType[type]++;
                    this.typePositions[type].push(cc.p(i,j))
                    this.addPokemon(i,j,type+1)
                }
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
        this.countType[this._pokemons[x][y]-1]--
        this.countRemainingPokemon--
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

    checkExistSolution: function () {
        if (this.countRemainingPokemon == 0) return true
        var e = [];
        for (var i = 0; i < this.getNRows()+2; i++) {
            e[i] = []
            for (var j = 0; j < this.getNColumns()+2; j++) {
                e[i][j] = 0
            }
        }
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++) {
                e[i+1][j+1] = this._pokemons[i][j] != -1
            }
        }
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++){
                if (this.getPokemon(i,j) != -1) {
                    for (var k = 0; k < this.typePositions[this.getPokemon(i,j)-1].length; k++) {
                        var t = this.typePositions[this.getPokemon(i,j)-1][k]
                        var s = cc.p(i+1, j+1)
                        if (s.x == t.x+1 && s.y == t.y+1) continue
                        var trace = this.breadthFirstSearch(s,cc.p(t.x+1,t.y+1),e)
                        var countP = 0
                        if (trace[s.x][s.y].x != -1) {
                            while (s.x != -2) {
                                countP++
                                s = trace[s.x][s.y]
                            }
                        }
                        if (countP >= 2 && countP <= 4) return true;
                    }
                }
            }
        }
        return false
    },

    findPath: function (preX, preY, x , y) {
        //init
        var e = [];
        for (var i = 0; i < this.getNRows()+2; i++) {
            e[i] = []
            for (var j = 0; j < this.getNColumns()+2; j++) {
                e[i][j] = 0
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
        var trace = this.breadthFirstSearch(s,t,e)

        //trace back
        var res = new Array()
        if (trace[s.x][s.y].x != -1) {
            while (s.x != -2) {
                res.push(cc.p(s.x-1, s.y-1))
                s = trace[s.x][s.y]
            }
        }
        return res;
    },

    breadthFirstSearch: function (s,t,e) {
        var trace = []
        var stepCount = []
        for (var i = 0; i < this.getNRows()+2; i++) {
            trace[i] = []; stepCount[i] = [];
            for (var j = 0; j < this.getNColumns()+2; j++) {
                trace[i][j] = cc.p(-1,-1)
                stepCount[i][j] = 0
            }
        }
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
                while (x >= 0 && x < this.getNRows()+2 && y>=0 && y < this.getNColumns()+2 && e[x][y] == 0) {
                    if (trace[x][y].x == -1 && stepCount[u.x][u.y]+1 <= 3) {
                        stepCount[x][y] = stepCount[u.x][u.y]+1
                        trace[x][y] = u;
                        q.enqueue(cc.p(x, y))
                    }
                    x += dx[i]; y += dy[i];
                }
            }
        }
        e[s.x][s.y] = 1;
        e[t.x][t.y] = 1;
        return trace
    }
})