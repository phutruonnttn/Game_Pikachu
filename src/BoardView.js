var BoardView = cc.Layer.extend({
    // board: class Board
    // squareSize: Độ dài cạnh 1 ô vuông trong bàn chơi (pixel)
    // _width: Độ rộng của board view
    // _height: Độ dài của board view
    // pokemons: Bảng row x column sprite của từng pokemon

    createBoardView: function (board){
        let boardView = new BoardView();
        boardView.board = board;
        boardView.squareSize = 0
        boardView._width = 0
        boardView._height = 0
        boardView.pokemons = {}
        boardView.showBoard();
        return boardView;
    },

    showBoard: function (){
        this.removeAllChildren(true)
        while (!this.board.checkExistSolution()) {
            this.board.generateTablePokemons()
        }
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        this.squareSize = visibleSize.width / (this.board.getNColumns() + 2);
        this._width = this.squareSize * this.board.getNColumns();
        this._height = this.squareSize * this.board.getNRows();
        this.setContentSize(this._width, this._height);
        this.pokemons = [];
        for (var i = 0; i < this.board.getNRows(); i++) {
            this.pokemons[i] = [];
            for (var j = 0; j < this.board.getNColumns(); j++) {
                if (this.board.getPokemon(i,j) !== -1) {
                    this.pokemons[i][j] = this.addPokemon(i,j,this.board.getPokemon(i,j));
                    this.addChild(this.pokemons[i][j]);
                }
            }
        }
    },

    addPokemon: function (row, column, type){
        var pokemon = new cc.Sprite("res/pokemon" + type + ".png");
        pokemon.setScaleX(this.squareSize / pokemon.getContentSize().width);
        pokemon.setScaleY(this.squareSize / pokemon.getContentSize().height);
        var position = this.positionOf(row, column)
        pokemon.setPosition(position);
        var self = this
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var touchLocation = cc.p(touch.getLocation().x - self.squareSize, touch.getLocation().y - (cc.Director.getInstance().getVisibleSize().height-self._height)/2)
                var target = event.getCurrentTarget() //target: pokemon
                if (cc.rectContainsPoint(target.getBoundingBox(), touchLocation)) {
                    var p = self.findRowAndColumnOfSprite(target)
                    self.removeChoosePokemonEffect();
                    if (self.board.selectPokemon(p.x, p.y)){
                        self.connectPokemons(self.board.getPreviousX(), self.board.getPreviousY(),p.x,p.y)
                        self.board.setPreviousX(-1)
                        self.board.setPreviousY(-1)
                        self.soundRemovePokemonEffect()
                    } else {
                        self.soundChoosePokemonEffect()
                        self.createChoosePokemonEffect(self.pokemons[p.x][p.y])
                        self.board.setPreviousX(p.x)
                        self.board.setPreviousY(p.y)
                    }
                    //nuot su kien
                    return true
                } else {
                    //chuyen su kien cho sprite pokemon tiep theo
                    return false;
                }
            }
        })
        cc.eventManager.addListener(listener, pokemon)
        return pokemon;
    },

    soundChoosePokemonEffect: function () {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.4);
            cc.audioEngine.playMusic("res/Music/choose.mp3", false)
        }
    },

    soundRemovePokemonEffect: function () {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.4);
            cc.audioEngine.playMusic("res/Music/remove.mp3", false)
        }
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

    createChoosePokemonEffect: function (pokemon) {
        var emitter = new cc.ParticleFlower()
        var square = pokemon.getBoundingBox()
        emitter.setPosition(square.x, square.y)
        emitter.setScale(0.2)
        // Tao hieu ung particle chay quanh pokemon
        var moveUp = cc.moveBy(0.2, cc.p(0, this.squareSize))
        var moveRight = cc.moveBy(0.2, cc.p(this.squareSize, 0))
        var moveDown = cc.moveBy(0.2, cc.p(0, -this.squareSize))
        var moveLeft = cc.moveBy(0.2, cc.p(-this.squareSize, 0))
        var sequence = cc.sequence(moveUp, moveRight, moveDown, moveLeft).repeatForever()
        emitter.runAction(sequence);
        // Chay hieu ung
        this.addChild(emitter, 2);
        emitter.setName("choosePokemon");
    },

    removeChoosePokemonEffect: function (){
        if (this.getChildByName("choosePokemon") != null) {
            this.removeChildByName("choosePokemon")
        }
    },

    removePokemon: function (p){
        if (this.pokemons[p.x][p.y] == null) return false;
        this.board.removePokemon(p.x, p.y);
        this.removeChild(this.pokemons[p.x][p.y])
        return true;
    },

    connectPokemons: function (x,y,_x,_y){
        //1: Hieu ung noi 2 pokemon
        var connectEffect = this.getConnectEffect(x,y,_x,_y)
        //2: Hieu ung lam mo 2 pokemon
        var pokemonFade1 = cc.TargetedAction.create(this.pokemons[x][y], cc.FadeOut.create(0.3))
        var pokemonFade2 = cc.TargetedAction.create(this.pokemons[_x][_y], cc.FadeOut.create(0.3))
        var effectSpawn = cc.spawn(pokemonFade1,pokemonFade2)
        //3: Xoa 2 pokemon
        var removePokemon1 = cc.callFunc(function (target){
            this.removePokemon(cc.p(x,y));
        }.bind(this))
        var removePokemon2 = cc.callFunc(function (target){
            this.removePokemon(cc.p(_x,_y));
        }.bind(this))
        var removePokemonSpawn = cc.spawn(removePokemon1, removePokemon2)
        //4: Check con nuoc di tiep khong
        var checkSolution = cc.callFunc(this.checkExistSolution, this)
        //5: removeChoosePokemonEffect
        //callFunc(this.removeChoosePokemonEffect)
        // Sequence (1,2,3,4...)
        var sequence = cc.sequence(connectEffect, effectSpawn, removePokemonSpawn, checkSolution)
        this.runAction(sequence)
    },

    checkExistSolution: function (target){
        if (!target.board.checkExistSolution()) {
            target.board.generateTablePokemons()
            target.showBoard()
        }
    },

    getConnectEffect: function (x,y,_x,_y){
        var path = this.board.findPath(x,y,_x,_y)
        var emitter = new cc.ParticleFlower()
        this.addChild(emitter)
        emitter.setScale(0.5)
        var duration = 0.5
        emitter.duration = duration
        emitter.setPosition(this.positionOf(path[0].x, path[0].y))
        var actions = []
        for (var i=1; i<path.length; i++){
            actions.push(cc.moveTo(duration/(path.length-1), this.positionOf(path[i].x, path[i].y)))
        }
        return cc.targetedAction(emitter, cc.sequence(actions))
    }
})