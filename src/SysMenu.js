

var SysMenu = cc.Layer.extend({
    _ship:null,

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);

        winSize = cc.director.getWinSize();

        this.initBackGround();

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;
        var newGameNormal = new cc.Sprite(res.menu_png, cc.rect(0, 0, singalWidth, singalHeight));
        var newGameSelected = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight, singalWidth, singalHeight));
        var newGameDisabled = new cc.Sprite(res.menu_png, cc.rect(0, singalHeight * 2, singalWidth, singalHeight));

        var gameSettingsNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth, 0, singalWidth, singalHeight));
        var gameSettingsSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight, singalWidth, singalHeight));
        var gameSettingsDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth, singalHeight * 2, singalWidth, singalHeight));

        var aboutNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, 0, singalWidth, singalHeight));
        var aboutSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight, singalWidth, singalHeight));
        var aboutDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 2, singalHeight * 2, singalWidth, singalHeight));
        var flare = new cc.Sprite(res.flare_jpg);
        this.addChild(flare, 15, 10);
        flare.visible = false;
        var newGame = new cc.MenuItemSprite(newGameNormal, newGameSelected, newGameDisabled, function () {
            this.onButtonEffect();
            //this.onNewGame();
            flareEffect(flare, this, this.onNewGame);
        }.bind(this));
        var gameSettings = new cc.MenuItemSprite(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);
        var about = new cc.MenuItemSprite(aboutNormal, aboutSelected, aboutDisabled, this.onAbout, this);
        newGame.scale = MW.SCALE;
        gameSettings.scale = MW.SCALE;
        about.scale = MW.SCALE;

        var menu = new cc.Menu(newGame, gameSettings, about);
        menu.alignItemsVerticallyWithPadding(15);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2 - 140;

        var label = new cc.LabelTTF("Power by Cocos2d-JS", "Arial", 21);
        label.setColor(cc.color(MW.FONTCOLOR));
        this.addChild(label, 1);
        label.x = winSize.width  / 2;
        label.y = 80;

        // this.schedule(this.update, 0.1);
        //
        // this._ship = new cc.Sprite("#ship03.png");
        // this.addChild(this._ship, 0, 4);
        // this._ship.x = Math.random() * winSize.width;
        // this._ship.y = 0;
        // this._ship.runAction(cc.moveBy(2, cc.p(Math.random() * winSize.width, this._ship.y + winSize.height + 100)));
        //
        // if (MW.SOUND) {
        //     cc.audioEngine.setMusicVolume(0.7);
        //     cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.mainMainMusic_wav : res.mainMainMusic_mp3, true);
        // }

        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.4);
            cc.audioEngine.playMusic("res/Music/RiverFlowsInYou.mp3", true)
        }

        return true;
    },
    initBackGround:function()
    {
        //Add code here
        var loading = cc.Sprite("res/loading.png");
        var logo = cc.Sprite("/res/logo.png")
        //var logoBack = cc.Sprite("/res/logoBack.png")
        loading.setScale(0.6)
        loading.setPosition(250,400)
        logo.setScale(0.4)
        logo.setPosition(330,650)
        // logoBack.setScale(1.5)
        // logoBack.setPosition(250,550)
        this.addChild(loading)
        //this.addChild(logoBack)
        this.addChild(logo)
    },

    onNewGame:function (pSender) {
        //load resources
        cc.LoaderScene.preload(g_maingame, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new cc.Scene();
            //scene.addChild(new GameLayer());
            scene.addChild(new GameLayerPokemon());
            scene.addChild(new GameControlMenu());
	        cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },
    onSettings:function (pSender) {
        this.onButtonEffect();
        var scene = new cc.Scene();
        scene.addChild(new SettingsLayer());
	    cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
    onAbout:function (pSender) {
        this.onButtonEffect();
        var scene = new cc.Scene();
        scene.addChild(new AboutLayer());
	    cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
    // update:function () {
    //     if (this._ship.y > 750) {
    //         this._ship.x = Math.random() * winSize.width;
	//         this._ship.y = 10;
    //         this._ship.runAction(cc.moveBy(
    //             parseInt(5 * Math.random(), 10),
    //             cc.p(Math.random() * winSize.width, this._ship.y + 750)
    //         ));
    //     }
    // },
    onButtonEffect:function(){
        if (MW.SOUND) {
            var s = cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_WINRT ? res.buttonEffet_wav : res.buttonEffet_mp3);
        }
    }
});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
};
