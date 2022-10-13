
var GameVictory = cc.Layer.extend({
    _ship:null,
    _lbScore:0,

    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        var bg = new cc.Sprite(res.wallBg_png);
        bg.scale =0.2;
        bg.setPosition(250,305)
        this.addChild(bg, 0, 1);

        var sp = new cc.Sprite(res.gameVictory_png);
        sp.setPosition(245,570)
        sp.scale = 0.4;
        this.addChild(sp, 1, 1);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;

        var playAgainNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 3, 0, singalWidth, singalHeight));
        var playAgainSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 3, singalHeight, singalWidth, singalHeight));
        var playAgainDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 3, singalHeight * 2, singalWidth, singalHeight));

        var flare = new cc.Sprite(res.flare_jpg);
        this.addChild(flare);
        flare.visible = false;
        var playAgain = new cc.MenuItemSprite(playAgainNormal, playAgainSelected, playAgainDisabled, function(){
            flareEffect(flare,this,this.onPlayAgain);
        }.bind(this) );
        playAgain.scale = MW.SCALE;

        var menu = new cc.Menu(playAgain);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = 170;

        var lbScore = new cc.LabelTTF("Your time: "+MW.TIME+" s","Arial Bold",24);
        lbScore.x = 240;
        lbScore.y = 430;
        lbScore.color = cc.color(255,0,0);
        this.addChild(lbScore,10);

        var lbScore = new cc.LabelTTF("Mode: " + MW.MODE_NAME[MW.CURRENT_MODE] + " - " + MW.MOVE_PARAMS[MW.POKEMON_MOVE].name,"Arial Bold",24);
        lbScore.x = 240;
        lbScore.y = 385;
        lbScore.color = cc.color(255,0,0);
        this.addChild(lbScore,10);


        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(MW.SOUND_VOLUMN);
            cc.audioEngine.playMusic(res.soundMain, true)
        }
        return true;
    },
    onPlayAgain:function (pSender) {
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new GameLayerPokemon());
        scene.addChild(new GameControlMenu());
        cc.director.runScene(new cc.TransitionFade(1.2,scene));
    }
});
