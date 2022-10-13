var GameLayerPokemon = cc.Layer.extend({
    boardView: {},
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        this.showBoard();
        this.showProgressTimer();
        this.showHintButton();
        return true;
    },
    showBoard: function (){
        var count = []
        for (var i=0; i< MW.NTYPES; i++){
            count.push(MW.N_EACH_OF_TYPE)
        }
        var board = new Board(MW.NROWS, MW.NCOLUMNS, MW.NTYPES, count)
        this.boardView = new BoardView().createBoardView(board)
        this.addChild(this.boardView, 1)
        var x = (cc.Director.getInstance().getVisibleSize().width - this.boardView.getContentSize().width) / 2;
        var y = (cc.Director.getInstance().getVisibleSize().height - this.boardView.getContentSize().height) / 2;
        this.boardView.setPosition(x, y);
    },
    showProgressTimer: function (){
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        let board = this.boardView.getBoundingBox()
        var progressTimer = new cc.ProgressTimer(new cc.Sprite(res.progressBar));
        progressTimer.type = cc.ProgressTimer.TYPE_BAR
        //Đặt tâm ở điểm giữa trái. Ảnh của progressTimer sẽ thu về phía Midpoint.
        progressTimer.setMidpoint(cc.p(0.0,0.5))
        //Đặt tỷ lệ thay đổi của 2 chiều ngang, dọc.
        progressTimer.setBarChangeRate(cc.p(1.0,0.0))
        //Đặt ban đầu 100%
        progressTimer.setPercentage(100)
        progressTimer.setScale(visibleSize.width/progressTimer.getContentSize().width)
        progressTimer.setPosition(visibleSize.width/2, board.y / 2)
        this.addChild(progressTimer)
        //Chạy đếm ngược từ 100% về 0% trong vòng 60 giây.
        var gameOver = cc.callFunc(function (){
            cc.delayTime(0.2),
            this.onGameOver()
        }.bind(this))
        progressTimer.runAction(cc.sequence(cc.progressTo(200, 0), gameOver))
    },

    showHintButton: function (){
        cc.MenuItemFont.setFontSize(24);
        cc.MenuItemFont.setFontName("Arial");
        var hint = new cc.MenuItemFont("HINT", function (target){
            this.onHint();
        }.bind(this))
        hint.setColor(cc.color(MW.WHITE_COLOR));
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        let board = this.boardView.getBoundingBox()
        hint.setPosition(visibleSize.width*3/4, board.y + board.height +  board.y/ 2)
        var menu = new cc.Menu(hint);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);
    },

    onHint: function () {
        this.boardView.showHint()
    },

    onGameOver:function () {
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        //scene.addChild(new GameOver());
        scene.addChild(new GameVictory())
        scene.addChild(new GameControlMenu());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
})