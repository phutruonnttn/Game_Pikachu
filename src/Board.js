let Board = cc.Class.extend( {
    // n_rows: Số hàng của bảng chứa type từng pokemon
    // n_columns: Số cột của bảng chứa type từng pokemon
    // pokemonTypeTable: Bảng row x column type của từng pokemon
    // previousX: Tọa độ x của pokemon đang được chọn
    // previousY: Tọa độ y của pokemon đang được chọn
    // countType: Số lượng pokemon còn lại của mỗi type
    // types: Số lượng type pokemon
    // typePositions: Vị trí từng pokemon theo mỗi type
    // countRemainingPokemon: Số pokemon còn lại trên bàn chơi
    // listCanConnect[i][j]: Tọa độ các pokemon khác mà pokemon[i][j] kết nối được

    ctor: function (n_rows, n_column, n_types, count){
        this.n_rows = n_rows;
        this.n_columns = n_column;
        this.countType = count
        this.types = n_types
        this.previousX = -1
        this.previousY = -1
        this.pokemonTypeTable = {}
        this.typePositions = {}
        this.countRemainingPokemon = n_rows * n_column
        this.listCanConnect = {}
        for (var i = 0; i < n_rows; i++){
            this.pokemonTypeTable[i] = [];
            this.listCanConnect[i] = []
            for (var j = 0; j < n_column; j++){
                this.pokemonTypeTable[i][j] = MW.FLAG_NUMBER;
                this.listCanConnect[i][j] = []
            }
        }
        this.generateTablePokemons()
    },

    // Cần thêm các ô ở các cạnh bên để BFS
    initTableForBFS: function (){
        var e = []
        for (var i = 0; i < this.getNRows()+2; i++) {
            e[i] = []
            for (var j = 0; j < this.getNColumns()+2; j++) {
                e[i][j] = 0
            }
        }
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++) {
                e[i+1][j+1] = (this.pokemonTypeTable[i][j] !== -1)
            }
        }
        return e
    },

    //Co the toi uu: bfs xong moi for type
    generateListCanConnect: function (){
        var e = this.initTableForBFS()
        for (var i = 0; i < this.n_rows; i++){
            for (var j = 0; j < this.n_columns; j++){
                if (this.getPokemon(i,j) !== -1) {
                    var stepCount = this.breadthFirstSearch(cc.p(-1,-1),cc.p(i+1,j+1),e,false)
                    for (var k = 0; k<this.typePositions[this.getPokemon(i,j)-1].length; k++) {
                        var p = this.typePositions[this.getPokemon(i,j)-1][k]
                        if (this.getPokemon(p.x, p.y) != -1){
                            if (p.x!==i || p.y !== j) {
                                var pInBFS = cc.p(p.x+1,p.y+1)
                                var stepTo = Math.min(stepCount[pInBFS.x][pInBFS.y],stepCount[pInBFS.x-1][pInBFS.y]+1,
                                    stepCount[pInBFS.x][pInBFS.y-1]+1,stepCount[pInBFS.x+1][pInBFS.y]+1,stepCount[pInBFS.x][pInBFS.y+1]+1)
                                if (MW.MIN_STEP_COUNT<=stepTo && stepTo<=MW.MAX_STEP_COUNT) {
                                    this.listCanConnect[i][j].push(p)
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    generateTablePokemons: function () {
        var countType = {}
        this.typePositions = []
        for (var i = 0; i< this.types; i++) {
            countType[i] = 0;
            this.typePositions.push([])
        }
        for (var i = 0; i < this.n_rows; i++) {
            for (var j = 0; j < this.n_columns; j++) {
                if (this.pokemonTypeTable[i][j] !== -1) {
                    var type;
                    do {
                        type = Math.floor(Math.random() * this.types) % this.types;
                    } while (countType[type] >= this.countType[type]);
                    countType[type]++;
                    this.typePositions[type].push(cc.p(i,j))
                    this.addPokemon(i,j,type+1)
                }
            }
        }
    },

    boardUpdatePosition: function (tmpPokemon) {
        for (var i = 0; i < this.n_rows; i++) {
            for (var j = 0; j < this.n_columns; j++) {
                this.addPokemon(i,j,tmpPokemon[i][j])
            }
        }
    },

    removePokemon: function (x,y){
        this.countType[this.pokemonTypeTable[x][y]-1]--
        this.countRemainingPokemon--
        this.pokemonTypeTable[x][y] = -1
        //Cap nhat lai mang listCanConnect
        for (var i = 0; i< this.listCanConnect[x][y].length; i++){
            var p = this.listCanConnect[x][y][i]
            var listP = this.listCanConnect[p.x][p.y]
            var delIndex = -1
            for (var j = 0; j<listP.length; j++){
                if (listP[j].x == x && listP[j].y == y) {
                    delIndex = j;
                    break
                }
            }
            this.listCanConnect[p.x][p.y].splice(delIndex,1)
        }
        this.listCanConnect[x][y].splice(0,this.listCanConnect[x][y].length)
    },

    selectPokemon: function (x,y){
        if (this.previousX === -1 && this.previousY === -1) {
            return false;
        }
        if (this.pokemonTypeTable[x][y] !== this.pokemonTypeTable[this.previousX][this.previousY]) {
            return false;
        }
        if (!this.canConnect(this.previousX, this.previousY, x, y)) {
            return false;
        }
        if (this.previousX === x && this.previousY === y) {
            return false;
        }
        return true;
    },

    canConnect: function (preX, preY, x , y) {
        var path = this.findPath(preX, preY, x, y)
        return path.length >= MW.MIN_PATH_LENGTH && path.length <= MW.MAX_PATH_LENGTH
    },

    checkExistSolutionMovableInBoard: function () {
        if (this.countRemainingPokemon === 0) return true
        var e = this.initTableForBFS()
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++){
                if (this.getPokemon(i,j) !== -1) {
                    var stepCount = this.breadthFirstSearch(cc.p(-1,-1),cc.p(i+1,j+1),e, false)
                    for (var i2 = 0; i2 < this.getNRows(); i2++) {
                        for (var j2 = 0; j2 < this.getNColumns(); j2++) {
                            if (this.getPokemon(i2,j2) == this.getPokemon(i,j) && (i!=i2 || j!=j2)) {
                                var p = cc.p(i2+1,j2+1)
                                var stepTo = Math.min(stepCount[p.x][p.y],stepCount[p.x-1][p.y]+1,stepCount[p.x][p.y-1]+1,
                                    stepCount[p.x+1][p.y]+1,stepCount[p.x][p.y+1]+1)
                                if (MW.MIN_STEP_COUNT<=stepTo && stepTo<=MW.MAX_STEP_COUNT) return true
                            }
                        }
                    }
                }
            }
        }
        return false
    },

    checkExistSolutionUnmovableInBoard: function (){
        if (this.countRemainingPokemon === 0) return true
        var check = this.checkListCanConnect()
        if (check) {
            return true
        } else {
            this.generateListCanConnect()
            return this.checkListCanConnect()
        }
    },

    checkListCanConnect: function (){
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++) {
                if (this.getPokemon(i,j)!==-1) {
                    if (this.listCanConnect[i][j].length >0) {
                        return true;
                    }
                }
            }
        }
        return false
    },

    findPath: function (preX, preY, x , y) {
        //init
        var e = this.initTableForBFS()
        var s = cc.p(preX+1, preY+1)
        var t = cc.p(x+1, y+1)
        //bfs
        var trace = this.breadthFirstSearch(s,t,e,true)
        //trace back
        var res = []
        if (trace[s.x][s.y].x !== -1) {
            while (s.x !== MW.FLAG_NUMBER) {
                res.push(cc.p(s.x-1, s.y-1))
                s = trace[s.x][s.y]
            }
        }
        return res;
    },

    breadthFirstSearch: function (s,t,e,typeReturn) {
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
        trace[t.x][t.y] = cc.p(MW.FLAG_NUMBER,MW.FLAG_NUMBER)
        if (s.x!=-1){
            e[s.x][s.y] = 0;
        }
        e[t.x][t.y] = 0;
        while (!q.isEmpty()) {
            var u = q.dequeue();
            if (u.x === s.x && u.y === s.y) break;
            for (var i = 0; i < 4; i++) {
                var x = u.x + dx[i];
                var y = u.y + dy[i];
                while (x >= 0 && x < this.getNRows()+2 && y>=0 && y < this.getNColumns()+2 && e[x][y] == 0) {
                    if (trace[x][y].x === -1 && stepCount[u.x][u.y]+1 <= MW.MAX_STEP_COUNT) {
                        stepCount[x][y] = stepCount[u.x][u.y]+1
                        trace[x][y] = u;
                        q.enqueue(cc.p(x, y))
                    }
                    x += dx[i]; y += dy[i];
                }
            }
        }
        if (s.x!=-1){
            e[s.x][s.y] = 1;
        }
        e[t.x][t.y] = 1;
        for (var i = 0; i < this.getNRows()+2; i++) {
            for (var j = 0; j < this.getNColumns()+2; j++) {
                if(stepCount[i][j] == 0) {
                    stepCount[i][j] = MW.BIG_NUMBER
                }
            }
        }
        if (typeReturn) return trace
        return stepCount
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
        this.pokemonTypeTable[x][y] = type;
    },

    getPokemon: function (x,y){
        return this.pokemonTypeTable[x][y];
    }
})