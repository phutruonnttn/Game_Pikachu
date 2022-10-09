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
        //16x16
        for (var i=0; i<32; i++){
            count.push(8)
        }
        var board = new Board(16, 16, 32, count)

        //4x4
        // for (var i=0; i<4; i++){
        //     count.push(4)
        // }
        // var board = new Board(4, 4, 4, count)

        //2x2
        // for (var i=0; i<2; i++){
        //     count.push(2)
        // }
        // var board = new Board(2, 2, 2, count)

        this.boardView = new BoardView().createBoardView(board)
        this.addChild(this.boardView, 1)
        var x = (cc.Director.getInstance().getVisibleSize().width - this.boardView.getContentSize().width) / 2;
        var y = (cc.Director.getInstance().getVisibleSize().height - this.boardView.getContentSize().height) / 2;
        this.boardView.setPosition(x, y);
    },
    showProgressTimer: function (){
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        let board = this.boardView.getBoundingBox()

        var progressTimer = new cc.ProgressTimer(new cc.Sprite("res/ProgressBar.png"));
        progressTimer.type = cc.ProgressTimer.TYPE_BAR
        //Đặt tâm ở điểm giữa trái. Ảnh của progressTimer sẽ thu về phía Midpoint.
        progressTimer.setMidpoint(cc.p(0.0,0.5))
        //Đặt tỷ lệ thay đổi của 2 chiều ngang, dọc.

        progressTimer.setBarChangeRate(cc.p(1.0,0.0))//chua ro

        //Đặt ban đầu 100%
        progressTimer.setPercentage(100)
        progressTimer.setScale(visibleSize.width/progressTimer.getContentSize().width)
        progressTimer.setPosition(visibleSize.width/2, board.y / 2)
        this.addChild(progressTimer)
        //Chạy đếm ngược từ 100% về 0% trong vòng 60 giây.
        //progressTimer.runAction(cc.ProgressFromTo.create(10,100,0))
        var to = cc.sequence(cc.progressTo(300, 0), cc.progressTo(0, 100));
        progressTimer.runAction(to.repeatForever())
    }
})