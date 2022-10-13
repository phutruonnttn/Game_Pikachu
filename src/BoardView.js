var BoardView = cc.Layer.extend({
    // board: class Board
    // squareSize: Độ dài cạnh 1 ô vuông trong bàn chơi (pixel)
    // _width: Độ rộng của board view
    // _height: Độ dài của board view
    // pokemonImageTable: Bảng row x column sprite của từng pokemon

    createBoardView: function (board, timer){
        let boardView = new BoardView();
        boardView.board = board;
        boardView.squareSize = 0
        boardView._width = 0
        boardView._height = 0
        boardView.pokemonImageTable = {}
        boardView.checkExistSolution()
        boardView.showBoard()
        boardView.timer = timer
        return boardView;
    },

    showBoard: function (){
        this.removeAllChildren(true)
        let visibleSize = cc.Director.getInstance().getVisibleSize();
        this.squareSize = visibleSize.width / (this.board.getNColumns() + 2 * MW.SPACE_EACH_SIDE);
        this._width = this.squareSize * this.board.getNColumns();
        this._height = this.squareSize * this.board.getNRows();
        this.setContentSize(this._width, this._height);
        this.pokemonImageTable = [];
        for (var i = 0; i < this.board.getNRows(); i++) {
            this.pokemonImageTable[i] = [];
            for (var j = 0; j < this.board.getNColumns(); j++) {
                if (this.board.getPokemon(i,j) !== -1) {
                    this.pokemonImageTable[i][j] = this.addPokemon(i,j,this.board.getPokemon(i,j));
                    this.addChild(this.pokemonImageTable[i][j]);
                }
            }
        }
    },

    addPokemon: function (row, column, type){
        var pokemon = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(MW.PREFIX_NAME + type + MW.SUFFIX_NAME))
        pokemon.setScaleX(this.squareSize / pokemon.getContentSize().width);
        pokemon.setScaleY(this.squareSize / pokemon.getContentSize().height);
        var position = this.positionOf(row, column)
        pokemon.setPosition(position);
        pokemon.positonInBoard = cc.p(row, column)
        var self = this
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var touchLocation = cc.p(touch.getLocation().x - self.squareSize, touch.getLocation().y - (cc.Director.getInstance().getVisibleSize().height-self._height)/2)
                var target = event.getCurrentTarget() //target: pokemon
                if (cc.rectContainsPoint(target.getBoundingBox(), touchLocation)) {
                    var p = target.positonInBoard
                    self.removeChoosePokemonEffect();
                    if (self.board.selectPokemon(p.x, p.y)){
                        self.connectPokemons(self.board.getPreviousX(), self.board.getPreviousY(),p.x,p.y)
                        self.board.setPreviousX(-1)
                        self.board.setPreviousY(-1)
                        self.soundRemovePokemonEffect()
                    } else {
                        self.soundChoosePokemonEffect()
                        self.createChoosePokemonEffect(self.pokemonImageTable[p.x][p.y])
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
        pokemon.listener = listener
        cc.eventManager.addListener(listener, pokemon)
        return pokemon;
    },

    soundChoosePokemonEffect: function () {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(MW.SOUND_VOLUMN);
            cc.audioEngine.playMusic(res.soundChoosePokemonEffect, false)
        }
    },

    soundRemovePokemonEffect: function () {
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(MW.SOUND_VOLUMN);
            cc.audioEngine.playMusic(res.soundRemovePokemonEffect, false)
        }
    },

    positionOf: function (row, column){
        return cc.p(column * this.squareSize + this.squareSize/2, this._height - row *this.squareSize -this.squareSize/2);
    },

    createChoosePokemonEffectByParticle: function (pokemon) {
        var emitter = new cc.ParticleFlower()
        var square = pokemon.getBoundingBox()
        emitter.setPosition(square.x, square.y)
        emitter.setScale(0.2)
        // Tao hieu ung particle chay quanh pokemon
        var moveUp = cc.moveBy(MW.DURATION_MOVE_POKEMONS, cc.p(0, this.squareSize))
        var moveRight = cc.moveBy(MW.DURATION_MOVE_POKEMONS, cc.p(this.squareSize, 0))
        var moveDown = cc.moveBy(MW.DURATION_MOVE_POKEMONS, cc.p(0, -this.squareSize))
        var moveLeft = cc.moveBy(MW.DURATION_MOVE_POKEMONS, cc.p(-this.squareSize, 0))
        var sequence = cc.sequence(moveUp, moveRight, moveDown, moveLeft).repeatForever()
        emitter.runAction(sequence);
        // Chay hieu ung
        this.addChild(emitter, 2);
        emitter.setName(MW.NAME_CHOOSE_POKEMON);
    },

    removeChoosePokemonEffectByParticle: function (){
        if (this.getChildByName(MW.NAME_CHOOSE_POKEMON) != null) {
            this.removeChildByName(MW.NAME_CHOOSE_POKEMON)
        }
    },

    createChoosePokemonEffect: function (pokemon) {
        var tintTo = cc.tintTo(MW.DURATION_CHOOSE_EFFECT, MW.EFFECT_COLOR.r,MW.EFFECT_COLOR.g,MW.EFFECT_COLOR.b)
        var tintRevert = cc.tintTo(MW.DURATION_CHOOSE_EFFECT,MW.REVERT_COLOR.r,MW.REVERT_COLOR.g,MW.REVERT_COLOR.b)
        var sequence = cc.sequence(tintTo,tintRevert).repeatForever()
        pokemon.setName(MW.NAME_CHOOSE_POKEMON);
        pokemon.runAction(sequence)
    },

    removeChoosePokemonEffect: function (){
        while (this.getChildByName(MW.NAME_CHOOSE_POKEMON) != null) {
            this.getChildByName(MW.NAME_CHOOSE_POKEMON).stopAllActions()
            this.getChildByName(MW.NAME_CHOOSE_POKEMON).runAction(cc.tintTo(MW.DURATION_CHOOSE_EFFECT,MW.REVERT_COLOR.r,MW.REVERT_COLOR.g,MW.REVERT_COLOR.b))
            this.getChildByName(MW.NAME_CHOOSE_POKEMON).setName("")
        }
    },

    removePokemon: function (p){
        if (this.pokemonImageTable[p.x][p.y] == null) return false;
        this.board.removePokemon(p.x, p.y);
        this.removeChild(this.pokemonImageTable[p.x][p.y])
        return true;
    },

    connectPokemons: function (x,y,_x,_y){
        //1: Hieu ung noi 2 pokemon
        var connectEffect = this.getConnectEffect(x,y,_x,_y)
        //2: Hieu ung lam mo 2 pokemon
        var pokemonFade1 = cc.TargetedAction.create(this.pokemonImageTable[x][y], cc.FadeOut.create(MW.DURATION_FADE_POKEMONS))
        var pokemonFade2 = cc.TargetedAction.create(this.pokemonImageTable[_x][_y], cc.FadeOut.create(MW.DURATION_FADE_POKEMONS))
        var pokemonScale1 = cc.TargetedAction.create(this.pokemonImageTable[x][y], cc.ScaleTo.create(MW.DURATION_FADE_POKEMONS,0.0))
        var pokemonScale2 = cc.TargetedAction.create(this.pokemonImageTable[_x][_y], cc.ScaleTo.create(MW.DURATION_FADE_POKEMONS,0.0))
        var effectSpawn = cc.spawn(pokemonFade1, pokemonScale1,pokemonFade2,pokemonScale2)
        //3: Xoa 2 pokemon
        var removePokemon = cc.callFunc(function (target){
            this.removePokemon(cc.p(x,y));
            this.removePokemon(cc.p(_x,_y));
        }.bind(this))
        //4: Check con nuoc di tiep khong
        var checkSolution = cc.callFunc(function (target){
            this.checkExistSolution();
        }.bind(this))
        // var checkSolution = cc.callFunc( (target) =>{
        //     this.checkExistSolution();
        // })
        //5: Board run and Sequence
        var sequence
        if (MW.POKEMON_MOVE != MW.DONT_MOVE) {
            var moveBoard = cc.callFunc(function (targer) {
                this.moveBoard(MW.MOVE_PARAMS[MW.POKEMON_MOVE].splitDirection, MW.MOVE_PARAMS[MW.POKEMON_MOVE].direction);
            }.bind(this))
            sequence = cc.sequence(connectEffect, effectSpawn, removePokemon, moveBoard, checkSolution)
        } else {
            sequence = cc.sequence(connectEffect, effectSpawn, removePokemon, checkSolution)
        }

        this.runAction(sequence)
    },

    checkExistSolution: function (){
        if (this.board.countRemainingPokemon == 0) {
            this.onGameVictory()
        }
        var flag = false
        if (MW.POKEMON_MOVE != MW.DONT_MOVE) {
            while (!this.board.checkExistSolutionMovableInBoard()) {
                this.board.generateTablePokemons()
                flag = true
            }
        } else{
            while (!this.board.checkExistSolutionUnmovableInBoard()) {
                this.board.generateTablePokemons()
                flag = true
            }
        }
        if (flag) {
            this.showBoard()
        }
    },

    getConnectEffect: function (x,y,_x,_y){
        var path = this.board.findPath(x,y,_x,_y)
        var emitter = new cc.ParticleFlower()
        this.addChild(emitter)
        emitter.setScale(0.5)
        var duration = MW.DURATION_CONNECT_POKEMONS
        emitter.duration = duration
        emitter.setPosition(this.positionOf(path[0].x, path[0].y))
        var actions = []
        for (var i=1; i<path.length; i++){
            actions.push(cc.moveTo(duration/(path.length-1), this.positionOf(path[i].x, path[i].y)))
        }
        return cc.targetedAction(emitter, cc.sequence(actions))
    },

    showHint: function (){
        this.removeChoosePokemonEffect()
        var hint
        if (MW.POKEMON_MOVE != MW.DONT_MOVE) {
            hint = this.board.getHintMovableBoard()
        } else{
            hint = this.board.getHintUnmovableBoard()
        }
        var p1 = hint.first
        var p2 = hint.second
        this.createChoosePokemonEffect(this.pokemonImageTable[p1.x][p1.y])
        this.createChoosePokemonEffect(this.pokemonImageTable[p2.x][p2.y])
    },

    moveBoard: function (splitDirection, direction){
        var afterPosition = this.board.boardMove(splitDirection,direction)
        var tmpImageTable = this.pokemonImageTable.map((value) => value.slice())
        for (var i=0; i<this.board.getNRows(); i++){
            for (var j=0; j<this.board.getNColumns(); j++){
                if (afterPosition[i][j].x != -1 ) {
                    tmpImageTable[afterPosition[i][j].x][afterPosition[i][j].y] = this.pokemonImageTable[i][j]
                    tmpImageTable[afterPosition[i][j].x][afterPosition[i][j].y].positonInBoard = cc.p(afterPosition[i][j].x, afterPosition[i][j].y)

                    var move = cc.moveTo(MW.DURATION_MOVE_POKEMONS, this.positionOf(afterPosition[i][j].x,afterPosition[i][j].y))
                    this.pokemonImageTable[i][j].runAction(move)
                }
            }
        }
        this.pokemonImageTable = tmpImageTable.map((value) => value.slice())
    },

    onGameVictory: function () {
        MW.TIME = Math.floor((100-this.timer.getPercentage())*MW.TIME_COUNT_DOWN)/100
        cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new GameVictory())
        scene.addChild(new GameControlMenu());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
})