var BoardView = cc.Layer.extend({
    board: {},//class Board
    squareSize: 5, //do dai canh 1 o vuong trong bang pixel
    _width: 50, // do rong cua bang pixel
    _height: 50, //do dai cua bang pixel
    pokemons: {},//mang 2 chieu luu anh cua cac o pokemon, moi o la 1 sprite

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
        //var pokemon = new cc.Sprite("res/pokemon1.png");
        pokemon.setScaleX(this.squareSize / pokemon.getContentSize().width);
        pokemon.setScaleY(this.squareSize / pokemon.getContentSize().height);
        var position = this.positionOf(row, column);
        pokemon.setPosition(position);

        //Event listener
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var touchLocation = touch.getLocation() - pokemon.getPosition()
            }
        })
        cc.eventManager.addListener(listener, pokemon)
        return pokemon;
    },

    positionOf: function (row, column){
        //
        return cc.p(column * this.squareSize + this.squareSize/2, this.height - row *this.squareSize -this.squareSize/2);
    },

    findRowAndColumnOfSprite: function (node) {
        for (var i = 0; i < this.board.getNRows(); i++) {
            for (var j = 0; j < this.board.getNColumns(); j++) {
                if (this.pokemons[i][j] == node) {
                    return [i,j]
                }
            }
        }
        return [-1, -1]
    },

    removePokemon: function (row, column){
        if (this.pokemons[row][column] == null) return false;
        this.board.removePokemon(row, column);
        this.pokemons[row][column] = null;
        return true;
    }
})