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
        var count = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
        var board =  Board.ctor(8, 8,16,count)
        //------------------
        var boardView = BoardView.ctor(board)

        this.addChild(boardView, 1)
        var x = (cc.Director.getInstance().getVisibleSize().width - boardView.getContentSize().width) / 2;
        var y = (cc.Director.getInstance().getVisibleSize().height - boardView.getContentSize().height) / 2;
        boardView.setPosition(cc.v2(x, y));
    }
})