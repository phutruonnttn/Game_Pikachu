var GameLayerPokemon = cc.Layer.extend({
    boardView: {},
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        this.showBoard();
        this.showProgressTimer();
        return true;
    },
    showBoard: function (){
        var count = new Array()
        for (var i=0; i<16; i++){
            count.push(16)
        }
        var board = new Board(16, 16, 16, count)
        this.boardView = new BoardView().createBoardView(board)
        this.addChild(this.boardView, 1)
        var x = (cc.Director.getInstance().getVisibleSize().width - this.boardView.getContentSize().width) / 2;
        var y = (cc.Director.getInstance().getVisibleSize().height - this.boardView.getContentSize().height) / 2;
        this.boardView.setPosition(x, y);

        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.4);
            cc.audioEngine.playMusic("res/Music/RiverFlowsInYou.mp3", true)
        }
    },
    showProgressTimer: function (){
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        let board = this.boardView.getBoundingBox()

        var progressTimer = new cc.ProgressTimer(new cc.Sprite("res/ProgressBar.png"));
        progressTimer.type = cc.ProgressTimer.TYPE_BAR
        //Đặt tâm ở điểm giữa trái. Ảnh của progressTimer sẽ thu về phía Midpoint.
        progressTimer.setMidpoint(cc.p(0.0,0.5))
        //Đặt tỷ lệ thay đổi của 2 chiều ngang, dọc.
        //chua ro
        progressTimer.setBarChangeRate(cc.p(1.0,0.0))
        //Đặt ban đầu 100%
        progressTimer.setPercentage(100)
        progressTimer.setScale((visibleSize.width*5)/(progressTimer.getContentSize().width*6))
        progressTimer.setPosition(visibleSize.width/2, board.y / 2)
        this.addChild(progressTimer)
        //Chạy đếm ngược từ 100% về 0% trong vòng 60 giây.
        //progressTimer.runAction(cc.ProgressFromTo.create(10,100,0))
        var to = cc.sequence(cc.progressTo(60, 0), cc.progressTo(0, 100));
        progressTimer.runAction(to.repeatForever())
    }
})