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
    // listCanConnect[i][j]: Tọa độ các pokemon khác mà pokemon[i][j] kết nối được (cùng loại)
    // countRemainingOfListCanConnect: số cặp còn lại trong listCanConnect
    // preSumVertical[i][j]: tính tổng theo chiều dọc tại từng cột để hỗ trợ hàm canConnect
    //                        preSumVertical[i][j] = pokemonTypeTable[0][j] + pokemonTypeTable[1][j]
    //                                               + ... + pokemonTypeTable[i][j]
    //                       cập nhật lại mỗi lần remove
    // preSumHorizontal[][]: tính tổng theo chiều ngang tại từng dòng để hỗ trợ hàm canConnect
    //                        preSumVertical[i][j] = pokemonTypeTable[i][0] + pokemonTypeTable[i][1]
    //                                               + ... + pokemonTypeTable[i][j]
    //                       cập nhật lại mỗi lần remove


    // **********************************************************************************************
    // Chưa hoàn thành updatePreSumArraysAfterMove: bị vướng mỗi lần cập nhật 2 mảng preSumVertical và
    // preSumVertical sau khi move board -> chưa áp dụng mảng sum để tối ưu hàm canconect trong trường
    // hợp board move được

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
        this.countRemainingOfListCanConnect = 0
        this.preSumVertical = {}
        this.preSumHorizontal = {}
        for (var i = 0; i < n_rows; i++){
            this.pokemonTypeTable[i] = [];
            this.listCanConnect[i] = []
            this.preSumVertical[i] = []
            this.preSumHorizontal[i] = []
            for (var j = 0; j < n_column; j++){
                this.pokemonTypeTable[i][j] = MW.FLAG_NUMBER;
                this.listCanConnect[i][j] = []
                this.preSumVertical[i][j] = 0
                this.preSumHorizontal[i][j] = 0
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

    //Co the toi uu: bfs xong moi for type - nhung khong cai thien nhieu, van O(n^4)
    generateListCanConnect: function (){
        this.countRemainingOfListCanConnect = 0
        var e = this.initTableForBFS()
        for (var i = 0; i < this.n_rows; i++){
            for (var j = 0; j < this.n_columns; j++){
                if (this.getPokemon(i,j) !== -1) {
                    var stepCount = this.breadthFirstSearch(cc.p(-1,-1),cc.p(i+1,j+1),e,false)
                    for (var k = 0; k<this.typePositions[this.getPokemon(i,j)-1].length; k++) {
                        var p = this.typePositions[this.getPokemon(i,j)-1][k]
                        if (this.getPokemon(p.x, p.y) != -1){
                            if (p.x!==i || p.y !== j) {
                                if ((p.x==i-1 && p.y==j) || (p.x==i+1 && p.y==j) || (p.x==i && p.y==j-1) || (p.x==i && p.y==j+1)){
                                    this.listCanConnect[i][j].push(p)
                                    this.countRemainingOfListCanConnect++
                                    continue
                                }
                                var pInBFS = cc.p(p.x+1,p.y+1)
                                var stepTo = Math.min(stepCount[pInBFS.x][pInBFS.y],stepCount[pInBFS.x-1][pInBFS.y]+1,
                                    stepCount[pInBFS.x][pInBFS.y-1]+1,stepCount[pInBFS.x+1][pInBFS.y]+1,stepCount[pInBFS.x][pInBFS.y+1]+1)
                                if (MW.MIN_STEP_COUNT<=stepTo && stepTo<=MW.MAX_STEP_COUNT) {
                                    this.listCanConnect[i][j].push(p)
                                    this.countRemainingOfListCanConnect++
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
                if (i==0){
                    this.preSumVertical[i][j] = 0
                } else {
                    this.preSumVertical[i][j] = this.preSumVertical[i-1][j]
                }
                if (j==0){
                    this.preSumHorizontal[i][j] = 0
                } else {
                    this.preSumHorizontal[i][j] = this.preSumHorizontal[i][j - 1]
                }
                if (this.pokemonTypeTable[i][j] !== -1) {
                    this.preSumVertical[i][j]++
                    this.preSumHorizontal[i][j]++
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

    removePokemon: function (x,y){
        this.countType[this.pokemonTypeTable[x][y]-1]--
        this.countRemainingPokemon--
        this.pokemonTypeTable[x][y] = -1
        if (MW.POKEMON_MOVE == MW.DONT_MOVE) {
            //Cap nhat lai mang listCanConnect
            for (var i = 0; i < this.listCanConnect[x][y].length; i++) {
                var p = this.listCanConnect[x][y][i]
                var listP = this.listCanConnect[p.x][p.y]
                var delIndex = -1
                for (var j = 0; j < listP.length; j++) {
                    if (listP[j].x == x && listP[j].y == y) {
                        delIndex = j;
                        break
                    }
                }
                if (delIndex != -1) {
                    this.listCanConnect[p.x][p.y].splice(delIndex, 1)
                    this.countRemainingOfListCanConnect--
                }
            }
            this.countRemainingOfListCanConnect = this.countRemainingOfListCanConnect - this.listCanConnect[x][y].length
            this.listCanConnect[x][y].splice(0, this.listCanConnect[x][y].length)

            //Cap nhat mang preSumVertical va preSumHorizontal
            for (var i = x; i<this.getNRows(); i++) {
                this.preSumVertical[i][y]--
            }
            for (var i = y; i<this.getNColumns(); i++){
                this.preSumHorizontal[x][i]--
            }
        }
    },

    //Cap nhat mang preSumVertical va preSumHorizontal
    updatePreSumArraysAfterMove: function (x,y){
        // for (var i = x; i<this.getNRows(); i++) {
        //     this.preSumVertical[i][y]--
        // }
        // for (var i = y; i<this.getNColumns(); i++){
        //     this.preSumHorizontal[x][i]--
        // }
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

    // Tim toa do nho nhat theo chieu doc ma 1 o co the di den
    findMinCoordinateXOfPoint: function (x,y){
        var res = x
        for (var i = x-1; i>=-1; i--){
            if (i==-1) {
                return i
            }
            if (this.getPokemon(i,y) == -1){
                res = i
            } else {
                return res
            }
        }
        return res
    },

    // Tim toa do lon nhat theo chieu doc ma 1 o co the di den
    findMaxCoordinateXOfPoint: function (x,y){
        var res = x
        for (var i = x+1; i<=this.getNRows(); i++) {
            if (i==this.getNRows()) {
                return i
            }
            if (this.getPokemon(i,y) == -1){
                res = i
            } else {
                return res
            }
        }
        return res
    },

    // Tim toa do nho nhat theo chieu ngang ma 1 o co the di den
    findMinCoordinateYOfPoint: function (x,y){
        var res = y
        for (var i = y-1; i>=-1; i--){
            if (i==-1) {
                return i
            }
            if (this.getPokemon(x,i) == -1){
                res = i
            } else {
                return res
            }
        }
        return res
    },

    // Tim toa do lon nhat theo chieu ngang ma 1 o co the di den
    findMaxCoordinateYOfPoint: function (x,y){
        var res = y
        for (var i = y+1; i<=this.getNColumns(); i++) {
            if (i==this.getNColumns()) {
                return i
            }
            if (this.getPokemon(x,i) == -1){
                res = i
            } else {
                return res
            }
        }
        return res
    },

    canConnect: function (preX, preY, x , y) {
        // var path = this.findPath(preX, preY, x, y)
        // return path.length >= MW.MIN_PATH_LENGTH && path.length <= MW.MAX_PATH_LENGTH

        // Thuat toan nhanh hon: Truong hop xau nhat van la O(n^2)
        // Xet cac LINE ngang
        var minXofP1 = this.findMinCoordinateXOfPoint(preX,preY)
        var maxXofP1 = this.findMaxCoordinateXOfPoint(preX,preY)
        var minXofP2 = this.findMinCoordinateXOfPoint(x,y)
        var maxXofP2 = this.findMaxCoordinateXOfPoint(x,y)
        var fromX = Math.max(minXofP1,minXofP2)
        var toX = Math.min(maxXofP1, maxXofP2)
        for (var i = fromX; i<=toX; i++){
            if (Math.min(preY,y)+1==Math.max(preY,y) || i == -1 || i == this.getNRows()) {
                return true
            }
            //Moi line ngang kiem tra giua 2 diem co o nao can duong khong? O(n)
            //Co the toi uu bang mang bam -> O(1)
            for (var j = Math.min(preY,y)+1; j<=Math.max(preY,y)-1; j++){
                if (this.getPokemon(i,j) != -1) {
                    break
                }
                if (j == Math.max(preY,y)-1) {
                    return true
                }
            }
        }
        //Xet cac LINE doc
        var minYofP1 = this.findMinCoordinateYOfPoint(preX,preY)
        var maxYofP1 = this.findMaxCoordinateYOfPoint(preX,preY)
        var minYofP2 = this.findMinCoordinateYOfPoint(x,y)
        var maxYofP2 = this.findMaxCoordinateYOfPoint(x,y)
        var fromY = Math.max(minYofP1,minYofP2)
        var toY = Math.min(maxYofP1, maxYofP2)
        for (var i = fromY; i<=toY; i++){
            if (Math.min(preX,x)+1==Math.max(preX,x) || i == -1 || i == this.getNColumns()) {
                return true
            }
            //Moi line doc kiem tra giua 2 diem co o nao can duong khong? O(n)
            //Co the toi uu bang mang bam -> O(1)
            for (var j = Math.min(preX,x)+1; j<=Math.max(preX,x)-1; j++){
                if (this.getPokemon(j,i) != -1) {
                    break
                }
                if (j == Math.max(preX,x)-1) {
                    return true
                }
            }
        }
        return false
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
                                if ((i2==i-1 && j2==j) || (i2==i+1 && j2==j) || (i2==i && j2==j-1) || (i2==i && j2==j+1)){
                                   return true
                                }
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

    getHintMovableBoard: function (){
        if (this.countRemainingPokemon === 0) return true
        var e = this.initTableForBFS()
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++){
                if (this.getPokemon(i,j) !== -1) {
                    var stepCount = this.breadthFirstSearch(cc.p(-1,-1),cc.p(i+1,j+1),e, false)
                    for (var i2 = 0; i2 < this.getNRows(); i2++) {
                        for (var j2 = 0; j2 < this.getNColumns(); j2++) {
                            if (this.getPokemon(i2,j2) == this.getPokemon(i,j) && (i!=i2 || j!=j2)) {
                                if ((i2==i-1 && j2==j) || (i2==i+1 && j2==j) || (i2==i && j2==j-1) || (i2==i && j2==j+1)){
                                    return {"first": cc.p(i,j), "second": cc.p(i2,j2)}
                                }
                                var p = cc.p(i2+1,j2+1)
                                var stepTo = Math.min(stepCount[p.x][p.y],stepCount[p.x-1][p.y]+1,stepCount[p.x][p.y-1]+1,
                                    stepCount[p.x+1][p.y]+1,stepCount[p.x][p.y+1]+1)
                                if (MW.MIN_STEP_COUNT<=stepTo && stepTo<=MW.MAX_STEP_COUNT) {
                                    return {"first": cc.p(i,j), "second": cc.p(i2,j2)}
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    getHintUnmovableBoard: function (){
        for (var i = 0; i < this.getNRows(); i++) {
            for (var j = 0; j < this.getNColumns(); j++) {
                if (this.getPokemon(i, j) !== -1) {
                    if (this.listCanConnect[i][j].length > 0) {
                        var p = this.listCanConnect[i][j][0]
                        return {"first": cc.p(i,j), "second": cc.p(p.x,p.y)}
                    }
                }
            }
        }
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
        if (this.countRemainingOfListCanConnect > 0) {
            return true
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

    initAfterPosition: function (){
        var afterPosition = {}
        for (var i=0; i<this.getNRows(); i++){
            afterPosition[i] = []
            for (var j=0; j<this.getNColumns(); j++){
                afterPosition[i][j] = cc.p(-1,-1)
            }
        }
        return afterPosition
    },

    // splitDirection: hướng cắt chia bảng thành các phần (0 - dọc; 1 - ngang)
    // direction[]: số lượng phần tử là số phần sau khi chia board, giá trị của
    //              direction[i] là sẽ hướng sang trái (lên) - 0 hay phải (xuống) - 1
    //              phụ thuộc vào splitDirection
    boardMove: function (splitDirection, direction){
        var afterPosition = this.initAfterPosition()
        if (splitDirection == 0) {
            for (var i=0; i<direction.length; i++){
                for (var j = 0; j< this.getNRows(); j++){
                    if (direction[i] == 0) {
                        var current = this.getNColumns()/direction.length * i - 1
                        var run = this.getNColumns()/direction.length * i
                        while (run<this.getNColumns()/direction.length*(i+1)){
                            var p = this.pokemonTypeTable[j][run]
                            if (p!=-1){
                                this.pokemonTypeTable[j][run] = -1
                                this.pokemonTypeTable[j][++current] = p
                                afterPosition[j][run] = cc.p(j,current)
                            }
                            run++
                        }
                    } else {
                        var current = this.getNColumns()/direction.length*(i+1)
                        var run =  this.getNColumns()/direction.length*(i+1) - 1
                        while (run >= this.getNColumns()/direction.length*i){
                            var p = this.pokemonTypeTable[j][run]
                            if (p!=-1){
                                this.pokemonTypeTable[j][run] = -1
                                this.pokemonTypeTable[j][--current] = p
                                afterPosition[j][run] = cc.p(j,current)
                            }
                            run--
                        }
                    }
                }
            }
        } else {
            for (var i=0; i<direction.length; i++){
                for (var j = 0; j< this.getNColumns(); j++) {
                    if (direction[i] == 0) {
                        var current = this.getNRows() / direction.length * i - 1
                        var run = this.getNRows() / direction.length * i
                        while (run < this.getNRows() / direction.length * (i + 1)) {
                            var p = this.pokemonTypeTable[run][j]
                            if (p != -1) {
                                this.pokemonTypeTable[run][j] = -1
                                this.pokemonTypeTable[++current][j] = p
                                afterPosition[run][j] = cc.p(current, j)
                            }
                            run++
                        }
                    } else {
                        var current = this.getNRows() / direction.length * (i + 1)
                        var run = this.getNRows() / direction.length * (i + 1) - 1
                        while (run >= this.getNRows() / direction.length * i) {
                            var p = this.pokemonTypeTable[run][j]
                            if (p != -1) {
                                this.pokemonTypeTable[run][j] = -1
                                this.pokemonTypeTable[--current][j] = p
                                afterPosition[run][j] = cc.p(current, j)
                            }
                            run--
                        }
                    }
                }
            }
        }
        return afterPosition
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