var client=require('./../lib/client');
var express = require('express');
var setlog=require('./../lib/log');
var router = express.Router();

router.get('/:user',function(req,res){
	var user=req.params.user;
	client.zincrby('slist',0,user,function(err,reply){
		var out={};
		if(reply) out['score']=+parseInt(reply);
		else out.score=0;
		setlog('server.log',"get "+user+"'s score")
		res.send(out);
	});
});
router.get('/leaders/:numbers',function(req,res){
	var num=parseInt(req.params.numbers);
	num=0-num;
	client.zrange('slist',num,-1,'WITHSCORES',function(err,repl){
		var rest={};
		for(var i=0;i<0-num;i++){
			var key=repl[i*2];
			var va=repl[i*2+1];
			rest[key]=va;
		}
		setlog('server.log','get '+(-num).toString()+' first score leader');
		res.send(rest);
	});
});
module.exports = router;
