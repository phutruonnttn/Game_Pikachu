
var SettingsLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        // var sp = new cc.Sprite(res.loading_png);
        // sp.setScale(0.6)
        // sp.setPosition(250,400)
        // this.addChild(sp, 0, 1);

        var cacheImage = cc.textureCache.addImage(res.menuTitle_png);
        var title = new cc.Sprite(cacheImage, cc.rect(0, 0, 134, 39));
        title.x = winSize.width / 2;
        title.y = winSize.height - 120;
        this.addChild(title);


        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(18);
        var title1 = new cc.MenuItemFont("Sound");
        title1.setEnabled(false);
        title1.setColor(cc.color(MW.FONTCOLOR));

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(26);
        var item1 = new cc.MenuItemToggle(
            new cc.MenuItemFont("On"),new cc.MenuItemFont("Off"));
        item1.setCallback(this.onSoundControl );
        item1.setColor(cc.color(MW.WHITE_COLOR));
        var state = MW.SOUND ? 0 : 1;
        item1.setSelectedIndex(state);

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(18);
        var title2 = new cc.MenuItemFont("Mode");
        title2.setEnabled(false);
        title2.setColor(cc.color(MW.FONTCOLOR));

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(26);
        var item2 = new cc.MenuItemToggle(
            new cc.MenuItemFont("Easy"),
            new cc.MenuItemFont("Normal"),
            new cc.MenuItemFont("Hard"));
        item2.setColor(cc.color(MW.WHITE_COLOR));
        item2.setSelectedIndex(MW.CURRENT_MODE)
        item2.setCallback(this.onModeControl);


        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(18);
        var title3 = new cc.MenuItemFont("Movable");
        title3.setEnabled(false);
        title3.setColor(cc.color(MW.FONTCOLOR));

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(26);
        var item3 = new cc.MenuItemToggle(
            new cc.MenuItemFont("None"),
            new cc.MenuItemFont("Up"),
            new cc.MenuItemFont("Down"),
            new cc.MenuItemFont("Right"),
            new cc.MenuItemFont("Left"),
            new cc.MenuItemFont("Split top, bottom"),
            new cc.MenuItemFont("Split right,left"),
            new cc.MenuItemFont("Converge top, bottom"),
            new cc.MenuItemFont("Converge right, left"));
        // var item3 = new cc.MenuItemToggle()
        // for (var i = 0; i< MW.MOVE_PARAMS.length; i++){
        //     cc.MenuItemFont.setFontName("Arial");
        //     cc.MenuItemFont.setFontSize(26);
        //     item3.addSubItem(new cc.MenuItemFont(MW.MOVE_PARAMS[i].name))
        // }
        item3.setColor(cc.color(MW.WHITE_COLOR));
        item3.setSelectedIndex(MW.POKEMON_MOVE)
        item3.setCallback(this.onMovableControl);


        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(26);
        var label = new cc.LabelTTF("Go back", "Arial", 20);
        label.setColor(cc.color(MW.FONTCOLOR));
        var back = new cc.MenuItemLabel(label, this.onBackCallback);
        back.scale = 0.8;

        var menu = new cc.Menu(title1, title2, item1, item2, title3, item3, back);
        menu.alignItemsInColumns(2, 2, 1, 1, 1);
        this.addChild(menu);

        back.y -= 50;

        return true;
    },
    onBackCallback:function (pSender) {
        var scene = new cc.Scene();
        scene.addChild(new SysMenu());
	    cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
    onSoundControl:function(){
        MW.SOUND = !MW.SOUND;
        var audioEngine = cc.audioEngine;
        if(MW.SOUND){
            cc.audioEngine.playMusic(res.soundMain, true)
        }
        else{
            audioEngine.stopMusic();
	        audioEngine.stopAllEffects();
        }
    },
    onModeControl:function(){
        MW.CURRENT_MODE = this.getSelectedIndex()
        MW.NROWS = MW.MODE_PARAMS[MW.CURRENT_MODE].row
        MW.NCOLUMNS = MW.MODE_PARAMS[MW.CURRENT_MODE].column
        MW.NTYPES = MW.MODE_PARAMS[MW.CURRENT_MODE].typeNumber
        MW.N_EACH_OF_TYPE = MW.MODE_PARAMS[MW.CURRENT_MODE].eachOfType
    },
    onMovableControl: function (){
        MW.POKEMON_MOVE = this.getSelectedIndex()
    }
});
