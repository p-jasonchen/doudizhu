AI = {};

AI.analyzePlayerCards = function(player){
	var paiInfo =  player.getSortedPaiInfo(player.cardArray, player.findPaiCmpFunction) || {},
		paiInfoArray = paiInfo.paiInfoArray || [];	
}