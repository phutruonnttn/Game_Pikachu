var BoardView = cc.Layer.extend({
    board: {},//class Board
    squareSize: 5, //do dai canh 1 o vuong trong bang pixel
    width: 50, // do rong cua bang pixel
    height: 50, //do dai cua bang pixel
    pokemons: {},//mang 2 chieu luu anh cua cac o pokemon, moi o la 1 sprite

    ctor: function (board){
        this._super();
        this.board = board;
        this.showBoard();
    },

    createBoardView: function (board){
        let boardView = BoardView.create();
        boardView.board = board;
        boardView.showBoard();
        return boardView;
    },

    showBoard: function (){
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        this.squareSize = visibleSize.width / (this.board.getNColumns() + 2);
        this.width = this.squareSize * this.board.getNColumns();
        this.height = this.squareSize * this.board.getNRows();

        //fix
        this.setContentSize(this.width, this.height);

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
        var pokemon = cc.sprite.create("res/pokemon" + type + ".png");
        pokemon.setScaleX(this.squareSize / pokemon.getContentSize().width);
        pokemon.setScaleY(this.squareSize / pokemon.getContentSize().height);
        var position = this.positionOf(row, column);
        pokemon.setPosition(position);
        return pokemon;
    },

    positionOf: function (row, column){
        //????????????????
        return cc.v2(column * this.squareSize + this.squareSize/2, this.height - row *this.squareSize -this.squareSize/2);
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

    //fix neu sai
    removePokemon: function (row, column){
        if (this.pokemons[row][column] == null) return false;
        this.board.removePokemon(row, column);
        this.pokemons[row][column] = null;
        return true;
    }
})