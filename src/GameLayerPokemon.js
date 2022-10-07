var GameLayerPokemon = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {

        this.showBoard();
        return true;
    },
    showBoard: function (){
        var board = new Board(8, 8, 8,[8,8,8,8,8,8,8,8])
        var boardView = new BoardView().createBoardView(board)
        this.addChild(boardView, 1)
        var x = (cc.Director.getInstance().getVisibleSize().width - boardView.getContentSize().width) / 2;
        var y = (cc.Director.getInstance().getVisibleSize().height - boardView.getContentSize().height) / 2;
        boardView.setPosition(x, y);
    }
})