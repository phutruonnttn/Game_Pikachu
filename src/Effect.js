

var flareEffect = function (flare,target, callback) {
    flare.stopAllActions();
    flare.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    flare.attr({
	    x: -45,
	    y: MW.FLAREY,
	    visible: true,
	    opacity: 0,
		rotation: -120,
		scale: 0.3
	});

    var opacityAnim = cc.fadeTo(0.5, 255);
    var opacDim = cc.fadeTo(1, 0);
    var biggerEase = cc.scaleBy(0.7, 1.2, 1.2).easing(cc.easeSineOut());
    var easeMove = cc.moveBy(0.5, cc.p(490, 0)).easing(cc.easeSineOut());
    var rotateEase = cc.rotateBy(2.5, 90).easing(cc.easeExponentialOut());
    var bigger = cc.scaleTo(0.5, 1);

    var onComplete = cc.callFunc(callback, target);
    var killflare = cc.callFunc(function () {
        this.parent.removeChild(this,true);
    }, flare);
    flare.runAction(cc.sequence(opacityAnim, biggerEase, opacDim, killflare, onComplete));
    flare.runAction(easeMove);
    flare.runAction(rotateEase);
    flare.runAction(bigger);
};



