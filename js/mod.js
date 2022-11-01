let modInfo = {
	name: "118元素周期表树",
	id: "Ignotus",
	author: "Jing Wenxuan as a student from Tianjin Zili High School,Class3,Grade9",
	pointsName: "基本粒子",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "Beta v12.0",
	name: "镁丽的元素",
}

let changelog = `<h1>更新日志（作者Ignotus）:</h1><br>
	<h3>Beta v3.0“热气球气体和轻金属”</h3><br>
		- 加入氢、氦、锂层级。<br>
		- 梦开始的地方。<br>
	<h3>Beta v4.0“火箭材料！”</h3><br>
		- 加入铍层级。对锂层级增加3个升级、2个里程碑、1个挑战。<br>
		- 修复氢升级“氢气”“氢阳离子”效果为0的bug。<br>
		<h3>Beta v5.0“这是个硬家伙”</h3><br>
		- 加入硼层级并加入升级、里程碑。对铍层级增加4个里程碑。<br>
		<h3>Beta v6.0“哇！挖到钻石了！”</h3><br>
		- 加入碳层级并加入可购买、很多里程碑。<br>
		- 对每个层级加入了进度条用来显示距离下一层的进度。<br>
		<h3>Beta v7.0“氮气加速！”</h3><br>
		- 加入氮层级并加入升级、里程碑。<br>
		- 对碳层级加入更多的层级和阶层效果、软上限。<br>
		- 修复了锂层级进度条显示的bug。<br>
		- 修复了碳可购买“木炭能量增强器”效果为乘算而非指数的bug。<br>
		<h3>Beta v8.0“生命之源”</h3><br>
		- 加入氧层级并加入可购买。<br>
		- 对碳层级加入新机制石墨能量和石墨升级、软上限。<br>
		<h3>Beta v9.0“死亡杀手”</h3><br>
		- 加入氟层级并加入挑战。<br>
		- 对碳层级加入更多升级、里程碑、软上限。<br>
		- 对氧层级加入更多可购买和软上限。<br>
		- 降低氢层级升级价格。<br>
		- 修复Bug。<br>
		<h3>Beta v9.1“Super死亡杀手”</h3><br>
		- 修复初始氢获取为NaN的bug。<br>
		<h3>Beta v9.2“Ultra死亡杀手”</h3><br>
		- 修复初始碳获取为0的bug。<br>
		<h3>Beta v9.3“Ultimate死亡杀手”</h3><br>
		- 石墨升级style优化。<br>
		<h3>Beta v9.4“Ultimate死亡杀手^2”</h3><br>
		- 修复氧层级。<br>
		<h3>Beta v9.5“Ultimate死亡杀手^3”</h3><br>
		- 修复木炭能量获取bug和氮原子效果bug。<br>
		<h2>Beta v10.0“氖光管”</h2><br>
		- 加入氖层级并加入可购买、里程碑。<br>
		- 加入成就。<br>
		<h3>Beta v11.0“活泼金属”</h3><br>
		- 加入钠层级并加入研究、升级、精研树。<br>
		- 加入更多成就。<br>
		- 修复Bug。<br>
		<h3>Beta v11.1“更活泼金属”</h3><br>
		- 修复精研重置获取为负数时可重置的bug。<br>
		- 加入更多成就。<br>
		- 修复钠层升级成本错误的bug。<br>
		- 修复钠层升级无法自动重置氟和氖的bug。<br>
		<h3>Beta v12.0“镁丽的元素”</h3><br>
		- 加入镁层并加入很多机制。<br>
		- 加入配平。<br>
		- 扩充钠层级的精研树。<br>`
		

let winText = `恭喜你！你已经到达了Beta v12.0的结局！等待镁层级加入更多内容吧！`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade("H",11)) gain = gain.mul(upgradeEffect("H",11))
	if(hasUpgrade("H",13)) gain = gain.mul(player.H.points.add(1).pow(0.2))
	if(hasUpgrade("He",11)) gain = gain.mul(8)
	if(hasUpgrade("He",13)) gain = gain.mul(upgradeEffect("He",13))
	if(player.B.unlocked) gain = gain.mul(format(player.B.ApowerEffect))
	if(hasUpgrade("H",24)) gain = gain.mul(upgradeEffect("H",24))
	if((player.Na.layer1).gte(1)) gain = gain.mul(player.Na.rewardEffect1)
	if((getBuyableAmount("Na",32)).gte(1)) gain = gain.mul(buyableEffect("Na",32))
	if(getBuyableAmount("Na",52).gte(1)) gain = gain.mul(buyableEffect("Na",52).add(1))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.Mg.points.gte(new Decimal("1"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
var displayThings = [
	"<h4 style=color:#F0840C;text-shadow:0px 0px 10px;>*警告：当氢获取超过1e10000后，其获取量将会受到一重软上限限制！*<h4>",
	"当前残局:1铝(1e11451氢)",
	"*目前游戏处于Beta版本，如遇到bug或者平衡问题可联系qq2119542935*",
    function() {return "当前游戏进度：" + format(player.H.points.log10().div(new Decimal("1e11451").log10()).mul(100).min(100)) + "%"},
    
	
]