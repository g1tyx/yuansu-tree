let modInfo = {
	name: "118元素周期表树",
	id: "Ignotus",
	author: "Ignotus",
	pointsName: "基本粒子",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "Beta v3.0",
	name: "这是个硬家伙",
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
		- 修复氢升级“氢气”“氢阳离子”效果为0的bug。<br>`

let winText = `恭喜你！你已经到达了Beta v5.0的结局！等待碳层级加入更多内容吧！`

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
	if(hasUpgrade("H",11)) gain = gain.mul(3)
	if(hasUpgrade("H",13)) gain = gain.mul(player.H.points.add(1).pow(0.2))
	if(hasUpgrade("He",11)) gain = gain.mul(8)
	if(hasUpgrade("He",13)) gain = gain.mul(upgradeEffect("He",13))
	if(player.B.unlocked) gain = gain.mul(format(tmp.B.ApowerEffect))
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
	return player.C.points.gte(new Decimal("1"))
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
	"当前残局:1碳",
]