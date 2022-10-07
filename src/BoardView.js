var BoardView = cc.Layer.extend({
    //class Board
    board: {},
    //do dai canh 1 o vuong trong bang pixel
    squareSize: 5,
    // do rong cua bang pixel
    _width: 50,
    //do dai cua bang pixel
    _height: 50,
    //mang 2 chieu luu anh cua cac o pokemon, moi o la 1 sprite
    pokemons: {},

    createBoardView: function (board){
        let boardView = new BoardView();
        boardView.board = board;
        boardView.showBoard();
        return boardView;
    },


    showBoard: function (){
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        this.squareSize = visibleSize.width / (this.board.getNColumns() + 2);
        this._width = this.squareSize * this.board.getNColumns();
        this._height = this.squareSize * this.board.getNRows();

        this.setContentSize(this._width, this._height);

        this.pokemons = [];
        for (var i = 0; i < this.board.getNRows(); i++) {
            this.pokemons[i] = [];
            for (var j = 0; j < this.board.getNColumns(); j++) {
                this.pokemons[i][j] = this.addPokemon(i,j,this.board.getPokemon(i,j));
                this.addChild(this.pokemons[i][j]);
            }
        }
    },

    addPokemon: function (row, column, type){
        var pokemon = new cc.Sprite("res/pokemon" + type + ".png");
        pokemon.setScaleX(this.squareSize / pokemon.getContentSize().width);
        pokemon.setScaleY(this.squareSize / pokemon.getContentSize().height);
        var position = this.positionOf(row, column)
        pokemon.setPosition(position);

        //Event listener
        var self = this
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var touchLocation = cc.p(touch.getLocation().x - self.squareSize, touch.getLocation().y - (cc.Director.getInstance().getVisibleSize().height-self._height)/2)
                var target = event.getCurrentTarget()//target o day la pokemon
                //neu diem duoc bam nam trong box chua sprite pokemon
                if (cc.rectContainsPoint(target.getBoundingBox(), touchLocation)) {
                    var p = self.findRowAndColumnOfSprite(target)
                    if (self.board.selectPokemon(p.x, p.y)){
                        self.removePokemon(self.board.previousX, self.board.previousY)
                        self.removePokemon(p.x,p.y)
                        self.board.previousX = -1
                        self.board.previousY = -1
                    } else {
                        self.board.previousX = p.x
                        self.board.previousY = p.y
                    }
                    return true//nuot su kien
                } else {
                    return false;//chuyen su kien cho sprite pokemon tiep theo
                }

            }
        })
        cc.eventManager.addListener(listener, pokemon)
        return pokemon;
    },

    positionOf: function (row, column){
        var a = column * this.squareSize + this.squareSize/2
        var b = this._height - row *this.squareSize -this.squareSize/2
        var c = this._height
        return cc.p(column * this.squareSize + this.squareSize/2, this._height - row *this.squareSize -this.squareSize/2);
    },

    findRowAndColumnOfSprite: function (node) {
        for (var i = 0; i < this.board.getNRows(); i++) {
            for (var j = 0; j < this.board.getNColumns(); j++) {
                if (this.pokemons[i][j] == node) {
                    return cc.p(i,j)
                }
            }
        }
        return cc.p(-1, -1)
    },

    removePokemon: function (row, column){
        if (this.pokemons[row][column] == null) return false;
        this.board.removePokemon(row, column);
        //this.pokemons[row][column] = null;
        this.removeChild(this.pokemons[row][column])
        return true;
    }
})