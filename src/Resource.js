var res = {
    flare_jpg : 'res/flare.jpg',
    loading_png : 'res/loading.png',
    menu_png : 'res/menu.png',
    logo_png: '/res/logo.png',
    menuTitle_png : 'res/menuTitle.png',
    progressBar: 'res/ProgressBar.png',
    buttonEffet_mp3 : 'res/Music/buttonEffet.mp3',
    buttonEffet_ogg : 'res/Music/buttonEffet.ogg',
    buttonEffet_wav : 'res/Music/buttonEffet.wav',
    gameOver_png : 'res/gameOver.png',
    gameVictory_png: 'res/gameVictory.png',
    darkBg_png: 'res/backgroundDark.png',
    wallBg_png: 'res/backgroundWall.png',
    soundChoosePokemonEffect: 'res/Music/choose.mp3',
    soundRemovePokemonEffect: 'res/Music/remove.mp3',
    soundMain: 'res/Music/RiverFlowsInYou.mp3',
    pokemon0_plist: 'res/pokemon-0.plist',
    pokemon1_plist: 'res/pokemon-1.plist',
    pokemon2_plist: 'res/pokemon-2.plist',
    pokemon3_plist: 'res/pokemon-3.plist',
    pokemon4_plist: 'res/pokemon-4.plist',
    pokemon5_plist: 'res/pokemon-5.plist'
};

var g_mainmenu = [
    res.loading_png,
    res.logo_png,
    res.flare_jpg,
    res.menu_png,
    res.menuTitle_png,
    res.progressBar,
    res.soundChoosePokemonEffect,
    res.soundRemovePokemonEffect,
    res.soundMain
];

var g_maingame = [
    //effect
    res.buttonEffet_wav,
    res.buttonEffet_mp3,
    res.buttonEffet_ogg,
    res.gameOver_png,
    res.gameVictory_png,
    res.darkBg_png,
    res.wallBg_png
];

cc.spriteFrameCache.addSpriteFrames(res.pokemon0_plist)
cc.spriteFrameCache.addSpriteFrames(res.pokemon1_plist)
cc.spriteFrameCache.addSpriteFrames(res.pokemon2_plist)
cc.spriteFrameCache.addSpriteFrames(res.pokemon3_plist)
cc.spriteFrameCache.addSpriteFrames(res.pokemon4_plist)
cc.spriteFrameCache.addSpriteFrames(res.pokemon5_plist)
