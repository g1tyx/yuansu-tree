 addLayer("H", {
    name: "氢", // This is optional, only used in a few places, If absent it just uses the layer id.currency
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    
    color: "#6495ED",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "氢", // Name of prestige currency
    infoboxes: {
        introBox: {
                title: "1号元素-氢",
                body(){
                        let a = "欢迎来到118元素之树！"
                        let b = "如你所见，这个元素周期表是从氢元素开始的。"
                        let c = "氢（Hydrogenium），是一种化学元素，元素符号H，" + "位于元素周期表第一位。"
                        let d = "氢通常的单质形态是氢气，无色无味无臭 \"的气体，\", 是目前人类所发现最轻的气体"
                        let e = "氢气是易燃易爆的气体！ "
                        e += "氢气的爆炸极限为4.0~74.2%（氢气的体积占混合气总体积比"
                        let f = "在地壳里，如果按质量计算，氢只占总质量的1%，而如果按原子百分数计算，则占17%。"
                        let g = "氢在自然界中分布很广，水便是氢的“仓库”——氢在水中的质量分数为11%；泥土中约有1.5%的氢；" 
                        let h = "在太阳的大气中，按原子百分数计算，氢占81.75%。在宇宙空间中，氢原子的数目比其他所有元素原子的总和约大100倍。"
                        let i = "你现在正在每秒获得一些基本粒子。试着通过重置将基本粒子聚合成氢元素吧！"

                        return a + b + c + " " + d + e + f + g + h + i
                },
        },
},
    baseResource: "points", // Name of resource prestige is based on
    marked(){return hasUpgrade("Mg",31)},
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = ["unlocked", "auto"]
            if (resettingLayer == "He") {
                if (hasMilestone("He", 0)) {kept.push("upgrades")}
            }
            if (resettingLayer == "Li") {
                if (hasMilestone("Li", 0)) {kept.push("upgrades")}
            }
            layerDataReset(this.layer, kept)
        }
    },
    softcap() {
        let sc = new Decimal("1e10000")
        return sc;
    },
    softcapPower() {
        let scp = 0.25;
        return scp;
    },
    bars: {
        NextCD: {
            direction: RIGHT,
            width: 700,
            height: 30,
            fillStyle: {'background-color' : "#E0FFFF"},
            req() {
                let req =new Decimal(200)
                return req
            },
            display() {
                let f = player.points.add(1).max(1)
                let r = "到达" + format(this.req()) + " 基本粒子以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                
                return r
            },
            progress() { 
                let f = player.points.add(1).max(1)
                let p = f.log10().div(this.req().log10())
                return p
            },
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("H",12)) mult = mult.mul(2)
        if(hasUpgrade("H",14)) mult = mult.mul(player.H.points.add(1).pow(0.15))
        mult = mult.mul(format(tmp.Li.effect))
        mult = mult.mul(format(tmp.Be.effect))
        if(player.B.unlocked) mult = mult.mul(format(player.B.BpowerEffect))
        if(player.C.unlocked) mult = mult.mul(format(tmp.C.effect))
        if(player.N.unlocked) mult = mult.mul(format(tmp.N.Effect))
        if(hasMilestone("C",9)) mult = mult.mul(1e6)
        if(player.O.points.gte(10)) mult = mult.mul(format(player.O.OpowerEff2))
        if(hasMilestone("C",11)) mult = mult.mul(1e20)
        if(getBuyableAmount("O",12).gte(1))mult = mult.mul(buyableEffect("O",12))
        if(getBuyableAmount("O",13).gte(1)) mult = mult.mul(buyableEffect("O",13))
        if(hasUpgrade("H",24)) mult = mult.mul(upgradeEffect("H",24))
        if(getBuyableAmount("Be",11).gte(1)) mult = mult.mul(buyableEffect("Be",11))
        if((getBuyableAmount("Ne",11).gte(1))&&(hasMilestone("Ne",3))) mult = mult.mul(buyableEffect("Ne",11).pow(1.3))
        if((getBuyableAmount("Ne",21).gte(1))&&(hasMilestone("Ne",3))) mult = mult.mul(buyableEffect("Ne",21).pow(1.3))
        if((getBuyableAmount("Ne",31).gte(1))&&(hasMilestone("Ne",3))) mult = mult.mul(buyableEffect("Ne",31).pow(1.3))
        if((getBuyableAmount("Ne",41).gte(1))&&(hasMilestone("Ne",3))) mult = mult.mul(buyableEffect("Ne",41).pow(1.3))
        if((getBuyableAmount("Ne",51).gte(1))&&(hasMilestone("Ne",3))) mult = mult.mul(buyableEffect("Ne",51).pow(1.3))
        if((getBuyableAmount("Ne",61).gte(1))&&(hasMilestone("Ne",3))) mult = mult.mul(buyableEffect("Ne",61).pow(1.3))
        if((player.Na.layer1).gte(1)) mult = mult.mul(player.Na.rewardEffect1)
        if((getBuyableAmount("Na",32)).gte(1)) mult = mult.mul(buyableEffect("Na",32))
        if(hasUpgrade("Mg",12)) mult = mult.mul(10000)
        if(getBuyableAmount("Na",52).gte(1)) mult = mult.mul(buyableEffect("Na",52).add(1))
        if(hasUpgrade("Mg",31)) mult = mult.mul(1e100)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (inChallenge('Li',11)) exp = exp.times(0.8)
        if (hasChallenge('Li',11)) exp = exp.times(1.1)
        if (hasUpgrade("Li",11)) exp = exp.times(1.05)
        if (hasUpgrade("Li",12)) exp = exp.times(1.05)
            if(hasUpgrade("Mg",31)) exp = exp.mul(1.3)
        
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: 重置获得氢", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration(){return hasMilestone('He',1)? 1 : 0},
    effectDescription(){
    if (hasUpgrade("Mg",31)) return "<h1 style=color:#FFFFFF;text-shadow:0px 0px 10px;>*超纯<h1>"},
    
    
        upgrades: { // Streaming
            11: {
                title: "氢原子(H)",
                description: "提升3.00x基本粒子获取",
                cost: new Decimal(2),
                effect(){ let eff = new Decimal(3)
                if(hasUpgrade("H",21)) eff = eff.mul(upgradeEffect("H",21))
                if(hasUpgrade("Mg",31)) eff = new Decimal(1e10)
            return eff},
                effectDisplay(){return `x${format(this.effect())}`}
                },
           
            12: {
                title: "氢阴离子(H-)",
                description: "提升2.00x氢获取",
                cost: new Decimal(2),
                        effect(){if(!hasUpgrade("Mg",12)) return new Decimal(2)
                        if(hasUpgrade("Mg",12))return new Decimal(1)},
                        effectDisplay(){return `x${format(this.effect())}`}
                },
            13: {
                title: "氢阳离子(H+)",
                description: "氢提升基本粒子获取",
                cost: new Decimal(2),
                        effect(){eff = player.H.points.pow(0.2)
                        if (eff>1e80) eff = new Decimal(1e80).mul(eff.div(1e80).root(5))
                        if(hasUpgrade("Mg",31)) eff = new Decimal(1e300)
                    return eff},
                        effectDisplay(){if (upgradeEffect("H",13)<1e80) return `x${format(this.effect())}`
                        if (upgradeEffect("H",13)>1e80) return `x${format(this.effect())}(已达软上限)`}
                },
            14: {
                    title: "氢气(H₂)",
                    description: "上一个升级以削弱的效果提升氢获取",
                    cost: new Decimal(2),
                    effect(){
                                let eff = player.H.points.pow(0.15)
                            if(hasUpgrade("He",12)) eff = eff.mul(upgradeEffect("He",12))
                            if((player.Na.layer2).gte(1)) eff = eff.mul(player.Na.rewardEffect2)
                            if (eff>1e80) eff = new Decimal(1e80).mul(eff.div(1e80).root(5))
                            if(hasUpgrade("Mg",13)) eff = eff.pow(0)
                             return eff
                        },
                            effectDisplay(){if (upgradeEffect("H",14)<1e80)return `x${format(this.effect())}`
                            if (upgradeEffect("H",14)>1e80) return `x${format(this.effect())}(已达软上限)`}
                },
            21: {
                title: "氘气(D₂)",
                description: "每提升1次阶层，氢原子效果翻4倍",
                cost: new Decimal("1e660"),
                effect(){
                            let eff = new Decimal(4).pow(player.C.Tier)
                            if(hasUpgrade("Mg",31)) eff = new Decimal(1e10)
                         return eff
                    },
                        effectDisplay(){return `x${format(this.effect())}`
            },
            unlocked(){return getBuyableAmount("Ne",11).gte(50)}
        },
        
        22: {
            title: "半重水(HDO)",
            description: "每秒自动获得氧，数量为重置可获得氧的10000%",
            cost: new Decimal("1e680"),
            effect(){
                        let eff = new Decimal(10000)
                     return eff
                },
                    effectDisplay(){return `${format(this.effect())}%`
        },
        unlocked(){return getBuyableAmount("Ne",11).gte(70)}
    },
    23: {
        title: "重水(T₂O)",
        description: "氟效应翻倍且倍增不纯的氖气获取",
        cost: new Decimal("1e700"),
        effect(){
                    let eff = new Decimal(2)
                    if(hasUpgrade("Mg",31)) eff = new Decimal(10)
                 return eff
            },
                effectDisplay(){return `x${format(this.effect())}`
    },
    unlocked(){return getBuyableAmount("Ne",11).gte(85)}
    },

24: {
    title: "超重水(T₂O)",
    description: "氖气以降低的效率加成自身获取，且以同样的效率提升基本粒子、氢、硼烷、碳、木炭能量、石墨能量、氧获取",
    cost: new Decimal("1e800"),
    effect(){
                let eff = player.Ne.power.log10().sqrt()
                if(hasUpgrade("Na",15)) eff = eff.mul(upgradeEffect("Na",15))
                if(hasUpgrade("Mg",31)) eff = new Decimal(30)
             return eff
        },
            effectDisplay(){return `x${format(this.effect())}`
},
unlocked(){return getBuyableAmount("Ne",11).gte(100)}
},
    },
            tabFormat:{
                "Main":{
                    content:[ "main-display",
                    "prestige-button",
                ["bar", "NextCD"],
                ["infobox","introBox"],
            
"blank",
"milestones",
"upgrades",
"challenges",
"buyables",

"blank",
, "blank", "blank", ]
                },
            },})
addLayer("He", {
        name: "氦", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "He", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                    unlocked: false,
                    points: new Decimal(0),
        }},
        color: "#E0FFFF",
        requires: new Decimal(200), // Can be a function that takes requirement increases into account
        resource: "氦", // Name of prestige currency
        baseResource: "基本粒子", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.7, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if(hasUpgrade("He",14)) mult = mult.mul(upgradeEffect("He", 14))
            if(player.B.unlocked) mult = mult.mul(format(player.B.CpowerEffect))
            if(hasUpgrade("H",24)) mult = mult.mul(upgradeEffect("H",24))
            if(getBuyableAmount("Be",11).gte(1)) mult = mult.mul(buyableEffect("Be",11))
            if((getBuyableAmount("Ne",11).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",11))
        if((getBuyableAmount("Ne",21).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",21))
        if((getBuyableAmount("Ne",31).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",31))
        if((getBuyableAmount("Ne",41).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",41))
        if((getBuyableAmount("Ne",51).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",51))
        if((getBuyableAmount("Ne",61).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",61))
        if(player.Na.layer2.gte(11)) mult = mult.mul(player.Na.rewardEffect3)
             return mult
                },
                branches:["H"],
                gainExp() { // Calculate the exponent on main currency from bonuses
                    exp = new Decimal(1)
                    if (hasUpgrade("Li",13)) exp = exp.times(1.05)
                    if (hasUpgrade("He",22)) exp = exp.add(0.2)
                    return exp

                },
                row: 1, // Row the layer is in on the tree (0 is the first row)
                hotkeys: [
                    {key: "j", description: "J: 重置获得氦", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                ],
                layerShown(){return player.H.unlocked},
                bars: {
                    NextCD: {
                        direction: RIGHT,
                        width: 700,
                        height: 30,
                        fillStyle: {'background-color' : "#DCDCDC"},
                        req() {
                            let req =new Decimal(1000)
                            return req
                        },
                        display() {
                            let f = player.H.points.add(1).max(1)
                            let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                            
                            return r
                        },
                        progress() { 
                            let f = player.H.points.add(1).max(1)
                            let p = f.log10().div(this.req().log10())
                            return p
                        },
                    },
                },
                
                infoboxes: {
                    introBox: {
                            title: "2号元素-氦",
                            body(){
                                    let a = "你已经收集了200个基本粒子，足够聚变生成一个氦原子了！"
                                    let b = "请注意，聚变生成氦原子将会消耗你的所有氢原子、氢升级和质子！"
                                    let c = "氦（Helium），最不活泼的元素，元素符号He，为稀有气体的一种。"
                                    let d = "氦在通常情况下为无色、无味的气体，是唯一不能在标准大气压下固化的物质。"
                                    let e = "热气球里面所充填的通常是氦气！ "
                                    e += "氦的元素名来源于希腊文，原意是“太阳”。1868年法国的杨森利用分光镜观察太阳表面，发现一条新的黄色谱线，并认为是属于太阳上的某个未知元素，故名氦。"
                                    let f = "氦存在于整个宇宙中，按质量计占23%，仅次于氢。"
                                    let g = "在自然界中主要存在于天然气体或放射性矿石中。在地球的大气层中，氦的浓度十分低，只有5.2万分之一。" 
                                    let h = "地球上的氦主要是放射性元素衰变的产物，α粒子就是氦的原子核。在工业中可由含氦达7%的天然气中提取。也可由液态空气中用分馏法从氦氖混合气体中制得。"
                                    let i = "试着通过重置将全部质子、氢原子聚合成氦元素吧！"
            
                                    return a + b + c + " " + d + e + f + g + h + i
                            },
                    },
            },
            milestones: {
                0: {
                    requirementDescription: "氦气集气瓶(1氦)",
                    effectDescription: "在重置后保留所有氢升级",
                    done() {
                        return player.He.points.gte(1)
                    }
                },
                1: {
                    requirementDescription: "工业氦气罐(5氦)",
                    effectDescription: "每秒获取50%重置可获得的氢",
                    done() {
                        return player.He.points.gte(5)

                    }}},
                    passiveGeneration(){return hasMilestone('Be',1)? 1 : 0},
                
                    upgrades: { // Streaming
                        11: {
                            title: "氦气(He)",
                            description: "提升8.00x基本粒子获取",
                            cost: new Decimal(1),
                            effect(){return new Decimal(8)},
                            effectDisplay(){return `x${format(this.effect())}`}
                            },
                       
                        12: {
                            title: "氢化氦(HeH₂)",
                            description: "基本粒子提升氢气(H₂)效果",
                            cost: new Decimal(10),
                                    effect(){let eff = player.points.pow(0.2)
                                    if (player.B.unlocked) eff = eff.mul(format(player.B.CpowerEffect))
                                return eff
                            },
                                    effectDisplay(){return `x${format(this.effect())}`}
                            },
                        13: {
                            title: "氢合氦离子(HeH+)",
                            description: "氦提升基本粒子获取",
                            cost: new Decimal(30),
                                    effect(){return player.He.points.pow(0.2).add(1)},
                                    effectDisplay(){return `x${format(this.effect())}`}
                            },
                        14: {
                                title: "(氦-4(He-4))",
                                description: "氢提升氦获取",
                                cost: new Decimal(50),
                                        effect(){return player.H.points.pow(0.1).add(1)},
                                        effectDisplay(){return `x${format(this.effect())}`},
                            },
                            21: {
                                title: "(氦-6(He-6))",
                                description: "上方升级效果平方且对木炭能量生效",
                                cost: new Decimal(1e170),
                                        effect(){return new Decimal(64)},
                                        effectDisplay(){return `x${format(this.effect())}`},
                                        unlocked(){return getBuyableAmount("Ne",21).gte(12)}
                            },
                            22: {
                                title: "(氦-7(He-7))",
                                description: "氦获取指数+0.2",
                                cost: new Decimal(1e200),
                                        effect(){return new Decimal(0.2)},
                                        effectDisplay(){return `x${format(this.effect())}`},
                                        unlocked(){return getBuyableAmount("Ne",21).gte(20)}
                            },
                            23: {
                                title: "(氦-8(He-8))",
                                description: "氦-3同时生效于氧获取且获得10个免费的氦-3",
                                cost: new Decimal(1e230),
                                        effect(){return new Decimal(10)},
                                        effectDisplay(){return `+${format(this.effect())}`},
                                        unlocked(){return getBuyableAmount("Ne",21).gte(30)}
                            },
                        },
                        buyables: {
                            11: {
                              title: "氦-3(He-3)",
                              cost(x) {return new Decimal(1e250).mul(new Decimal(200).pow(x)).floor()},
                              canAfford() { return player.He.points.gte(this.cost())},
                              buy() {
                                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                              },
                              display() {return `(*不消耗氦)一种拥有巨大潜力的新型能源，在月球上有巨大储备。\n持有氦-3分子数目： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}氦\n效果：木炭能量、碳获取*${format(this.effect())}倍`},
                              effect(x) { 
                                if(!hasUpgrade("He",23))mult2 = new Decimal(x).add(1).pow(0.7)
                                if(hasUpgrade("He",23))mult2 = new Decimal((x).add(10)).add(1).pow(0.7)
                                if((player.Na.layer2).gte(11)) mult2 = mult2.mul(player.Na.rewardEffect3.pow(0.3))
                                return new Decimal(mult2)},
                              unlocked(){return getBuyableAmount("Ne",21).gte(6)}
                            },
                        },
                        tabFormat:{
                            "Main":{
                                content:[ "main-display",
                                "prestige-button",
                            ["bar", "NextCD"],
                            ["infobox","introBox"],
                        
        "blank",
        "milestones",
        "upgrades",
        "challenges",
        "buyables",
        
        "blank",
        , "blank", "blank", ]
                            },
                        },})
        addLayer("Li", {
                 name: "锂", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "Li", // This appears on the layer's node. Default is the id with the first letter capitalized
               position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
                startData() { return {
                        unlocked: false,
                     points: new Decimal(0),
                 }},
                 
                 effect(){let effect = player.Li.points.pow(2.5).add(1)
                   if (hasMilestone('Be',3)) effect = effect.pow(2)
                   return effect
                  } ,
                 effectDisplay(){return `提升氢获取x${format(this.effect())}`}
            
               ,color: "#DCDCDC",
                             requires: new Decimal(1000), // Can be a function that takes requirement increases into account
                    resource: "锂", // Name of prestige currency
                  baseResource: "氢", // Name of resource prestige is based on
                    baseAmount() {return player.H.points}, // Get the current amount of baseResource
                type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
             exponent(){let exp = new Decimal(3)
               if (hasMilestone("B", 2))exp = exp.minus(0.5)
               return exp


             }, // Prestige currency exponent
            
            effectDescription() {
                return "倍增氢获取 " + format(tmp.Li.effect) + "x"
            },
           gainMult() { // Calculate the multiplier for main currency from bonuses
             mult = new Decimal(1)
             if (hasChallenge("Li",12)) mult = mult.mul(new Decimal(1.5).pow(challengeCompletions("Li",12)))
             
              return mult
                      },
                      milestones: {
                        0: {
                            requirementDescription: "7号锂电池(1锂)",
                            effectDescription: "在重置时保持所有氢升级",
                            done() {
                                return player.Li.points.gte(1)

                            }
                        },
                        1: {
                            requirementDescription: "5号锂电池(3锂)",
                            effectDescription: "解锁3个锂升级",
                            done() {
                                return player.Li.points.gte(3)

                                }
                            }}
                      ,gainExp() { // Calculate the exponent on main currency from bonuses
                          return new Decimal(1)
                        },
                                    row: 1, // Row the layer is in on the tree (0 is the first row)
                                    hotkeys: [
                                        {key: "k", description: "K: 重置获得锂", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                                    ],
                                    layerShown(){return player.He.unlocked},
                                    bars: {
                                        NextCD: {
                                            direction: RIGHT,
                                            width: 700,
                                            height: 30,
                                            fillStyle: {'background-color' : "#808000"},
                                            req() {
                                                let req =new Decimal(1e8)
                                                return req
                                            },
                                            display() {
                                                let f = player.H.points.add(1).max(1)
                                                let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                
                                                return r
                                            },
                                            progress() { 
                                                let f = player.points.add(1).max(1)
                                                let p = f.log10().div(this.req().log10())
                                                return p
                                            },
                                        },
                                    },
                                    infoboxes: {
                                        introBox: {
                                                title: "3号元素-锂",
                                                body(){
                                                        let a = "你已经收集了1000个基本粒子，足够聚变生成一个锂原子了！"
                                                        let b = "请注意，聚变生成锂原子将会消耗你的所有氢原子、氢升级和质子！"
                                                        let c = "锂（Lithium）是一种金属元素，元素符号为Li，对应的单质为银白色质软金属，也是密度最小的金属。"
                                                        let d = "用于原子反应堆、制轻合金及电池等。"
                                                        let e = "由于电极电势最负，锂是已知元素（包括放射性元素）中金属活动性最强的。 "
                                                        e += "锂的密度非常小，仅有0.534g/cm³，为非气态单质中最小的一个。"
                                                        let f = "锂的焰色反应为紫红色。"
                                                        let g = "天然锂有两种同位素：锂-6和锂-7。" 
                                                        let h = "在自然界中，锂主要以锂辉石、锂云母及磷铝石矿的形式存在。"
                                                        let i = "试着通过重置将全部质子、氢原子聚合成锂元素吧！"
                                
                                                        return a + b + c + " " + d + e + f + g + h + i
                                                },
                                        },
                                },
                                branches:["H"],
                                resetsNothing() { return hasMilestone("B",4)},
                                challenges:{
                                11: {
                                    name: "轻型锂合金",
                                    challengeDescription: "基本粒子获取^0.8 . ",
                                    canComplete(){return player.H.points.gte("100000")},
                                    goalDescription: "100,000氢",
                                    rewardDescription(){return "氢获取^1.1。"},
                                  unlocked(){return true},
                                },
                                12: {
                                    name: "氮化锂(Li3N)",
                                    currencyDisplayName: "木炭能量",
                                    currencyInternalName: "Cpower",
                                    currencyLayer: "C",
                                    challengeDescription: function() {
                                        let c11 = "时间速度效果/1e100"
                                        if (inChallenge("Li", 12)) c11 = c11 + " (挑战中)"
                                        if (challengeCompletions("Li", 12) == 1) c11 = c11 + " (已完成)"
                                        c11 = c11 + "<br>分子数目:" + challengeCompletions("Li",12) + "/" + tmp.Li.challenges[12].completionLimit
                                        return c11
                                    },
                                    goal(){
                                        if (challengeCompletions("Li", 12) == 0) return Decimal.pow(10,100);
                                        if (challengeCompletions("Li", 12) == 1) return Decimal.pow(10,113);
                                        if (challengeCompletions("Li", 12) == 2) return Decimal.pow(10,130);
                                    },
                                    completionLimit:3 ,

                                    rewardDescription: "提升锂获取",
                                    rewardEffect() {
                                        let c11 = new Decimal(1.5)
                                        let c11c = new Decimal(challengeCompletions("Li", 12))
                                        c11 = c11.pow(c11c)
                                        return c11
                                   },
                                   rewardDisplay() {return "*"+format(tmp.Li.challenges[12].rewardEffect)+""},
                                    onEnter() { 
                                            startCChallenge()
                                        
                                    },
                                    unlocked(){
                                        return (getBuyableAmount("Ne",31).gte(5))
                                    }
                                },
                            },
                            autoPrestige() { return hasMilestone("B",1)},
                         
                                    
                                        upgrades: { // Streaming
                                            11: {
                                                title: "锂原子(Li)",
                                                description: "提升氢获取指数",
                                                cost: new Decimal(3),
                                                effect(){return new Decimal(1.05)},
                                                effectDisplay(){return `^${format(this.effect())}`},
                                                unlocked(){return hasMilestone("Li",1)}
                                                },
                                           
                                            12: {
                                                title: "锂离子(Li+)",
                                                description: "提升氢获取指数",
                                                cost: new Decimal(4),
                                                        effect(){return new Decimal(1.05)},
                                                        effectDisplay(){return `^${format(this.effect())}`},
                                                        unlocked(){return hasMilestone("Li",1)}
                                                },
                                            13: {
                                                    title: "氢化锂(LiH)",
                                                    description: "提升氦获取指数",
                                                    cost: new Decimal(5),
                                                    effect(){return new Decimal(1.05)},
                                                    effectDisplay(){return `^${format(this.effect())}`},
                                                    unlocked(){return hasMilestone("Li",1)}
                                                    },
                                                    14: {
                                                        title: "氧化锂(LiO)",
                                                        description: "前3个升级对木炭能量同样有效",
                                                        cost: new Decimal(5),
                                                        effect(){return new Decimal(1.05)},
                                                        effectDisplay(){return `^${format(this.effect())}`},
                                                        unlocked(){return getBuyableAmount("Ne",31).gte(10)}
                                                        },
                
 
                                                    },
                                                    tabFormat:{
                                                        "Main":{
                                                            content:[ "main-display",
                                                            "prestige-button",
                                                        ["bar", "NextCD"],
                                                        ["infobox","introBox"],
                                                    
        "blank",
        "milestones",
        "upgrades",
        "challenges",
       
        "blank",
        , "blank", "blank", ]
                                                        },
                                                    }})
    
                                                    addLayer("Be", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                        symbol:"Be",
                                                        position: 0,
                                                        branches:["He"],

                                                    
                                                        color: "#808000",                       // The color for this layer, which affects many elements.
                                                        resource: "铍",            // The name of this layer's main prestige resource.
                                                        row: 2,                                 // The row this layer is on (0 is the first row).
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e8),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "static",                         // Determines the formula used for calculating prestige currency.
                                                        exponent(){let exp = new Decimal(1.5)
                                                            if (hasMilestone("B", 3))exp = exp.minus(0.1)
                                                            return exp
                                             
                                             
                                                          },                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#800000"},
                                                                req() {
                                                                    let req =new Decimal(1e10)
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        layerShown(){return player.Li.unlocked},
                                                        autoPrestige() { return (hasMilestone("B", 3))},// Returns a bool for if this layer's node should be visible in the tree.
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "4号元素-铍",
                                                                    body(){
                                                                            let a = "你已经收集了100,000,000个基本粒子，足够聚变生成一个铍原子了！"
                                                                            let b = "请注意，聚变生成铍原子将会消耗你的所有1-3号元素原子、升级和质子！"
                                                                            let c = "铍（Beryllium）是第二周期第二主族元素，原子序数为4，元素符号Be，是一种灰白色的碱土金属，属六方晶系，质硬，有展性。"
                                                                            let d = "铍及其化合物都有剧毒。"
                                                                            let e = "铍既能溶于酸也能溶于碱液，是两性金属，铍主要用于原子能反应堆材料，宇航工程材料，各种合金，X射线透射窗等。 "
                                                                            e += "铍还是1类致癌物！"
                                                                            let f = "铍是钢灰色金属轻金属。铍的硬度比同族金属高，不像钙、锶、钡可以用刀子切割。"
                                                                            let g = "铍共有12个同位素，其中有1个是稳定的。" 
                                                                            let h = "铍和锂一样，在空气中形成保护性氧化层，故在空气中即使红热时也很稳定。"
                                                                            let i = "试着通过重置将全部基本粒子、1-3号元素原子聚合成铍原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                            },
                                                    },
                                                    buyables: {
                                                        11: {
                                                          title: "氧化铍(BeO)",
                                                          cost(x) {return new Decimal(250).add(new Decimal(2).pow(x)).floor()},
                                                          canAfford() { return player.Be.points.gte(this.cost())},
                                                          buy() {
                                                             setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                          },
                                                          display() {return `制作陶瓷，玻璃的无机材料。\n持有分子数目： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}铍\n效果：氢、氦获取*${format(this.effect())}倍`},
                                                          effect(x) { 
                                                            mult2 = new Decimal(x).add(1).log2().add(1).pow(4)
                                                            return new Decimal(mult2)},
                                                          unlocked(){return getBuyableAmount("Ne",41).gte(2)}
                                                        },
                                                        12: {
                                                            title: "氟化铍(BeF2)",
                                                            cost(x) {return new Decimal(265).add(new Decimal(3).pow(x)).floor()},
                                                            canAfford() { return player.Be.points.gte(this.cost())},
                                                            buy() {
                                                               setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                            },
                                                            display() {return `主要用于工业制作铍和铍合金。\n持有分子数目： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}铍\n效果：石墨能量、硼烷获取*${format(this.effect())}倍`},
                                                            effect(x) { 
                                                              mult2 = new Decimal(x).add(1).log2().add(1).pow(10)
                                                              return new Decimal(mult2)},
                                                            unlocked(){return getBuyableAmount("Ne",41).gte(5)}
                                                          },
                                                    },
                                                    milestones: {
                                                        0: {
                                                            requirementDescription: "小型铍合金(1铍)",
                                                            effectDescription: "在重置后保留所有之前层级的内容",
                                                            done() {
                                                                return player.Be.points.gte(1)
                                                            }
                                                        },
                                                        1: {
                                                            requirementDescription: "中型铍合金(2铍)",
                                                            effectDescription: "每秒获取50%重置可获得的氦",
                                                            done() {
                                                                return player.Be.points.gte(2)
                                                             
                                                            }
                                                        },
                                                        2: {
                                                            requirementDescription: "大型铍合金(3铍)",
                                                            effectDescription: "平方“氢原子”“氦气”效果",
                                                            done() {
                                                                return player.Be.points.gte(3)
                                                            }
                                                        },
                                                        3: {
                                                            requirementDescription: "特大型铍合金(4铍)",
                                                            effectDescription: "平方锂效果",
                                                            done() {
                                                                return player.Be.points.gte(4)
                                                             
                                                            }
                                                        },
                                                    
                                                    
                                                    
                                                    },
                                                    tabFormat:{
                                                        "Main":{
                                                            content:[ "main-display",
                                                            "prestige-button",
                                                        ["bar", "NextCD"],
                                                        ["infobox","introBox"],
                                                    
        "blank",
        "milestones",
        "upgrades",
        "buyables",
        "challenges",
       
        "blank",
        , "blank", "blank", ]
                                                        },
                                                    },
                                                    effect(){
                                                     let eff = player.Be.points.pow(2.5).add(1)
                                                     if (hasUpgrade("N",14)) eff = eff.mul(upgradeEffect("N",14))
                                                     if(hasUpgrade("H",24)) eff = eff.mul(upgradeEffect("H",24))
                                                     if(hasUpgrade("B",21)) eff = eff.mul(player.B.points.pow(2.5).add(1))
                                                     if(player.Na.layer3.gte(11)) eff = eff.mul(player.Na.rewardEffect4)
                                                     return eff

                                                    },
                                                    
                                                                effectDescription() {
                                                        return "倍增氢获取 " + format(tmp.Be.effect) + "x"
                                                    },
                                                    canBuyMax() { return hasMilestone("Be", 2) },
                                                    resetsNothing() { return true}},
                                                        
                                                    addLayer("B", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,       
                                                            effect: new Decimal(0),              // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),  
                                                            Apower: new Decimal(1),
                                                            Bpower: new Decimal(1),
                                                            Cpower: new Decimal(1), 
                                                            Dpower: new Decimal(1),
                                                            Epower: new Decimal(1),
                                                            ApowerEffect: new Decimal(1),
                                                            BpowerEffect: new Decimal(1),
                                                            CpowerEffect: new Decimal(1),// "points" is the internal name for the main resource of the layer.
                                                            DpowerEffect: new Decimal(1),
                                                            EpowerEffect: new Decimal(1),
                                                        }},
                                                    
                                                        color: "#800000",                       // The color for this layer, which affects many elements.
                                                        resource: "硼",            // The name of this layer's main prestige resource.
                                                        row: 2,   
                                                        symbol:"B",  
                                                        position: 1,                            // The row this layer is on (0 is the first row).
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "static",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 2.1,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },     
                                                        layerShown() { return player.Be.unlocked },  
                                                        branches:["He","Li"],        // Returns a bool for if this layer's node should be visible in the tree.
                                                        
                                                        milestones: {
                                                            0: {
                                                                requirementDescription: "硼粉(1硼)",
                                                                effectDescription: "在重置后保留所有之前层级的内容，并且解锁甲硼烷(BH₃)效果",
                                                                done() {
                                                                    return player.B.points.gte(1)
                                                                }
                                                            },
                                                            1: {
                                                                requirementDescription: "硼粒(2硼)",
                                                                effectDescription: "自动进行锂重置",
                                                                done() {
                                                                    return player.B.points.gte(2)
                                                                 
                                                                }
                                                            },
                                                            2: {
                                                                requirementDescription: "硼条(3硼)",
                                                                effectDescription: "解锁乙硼烷(B₂H₅)效果",
                                                                done() {
                                                                    return player.B.points.gte(3)
                                                                }
                                                            },
                                                            3: {
                                                                requirementDescription: "硼晶体(5硼)",
                                                                effectDescription: "自动进行铍重置且锂的成本指数-0.1,解锁3个硼升级",
                                                                done() {
                                                                    return player.B.points.gte(5)
                                                                 
                                                                }
                                                            },
                                                                4: {
                                                                    requirementDescription: "硼罐(8硼)",
                                                                    effectDescription: "解锁丙硼烷(B₃H₇)效果且铍的成本指数-0.2,锂不再重置氢和基本粒子",
                                                                    done() {
                                                                        return player.B.points.gte(8)
                                                                     
                                                                    }
                                                            },
                                                         
                                                        },
                                                        autoPrestige() { return (hasMilestone("F", 0))},
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#333333"},
                                                                req() {
                                                                    let req =new Decimal(1e30)
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "5号元素-硼",
                                                                    body(){
                                                                            let a = "你已经收集了1e10个氢原子，足够聚变生成一个硼原子了！"
                                                                            let b = "聚变硼原子不会消耗任何更低层级的资源。"
                                                                            let c = "硼(Boron)是一种罕见的化学元素。"
                                                                            let d = "硼在地壳中的含量为0.001%。硼为黑色或银灰色固体。晶体硼为黑色，硬度仅次于金刚石，质地较脆。"
                                                                            let e = "硼还由于其缺电子性造成其氢化物中硼原子拥有异常高的配位数， "
                                                                            e += "使之成为所有元素氢化物中结构最复杂的。"
                                                                            let f = "它在自然界中主要矿石是硼砂和白硼钙石等。中国西藏自治区许多含硼盐湖，蒸发干涸后有大量硼砂晶体堆积。"
                                                                            let g = "硼在自然界中的含量相当丰富。天然产的硼砂（Na2B4O7·10H2O），在中国古代就已作为药物，叫做蓬砂或盆砂，可能是从西藏传到印度，再从印度传到欧洲去的。" 
                                                                            let h = "高温下B能与N₂、O₂、S等单质反应，例如它能在空气中燃烧生成B₂O₃和少量BN，在室温下即能与F₂发生反应，但它不与H₂、稀有气体等作用。"
                                                                            let i = "试着通过重置将全部基本粒子、1-3号元素原子聚合成硼原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                            },
                                                        },
                                                        
                                                        
                                                        update(diff) {
                                                            if (player.B.unlocked) player.B.Apower = player.B.Apower.plus(player.B.effect.times(diff).pow(1.2));
                                                        
                                                            
                                                            if (player.B.unlocked) player.B.Bpower = player.B.Bpower.plus(player.B.effect.times(diff).pow(0.9));
                                                            
                                                            if (player.B.unlocked) player.B.Cpower = player.B.Cpower.plus(player.B.effect.times(diff).pow(0.6));
                                                            
                                                            if (player.B.unlocked) player.B.Dpower = player.B.Dpower.plus(player.B.effect.times(diff).pow(0.3));
                                                            if (player.B.unlocked) player.B.Epower = player.B.Epower.plus(player.B.effect.times(diff).pow(0.15));
                                                        
                                                        
                                                        },
                                                        tabFormat: ["infobox",
                                                            "main-display",
			
                                                        "prestige-button",
                                                        ["bar","NextCD"],
			"blank",
            ["infobox", "introBox"],
            ["display-text",
				function() {return '你有 ' + format(player.B.points) + ' 硼，每秒生产每种硼烷 '+format(player.B.effect)+''},
					{}],
			["display-text",
				function() {return '你有 ' + format(player.B.Apower) + ' 甲硼烷(BH₃，增幅基本粒子获取 '+format(player.B.ApowerEffect)+'x'},
					{}],
            ["display-text",
				function() {return '你有 ' + format(player.B.Bpower) + ' 乙硼烷(B₂H₅，增幅氢获取 '+format(player.B.BpowerEffect)+'x'},
					{}],
                                        ["display-text",
                    function() {return '你有 ' + format(player.B.Cpower) + ' 丙硼烷(B₃H₇，增幅氦获取与氢化氦效果 '+format(player.B.CpowerEffect)+'x'},
                        {}],
                        ["display-text",
                        function() {return '你有 ' + format(player.B.Dpower) + ' 丁硼烷(B₄H₉，增幅前三种硼烷效果 '+format(player.B.DpowerEffect)+'x'},
                            {}],
                            ["display-text",
                        function() {return '你有 ' + format(player.B.Epower) + ' 戊硼烷(B₅H₁₁，增幅前四种硼烷效果 '+format(player.B.EpowerEffect)+'x'},
                            {}],
			"blank",
			"milestones", "blank", "blank", "upgrades"],
                                                    
                                                        effect() {
                                                            let eff = new Decimal(4).pow(player.B.points).minus(1)
                                                            if (hasUpgrade("B",11)) eff = eff.pow(1.14514)
                                                            if (hasUpgrade("B",22)) eff = eff.pow(1.14514)
                                                            

                                                            if (getBuyableAmount("Be",12).gte(1)) eff = eff.mul(buyableEffect("Be",12))
                                                            if (getBuyableAmount("Na",63).gte(1)) eff = eff.mul(buyableEffect("Na",63))
                                                            player.B.effect = eff
                                                            return eff;
                                                        },
                                                        resetsNothing() { return true },
                                                        ApowerEffect(){
                                                        let Apowerbase = new Decimal(5);
                                                        
                                                        Apowerbase = Apowerbase.mul(player.B.Apower).pow(0.4).add(1)
                                                        if (!hasMilestone("B", 0)) Apowerbase = Apowerbase.pow(0)
                                                        if (hasUpgrade("B", 12)) Apowerbase = Apowerbase.pow(upgradeEffect("B",12))
                                                        Apowerbase = Apowerbase.mul(player.B.DpowerEffect)
                                                        Apowerbase = Apowerbase.mul(player.B.EpowerEffect)
                                                        player.B.ApowerEffect = Apowerbase
                                                        

                                                        return Apowerbase;
                                                    
                                                        }           , 
                                                        BpowerEffect(){
                                                        let Bpowerbase = new Decimal(4);
                                                        Bpowerbase = Bpowerbase.mul(player.B.Bpower).pow(0.3).add(1)
                                                        if (!hasMilestone("B", 2)) Bpowerbase = Bpowerbase.pow(0)
                                                        if (hasUpgrade("B", 12)) Bpowerbase = Bpowerbase.pow(upgradeEffect("B",12))
                                                        Bpowerbase = Bpowerbase.mul(player.B.DpowerEffect)
                                                        Bpowerbase = Bpowerbase.mul(player.B.EpowerEffect)
                                                        player.B.BpowerEffect = Bpowerbase
                                                        return Bpowerbase;
                                                            }    ,
                                                         CpowerEffect(){
                                                                let Cpowerbase = new Decimal(3);
                                                                Cpowerbase = Cpowerbase.mul(player.B.Cpower).pow(0.2).add(1)
                                                                if (!hasMilestone("B", 4)) Cpowerbase = Cpowerbase.pow(0)
                                                                if (hasUpgrade("B", 12)) Cpowerbase = Cpowerbase.pow(upgradeEffect("B",12))
                                                                Cpowerbase = Cpowerbase.mul(player.B.DpowerEffect)
                                                                Cpowerbase = Cpowerbase.mul(player.B.EpowerEffect)
                                                                player.B.CpowerEffect = Cpowerbase
                                                                return Cpowerbase;
                                                                
                                                                }     ,      
                                                        DpowerEffect(){
                                                                 let    Dpowerbase = new Decimal(2);
                                                                 Dpowerbase = Dpowerbase.mul(player.B.Dpower).pow(0.1).add(1)
                                                                 Dpowerbase = Dpowerbase.mul(player.B.EpowerEffect)
                                                                 if (player.Na.layer3.gte(11)) Dpowerbase = Dpowerbase.mul(player.Na.rewardEffect4)
                                                                 if (!hasMilestone("N",2))Dpowerbase = Dpowerbase.pow(0)
                                                                 player.B.DpowerEffect = Dpowerbase
                                                                    return Dpowerbase;
                                                                
                                                        }       ,  
                                                        EpowerEffect(){
                                                            let    Epowerbase = new Decimal(1.7);
                                                            Epowerbase = Epowerbase.mul(player.B.Epower).pow(0.09).add(1)
                                                            if (getBuyableAmount("Ne",51)<1) Epowerbase =Epowerbase.pow(0)
                                                               return Epowerbase;
                                                           
                                                   }       ,      
                                                        upgrades: {
                                                            11: {
                                                            title: "无定形体硼(B)",
                                                            description: "提升硼效应^1.14514",
                                                            cost: new Decimal(6),
                                                            effect(){return new Decimal(1.14514)},
                                                            effectDisplay(){return `^${format(this.effect())}`},
                                                            unlocked(){return hasMilestone("B",2)}
                                                            },
                                                            12: {
                                                                title: "晶体硼(B)",
                                                                description: "提升所有硼烷效果^1.514",
                                                                cost: new Decimal(7),
                                                                effect(){let eff = new Decimal(1.514)
                                                                    if (hasUpgrade("B",13)) eff = eff.mul(1.514)
                                                                     return eff},
                                                                effectDisplay(){return `^${format(this.effect())}`},
                                                                unlocked(){return hasMilestone("B",2)}
                                                                },
                                                            13: {
                                                                    title: "硼离子(B3+)",
                                                                    description: "使上一个升级对自己生效",
                                                                    cost: new Decimal(9),
                                                                    effect(){return new Decimal(1.513)},
                                                                    effectDisplay(){return `^${format(this.effect())}`},
                                                                    unlocked(){return hasMilestone("B",2)}
                                                                    },
                                                                    21: {
                                                                        title: "碳化硼(B₄C)",
                                                                        description: "每个硼提供1个免费铍",
                                                                        cost: new Decimal(42),
                                                                        effect(){return player.B.points},
                                                                        effectDisplay(){return `+${format(this.effect())}`},
                                                                        unlocked(){return getBuyableAmount("Ne",51).gte(2)}
                                                                        },
                                                                        22: {
                                                                            title: "氮化硼(BN)",
                                                                            description: "硼效应再次^1.14514",
                                                                            cost: new Decimal(45),
                                                                            effect(){return new Decimal(1.14514)},
                                                                            effectDisplay(){return `^${format(this.effect())}`},
                                                                            unlocked(){return getBuyableAmount("Ne",51).gte(4)}
                                                                            },
                                                                            23: {
                                                                                title: "硼酸(H3BO3)",
                                                                                description: "丁硼烷同样适用于氖气",
                                                                                cost: new Decimal(46),
                                                                                effect(){let eff = new Decimal(1)
                                                                                    eff = eff.mul((player.B.DpowerEffect))
                                                                                    if (hasUpgrade("B",24)) eff = eff.pow(2)
                                                                                    return eff},
                                                                                effectDisplay(){return `*${format(this.effect())}`},
                                                                                unlocked(){return getBuyableAmount("Ne",51).gte(6)}
                                                                                },
                                                                                24: {
                                                                                    title: "一氟化硼(BF)",
                                                                                    description: "解锁一个新层级且前一个升级效果平方",
                                                                                    cost: new Decimal(46),
                                                                                    effect(){return new Decimal(2)},
                                                                                    effectDisplay(){return `^${format(this.effect())}`},
                                                                                    unlocked(){return getBuyableAmount("Ne",51).gte(8)}
                                                                                    },
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                    },
                                                    addLayer("C", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),  
                                                            Cpower: new Decimal(0),
                                                            Cpower2: new Decimal(0),
                                                            Cdim1:new Decimal(0),
                                                            Cdim1effect:new Decimal(0),
                                                            FreeCdim1:new Decimal(0),
                                                            Cdim2:new Decimal(0),
                                                            Cdim2effect:new Decimal(0),
                                                            FreeCdim2:new Decimal(0),
                                                            Cdim3:new Decimal(0),
                                                            Cdim3effect:new Decimal(0),
                                                            FreeCdim3:new Decimal(0), 
                                                            Rank:new Decimal(0),
                                                            Tier:new Decimal(0)  // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                        update(diff) {
                                                            if (hasMilestone("C",2)) player.C.Cpower = player.C.Cpower.add(new Decimal(1).times(diff))
                                                            if (hasMilestone("C",3)) player.C.Cpower = player.C.Cpower.add(((buyableEffect("C",21)).add(1)).times(diff))
                                                            if ((hasUpgrade("C",11))&&(getBuyableAmount("C",21).gte(0))) buyBuyable("C",21)
                                                            if ((hasUpgrade("C",11))&&(getBuyableAmount("C",21).gte(2))) buyBuyable("C",22)
                                                            if ((hasUpgrade("C",11))&&(getBuyableAmount("C",21).gte(3))) buyBuyable("C",23)
                                                            if (hasUpgrade("C",15)) buyBuyable("C",11)
                                                            if (hasUpgrade("C",21)) buyBuyable("C",12)
                                                       
                                                        
                                                        },
                                                        Cdim1(){return getBuyableAmount("C",21)},
                                                        Rank(){player.C.Rank = getBuyableAmount("C",11)
                                                            return getBuyableAmount("C",11)},
                                                        Tier(){player.C.Tier = getBuyableAmount("C",12)
                                                            return getBuyableAmount("C",12)},
                                                        PowerEffect(){let PowerEffect = new Decimal(1)
                                                            if (hasMilestone("C",2)) PowerEffect = (player.C.Cpower).pow(0.3).add(1)
                                                            if (hasUpgrade("N",12)) PowerEffect = PowerEffect.mul(upgradeEffect("N",12))
                                                            return PowerEffect},
                                                        Cdim1effect(){return buyableEffect("C",21)},
                                                    
                                                        color: "#444444",                       // The color for this layer, which affects many elements.
                                                        resource: "碳",            // The name of this layer's main prestige resource.
                                                        row: 2,       
                                                        symbol:"C",   
                                                        position: 2, 
                                                        branches:["Li"],                       // The row this layer is on (0 is the first row).
                                                        effect(){return player.C.points.pow(0.3)},
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e30),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "normal",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {  let mult = new Decimal(1)
                                                            if (player.C.unlocked)mult = mult.mul(tmp.C.PowerEffect)
                                                        
                                                            if(hasMilestone("C",4)) mult = mult.mul(2)   
                                                            if(hasMilestone("C",5)) mult = mult.mul(2)  
                                                            if (hasMilestone("C",8)) mult = mult.mul(10)
                                                            if (hasMilestone("C",9)) mult = mult.mul(10)  
                                                            if (hasMilestone("C",11)) mult = mult.mul(10) 
                                                            if (getBuyableAmount("C",41).gte(1)) mult = mult.mul(tmp.C.buyables[41].effect)
                                                            if (getBuyableAmount("O",13).gte(1)) mult = mult.mul(tmp.O.buyables[13].effect)
                                                            if(hasUpgrade("H",24)) mult = mult.mul(upgradeEffect("H",24))                     // Returns your multiplier to your gain of the prestige resource.
                                                            return mult     
                                                                 // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                    
                                                        layerShown() { return player.B.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
                                                    
                                                        upgrades: {
                                                            11: {
                                                                title: "石墨(C)",
                                                                description: "自动购买木炭能量发生器、助推器和增强器。",
                                                                cost: new Decimal(1),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(1)
                                                                return s13
                                                                },
                                                                effectDisplay(){
                                                                return "在上面写着了！"
                                                                },
                                                                unlocked(){
                                                                    return true
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",11)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",11)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            12: {
                                                                title: "甲烷(CH₄)",
                                                                description: "木炭能量助推器提供免费木炭能量发生器。",
                                                                cost: new Decimal(10),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(0)
                                                                s13 = s13.add(getBuyableAmount("C",22))
                                                                return s13
                                                                },
                                                                effectDisplay(){return `+${format(this.effect())}`},
                                                                unlocked(){
                                                                    return true
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",12)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",12)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            13: {
                                                                title: "乙烷(C₂H₆)",
                                                                description: "木炭能量增强器提供免费木炭能量助推器。",
                                                                cost: new Decimal(25),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(0)
                                                                s13 = s13.add(getBuyableAmount("C",23))
                                                                return s13
                                                                },
                                                                effectDisplay(){return `+${format(this.effect())}`},
                                                                unlocked(){
                                                                    return true
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",13)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",13)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            14: {
                                                                title: "丙烷(C₃H₈)",
                                                                description: "级别不再重置任何东西。",
                                                                cost: new Decimal(50),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(1)
                                                                return s13
                                                                },
                                                                effectDisplay(){
                                                                return "在上面写着了！"
                                                                },
                                                                unlocked(){
                                                                    return true
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",14)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",14)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            15: {
                                                                title: "丁烷(C₄H₁₀)",
                                                                description: "你可以自动提升级别。",
                                                                cost: new Decimal(10000),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(1)
                                                                return s13
                                                                },
                                                                effectDisplay(){
                                                                return "在上面写着了！"
                                                                },
                                                                unlocked(){
                                                                    return true
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",15)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",15)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            21: {
                                                                title: "一氧化碳(CO)",
                                                                description: "你可以自动提升阶层。",
                                                                cost: new Decimal(1000000),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(1)
                                                                return s13
                                                                },
                                                                effectDisplay(){
                                                                return "在上面写着了！"
                                                                },
                                                                unlocked(){
                                                                    return hasChallenge("F",12)
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",21)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",21)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            22: {
                                                                title: "二氧化碳(CO₂)",
                                                                description: "每有5个时间速度，增加1个增强器",
                                                                cost: new Decimal(100000000),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(0)
                                                                s13 = s13.add((getBuyableAmount("C",41)).div(5))
                                                                return s13
                                                                },
                                                                effectDisplay(){return `+${format(this.effect())}`},
                                                                unlocked(){
                                                                    return hasChallenge("F",12)
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",22)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",22)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            23: {
                                                                title: "三氧化碳(CO₃)",
                                                                description: "木炭能量发生器、助推器、增强器的成本膨胀削弱20%",
                                                                cost: new Decimal(1e15),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(20)
                                                                return s13
                                                                },
                                                                effectDisplay(){return `-${format(this.effect())}%`},
                                                                unlocked(){
                                                                    return hasChallenge("F",21)
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",23)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",23)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            24: {
                                                                title: "四氧化碳(CO₄)",
                                                                description: "木炭能量增强器基数+1",
                                                                cost: new Decimal(1e24),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(1)
                                                                return s13
                                                                },
                                                                effectDisplay(){return `+${format(this.effect())}`},
                                                                unlocked(){
                                                                    return hasChallenge("F",21)
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",24)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",24)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            25: {
                                                                title: "五氧化碳(CO₅)",
                                                                description: "级别成本膨胀削弱10%",
                                                                cost: new Decimal(1e37),
                                                                currencyDisplayName: "石墨能量",
                                                                currencyInternalName: "Cpower2",
                                                                currencyLayer: "C",
                                                                effect(){
                                                                let s13 = new Decimal(10)
                                                                return s13
                                                                },
                                                                effectDisplay(){return `-${format(this.effect())}%`},
                                                                unlocked(){
                                                                    return hasChallenge("F",22)
                                                                },
                                                                style: {
                                                                    "background-color"() {
                                                                        if (hasUpgrade("C",25)) color = "#00FF00"
                                                                        if (!hasUpgrade("C",25)) color = "#FF0000"
                                                                        return color
                                                                        
                                                                    }
                                                                }
                                                            },
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                        resetsNothing() { return true},
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "6号元素-碳",
                                                                    body(){
                                                                            let a = "你已经收集了1e30个氢原子，足够聚变生成一个碳原子了！"
                                                                            let b = "聚变碳原子不会消耗任何更低层级的资源。"
                                                                            let c = "碳（Carbon）是一种非金属元素，化学符号为C，在常温下具有稳定性，不易反应、极低的对人体的毒性，甚至可以以石墨或活性炭的形式安全地摄取，位于元素周期表的第二周期IVA族。"
                                                                            let d = "碳是一种很常见的元素，它以多种形式广泛存在于大气和地壳和生物之中。"
                                                                            let e = "碳单质很早就被人认识和利用，碳的一系列化合物——有机物更是生命的根本。 "
                                                                            e += "碳是生铁、熟铁和钢的成分之一。 "
                                                                            let f = "碳能在化学上自我结合而形成大量化合物，在生物上和商业上是重要的分子。"
                                                                            let g = "生物体内绝大多数分子都含有碳元素。" 
                                                                            let h = "碳的化合物中，只有以下化合物属于无机物：碳的氧化物、碳化物、碳的硫属化合物、二硫化碳(CS2)、碳酸盐、碳酸氢盐、氰及一系列拟卤素及其拟卤化物、拟卤酸盐，如氰[(CN)2]、氧氰[(OCN)2]，硫氰[(SCN)2]，其它含碳化合物都是有机化合物。"
                                                                            let i = "试着通过重置将全部基本粒子、1-3号元素原子聚合成碳原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                            },
                                                        },
                                                        buyables: {
                                                            11: {
                                                                unlocked(){return hasMilestone("C",3)},
                                                                title: "级别",
                                                                style: {"background-color":'#00FFFF'},
                                                                cost(x) {
                                                                    if(x<10){ return new Decimal(10).mul(new Decimal(10).pow(x))}
                                                                    if(9<x<100){ return new Decimal(10).mul((new Decimal(5000).mul(hasUpgrade('C',25)? 0.9 : 1)).pow((x).sub(7)))}
                                                                },
                                                                canAfford() { return player.C.Cpower.gte(this.cost())},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   if(!hasUpgrade("C",14)) setBuyableAmount(this.layer, 21,new Decimal(0))
                                                                   if(!hasUpgrade("C",14)) setBuyableAmount(this.layer, 22,new Decimal(0))
                                                                   if(!hasUpgrade("C",14)) setBuyableAmount(this.layer, 23,new Decimal(0))
                                                                   player.C.Cpower = new Decimal(10)
                                                                   
                                                                },
                                                                autoed(){return hasUpgrade("C",15)},
                                                                display() {return `重置木炭能量，但提升级别。\n当前层级： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}木炭能量\n效果：级别1：解锁木炭能量发生器。<br>级别2：解锁木炭能量助推器，双倍碳获取。<br>级别3：解锁木炭能量增强器，双倍碳获取。<br>级别8：木炭能量和碳获取*10。`},
                                                                effect(x) { 
                                                                  eff = new Decimal(x)
                                                                  return new Decimal(eff)}
                                                              },
                                                              12: {
                                                                unlocked(){return player.C.Rank.gte(5)},
                                                                title: "阶层",
                                                                style: {"background-color":'#00FFFF'},
                                                                cost(x) {return new Decimal(5).add(new Decimal(4).mul(x))},
                                                                canAfford() { return player.C.Rank.gte(this.cost())},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   setBuyableAmount("C",11, new Decimal(0))
                                                                   setBuyableAmount(this.layer, 21,new Decimal(0))
                                                                   setBuyableAmount(this.layer, 22,new Decimal(0))
                                                                   setBuyableAmount(this.layer, 23,new Decimal(0))
                                                                   player.C.Cpower = new Decimal(10)
                                                                },
                                                                display() {return `重置级别，但提升阶层。\n当前阶层： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}层级\n效果：阶层1：木炭能量获取^1.15。<br>阶层2：木炭能量和碳获取*10，氢获取*1e6。<br>阶层3：碳和木炭能量获取*10，氢获取*1e20`},
                                                                effect(x) { 
                                                                  eff = new Decimal(x)
                                                                  return new Decimal(eff)}
                                                              },
                                                            21: {
                                                                unlocked(){return layers.C.Rank().gte(1)},
                                                              title: "木炭能量发生器",
                                                              cost(x) {if((getBuyableAmount("C",21))<20) return new Decimal(10).mul(new Decimal(1.5).pow(x))
                                                                if((getBuyableAmount("C",21))>19) return new Decimal(20000).mul((new Decimal(10).mul(hasUpgrade('C',23)? 0.8 : 1)).pow((x).sub(new Decimal(19))))},
                                                              canAfford() { return player.C.Cpower.gte(this.cost())},
                                                              autoed(){return hasUpgrade("C",11)},
                                                              buy() {
                                                                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                 if(!hasUpgrade("C",11))player[this.layer].Cpower = player[this.layer].Cpower.sub(tmp[this.layer].buyables[this.id].cost)
                                                              },
                                                              display() {return `生产木炭能量。\n持有木炭能量发生器数量： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}木炭能量\n效果：每秒生产*${format(this.effect())}木炭能量`},
                                                              effect(x) { 
                                                                if (!hasUpgrade("C",12)) eff = new Decimal(x)
                                                                if (hasUpgrade("C",12)) eff = new Decimal(x.add(getBuyableAmount("C",22)))
                                                                if (getBuyableAmount("C",22).gte(1))eff = eff.mul(tmp.C.buyables[22].effect)
                                                                if (hasUpgrade("N",11)) eff = eff.mul(upgradeEffect("N",11))
                                                                if (hasMilestone("C",8)) eff = eff.mul(10)
                                                                if (hasMilestone("C",9)) eff = eff.mul(10)
                                                                if (hasMilestone("C",11)) eff = eff.mul(10)
                                                                if (hasMilestone("C",7)) eff = eff.pow(1.15)
                                                                if (getBuyableAmount("O",12).gte(1)) eff = eff.mul(tmp.O.buyables[12].effect)
                                                                if (hasMilestone("C",10))eff = eff.mul(tmp.C.buyables[41].effect)
                                                                if (inChallenge('F',11)) eff = eff.pow(0.8)       
                                                                if (getBuyableAmount("O",12).gte(1)) eff = eff.mul(buyableEffect("O",12))
                                                                if (hasMilestone("C",14)) eff = eff.mul((player.C.Tier).add(1).pow(hasMilestone('C',15)? 4 : 1)).mul((player.C.Rank).add(1).pow(hasMilestone('C',15)? 4 : 1))
                                                                if(hasUpgrade("H",24)) eff = eff.mul(upgradeEffect("H",24))
                                                                if (getBuyableAmount("He",11).gte(1)) eff = eff.mul(buyableEffect("He",11))
                                                                if(hasUpgrade("He",23)) eff = eff.mul(buyableEffect("He",11))
                                                                if(hasUpgrade("Li",14)) eff = eff.pow(new Decimal(1.15))
                                                                if((player.Na.layer4).gte(10)) eff = eff.mul(player.Na.rewardEffect5)
                                                                if (eff>1e50)eff = ((eff.div(1e50)).root(2)).mul(1e50)
                                                                return eff
                                                            },
                                                        },
                                                            22: {
                                                                title: "木炭能量助推器",
                                                                unlocked(){return layers.C.Rank().gte(2)},
                                                                cost(x) {if((getBuyableAmount("C",22))<20) return new Decimal(100).mul(new Decimal(4).pow(x))
                                                                    if((getBuyableAmount("C",22))>19) return new Decimal(1e14).mul((new Decimal(20).mul(hasUpgrade('C',23)? 0.8 : 1)).pow((x).sub(new Decimal(19))))},
                                                                canAfford() { return player.C.Cpower.gte(this.cost())},
                                                                autoed(){return hasUpgrade("C",11)},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   if(!hasUpgrade("C",11))player[this.layer].Cpower = player[this.layer].Cpower.sub(tmp[this.layer].buyables[this.id].cost)
                                                                },
                                                                display() {return `倍增木炭能量发生器的效果。\n持有木炭能量助推器数量： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}木炭能量\n效果：木炭能量发生器效果*${format(this.effect())}`},
                                                                effect(x) { 
                                                                if (!hasUpgrade("C",13)) eff = new Decimal(x).mul(2).add(1)
                                                                if (hasUpgrade("C",13)) eff = new Decimal(x.add(getBuyableAmount("C",23))).mul(2).add(1)
                                                                  eff = eff.pow(tmp.C.buyables[23].effect)
                                                                  if (inChallenge('F',11)) eff = eff.pow(0.8)
                                                                  if (inChallenge("F", 22)) eff = eff.mul(1e-10)
                                                                  return new Decimal(eff)}
                                                              },
                                                              23: {
                                                                title: "木炭能量增强器",
                                                                unlocked(){return layers.C.Rank().gte(3)},
                                                                cost(x) {if((getBuyableAmount("C",23))<20) return new Decimal(1000).mul(new Decimal(9).pow(x))
                                                                    if((getBuyableAmount("C",23))>19) return new Decimal(1e22).mul((new Decimal(45).mul(hasUpgrade('C',23)? 0.8 : 1)).pow((x).sub(new Decimal(19))))
                                                                },
                                                                canAfford() { return player.C.Cpower.gte(this.cost())},
                                                                autoed(){return hasUpgrade("C",11)},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   if(!hasUpgrade("C",11))player[this.layer].Cpower = player[this.layer].Cpower.sub(tmp[this.layer].buyables[this.id].cost)
                                                                },
                                                                display() {return `指数加成木炭能量助推器的效果。\n持有木炭能量增强器数量： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}木炭能量\n效果：木炭能量助推器效果^${format(this.effect())}`},
                                                                effect(x) { 
                                                                  if (getBuyableAmount("C",23)<4) eff = new Decimal(x).mul(0.5).add(1)
                                                                  if (getBuyableAmount("C",23)>3&&!hasUpgrade("C",22)) eff = new Decimal(x).mul(0.1).mul(((player.O.OpowerEff).add(tmp.F.challenges[11].rewardEffect)).div(100).add(1)).add(2.5)
                                                                  if (getBuyableAmount("C",23)>3&&hasUpgrade("C",22)) eff = new Decimal((x).add(upgradeEffect("C",22))).mul(0.1).mul(((player.O.OpowerEff).add(tmp.F.challenges[11].rewardEffect).add(hasUpgrade('C',24)? 1 : 0)).div(100).add(1)).add(2.5)
                                                                  if (inChallenge('F',11)) eff = eff.pow(0.8)
                                                                  if (inChallenge("F", 12)) eff = eff.pow(0.1)
                                                                  if (inChallenge("F", 22)) eff = eff.pow(0.05)
                                                                  return new Decimal(eff)}
                                                              },
                                                              31: {
                                                                title: "石墨能量",
                                                                gain() { 
                                                                    let gain = player.C.Cpower.div(1e16).pow(0.45)
                                                                if (hasMilestone("C",12)) gain = gain.mul(player.C.Rank)
                                                                if (hasMilestone("C",13)) gain = gain.mul(player.C.Tier)
                                                                if(hasUpgrade("H",24)) gain = gain.mul(upgradeEffect("H",24))
                                                                if(getBuyableAmount("Be",12).gte(1)) gain = gain.mul(buyableEffect("Be",12))
                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("重置你的级别、阶层、木炭发生器倍增器增强器等级和木炭能量，获得"+formatWhole(tmp[this.layer].buyables[this.id].gain)+"石墨能量\n"+
                                                                    "需要: 1e16木炭能量\n")
                                                                    return display;
                                                                },
                                                                unlocked() { return layers.C.Rank().gte(11) }, 
                                                                canAfford() { return player.C.Cpower.gte(1e16) },
                                                                buy() { 
                                                                     setBuyableAmount(this.layer,11,new Decimal(0))
                                                                     setBuyableAmount(this.layer,12,new Decimal(0))
                                                                     setBuyableAmount(this.layer,21,new Decimal(0))
                                                                     setBuyableAmount(this.layer,22,new Decimal(0))
                                                                     setBuyableAmount(this.layer,23,new Decimal(0))
                                                                     player.C.Cpower2 = player.C.Cpower2.add(tmp[this.layer].buyables[this.id].gain)
                                                                     player.C.Cpower = new Decimal(10)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style: {"background-color":'#FF0000'},
                                                                autoed() { return false},
                                                            },
                                                            41: {
                                                                title: "时间速度",
                                                                unlocked(){return hasMilestone("C",10)},
                                                                cost(x) {return new Decimal(3).pow(x)},
                                                                canAfford() { return player.C.Cpower2.gte(this.cost())},
                                                                autoed(){return false},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   player[this.layer].Cpower2 = player[this.layer].Cpower2.sub(tmp[this.layer].buyables[this.id].cost)
                                                                },
                                                                style: {"background-color":'#FF0000'},
                                                                display() {return `提升所有石墨能量之前资源的获取速度。\n持有时间加速数量： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}石墨能量\n效果：时间速度*${format(this.effect())}`},
                                                                effect(x) { let eff = new Decimal(1)
                                                                  if(!hasChallenge("F",21))eff = eff.mul((new Decimal(1.5).pow(x)))
                                                                  if(hasChallenge("F",21))eff = eff.mul((new Decimal(1.5).add(layers["F"]["challenges"]["21"].rewardEffect())).pow(x))
                                                                  if(player.F.points.gte(1))eff = eff.mul(tmp.F.effect)
                                                                  if(hasChallenge("F",12))eff = eff.mul(new Decimal(2).pow((layers["F"]["challenges"]["12"].rewardEffect())))
                                                                  if(inChallenge("Li",12))eff = eff.div(1e100)
                                                                  if((player.Na.layer4).gte(10)) eff = eff.mul(player.Na.rewardEffect5)
                                                                  if (eff>1e50)eff = ((eff.div(1e50)).root(10)).mul(1e50)
                                                                  return eff
                                                                }
                                                              },
                                                        },
                                                        milestones: {
                                                            0: {
                                                                requirementDescription: "炭灰(1碳)",
                                                                effectDescription: "在重置后保留所有之前层级的内容",
                                                                done() {
                                                                    return player.C.points.gte(1)
                                                                }
                                                            },
                                                            1: {
                                                                requirementDescription: "木炭粉(10,000碳)",
                                                                effectDescription: "每秒自动获得重置可获得碳的100倍",
                                                                done() {
                                                                    return player.C.points.gte(10000)
                                                                 
                                                                }
                                                            },
                                                            2: {
                                                                requirementDescription: "木炭粒(100,000,000碳)",
                                                                effectDescription: "解锁木炭能量(每秒自动生产1)。",
                                                                done() {
                                                                    return player.C.points.gte(1e8)
                                                                }
                                                            },
                                                            3: {
                                                                requirementDescription: "木炭罐子(1e9碳)",
                                                                effectDescription: "解锁级别。",
                                                                done() {
                                                                    return player.C.points.gte(1e9)
                                                                 
                                                                }
                                                            },
                                                            4: {
                                                                requirementDescription: "大型木炭罐子(2级别)",
                                                                effectDescription: "双倍碳获取。",
                                                                done() {
                                                                    return player.C.Rank.gte(2)
                                                                 
                                                                }
                                                            },
                                                            5: {
                                                                requirementDescription: "木炭桶(3级别)",
                                                                effectDescription: "再次双倍碳获取。",
                                                                done() {
                                                                    return player.C.Rank.gte(3)
                                                                 
                                                                }
                                                            },
                                                                6: {
                                                                    requirementDescription: "小木炭堆(5级别)",
                                                                    effectDescription: "解锁阶层。",
                                                                    done() {
                                                                        return player.C.Rank.gte(5)
                                                                     
                                                                    }
                                                            },
                                                            7: {
                                                                requirementDescription: "木炭堆(1阶层)",
                                                                effectDescription: "木炭能量获取^1.15。",
                                                                done() {
                                                                    return player.C.Tier.gte(1)
                                                                 
                                                                }

                                                        },
                                                         
                                                        8: {
                                                            requirementDescription: "大木炭堆(8级别)",
                                                            effectDescription: "碳和木炭能量获取*10",
                                                            done() {
                                                                return player.C.Rank.gte(8)
                                                             
                                                            }
                                                        },
                                                        9: {
                                                            requirementDescription: "特大型木炭堆(2阶层)",
                                                            effectDescription: "碳和木炭能量获取*10，氢获取*1e6",
                                                            done() {
                                                                return player.C.Tier.gte(2)
                                                             
                                                            }
                                                        },
                                                        10: {
                                                            requirementDescription: "石墨粉(1石墨能量)",
                                                            effectDescription: "里程碑的基础木炭能量获取提升20倍",
                                                            done() {
                                                                return player.C.Cpower2.gte(1)
                                                             
                                                            }
                                                        },
                                                        11: {
                                                            requirementDescription: "石墨粒(3阶层)",
                                                            effectDescription: "碳和木炭能量获取*10，氢获取*1e20",
                                                            done() {
                                                                return player.C.Tier.gte(3)
                                                             
                                                            }
                                                        },
                                                        12: {
                                                            requirementDescription: "石墨罐子(15级别)",
                                                            effectDescription: "等级倍增石墨能量获取",
                                                            done() {
                                                                return player.C.Rank.gte(15)
                                                             
                                                            }
                                                        },
                                                        13: {
                                                            requirementDescription: "大石墨罐子(4阶层)",
                                                            effectDescription: "阶层倍增石墨能量获取",
                                                            done() {
                                                                return player.C.Tier.gte(4)
                                                             
                                                            }
                                                        },
                                                        14: {
                                                            requirementDescription: "小石墨堆(5阶层)",
                                                            effectDescription: "前两个里程碑同样适用于木炭能量",
                                                            done() {
                                                                return player.C.Tier.gte(5)
                                                             
                                                            }
                                                        },
                                                        15: {
                                                            requirementDescription: "石墨堆(8阶层)",
                                                            effectDescription: "前一个里程碑效果提升至4次方",
                                                            done() {
                                                                return player.C.Tier.gte(8)
                                                             
                                                            }
                                                        },
                                                        16: {
                                                            requirementDescription: "大石墨堆(36级别)",
                                                            effectDescription: "氖气获取提升级别倍",
                                                            done() {
                                                                return player.C.Rank.gte(36)
                                                             
                                                            }
                                                        },
                                                        17: {
                                                            requirementDescription: "特大石墨堆(42级别)",
                                                            effectDescription: "氦-3效果同样适用于氖气",
                                                            done() {
                                                                return player.C.Rank.gte(42)
                                                             
                                                            }
                                                        },
                                                        

                                                    },
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#FBB9DF"},
                                                                req() {
                                                                    let req =new Decimal(1e50)
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        passiveGeneration(){return hasMilestone('C',1)? 100 : 0},
                                                        tabFormat: {
                                                        "Info":{
                                                            content:["infobox",
                                                        "main-display",
        
                                                    "prestige-button",
        "blank",
        ["infobox", "introBox"],
       
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Milestones":{
                                                            content:["infobox",
                                                        "main-display",
                                                        ["bar", "NextCD"],
                                                    "prestige-button",
        "blank",
        "milestones",
       
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Charcoal-Energy":{
                                                            content:["infobox",
                                                        "main-display",
                                                        ["display-text",
                                                        function() {return "你有 <h2 style='color:#444444;text-shadow:0px 0px 10px;'>"+ format(player.C.Cpower) + "</h2> 木炭能量"},
                                                            {}],
                                                            "blank",
                                                        ["display-text",
                                                        function() {return "你有 <h2 style='color:#FF0000;text-shadow:0px 0px 10px;'>"+ format(player.C.Cpower2) + "</h2> 石墨能量"},
                                                            {}],
                                                            "blank",
        
                                                    "prestige-button",
        "blank",
        ["display-text",
        function() {return '你有 ' + format(player.C.Cpower) + ' 木炭能量，增幅碳获取 '+format(tmp.C.PowerEffect)+'x'},
            {}],
            ["display-text",
            function() {return '你有 ' + format(player.C.points) + ' 碳，增幅氢获取 '+format(tmp.C.effect)+'x'},
                {}],
                ["display-text",
                function() {return '*警告* 当级别超过10后，级别的成本膨胀将会加速！'},
                    {}],
                ["display-text",
                function() {return '*警告* 当木炭能量增强器超过4后，其效果将受到软上限限制！'},
                    {}],
                ["display-text",
                function() {return '*警告* 当木炭能量增强器超过8后，其效果将受到二重软上限限制！'},
                    {}],
                    ["display-text",
                    function() {return '*警告* 当木炭能量超过1e50时，其获取将受到软上限限制！'},
                        {}],
        
        "buyables",
       
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Graphite-Energy":{
                                                            buttonStyle: {"border-color": "#FF0000"},
                                                            content:["infobox",
                                                        "main-display",
                                                        ["display-text",
        function() {return "你有 <h2 style='color:#FF0000;text-shadow:0px 0px 10px;'>"+ format(player.C.Cpower2) + "</h2> 石墨能量"},
            {}],

                                                        
                                                    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Graphite-Upgrades":{
                                                            
                                                            buttonStyle: {"border-color": "#FF0000"},
                                                            content:["infobox",
                                                        "main-display",
                                                        ["display-text",
                                                            function() {return "你有 <h2 style='color:#FF0000;text-shadow:0px 0px 10px;'>"+ format(player.C.Cpower2) + "</h2> 石墨能量"},
                                                                {}],
        "upgrades",
                                                   
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Fullerene-Energy":{
                                                            buttonStyle: {"border-color": "#FFFF00"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                    "prestige-button",
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Fullerene-Upgrades":{
                                                            buttonStyle: {"border-color": "#FFFF00"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                    "prestige-button",
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Fullerene-Challanges":{
                                                            buttonStyle: {"border-color": "#FFFF00"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                
    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Diamond-Ray":{
                                                            buttonStyle: {"border-color": "#0000FF"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                
    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Diamond-Upgrades":{
                                                            buttonStyle: {"border-color": "#0000FF"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                
    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Diamond-Gen":{
                                                            buttonStyle: {"border-color": "#0000FF"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                
    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Diamond-Challanges":{
                                                            buttonStyle: {"border-color": "#0000FF"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                
    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Quarks":{
                                                            buttonStyle: {"border-color": "#0000FF"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                
    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Carbon-Supernova":{
                                                            buttonStyle: {"border-color": "#FF03F5"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                
    
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        },

                                                    },
                                                    addLayer("N", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                    
                                                        color: "#FBB9DF",                       // The color for this layer, which affects many elements.
                                                        resource: "氮",    
                                                        symbol:"N",        // The name of this layer's main prestige resource.
                                                        row: 3,   
                                                        position: 1,                              // The row this layer is on (0 is the first row).
                                                        branches:["Be"],
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e50),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "static",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 2,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                        
                                                        layerShown() { return player.C.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
                                                        Effect(){return new Decimal(3).pow(player.N.points)},

                                                        upgrades: {
                                                            11: {
                                                                title: "氮原子(N)",
                                                                description: "级别提升木炭能量获取",
                                                                cost: new Decimal(2),
                                                                effect(){ eff = new Decimal(1)
                                                                    eff = eff.add(((getBuyableAmount("C",11))).pow(0.4))
                                                                    if(inChallenge("F", 21)) eff = eff.pow(0)
                                                                    if(player.Na.rewardEffect6.gte(2)) eff = eff.mul(player.Na.rewardEffect6)
                                                                return eff
                                                            },
                                                                effectDisplay(){return `*${format(this.effect())}`},
                                                                unlocked(){return hasMilestone("N",1)}
                                                                },
                                                                12: {
                                                                    title: "氮离子(N3-)",
                                                                    description: "木炭能量增幅碳获取的公式更好",
                                                                    cost: new Decimal(3),
                                                                    effect(){let eff = new Decimal(1.2)
                                                                        if(inChallenge("F", 21)) eff = eff.pow(0)
                                                                         return eff},
                                                                    effectDisplay(){return `*${format(this.effect())}`},
                                                                    unlocked(){return hasMilestone("N",1)}
                                                                    },
                                                                13: {
                                                                        title: "氮气(N₂)",
                                                                        description: "略微提升之前所有层级资源的效果。",
                                                                        cost: new Decimal(4),
                                                                        effect(){return new Decimal(1.001)},
                                                                        effectDisplay(){return `^${format(this.effect())}`},
                                                                        unlocked(){return hasMilestone("N",1)}
                                                                        },
                                                                        14: {
                                                                            title: "氨气(NH₃)",
                                                                            description: "丁硼烷以降低的速度提升全部硼烷获取。",
                                                                            cost: new Decimal(6),
                                                                            effect(){ let eff = (player.B.Dpower).pow(0.1)
                                                                                if(player.Na.rewardEffect6.gte(2)) eff = eff.mul(player.Na.rewardEffect6)
                                                                                return eff},
                                                                            effectDisplay(){return `*${format(this.effect())}`},
                                                                            unlocked(){return hasMilestone("N",1)}
                                                                            },
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                       
                                                        resetsNothing(){return true},
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "7号元素-氮",
                                                                    body(){
                                                                            let a = "你已经收集了1e50个氢原子，足够聚变生成一个氮原子了！"
                                                                            let b = "聚变氮原子不会消耗任何更低层级的资源。"
                                                                            let c = "氮（Nitrogen）是一种化学元素，它的化学符号是N，它的原子序数是7。"
                                                                            let d = "氮是空气中最多的元素，在自然界中存在十分广泛，在生物体内亦有极大作用，是组成氨基酸的基本元素之一。"
                                                                            let e = "氮及其化合物在生产生活中应用广泛。 "
                                                                            e += "氮在地壳中的含量很少，自然界中绝大部分的氮是以单质分子氮气的形式存在于大气中，氮气占空气体积的78％。氮的最重要的矿物是硝酸盐。 "
                                                                            let f = "氮在地壳中的重量百分比含量是0.0046%，总量约达到4e12吨。"
                                                                            let g = "氮有两种天然同位素：氮-14和氮-15，其中氮-14的丰度为99.625%。" 
                                                                            let h = "氮气为无色、无味的气体。氮通常的单质形态是氮气。它无色无味无臭，是很不易有化学反应呈化学惰性的气体，而且它不支持燃烧，微溶于水、乙醇。用于合成氨，制硝酸，用作物质保护剂，冷冻剂。"
                                                                            let i = "试着通过重置将全部基本粒子、1-6号元素原子聚合成氮原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                                    
                                                            },
                                                        },
                                                        autoPrestige() { return (hasMilestone("F", 1))},
                                                        milestones: {
                                                            0: {
                                                                requirementDescription: "氮气集气瓶(1氮)",
                                                                effectDescription: "在重置后保留所有之前层级的内容",
                                                                done() {
                                                                    return player.N.points.gte(1)
                                                                }
                                                            },
                                                            1: {
                                                                requirementDescription: "小氮气罐(2氮)",
                                                                effectDescription: "解锁8个氮升级",
                                                                done() {
                                                                    return player.N.points.gte(2)
                                                                 
                                                                }
                                                            },
                                                            2: {
                                                                requirementDescription: "氮气罐(3氮)",
                                                                effectDescription: "解锁丁硼烷效果",
                                                                done() {
                                                                    return player.N.points.gte(3)
                                                                }
                                                            },
                                                            3: {
                                                                requirementDescription: "大氮气罐(20氮)",
                                                                effectDescription: "解锁氮气加速。",
                                                                done() {
                                                                    return player.N.points.gte(20)
                                                                 
                                                                }
                                                            },
                                                           
                                                    },
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#0000FF"},
                                                                req() {
                                                                    let req =new Decimal(1e100)
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        tabFormat:{
                                                            "Main":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                ["display-text",
                                                                function() {return '你有 ' + format(player.N.points) + '氮，加成氢获取 '+format(tmp.N.Effect)+'x'},
                                                                    {}],
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
           
            "blank",
            , "blank", "blank", ]
                                                    },
                                                        },

                                                    }))))
                                                    addLayer("O", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0), 
                                                            Opower: new Decimal(0), 
                                                            Opowergain: new Decimal(0),
                                                            effect: new Decimal(0),
                                                            effect2: new Decimal(0),
                                                            OpowerEff: new Decimal(0),
                                                            OpowerEff2: new Decimal(0),        // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                        color: "#0066FF",                       // The color for this layer, which affects many elements.
                                                        resource: "氧",            // The name of this layer's main prestige resource.
                                                        row: 3,  
                                                        position: 10,                               // The row this layer is on (0 is the first row).
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e100),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                        branches:["B"],
                                                        type: "normal",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 0.001,                          // "normal" prestige gain is (currency^exponent).
                                                        effect() { 
                                                            let sol = player.O.points;
                                                            let eff = sol.plus(1);
                                                            if (eff>1e100) eff = ((eff.div(1e100)).root(3000000)).mul(1e100)
                                                            player.O.effect = eff
                                                            return eff;
                                                        },
                                                        effect2() { player.O.effect2 = player.O.points.div(1e5).plus(1).sqrt()
                                                            return player.O.points.div(1e20).plus(1).sqrt()},
                                                            buyables: {
                                                                rows: 3,
                                                                cols: 3,
                                                                11: {
                                                                    title: "臭氧(O₃)",
                                                                    gain() { return player.O.points.div(2).root(1.5) },
                                                                    effect() { 
                                                                        let amt = player[this.layer].buyables[this.id]
                                                                        amt = amt.add(1).log10().add(1)
                                                                    return amt
                                                                    },
                                                                    display() { // Everything else displayed in the buyable button after the title
                                                                        let data = tmp[this.layer].buyables[this.id]
                                                                        let x = player[this.layer].buyables[this.id].gte(5e4)?"10^(sqrt(log(x)*log(5e4)))":"x"
                                                                        let display = ("献祭你所有的氧，获得 "+formatWhole(tmp[this.layer].buyables[this.id].gain)+" 臭氧\n"+
                                                                        "需要: 100 氧\n"+
                                                                        "数量: " + formatWhole(player[this.layer].buyables[this.id]))+"\n"+
                                                                        ("效果: 加成氧获取 "+format(tmp[this.layer].buyables[this.id].effect) + 'x')
                                                                        return display;
                                                                    },
                                                                    unlocked() { return player[this.layer].unlocked }, 
                                                                    canAfford() { return player.O.points.gte(100) },
                                                                    buy() { 
                                                                        player.O.points = new Decimal(0);
                                                                        player.O.buyables[this.id] = player.O.buyables[this.id].add(tmp[this.layer].buyables[this.id].gain);
                                                                    },
                                                                    buyMax() {
                                                                        // I'll do this later ehehe
                                                                    },
                                                                    style: {'height':'140px', 'width':'140px'},
                                                                    autoed() { return false },
                                                                },
                                                                12: {
                                                                    title: "氧化氢(H₂O)",
                                                                    gain() { return player.H.points.div(1e140).cbrt().times(player.O.Opower.div(2500)).root(3.5)},
                                                                    effect() { let eff = Decimal.pow(10, player[this.layer].buyables[this.id].add(1).log10().cbrt()).plus(1)
                                                                        if (eff>1e10) eff = ((eff.div(1e10)).root(1e308)).mul(1e10)
                                                                        return eff},
                                                                    display() { // Everything else displayed in the buyable button after the title
                                                                        let data = tmp[this.layer].buyables[this.id]
                                                                        let display = ("献祭你所有的氢和氧气，获得 "+formatWhole(tmp[this.layer].buyables[this.id].gain)+" 氧化氢\n"+
                                                                        "需要: 2500氧气、1e140氢\n"+
                                                                        "数量: " + formatWhole(player[this.layer].buyables[this.id])+"\n"+
                                                                        ("效果: 加成木炭能量与氢获取 "+format(tmp[this.layer].buyables[this.id].effect) + 'x'))
                                                                        return display;
                                                                    },
                                                                    unlocked() { return player[this.layer].unlocked }, 
                                                                    canAfford() { return player.H.points.gte(1e140)&&player.O.Opower.gte(2500) },
                                                                    buy() { 
                                                                        player.H.points = new Decimal(0);
                                                                        player.O.Opower = new Decimal(0);
                                                                        player.O.buyables[this.id] = player.O.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
                                                                    },
                                                                    buyMax() {
                                                                        // I'll do this later ehehe
                                                                    },
                                                                    style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
                                                                    autoed() { return false},
                                                                },
                                                                13: {
                                                                    title: "过氧化氢(H₂O₂)",
                                                                    gain() { return player.H.points.div(1e260).cbrt().times(player.O.Opower.div(2e5)).root(6.5) },
                                                                    effect() { let eff = Decimal.pow(1.2,player[this.layer].buyables[this.id]).log10().add(1).pow(new Decimal(2.5).add(layers["F"]["challenges"]["22"].rewardEffect()))
                                                                if (eff>1e50) eff = ((eff.div(1e50)).root(10)).mul(1e50)
                                                                if (eff>1e60) eff = ((eff.div(1e60)).root(1e308)).mul(1e60)
                                                            return eff},
                                                                    display() { // Everything else displayed in the buyable button after the title
                                                                        let data = tmp[this.layer].buyables[this.id]
                                                                        let display = ("献祭所有氢和氧气，获得 "+formatWhole(tmp[this.layer].buyables[this.id].gain)+" 过氧化氢\n"+
                                                                        "需要: 250,000氧气、1e260氢\n"+
                                                                        "数量: " + formatWhole(player[this.layer].buyables[this.id])+("效果: 加成氢获取与碳获取 "+format(tmp[this.layer].buyables[this.id].effect) + 'x(超过1e50后受到10次方根限制)'))
                                                                        return display;
                                                                    },
                                                                    unlocked() { return hasChallenge("F",11)}, 
                                                                    canAfford() { return player.O.Opower.gte(2e5)&&player.H.points.gte(1e260)},
                                                                    buy() { 
                                                                        player.H.points = new Decimal(0);
                                                                        player.O.Opower = new Decimal(0);
                                                                        player.O.buyables[this.id] = player.O.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
                                                                    },
                                                                    buyMax() {
                                                                        // I'll do this later ehehe
                                                                    },
                                                                    style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
                                                                    autoed() { return false},
                                                                },
                                                            },
                                                        OpowerEff() { 
                                                            let eff = Decimal.sub(4, Decimal.div(4, player.O.Opower.plus(1).log10().plus(1))) 
                                                            player.O.OpowerEff = eff
                                                            return eff
                                                        },
                                                        solEnEff2() {let eff2 = player.O.Opower.plus(1).pow(2)
                                                            if (eff2>1e40) eff2 = ((eff2.div(1e40)).root(10)).mul(1e40)
                                                            if (eff2>1e50) eff2 = ((eff2.div(1e50)).root(100)).mul(1e50)
                                                            if (eff2>1e70) eff2 = ((eff2.div(1e70)).root(1e200)).mul(1e70)
                                                        player.O.OpowerEff2 = eff2
                                                        return eff2 },
                                                        Opowergain() { 
                                                            
                                                            let gain = new Decimal(2).times(player.O.effect).pow(player.O.effect2).sub(1);
                                                            player.O.Opowergain = gain
                                                            return gain;
                                                        },
                                                        update(diff) {
                                                            player.O.Opower = player.O.Opower.plus(player.O.Opowergain.times(diff))
                                                        },
                                                        gainMult() {            
                                                            let mult = new Decimal(1)
                                                            mult = mult.mul(((player.N.points).sub(12)).pow(2))    
                                                            mult = mult.mul(buyableEffect("O",11))  
                                                                          // Returns your multiplier to your gain of the prestige resource.
                                                            return mult              // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                        passiveGeneration(){return hasUpgrade('H',22)? 100 : 0},
                                                    
                                                        layerShown() { return player.N.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
                                                    
                                                        upgrades: {
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                        resetsNothing(){return true},
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "8号元素-氧",
                                                                    body(){
                                                                            let a = "你已经收集了1e100个氢原子，足够聚变生成一个氧原子了！"
                                                                            let b = "聚变氧原子不会消耗任何更低层级的资源。"
                                                                            let c = "氧（Oxygen）是一种化学元素，其原子序数为8，相对原子质量为15.9994。"
                                                                            let d = "在元素周期表中，氧是氧族元素的一员，它也是一个高反应性的第二周期非金属元素，很容易与几乎所有其他元素形成化合物（主要为氧化物）。"
                                                                            let e = "两个氧原子结合形成氧气，是一种无色无臭无味的双原子气体，化学式为O2。。 "
                                                                            e += "如果按质量计算，氧在宇宙中的含量仅次于氢和氦，在地壳中，氧则是含量最丰富的元素。氧不仅占了水质量的89%，也占了空气体积的20.9%。 "
                                                                            let f = "构成有机体的所有主要化合物都含有氧，包括蛋白质、碳水化合物和脂肪。"
                                                                            let g = "构成动物壳、牙齿及骨骼的主要无机化合物也含有氧。" 
                                                                            let h = "氧的同位素已知的有十七种，包括氧-12至氧-28，其中氧-16、氧-17和氧-18三种属于稳定型，其他已知的同位素都带有放射性，其半衰期全部均少于三分钟。"
                                                                            let i = "试着通过重置将全部基本粒子、1-6号元素原子聚合成氧原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                                    
                                                            },
                                                        },
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#FFF68F"},
                                                                req() {
                                                                    let req =new Decimal(1e200)
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        tabFormat:{
                                                            "Main":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                ["display-text",
                                                                function() {return '你有 ' + format(player.O.points) + '氧，正在每秒生产氧气'},
                                                                    {}],
                                                                    ["display-text",
                                                                function() {return '你有 ' + format(player.O.Opower) + '氧气(O₂)'},
                                                                    {}],
                                                                    ["display-text",
                                                                function() {return '你的氧气使木炭能量增强器软上限削弱' + format(player.O.OpowerEff) + '%(上限为4%)'},
                                                                    {}],
                                                                    ["display-text",
                                                                function() {return '同时也使氢获取倍增' + format(player.O.OpowerEff2) + 'x(当大于1e40时受到10次方根限制)(当大于1e50时受到100次方根限制)(上限为1e70)'},
                                                                    {}],
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    },
                                                        },
                                                    })
                                                    addLayer("F", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                        symbol:"F",
                                                        branches:["C"],
                                                        color: "#FFF68F",                       // The color for this layer, which affects many elements.
                                                        resource: "氟",            // The name of this layer's main prestige resource.
                                                        row: 3,
                                                        position: 13,                                 // The row this layer is on (0 is the first row).
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e200),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "static",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 2.1,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                        milestones: {
                                                            0: {
                                                                requirementDescription: "氟气集气瓶(10氟)",
                                                                effectDescription: "自动进行硼重置",
                                                                done() {
                                                                    return player.F.points.gte(10)
                                                                }
                                                            },
                                                            1: {
                                                                requirementDescription: "工业氟气罐(30氟)",
                                                                effectDescription: "自动进行氮重置",
                                                                done() {
                                                                    return player.F.points.gte(30)
                                                                 
                                                                }
                                                            },
                                                        },
                                                        challenges: { //CompleteOrder:11x1,11x2,12x1,11x3,21x1,12x2,22x1,12x3,21x2,21x3,22x2,22x3
                                                            rows: 2,
                                                            cols: 2,
                                                            11: {
                                                                name: "氟化氢(HF)",
                                                                currencyDisplayName: "木炭能量",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "木炭能量发生器、助推器和增强器的效果^0.8"
                                                                    if (inChallenge("F", 11)) c11 = c11 + " (挑战中)"
                                                                    if (challengeCompletions("F", 11) == 1) c11 = c11 + " (已完成)"
                                                                    c11 = c11 + "<br>分子数目:" + challengeCompletions("F",11) + "/" + tmp.F.challenges[11].completionLimit
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("F", 11) == 0) return Decimal.pow(10,14);
                                                                    if (challengeCompletions("F", 11) == 1) return Decimal.pow(10,17);
                                                                    if (challengeCompletions("F", 11) == 2) return Decimal.pow(10,22);
                                                                },
                                                                completionLimit:3 ,

                                                                rewardDescription: "木炭能量增强器效果软上限削弱",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(10)
                                                                    let c11c = challengeCompletions("F", 11)
                                                                    c11 = c11.mul(c11c)
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(tmp.F.challenges[11].rewardEffect)+"%(第1次完成该挑战时，解锁过氧化氢！)"},
                                                                onEnter() { 
                                                                        startCChallenge()
                                                                    
                                                                },
                                                                unlocked(){
                                                                    return true
                                                                }
                                                            },
                                                            12: {
                                                                name: "二氟化氧(OF₂)",
                                                                currencyDisplayName: "木炭能量",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "木炭能量增强器的一重软上限立即开始"
                                                                    if (inChallenge("F", 12)) c11 = c11 + " (挑战中)"
                                                                    if (challengeCompletions("F", 12) == 1) c11 = c11 + " (已完成)"
                                                                    c11 = c11 + "<br>分子数目:" + challengeCompletions("F",12) + "/" + tmp.F.challenges[12].completionLimit
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("F", 12) == 0) return Decimal.pow(10,18);
                                                                    if (challengeCompletions("F", 12) == 1) return Decimal.pow(10,34);
                                                                    if (challengeCompletions("F", 12) == 2) return Decimal.pow(10,60);
                                                                },
                                                                completionLimit:3 ,

                                                                rewardDescription: "加强时间速度效果",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(10)
                                                                    let c11c = new Decimal(challengeCompletions("F", 12))
                                                                    c11 = c11.pow(c11c)
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(tmp.F.challenges[12].rewardEffect)+"x(第1次完成该挑战时，解锁一氧化碳和二氧化碳！)"},
                                                                onEnter() { 
                                                                        startCChallenge()
                                                                    
                                                                },
                                                                unlocked(){
                                                                    return true
                                                                }
                                                            },
                                                            21: {
                                                                name: "次氟酸(HOF)",
                                                                currencyDisplayName: "木炭能量",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "氮层级所有升级全部无效"
                                                                    if (inChallenge("F", 21)) c11 = c11 + " (挑战中)"
                                                                    if (challengeCompletions("F", 21) == 1) c11 = c11 + " (已完成)"
                                                                    c11 = c11 + "<br>分子数目:" + challengeCompletions("F",21) + "/" + tmp.F.challenges[21].completionLimit
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("F", 21) == 0) return Decimal.pow(10,40);
                                                                    if (challengeCompletions("F", 21) == 1) return Decimal.pow(10,92);
                                                                    if (challengeCompletions("F", 21) == 2) return Decimal.pow(10,98);
                                                                },
                                                                completionLimit:3 ,

                                                                rewardDescription: "提升时间速度基数",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(0)
                                                                    let c11c = new Decimal(challengeCompletions("F", 21))
                                                                    c11 = c11.add(c11c.mul(0.5))
                                                                    if (player.Ne.points.gte(1)) c11 = c11.mul(((tmp.Ne.effect).div(100)).add(1))
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(tmp.F.challenges[21].rewardEffect)+"+(第1次完成该挑战时，解锁三氧化碳和四氧化碳！)"},
                                                                onEnter() { 
                                                                        startCChallenge()
                                                                    
                                                                },
                                                                unlocked(){
                                                                    return true
                                                                }
                                                            },
                                                            22: {
                                                                name: "氟化锂(LiF)",
                                                                currencyDisplayName: "木炭能量",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "木炭能量助推器和木炭能量增强器被灾难性削弱"
                                                                    if (inChallenge("F", 22)) c11 = c11 + " (挑战中)"
                                                                    if (challengeCompletions("F", 22) == 1) c11 = c11 + " (已完成)"
                                                                    c11 = c11 + "<br>分子数目:" + challengeCompletions("F",22) + "/" + tmp.F.challenges[22].completionLimit
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("F", 22) == 0) return Decimal.pow(10,52);
                                                                    if (challengeCompletions("F", 22) == 1) return Decimal.pow(10,73);
                                                                    if (challengeCompletions("F", 22) == 2) return Decimal.pow(10,74);
                                                                },
                                                                completionLimit:3 ,

                                                                rewardDescription: "提升过氧化氢效果",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(1)
                                                                    let c11c = new Decimal(challengeCompletions("F", 22))
                                                                    c11 = c11.add(c11c.mul(new Decimal(0.15)))
                                                                    if (player.Ne.points.gte(1)) c11 = c11.mul(((tmp.Ne.effect).div(100)).add(1))
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(tmp.F.challenges[22].rewardEffect)+"^(第1次完成该挑战时，解锁五氧化碳！)"},
                                                                onEnter() { 
                                                                        startCChallenge()
                                                                    
                                                                },
                                                                unlocked(){
                                                                    return true
                                                                }
                                                            },
                                                        },
                                                        autoPrestige(){return hasUpgrade("Na",41)},
                                                        effect() { 
                                                            let eff = Decimal.sub(4, Decimal.div(4, player.F.points.plus(1).log10().plus(1))) 
                                                            if(hasUpgrade("H",23)) eff = eff.mul(upgradeEffect("H",23))
                                                            player.F.OpowerEff = eff
                                                            return eff
                                                        },
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#6600FF"},
                                                                req() {
                                                                    let req =new Decimal("1e650")
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "9号元素-氟",
                                                                    body(){
                                                                            let a = "你已经收集了1e200个氢原子，足够聚变生成一个氟原子了！"
                                                                            let b = "聚变氟原子不会消耗任何更低层级的资源。"
                                                                            let c = "氟（Fluorine）是一种非金属化学元素，化学符号为F，原子序数为9。"
                                                                            let d = "氟是卤族元素之一，属周期系ⅦA族，在元素周期表中位于第二周期。氟元素的单质是F2，它是一种淡黄色 [1]  有剧毒的气体。"
                                                                            let e = "氟气的腐蚀性很强，化学性质极为活泼，是氧化性最强的物质之一，甚至可以和部分惰性气体在一定条件下反应 [2]  。"
                                                                            e += "氟是特种塑料、橡胶和冷冻机（氟氯烷）中的关键元素。由于氟的特殊化学性质，氟化学在化学发展史上有重要的地位。 "
                                                                            let f = "氟是已知元素中非金属性最强的元素，这使得其没有正氧化态。"
                                                                            let g = "氟的基态原子价电子层结构为2s22p5，且氟具有极小的原子半径，因此具有强烈的得电子倾向，具有强的氧化性，是已知的最强的氧化剂之一。" 
                                                                            let h = "氟的卤素互化物有ClF、ClF3、BrF3、IF5等。"
                                                                            let i = "试着通过重置将全部基本粒子、1-6号元素原子聚合成氟原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                                    
                                                            },
                                                        },
                                                        
                                                        layerShown() { return player.O.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
                                                        resetsNothing(){return true},
                                                        upgrades: {
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                        tabFormat:{
                                                            "Main":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            "challenges",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    },
                                                        },
                                                        effectDescription() {
                                                            return "倍增时间速度效果" + format(tmp.F.effect) + "x"
                                                        },
                                                    })
                                                    addLayer("Ne", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0), 
                                                            power:new Decimal(0),
                                                            Unpower:new Decimal(0),
                                                            Time:new Decimal(0)           // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                    
                                                        color: "#6600FF",                       // The color for this layer, which affects many elements.
                                                        resource: "氖",            // The name of this layer's main prestige resource.
                                                        row: 4,      
                                                        branches:["N","O","F"],                           // The row this layer is on (0 is the first row).
                                                    
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal("1e650"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "static",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 3,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                        effect(){
                                                        let eff = new Decimal(0)
                                                        eff = eff.add((player.Ne.points.add(2).log2()).mul(15))
                                                        return eff
                                                        },
                                                        autoPrestige(){return hasUpgrade("Na",41)},
                                                        effect2(){
                                                            let eff = new Decimal(1)
                                                            eff = eff.mul(new Decimal(2).pow(player.Ne.points)).sub(1)
                                                            if(getBuyableAmount("Ne",11).gte(1)) eff = eff.mul(buyableEffect("Ne",11))
                                                            if(getBuyableAmount("Ne",21).gte(1)) eff = eff.mul(buyableEffect("Ne",21))
                                                            if(getBuyableAmount("Ne",31).gte(1)) eff = eff.mul(buyableEffect("Ne",31))
                                                            if(getBuyableAmount("Ne",41).gte(1)) eff = eff.mul(buyableEffect("Ne",41))
                                                            if(getBuyableAmount("Ne",51).gte(1)) eff = eff.mul(buyableEffect("Ne",51))
                                                            if(getBuyableAmount("Ne",61).gte(1)) eff = eff.mul(buyableEffect("Ne",61))
                                                            if(hasUpgrade("H",24)) eff = eff.mul(upgradeEffect("H",24))
                                                            if (hasUpgrade("Mg",22)) eff = eff.mul(upgradeEffect("Mg",22))
                                                            return eff
                                                            },
                                                        layerShown() { return player.F.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
                                                        resetsNothing(){return true},
                                                        upgrades: {
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                        effectDescription() {
                                                            return "倍增氟化锂、次氟酸、水、臭氧效果" + format(tmp.Ne.effect) + "%，"+"并且每秒生产氖气"+format(tmp.Ne.effect2)+""
                                                        },
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "10号元素-氖",
                                                                    body(){
                                                                            let a = "你已经收集了1e650个氢原子，足够聚变生成一个氖原子了！"
                                                                            let b = "聚变氖原子不会消耗任何更低层级的资源。"
                                                                            let c = "氖（Neon）（旧译作氝，讹作氞），是一种化学元素，化学符号是Ne，它的原子序数是10，"
                                                                            let d = "是一种无色的稀有气体，把它放电时呈橙红色。"
                                                                            let e = "氖最常用在霓虹灯之中。空气中含有少量氖。属零族元素，化学性质极不活泼，为稀有气体的成员之一。"
                                                                            e += "氖至今仍没有一种确认存在的化合物，只发现了一些不稳定的阳离子和未经证实的水合物。 "
                                                                            let f = "氖的核外电子排布式为1s22s22p6，属于稳定的8电子构型，同时氖原子较小，原子核对电子束缚力较强，导致氖元素的化学性质很稳定。"
                                                                            let g = "氖发射的明亮的红橙色的光常被用来做霓虹灯做广告。其它应用有：" 
                                                                            let h = "真空管、高压指示器、避雷针、电视机荧光屏、氦-氖激光，用作冷却液（液氖），用于高能物理研究，让氖充满火花室来探测微粒的行径，填充水银灯和钠蒸气灯等。"
                                                                            let i = "试着通过重置将全部基本粒子、1-9号元素原子聚合成氖原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                                    
                                                            },
                                                        },
                                                        buyables:
                                                        {
                                                            11: {
                                                                unlocked(){return player.Ne.points.gte(1)},
                                                              title: "濒临损坏的氖光管<br>*电量达到50%、70%、85%、100%时，解锁1个氢升级",
                                                              cost(x) {if ((getBuyableAmount(this.layer,this.id))<100000) return new Decimal(10).mul(new Decimal(1.12).pow(x))
                                                              },
                                                              canAfford() { return player.Ne.power.gte(this.cost())},
                                                              autoed(){return hasUpgrade("C",11)},
                                                              buy() {
                                                                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                 player[this.layer].power = player[this.layer].power.sub(tmp[this.layer].buyables[this.id].cost)
                                                              },
                                                              display() {return `\n电量： ${format(getBuyableAmount(this.layer, this.id))}%\n充电消耗：${format(this.cost())}氖气\n效果：将你的不纯的氖气获取乘以x${format(this.effect())}倍`},
                                                              effect(x) { 
                                                                eff = new Decimal(x).add(1)
                                                                return eff
                                                            },
                                                            style() { return {'background-color': "#220033", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-radius': "25px", height: "100px", width: "600px"}},
                                                        },
                                                        21: {
                                                            unlocked(){return player.Ne.points.gte(3)},
                                                          title: "黯淡的氖光管<br>*电量达到6%时，解锁1个氦可购买;电量达到12%、20%、30%时，解锁1个氦升级",
                                                          cost(x) {return new Decimal(15000).mul(new Decimal(1.2).pow(x))},
                                                          canAfford() { return player.Ne.power.gte(this.cost())},
                                                          autoed(){return hasUpgrade("C",11)},
                                                          buy() {
                                                             setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                             player[this.layer].power = player[this.layer].power.sub(tmp[this.layer].buyables[this.id].cost)
                                                          },
                                                          display() {return `\n电量： ${format(getBuyableAmount(this.layer, this.id))}%\n充电消耗：${format(this.cost())}氖气\n效果：将你的不纯的氖气获取乘以x${format(this.effect())}倍`},
                                                          effect(x) { 
                                                            eff = new Decimal(x).pow(2).add(1)
                                                            return eff
                                                        },
                                                        style() { return {'background-color': "#440066", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-radius': "25px", height: "100px", width: "600px"}},
                                                    },
                                                    31: {
                                                        unlocked(){return player.Ne.points.gte(5)},
                                                      title: "平凡的氖光管<br>*电量达到5%时，解锁1个锂挑战；电量达到10%时，解锁1个锂升级",
                                                      cost(x) {return new Decimal(200000).mul(new Decimal(3).pow(x))},
                                                      canAfford() { return player.Ne.power.gte(this.cost())},
                                                      autoed(){return hasUpgrade("C",11)},
                                                      buy() {
                                                         setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                         player[this.layer].power = player[this.layer].power.sub(tmp[this.layer].buyables[this.id].cost)
                                                      },
                                                      display() {return `\n电量： ${format(getBuyableAmount(this.layer, this.id))}%\n充电消耗：${format(this.cost())}氖气\n效果：将你的不纯的氖气获取乘以x${format(this.effect())}倍`},
                                                      effect(x) { 
                                                        eff = new Decimal(x).pow(3).add(1)
                                                        return eff
                                                    },
                                                    style() { return {'background-color': "#550099", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-radius': "25px", height: "100px", width: "600px"}},
                                                },
                                                41: {
                                                    unlocked(){return player.Ne.points.gte(8)},
                                                  title: "明亮的氖光管<br>*电量达到2%、5%时，解锁1个铍可购买",
                                                  cost(x) {return new Decimal(150000000).mul(new Decimal(20).pow(x))},
                                                  canAfford() { return player.Ne.power.gte(this.cost())},
                                                  autoed(){return hasUpgrade("C",11)},
                                                  buy() {
                                                     setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                     player[this.layer].power = player[this.layer].power.sub(tmp[this.layer].buyables[this.id].cost)
                                                  },
                                                  display() {return `\n电量： ${format(getBuyableAmount(this.layer, this.id))}%\n充电消耗：${format(this.cost())}氖气\n效果：将你的不纯的氖气获取乘以x${format(this.effect())}倍`},
                                                  effect(x) { 
                                                    eff = new Decimal(x).pow(4).add(1)
                                                    return eff
                                                  },
                                                style() { return {'background-color': "#6600AA", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-radius': "25px", height: "100px", width: "600px"}},
                                                },
                                                51: {
                                                    unlocked(){return player.Ne.points.gte(9)},
                                                  title: "超亮的氖光管<br>*电量达到1%时，解锁戊硼烷；电量达到2%，4%，6%，8%时解锁1个硼升级",
                                                  cost(x) {return new Decimal(12000000000).mul(new Decimal(120).pow(x))},
                                                  canAfford() { return player.Ne.power.gte(this.cost())},
                                                  autoed(){return hasUpgrade("C",11)},
                                                  buy() {
                                                     setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                     player[this.layer].power = player[this.layer].power.sub(tmp[this.layer].buyables[this.id].cost)
                                                  },
                                                  display() {return `\n电量： ${format(getBuyableAmount(this.layer, this.id))}%\n充电消耗：${format(this.cost())}氖气\n效果：将你的不纯的氖气获取乘以x${format(this.effect())}倍`},
                                                  effect(x) { 
                                                    eff = new Decimal(x).pow(5).add(1)
                                                    return eff
                                                },
                                                style() { return {'background-color': "#8800DD", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-radius': "25px", height: "100px", width: "600px"}},
                                            },
                                                61: {
                                                    unlocked(){return player.Ne.points.gte(10)},
                                                  title: "闪瞎双眼的氖光管<br>*电量达到100%时，解锁碳60能量！",
                                                  cost(x) {return new Decimal(6.2e12).mul(new Decimal(413).pow(x))},
                                                  canAfford() { return player.Ne.power.gte(this.cost())},
                                                  autoed(){return hasUpgrade("C",11)},
                                                  buy() {
                                                     setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                     player[this.layer].power = player[this.layer].power.sub(tmp[this.layer].buyables[this.id].cost)
                                                  },
                                                  display() {return `\n电量： ${format(getBuyableAmount(this.layer, this.id))}%\n充电消耗：${format(this.cost())}氖气\n效果：将你的不纯的氖气获取乘以x${format(this.effect())}倍`},
                                                  effect(x) { 
                                                    eff = new Decimal(x).pow(6).add(1)
                                                    return eff
                                                },
                                                style() { return {'background-color': "#9900FF", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-radius': "25px", height: "100px", width: "600px"}},
                                            },
                                                71: {
                                                    title: "氖气提纯",
                                                    gain() { 
                                                        let gain = player.Ne.Unpower.div(10).pow(0.5)
                                                    if(hasUpgrade("H",24)) gain = gain.mul(upgradeEffect("H",24))
                                                    gain = gain.mul(player.Ne.Time.mul(0.05))
                                                    if(hasMilestone("C",16)) gain = gain.mul(player.C.Rank)
                                                    if(hasMilestone("C",17)) gain = gain.mul(buyableEffect("He",11))
                                                    if(hasUpgrade("B",23)) gain = gain.mul(upgradeEffect("B",23))
                                                    if (hasUpgrade("Mg",22)) gain = gain.mul(upgradeEffect("Mg",22))
                                                    if(hasUpgrade("Mg",24)) gain = gain.mul(upgradeEffect("Mg",24))
                                                    return gain
                                                },
                                                    display() { // Everything else displayed in the buyable button after the title
                                                        let data = tmp[this.layer].buyables[this.id]
                                                        let display = ("消耗你所有的不纯的氖气和30%氧，获得"+formatWhole(tmp[this.layer].buyables[this.id].gain)+"氖气\n"+
                                                        "需要: 10氖\n"+
                                                        "提纯效率：^0.5(tips:氖气提纯间隔时间的0.05倍将会作为氖气提纯量的乘数)\n")
                                                        return display;
                                                    },
                                                    unlocked() { return true }, 
                                                    canAfford() { return true},
                                                    buy() { 

                                                         player.Ne.power = player.Ne.power.add(tmp[this.layer].buyables[this.id].gain)
                                                         player.Ne.Unpower = new Decimal(0)
                                                         player.O.power = player.O.power.mul(0.7)
                                                         
                                                    },
                                                    buyMax() {
                                                        // I'll do this later ehehe
                                                    },
                                                    style() { return {'background-color': "#999999", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-radius': "25px", height: "100px", width: "300px"}},
                                                    autoed() { return false},
                                                },
                                                    
                                                

                                                        },
                                                        milestones:{
                                                            0: {
                                                                requirementDescription: "小氖气集气瓶(1氖)",
                                                                effectDescription: "解锁一种新的氖管",
                                                                done() {
                                                                    return player.Ne.points.gte(1)
                                                                }
                                                            },
                                                            1: {
                                                                requirementDescription: "氖气集气瓶(3氖)",
                                                                effectDescription: "再次解锁一种新的氖管",
                                                                done() {
                                                                    return player.Ne.points.gte(3)
                                                                }
                                                            },
                                                            2: {
                                                                requirementDescription: "大氖气集气瓶(5氖)",
                                                                effectDescription: "再次解锁一种新的氖管",
                                                                done() {
                                                                    return player.Ne.points.gte(5)
                                                                }
                                                            },
                                                            3: {
                                                                requirementDescription: "特大氖气集气瓶(濒临损坏的氖光管 充电75%)",
                                                                effectDescription: "所有氖光管以提升的效率倍增氢获取",
                                                                done() {
                                                                    return getBuyableAmount("Ne",11).gte(75)
                                                                }
                                                            },
                                                            4: {
                                                                requirementDescription: "巨氖气集气瓶(8氖)",
                                                                effectDescription: "再次解锁一种新的氖管",
                                                                done() {
                                                                    return player.Ne.points.gte(8)
                                                                }
                                                            },
                                                            5: {
                                                                requirementDescription: "特巨氖气集气瓶(黯淡的氖光管 充电90%)",
                                                                effectDescription: "所有氖光管的效率倍增氦获取",
                                                                done() {
                                                                    return getBuyableAmount("Ne",21).gte(90)
                                                                }
                                                            },
                                                            6: {
                                                                requirementDescription: "小型工业氖气罐(9氖)",
                                                                effectDescription: "再次解锁一种新的氖管",
                                                                done() {
                                                                    return player.Ne.points.gte(9)
                                                                }
                                                            },
                                                            7: {
                                                                requirementDescription: "工业氖气罐(10氖)",
                                                                effectDescription: "解锁最后一种新的氖管",
                                                                done() {
                                                                    return player.Ne.points.gte(10)
                                                                }
                                                            },


                                                        },
                                                        tabFormat:{
                                                            "Mult":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            ["display-text",
                                                                function() {return '你的不纯的氖气是<h2 style=color:#3300FF;text-shadow:0px 0px 10px;>' + format(player.Ne.Unpower) + '<h2>'},
                                                                    {}],
                                                            ["display-text",
                                                                function() {return '你的氖气是<h2 style=color:#6611FF;text-shadow:0px 0px 10px;>' + format(player.Ne.power) + '<h2>'},
                                                                    {}],
                                                            "challenges",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    },
                                                    "Milestones":{
                                                        content:[ "main-display",
                                                        "prestige-button",
                                                        "blank",
                                                        "milestones"]    
                                                    }
                                                        },
                                                        update(diff) {
                                                            if (player.Ne.points.gte(1)) player.Ne.Unpower = player.Ne.Unpower.plus(tmp.Ne.effect2.times(diff).pow(1));
                                                            if (player.Ne.points.gte(1)) player.Ne.Time = player.Ne.Time.plus(diff)
                                                            if (hasUpgrade("Na",41)) player.Ne.power = player.Ne.power.add((new Decimal(1000).mul(diff).mul(tmp[this.layer].buyables[71].gain)))
                                                            if (hasMilestone("Mg",0)) buyBuyable("Ne",11)
                                                            if (hasMilestone("Mg",0)) buyBuyable("Ne",21)
                                                            if (hasMilestone("Mg",0)) buyBuyable("Ne",31)
                                                            if (hasMilestone("Mg",0)) buyBuyable("Ne",41)
                                                            if (hasMilestone("Mg",0)) buyBuyable("Ne",51)
                                                            if (hasMilestone("Mg",0)) buyBuyable("Ne",61)

                                                        },
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#f0840c"},
                                                                req() {
                                                                    let req =new Decimal("1e950")
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢并解锁一氟化硼以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                    })
                                                    addLayer("Na", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),  
                                                            research: new Decimal(0),
                                                            power1: new Decimal(0),
                                                            power2: new Decimal(0), 
                                                            power3: new Decimal(0), 
                                                            power4: new Decimal(0), 
                                                            power5: new Decimal(0),            // "points" is the internal name for the main resource of the layer.
                                                            power6: new Decimal(0), 
                                                            power7: new Decimal(0),
                                                            layer1: new Decimal(0),
                                                            layer2: new Decimal(0),
                                                            layer3: new Decimal(0),
                                                            layer4: new Decimal(0),
                                                            layer5: new Decimal(0),
                                                            layer6: new Decimal(0),
                                                            layer7: new Decimal(0),
                                                            layer1limit:new Decimal(0),
                                                            layer2limit:new Decimal(0),
                                                            layer3limit:new Decimal(0),
                                                            layer4limit:new Decimal(0),
                                                            layer5limit:new Decimal(0),
                                                            layer6limit:new Decimal(0),
                                                            layer7limit:new Decimal(0),
                                                            rewardEffect1:new Decimal(1),
                                                            rewardEffect2:new Decimal(1),
                                                            rewardEffect3:new Decimal(1),
                                                            rewardEffect4:new Decimal(1),
                                                            rewardEffect5:new Decimal(1),
                                                            rewardEffect6:new Decimal(1),
                                                            rewardEffect7:new Decimal(1),
                                                            effect:new Decimal(1),
                                                        }},
                                                        researcheffect(){
                                                            let eff = new Decimal(1)
                                                            if(!hasUpgrade("Na",53))eff = eff.mul(player.Na.research.add(1)).log10().add(1)
                                                            if(hasUpgrade("Na",53))eff = eff.mul(player.Na.research.add(1)).ln().add(1)
                                                            return eff
                                                        },
                                                        tabFormat:{
                                                            "SodiumResearch":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            
                                                            "upgrades",
                                                            
                                                            "challenges",
                                                        "grid",

            "blank",
            
            "milestones",
            
           
            "blank",
            , "blank", "blank", ]
                                                    },
                                                    "SuperSodiumResearch(Tier1)":{
                                                        content:[ "main-display",
                                                        "prestige-button",
                                                        ["display-text",
                                                                function() {return '您拥有<h2 style=color:#0000FF;text-shadow:0px 0px 10px;>' + format(player.Na.research) + '<h2>低阶钠精研点数,降低钠离子与氢氧化钠研究阈值<h2 style=color:#0000FF;text-shadow:0px 0px 10px;>'+format(tmp.Na.researcheffect)},
                                                                    {}],
                                                        
                                                                    ["buyable",11],
                                                                    "blank",
                                                                    ["buyable",41],
                                                                    "blank",
                                                                    ["buyable",21],
                                                                    "blank",
                                                                    "blank",
                                                                    "blank",
                                                                    ["row",[["buyable", 31], ["buyable", 32]]],
                                                                    "blank",
                                                                    "blank",
                                                                    "blank",
                                                                    ["row",[["buyable", 51], ["buyable", 52]]],
                                                                    "blank",
                                                                    "blank",
                                                                    "blank",
                                                                    ["row",[["buyable", 61], ["buyable", 62], ["buyable", 63]]],
                                                                    
                                                        "blank",
                                                        
                                                        "milestones"]  ,
                                                        buttonStyle: {"border-color": "#0000FF","background-color": "#000088"},  
                                                        style:{"background-color":"#000033"},
                                                        unlocked(){return hasUpgrade("Na",41)}
                                                    }
                                                        },
                                                        bars: {
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#104ea2"},
                                                                req() {
                                                                    let req =new Decimal("1e3500")
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        infoboxes: {
                                                            introBox: {
                                                                    title: "11号元素-钠",
                                                                    body(){
                                                                            let a = "你已经收集了1e950个氢原子，足够聚变生成一个氖原子了！"
                                                                            let b = "聚变钠原子不会消耗任何更低层级的资源。"
                                                                            let c = "钠（Natrium）是一种金属元素，元素符号是Na，英文名sodium。"
                                                                            let d = "在周期表中位于第3周期、第ⅠA族，是碱金属元素的代表，"
                                                                            let e = "质地柔软，能与水反应生成氢氧化钠，放出氢气，化学性质较活泼。"
                                                                            e += "钠元素以盐的形式广泛的分布于陆地和海洋中，钠也是人体肌肉组织和神经组织中的重要成分之一。 "
                                                                            let f = "钠为银白色立方体结构金属，质软而轻可用小刀切割，密度比水小。"
                                                                            let g = "钠还能在二氧化碳中燃烧，和低元醇反应产生氢气，和电离能力很弱的液氨也能反应，具有抗腐蚀性。" 
                                                                            let h = "钠原子的最外层只有1个电子，很容易失去，所以有强还原性。"
                                                                            let i = "试着通过重置将全部基本粒子、1-9号元素原子聚合成钠原子吧！"
                                                    
                                                                            return a + b + c + " " + d + e + f + g + h + i
                                                                    },
                                                                    
                                                            },
                                                        },
                                                        buyables:{
                                                            11: {
                                                                title: "低阶钠精研",
                                                                gain() { 
                                                                    let gain = new Decimal(1)
                                                                    if (!getBuyableAmount("Na",31).gte(1))gain = gain.mul(player.Na.layer1.sub(66).pow(2))
                                                                    if (getBuyableAmount("Na",31).gte(1))gain = gain.mul(player.Na.layer1.sub(66).pow(2.5))
                                                                    if (!getBuyableAmount("Na",31).gte(1))gain = gain.mul(player.Na.layer2.sub(49).pow(3))
                                                                    if (getBuyableAmount("Na",31).gte(1))gain = gain.mul(player.Na.layer2.sub(49).pow(3.5))
                                                                    if(hasUpgrade("Mg",14)) gain = gain.mul(tmp.Mg.MgNeffect)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("重置你的前两种钠研究和钠，获得"+formatWhole(tmp[this.layer].buyables[this.id].gain)+"低阶钠精研点数\n"+
                                                                    "*钠精研点数很不稳定，在重置时所有旧获得的精研点数都会丢失！\n"+
                                                                    "需要: 66钠离子研究深度、50氢氧化钠研究深度\n"+
                                                                    "研究效率：30%\n")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return player.Na.layer1.gte(67)&&player.Na.layer2.gte(50)},
                                                                buy() { 
                                                                     player.Na.research = new Decimal(0)
                                                                     player.Na.layer1 = new Decimal(0)
                                                                     player.Na.layer2 = new Decimal(0)
                                                                     player.Na.power1 = new Decimal(0)
                                                                     player.Na.power2 = new Decimal(0)
                                                                     player.Na.research = player.Na.research.add(tmp[this.layer].buyables[this.id].gain)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-color': "#0000FF",'border-radius': "25px", height: "100px", width: "300px"}},
                                                                autoed() { return false},
                                                            },
                                                            21: {
                                                                unlocked(){return player.Na.research.gte(1)},
                                                              title: "钠-23",
                                                              cost(x) {if (!getBuyableAmount(this.layer, this.id).gte(1)) return new Decimal(1700000)
                                                                if (getBuyableAmount(this.layer, this.id).gte(1)) return new Decimal(1.7e308)},
                                                              canAfford() { return player.Na.research.gte(this.cost())},
                                                              buy() {
                                                                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                 player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                                              },
                                                              display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：每购买1个氖管，研究力量提升1%（叠加）\n当前：x${format(this.effect())}`},
                                                              effect(x) { 
                                                                eff = ((getBuyableAmount("Ne",11).add(getBuyableAmount("Ne",21)).add(getBuyableAmount("Ne",31)).add(getBuyableAmount("Ne",41)).add(getBuyableAmount("Ne",51)).add(getBuyableAmount("Ne",61)).mul(x)).add(100)).div(100)
                                                                if(getBuyableAmount("Na",51).gte(1)) eff = eff.pow(buyableEffect("Na",51).add(1))
                                                                return eff
                                                            },
                                                            style() {  if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                                            if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                                                        },
                                                        31: {
                                                            unlocked(){return getBuyableAmount("Na",21).gte(1)},
                                                          title: "钠-24(Research)",
                                                          cost(x) {if ((!getBuyableAmount(this.layer, this.id).gte(1))&&(!getBuyableAmount("Na",32).gte(1))) return new Decimal(50000000)
                                                          else return new Decimal(1.7e308)},
                                                          canAfford() { return player.Na.research.gte(this.cost())},
                                                          buy() {
                                                             setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                             player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                                          },
                                                          display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：精研点数获取基数+1\n当前：+${format(this.effect())}`},
                                                          effect(x) { 
                                                            eff = new Decimal(1).mul(x)
                                                            return eff
                                                        },
                                                        branches:["21"],
                                                        style() {  if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "cyan", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                                        if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                                                    },
                                                    32: {
                                                        unlocked(){return getBuyableAmount("Na",21).gte(1)},
                                                      title: "钠-25(Effect)",
                                                      cost(x) {if ((!getBuyableAmount(this.layer, this.id).gte(1))&&(!getBuyableAmount("Na",31).gte(1))) return new Decimal(1e10)
                                                        else return new Decimal(1.7e308)},
                                                      canAfford() { return player.Na.research.gte(this.cost())},
                                                      buy() {
                                                         setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                         player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                                      },
                                                      display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：研究力量以大大增强的倍率加成氢和基本粒子获取\n当前：x${format(this.effect())}`},
                                                      effect(x) { 
                                                        eff = player.Na.points.pow(75)
                                                        if(hasUpgrade("Mg",13)) eff = eff.pow(3)
                                                        return eff
                                                    },
                                                    branches:["21"],
                                                    style() {if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "yellow", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                                    if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                                                },
                                                51: {
                                                    unlocked(){return getBuyableAmount("Na",31).gte(1)||getBuyableAmount("Na",32).gte(1)},
                                                  title: "钠-26(Research)",
                                                  cost(x) {if ((!getBuyableAmount(this.layer, this.id).gte(1))&&(!getBuyableAmount("Na",52).gte(1))) return new Decimal(4e11)
                                                  else return new Decimal(1.7e308)},
                                                  canAfford() { return player.Na.research.gte(this.cost())},
                                                  buy() {
                                                     setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                     player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                                  },
                                                  display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：钠-23效果每有1个镁，提升0.25次方，且该精研效果的5次方提升镁效应\n当前：+${format(this.effect())}`},
                                                  effect(x) { 
                                                    eff = player.Mg.points.mul(0.25).add(1)
                                                    return eff
                                                },
                                                branches:["31"],
                                                style() {  if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "cyan", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                                if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                                            },
                                            52: {
                                                unlocked(){return getBuyableAmount("Na",31).gte(1)||getBuyableAmount("Na",32).gte(1)},
                                              title: "钠-27(Effect)",
                                              cost(x) {if ((!getBuyableAmount(this.layer, this.id).gte(1))&&(!getBuyableAmount("Na",51).gte(1))) return new Decimal(6e13)
                                                else return new Decimal(1.7e308)},
                                              canAfford() { return player.Na.research.gte(this.cost())},
                                              buy() {
                                                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                 player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                              },
                                              display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：氧化镁x氮化镁提升氢和基本粒子获取\n当前：x${format(this.effect())}`},
                                              effect(x) { 
                                                if(player.Mg.points.gte(1))eff = player.Mg.MgO
                                                if(player.Mg.points.gte(1))eff = eff.mul(player.Mg.MgN).pow(5)
                                                return eff
                                            },
                                            branches:["32"],
                                            style() {if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "yellow", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                            if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                                        },
                                        61: {
                                            unlocked(){return getBuyableAmount("Na",51).gte(1)||getBuyableAmount("Na",52).gte(1)},
                                          title: "钠-28(Research)",
                                          cost(x) {if ((!getBuyableAmount(this.layer, this.id).gte(1))&&(!getBuyableAmount("Na",63).gte(1))) return new Decimal(2e15)
                                          else return new Decimal(1.7e308)},
                                          canAfford() { return player.Na.research.gte(this.cost())},
                                          buy() {
                                             setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                             player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                          },
                                          display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：钠离子、氢氧化钠研究阈值除以镁效应\n当前：/${format(this.effect())}`},
                                          effect(x) { 
                                            eff = tmp.Mg.effect
                                            if(hasUpgrade("Mg",44)) eff = eff.pow(2)
                                            if(hasUpgrade("Mg",45)) eff = eff.pow(3)
                                            return eff
                                        },
                                        branches:["51"],
                                        style() {  if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "cyan", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                        if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                                    },
                                    62: {
                                        unlocked(){return getBuyableAmount("Na",51).gte(1)||getBuyableAmount("Na",52).gte(1)},
                                      title: "钠-29",
                                      cost(x) {if(!getBuyableAmount(this.layer, this.id).gte(1)) return new Decimal(2e16)
                                        if(getBuyableAmount(this.layer, this.id).gte(1)) return new Decimal(1.7e308)},
                                      canAfford() { return player.Na.research.gte(this.cost())},
                                      buy() {
                                         setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                         player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                      },
                                      display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：钠加成镁效应\n当前：x${format(this.effect())}`},
                                      effect(x) { 
                                        eff = player.Na.points
                                        return eff
                                    },
                                    
                                    branches:["51","52"],
                                    style() {  if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                    if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                                },
                                63: {
                                    unlocked(){return getBuyableAmount("Na",51).gte(1)||getBuyableAmount("Na",52).gte(1)},
                                  title: "钠-30(Effect)",
                                  cost(x) {if ((!getBuyableAmount(this.layer, this.id).gte(1))&&(!getBuyableAmount("Na",61).gte(1))) return new Decimal(6e17)
                                  else return new Decimal(1.7e308)},
                                  canAfford() { return player.Na.research.gte(this.cost())},
                                  buy() {
                                     setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                     player[this.layer].research = player[this.layer].research.sub(tmp[this.layer].buyables[this.id].cost)
                                  },
                                  display() {return `精研消耗：${format(this.cost())}低阶钠精研点数\n效果：上方研究以降低的速度提升全部硼烷获取\n当前：x${format(this.effect())}`},
                                  effect(x) { 
                                    eff = buyableEffect("Na",52).cbrt()
                                    return eff
                                },
                                branches:["52"],
                                style() {  if (!getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "yellow", 'border-color': "#0000FF",'border-radius': "25px", height: "120px", width: "240px"}
                                if (getBuyableAmount(this.layer,this.id).gte(1)) return {'background-color': "#00BB00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00FF00",'border-radius': "25px", height: "120px", width: "240px"}},
                            },
                                                41: {
                                                    title: "洗点",
                                                    gain() { 
                                                        let gain = player.Na.layer1.sub(66).pow(2)
                                                        gain = gain.mul(player.Na.layer2.sub(49).pow(3))
                                                    return gain
                                                },
                                                    display() { // Everything else displayed in the buyable button after the title
                                                        let data = tmp[this.layer].buyables[this.id]
                                                        let display = ("重置你已完成的所有低阶钠精研(*不退还精研点数)")
                                                        return display;
                                                    },
                                                    unlocked() { return true }, 
                                                    canAfford() { return true},
                                                    buy() { 
                                                        setBuyableAmount("Na",21,new Decimal(0))
                                                        setBuyableAmount("Na",31,new Decimal(0))
                                                        setBuyableAmount("Na",32,new Decimal(0))
                                                        setBuyableAmount("Na",51,new Decimal(0))
                                                        setBuyableAmount("Na",52,new Decimal(0))
                                                        setBuyableAmount("Na",61,new Decimal(0))
                                                        setBuyableAmount("Na",62,new Decimal(0))
                                                        setBuyableAmount("Na",63,new Decimal(0))
                                                         
                                                    },
                                                    buyMax() {
                                                        // I'll do this later ehehe
                                                    },
                                                    style() { return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-color': "#0000FF",'border-radius': "25px", height: "100px", width: "100px"}},
                                                    autoed() { return false},
                                                },
                                                    },
                                                        challenges:{
                                                            11: {
                                                                name: "钠离子(Na+)",
                                                                currencyDisplayName: "???",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "开始研究，提升钠离子研究深度"
                                                                    if (inChallenge("Na", 11)) c11 = c11 + " (研究中)"
                                                                    if (challengeCompletions("Na", 11) == 1) c11 = c11 + " (空闲)"
                                                                    c11 = c11 + "<br>深度:" + player.Na.layer1
                                                                    c11 = c11 + "<br>下一深度还需要" + format((player.Na.power1))  +"/"+format((player.Na.layer1limit))+"研究力量"
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("Na", 11) == 0) return Decimal.pow(10,1e308);
                                                                },
                                                                completionLimit:1,

                                                                rewardDescription: "提升基本粒子获取",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(1000)
                                                                    c11 = c11.pow(player.Na.layer1)
                                                                    if(hasUpgrade("Na",14))c11 = c11.mul(upgradeEffect("Na",14))
                                                                    if(hasUpgrade("Mg",42))c11 = c11.mul(tmp.Mg.MgCO3effect)
                                                                    player.Na.rewardEffect1 = c11
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(player.Na.rewardEffect1)+"x"},
                                                              
                                                                unlocked(){
                                                                    return true
                                                                }
                                                            },
                                                            12: {
                                                                name: "氢氧化钠(NaOH)",
                                                                currencyDisplayName: "???",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "开始研究，提升氢氧化钠研究深度"
                                                                    if (inChallenge("Na", 12)) c11 = c11 + " (研究中)"
                                                                    if (challengeCompletions("Na", 12) == 1) c11 = c11 + " (空闲)"
                                                                    c11 = c11 + "<br>深度:" + player.Na.layer2
                                                                    c11 = c11 + "<br>下一深度还需要" + format((player.Na.power2))  +"/"+format((player.Na.layer2limit))+"研究力量"
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("Na", 12) == 0) return Decimal.pow(10,1e308);
                                                                },
                                                                completionLimit:1,

                                                                rewardDescription: "提升氢获取与氢气效果",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(200)
                                                                    c11 = c11.pow(player.Na.layer2)
                                                                    if(hasUpgrade("Na",22))c11 = c11.mul(upgradeEffect("Na",22))
                                                                    if(hasUpgrade("Mg",42))c11 = c11.mul(tmp.Mg.MgCO3effect)
                                                                    player.Na.rewardEffect2 = c11
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(player.Na.rewardEffect2)+"x(该研究深度到达10时，解锁下一项研究！)"},
                                                              
                                                                unlocked(){
                                                                    return true
                                                                }
                                                            },
                                                            21: {
                                                                name: "硫酸钠(Na2SO4)",
                                                                currencyDisplayName: "???",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "开始研究，提升硫酸钠研究深度"
                                                                    if (inChallenge("Na", 21)) c11 = c11 + " (研究中)"
                                                                    if (challengeCompletions("Na", 21) == 1) c11 = c11 + " (空闲)"
                                                                    c11 = c11 + "<br>深度:" + player.Na.layer3
                                                                    c11 = c11 + "<br>下一深度还需要" + format((player.Na.power3))  +"/"+format((player.Na.layer3limit))+"研究力量"
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("Na", 21) == 0) return Decimal.pow(10,1e308);
                                                                },
                                                                completionLimit:1,

                                                                rewardDescription: "提升氦获取(研究效果)与氦-3效果(研究效果^0.3)",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(9)
                                                                    c11 = c11.pow(player.Na.layer3)
                                                                    if(hasUpgrade("Mg",42))c11 = c11.mul(tmp.Mg.MgCO3effect)
                                                                    player.Na.rewardEffect3 = c11
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(player.Na.rewardEffect3)+"x(该研究深度到达10时，解锁下一项研究！)"},
                                                              
                                                                unlocked(){
                                                                    return player.Na.layer2.gte(10)
                                                                }
                                                            },
                                                            22: {
                                                                name: "硼酸钠(Na2B4O7)",
                                                                currencyDisplayName: "???",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "开始研究，提升硼酸钠研究深度"
                                                                    if (inChallenge("Na", 22)) c11 = c11 + " (研究中)"
                                                                    if (challengeCompletions("Na", 22) == 1) c11 = c11 + " (空闲)"
                                                                    c11 = c11 + "<br>深度:" + player.Na.layer4
                                                                    c11 = c11 + "<br>下一深度还需要" + format((player.Na.power4))  +"/"+format((player.Na.layer4limit))+"研究力量"
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("Na", 22) == 0) return Decimal.pow(10,1e308);
                                                                },
                                                                completionLimit:1,

                                                                rewardDescription: "提升硼效应及丁硼烷效果",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(4)
                                                                    c11 = c11.pow(player.Na.layer4)
                                                                    if(hasUpgrade("Mg",42))c11 = c11.mul(tmp.Mg.MgCO3effect)
                                                                    player.Na.rewardEffect4 = c11
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(player.Na.rewardEffect4)+"x"},
                                                              
                                                                unlocked(){
                                                                    return player.Na.layer3.gte(10)
                                                                }
                                                            },
                                                            31: {
                                                                name: "碳酸钠(Na2CO3)",
                                                                currencyDisplayName: "???",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "开始研究，提升碳酸钠研究深度"
                                                                    if (inChallenge("Na", 31)) c11 = c11 + " (研究中)"
                                                                    if (challengeCompletions("Na", 31) == 1) c11 = c11 + " (空闲)"
                                                                    c11 = c11 + "<br>深度:" + player.Na.layer5
                                                                    c11 = c11 + "<br>下一深度还需要" + format((player.Na.power5))  +"/"+format((player.Na.layer5limit))+"研究力量"
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("Na", 31) == 0) return Decimal.pow(10,1e308);
                                                                },
                                                                completionLimit:1,

                                                                rewardDescription: "提升木炭能量获取与时间速度效果",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(5)
                                                                    c11 = c11.pow(player.Na.layer5)
                                                                    if(hasUpgrade("Mg",42))c11 = c11.mul(tmp.Mg.MgCO3effect)
                                                                    player.Na.rewardEffect5 = c11
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(player.Na.rewardEffect5)+"x"},
                                                              
                                                                unlocked(){
                                                                    return player.Na.layer4.gte(10)
                                                                }
                                                            },
                                                            32: {
                                                                name: "硝酸钠(NaNO3)",
                                                                currencyDisplayName: "???",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "开始研究，提升硝酸钠研究深度"
                                                                    if (inChallenge("Na", 32)) c11 = c11 + " (研究中)"
                                                                    if (challengeCompletions("Na", 32) == 1) c11 = c11 + " (空闲)"
                                                                    c11 = c11 + "<br>深度:" + player.Na.layer6
                                                                    c11 = c11 + "<br>下一深度还需要" + format((player.Na.power6))  +"/"+format((player.Na.layer6limit))+"研究力量"
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("Na", 32) == 0) return Decimal.pow(10,1e308);
                                                                },
                                                                completionLimit:1,

                                                                rewardDescription: "提升全部氮升级效果",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(3)
                                                                    c11 = c11.pow(player.Na.layer6)
                                                                    if(hasUpgrade("Mg",42))c11 = c11.mul(tmp.Mg.MgCO3effect)
                                                                    player.Na.rewardEffect6 = c11

                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(player.Na.rewardEffect6)+"x"},
                                                              
                                                                unlocked(){
                                                                    return true
                                                                }
                                                            },
                                                            41: {
                                                                name: "氧化钠(Na2O)",
                                                                currencyDisplayName: "???",
                                                                currencyInternalName: "Cpower",
                                                                currencyLayer: "C",
                                                                challengeDescription: function() {
                                                                    let c11 = "开始研究，提升氧化钠研究深度"
                                                                    if (inChallenge("Na", 41)) c11 = c11 + " (研究中)"
                                                                    if (challengeCompletions("Na", 41) == 1) c11 = c11 + " (空闲)"
                                                                    c11 = c11 + "<br>深度:" + player.Na.layer7
                                                                    c11 = c11 + "<br>下一深度还需要" + format((player.Na.power7))  +"/"+format((player.Na.layer7limit))+"研究力量"
                                                                    return c11
                                                                },
                                                                goal(){
                                                                    if (challengeCompletions("Na", 41) == 0) return Decimal.pow(10,1e308);
                                                                },
                                                                completionLimit:1,

                                                                rewardDescription: "提升提纯与未提纯氖气获取",
                                                                rewardEffect() {
                                                                    let c11 = new Decimal(111)
                                                                    c11 = c11.pow(player.Na.layer7)
                                                                    player.Na.rewardEffect7 = c11
                                                                    return c11
                                                               },
                                                               rewardDisplay() {return format(player.Na.rewardEffect7)+"x"},
                                                              
                                                                unlocked(){
                                                                    return false
                                                                }
                                                            },
                                                        },
                                                        upgrades: {
                                                            11: {
                                                            title: "钠原子(Na)",
                                                            description: "级别以降低的速度提升研究力量",
                                                            cost: new Decimal(1000),
                                                            currencyDisplayName: "钠离子研究力量",
                                                            currencyInternalName: "power1",
                                                            currencyLayer:"Na",
                                                            effect(){let eff = player.C.Rank.pow(0.3)
                                                                if(hasUpgrade("Na",34)) eff = eff.pow(3)
                                                                return eff},
                                                            effectDisplay(){return `x${format(this.effect())}`},
                                                            unlocked(){return true}
                                                            },
                                                        12: {
                                                            title: "氢化钠(NaH)",
                                                            description: "研究力量公式指数提升1",
                                                            cost: new Decimal(4),
                                                            currencyDisplayName: "钠",
                                                            currencyInternalName: "points",
                                                            currencyLayer:"Na",
                                                            effect(){return new Decimal(1)},
                                                            effectDisplay(){return `+${format(this.effect())}`},
                                                            unlocked(){return true}
                                                            },
                                                                13: {
                                                                title: "葡萄糖酸钠(C6H11NaO7)",
                                                                description: "阶层以降低的速度提升研究力量",
                                                                cost: new Decimal(10000),
                                                                currencyDisplayName: "氢氧化钠研究力量",
                                                                currencyInternalName: "power2",
                                                                currencyLayer:"Na",
                                                                effect(){let eff = player.C.Tier.pow(0.6)
                                                                    if(hasUpgrade("Na",35)) eff = eff.pow(3)
                                                                    return eff},
                                                                effectDisplay(){return `x${format(this.effect())}`},
                                                                unlocked(){return true}
                                                                },
                                                                
                                                                    15: {
                                                                        title: "亚硝酸钠(NaNO2)",
                                                                        description: "研究力量以大幅降低的速度提升超重水(上限10x)",
                                                                        cost: new Decimal(5),
                                                                        currencyDisplayName: "钠",
                                                                        currencyInternalName: "points",
                                                                        currencyLayer:"Na",
                                                                        effect(){return player.Na.points.pow(0.2)},
                                                                        effectDisplay(){return `x${format(this.effect())}`},
                                                                        unlocked(){return true}
                                                                        },
                                                                        21: {
                                                                            title: "丙酸钠(C3H5O2Na)",
                                                                            description: "此行每有1个升级，柠檬酸钠效果+0.05",
                                                                            cost: new Decimal(3),
                                                                            currencyDisplayName: "硫酸钠研究深度",
                                                                            currencyInternalName: "layer3",
                                                                            currencyLayer:"Na",
                                                                            effect(){let eff = new Decimal(0.05)
                                                                                if(hasUpgrade("Na",22)) eff = eff.add(0.05)
                                                                                if(hasUpgrade("Na",23)) eff = eff.add(0.05)
                                                                                if(hasUpgrade("Na",24)) eff = eff.add(0.05)
                                                                                if(hasUpgrade("Na",25)) eff = eff.add(0.05)
                                                                                if(hasUpgrade("Na",31)) eff = eff.add(upgradeEffect("Na",31))
                                                                            return eff},
                                                                            effectDisplay(){return `+${format(this.effect())}`},
                                                                            unlocked(){return hasUpgrade("Na",15)}
                                                                            },
                                                                            22: {
                                                                                title: "十八酸钠(C17H35COONa)",
                                                                                description: "柠檬酸钠效果同样适用于氢氧化钠",
                                                                                cost: new Decimal(4),
                                                                                currencyDisplayName: "硫酸钠研究深度",
                                                                                currencyInternalName: "layer3",
                                                                                currencyLayer:"Na",
                                                                                effect(){let eff = upgradeEffect("Na",14)
                                                                                return eff},
                                                                                effectDisplay(){return `^${format(this.effect())}`},
                                                                                unlocked(){return hasUpgrade("Na",15)}
                                                                                },
                                                                                23: {
                                                                                    title: "乳酸钠(C3H5O3Na)",
                                                                                    description: "每有1深度的前三种研究，研究力量指数就提升0.01",
                                                                                    cost: new Decimal(18),
                                                                                    currencyDisplayName: "氢氧化钠研究深度",
                                                                                    currencyInternalName: "layer2",
                                                                                    currencyLayer:"Na",
                                                                                    effect(){let eff = (player.Na.layer1.add(player.Na.layer2).add(player.Na.layer3)).mul(0.01)
                                                                                        if(hasUpgrade("Na",52)) eff = eff.add(upgradeEffect("Na",52))
                                                                                    return eff},
                                                                                    effectDisplay(){return `+${format(this.effect())}`},
                                                                                    unlocked(){return hasUpgrade("Na",15)}
                                                                                    },
                                                                                    24: {
                                                                                        title: "苹果酸钠(C4H4O5Na2·H2O)",
                                                                                        description: "前三种研究的成本提升指数-0.2",
                                                                                        cost: new Decimal(24),
                                                                                        currencyDisplayName: "钠离子研究深度",
                                                                                        currencyInternalName: "layer1",
                                                                                        currencyLayer:"Na",
                                                                                        effect(){let eff = new Decimal(0.2)
                                                                                        return eff},
                                                                                        effectDisplay(){return `-${format(this.effect())}`},
                                                                                        unlocked(){return hasUpgrade("Na",15)}
                                                                                        },
                                                                                        25: {
                                                                                            title: "醋酸钠(CH3COONa)",
                                                                                            description: "钠获取指数-2(这反而是加成！)",
                                                                                            cost: new Decimal(27),
                                                                                            currencyDisplayName: "钠离子研究深度",
                                                                                            currencyInternalName: "layer1",
                                                                                            currencyLayer:"Na",
                                                                                            effect(){let eff = new Decimal(2)
                                                                                            return eff},
                                                                                            effectDisplay(){return `-${format(this.effect())}`},
                                                                                            unlocked(){return hasUpgrade("Na",15)}
                                                                                            },
                                                                                            31: {
                                                                                                title: "氟化钠(NaF)",
                                                                                                description: "上方升级效果同样基于此列",
                                                                                                cost: new Decimal(1.5e8),
                                                                                                currencyDisplayName: "硼酸钠研究力量",
                                                                                                currencyInternalName: "power4",
                                                                                                currencyLayer:"Na",
                                                                                                effect(){let eff = new Decimal(0.15)
                                                                                                return eff},
                                                                                                effectDisplay(){return `+${format(this.effect())}`},
                                                                                                unlocked(){return hasUpgrade("Na",25)}
                                                                                                },
                                                                                                32: {
                                                                                                    title: "氮化钠(Na3N)",
                                                                                                    description: "柠檬酸钠以削弱的效果提升研究力量",
                                                                                                    cost: new Decimal(1),
                                                                                                    currencyDisplayName: "硼酸钠研究深度",
                                                                                                    currencyInternalName: "layer4",
                                                                                                    currencyLayer:"Na",
                                                                                                    effect(){let eff = upgradeEffect("Na",14).root(2)
                                                                                                    return eff},
                                                                                                    effectDisplay(){return `^${format(this.effect())}`},
                                                                                                    unlocked(){return hasUpgrade("Na",25)}
                                                                                                    },
                                                                                                    33: {
                                                                                                        title: "叠氮化钠(NaN3)",
                                                                                                        description: "和上一个升级效果相同，只是效果削减。",
                                                                                                        cost: new Decimal(2e11),
                                                                                                        currencyDisplayName: "碳酸钠研究力量",
                                                                                                        currencyInternalName: "power5",
                                                                                                        currencyLayer:"Na",
                                                                                                        effect(){let eff = upgradeEffect("Na",32).sqrt()
                                                                                                        return eff},
                                                                                                        effectDisplay(){return `^${format(this.effect())}`},
                                                                                                        unlocked(){return hasUpgrade("Na",25)},
                                                                                                        
                                                                                                        },
                                                                                                        34: {
                                                                                                            title: "甲酸钠(HCOONa)",
                                                                                                            description: "立方钠原子效果",
                                                                                                            cost: new Decimal(8),
                                                                                                            currencyDisplayName: "碳酸钠研究深度",
                                                                                                            currencyInternalName: "layer5",
                                                                                                            currencyLayer:"Na",
                                                                                                            effect(){let eff = new Decimal(3)
                                                                                                            return eff},
                                                                                                            effectDisplay(){return `^${format(this.effect())}`},
                                                                                                            unlocked(){return hasUpgrade("Na",25)},
                                                                                                            },
                                                                                                            35: {
                                                                                                                title: "苯甲酸钠(C7H5NaO2)",
                                                                                                                description: "立方葡萄糖酸钠效果",
                                                                                                                cost: new Decimal(11),
                                                                                                                currencyDisplayName: "碳酸钠研究深度",
                                                                                                                currencyInternalName: "layer5",
                                                                                                                currencyLayer:"Na",
                                                                                                                effect(){let eff = new Decimal(3)
                                                                                                                return eff},
                                                                                                                effectDisplay(){return `^${format(this.effect())}`},
                                                                                                                unlocked(){return hasUpgrade("Na",25)},
                                                                                                                },
                                                                                                                41: {
                                                                                                                    title: "松香酸钠(C20H29NaO2)",
                                                                                                                    description: "每秒获得1000倍氖提纯可获得的氖，氖提纯效率永久提升10%，你可以自动重置氟和氖。同时解锁*精研*",
                                                                                                                    cost: new Decimal(13),
                                                                                                                    currencyDisplayName: "碳酸钠研究深度",
                                                                                                                    currencyInternalName: "layer5",
                                                                                                                    currencyLayer:"Na",
                                                                                                                    effect(){let eff = new Decimal(10)
                                                                                                                    return eff},
                                                                                                                    effectDisplay(){return `+${format(this.effect())}%`},
                                                                                                                    unlocked(){return (hasUpgrade("Na",25)&&!hasUpgrade("Na",41))},
                                                                                                                    style() { return {'background-color': "#000088", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-color': "#0000FF",'border-radius': "25px", height: "100px", width: "600px"}},
                                                                                                                    },
                                                                                                                    51: {
                                                                                                                        title: "过氧化钠(Na2O2)",
                                                                                                                        description: "再次生效叠氮化钠",
                                                                                                                        cost: new Decimal(15),
                                                                                                                        currencyDisplayName: "碳酸钠研究深度",
                                                                                                                        currencyInternalName: "layer5",
                                                                                                                        currencyLayer:"Na",
                                                                                                                        effect(){let eff = upgradeEffect("Na",33)
                                                                                                                        return eff},
                                                                                                                        effectDisplay(){return `^${format(this.effect())}`},
                                                                                                                        unlocked(){return (hasUpgrade("Na",41))},
                                                                                                                        },
                                                                                                                        52: {
                                                                                                                            title: "超氧化钠(NaO2)",
                                                                                                                            description: "后4种研究的效果同样能加成乳酸钠",
                                                                                                                            cost: new Decimal(7),
                                                                                                                            currencyDisplayName: "硝酸钠研究深度",
                                                                                                                            currencyInternalName: "layer6",
                                                                                                                            currencyLayer:"Na",
                                                                                                                            effect(){let eff = (player.Na.layer4.add(player.Na.layer5).add(player.Na.layer6)).mul(0.01)
                                                                                                                            return eff},
                                                                                                                            effectDisplay(){return `+${format(this.effect())}`},
                                                                                                                            unlocked(){return (hasUpgrade("Na",41))},
                                                                                                                            },
                                                                                                                            53: {
                                                                                                                                title: "碳酸氢钠(NaHCO3)",
                                                                                                                                description: "低阶钠精研点数的效果公式中log10变为ln",
                                                                                                                                cost: new Decimal(12),
                                                                                                                                currencyDisplayName: "硝酸钠研究深度",
                                                                                                                                currencyInternalName: "layer6",
                                                                                                                                currencyLayer:"Na",
                                                                                                                                effect(){let eff = 6
                                                                                                                                return eff},
                                                                                                                                effectDisplay(){return `-${format(this.effect())}`},
                                                                                                                                unlocked(){return (hasUpgrade("Na",41))},
                                                                                                                                },
                                                                                                                                54: {
                                                                                                                                    title: "琥珀酸钠(C4H4Na2O4)",
                                                                                                                                    description: "每购买一个钠研究，柠檬酸钠效果提升0.03(上限0.15)",
                                                                                                                                    cost: new Decimal(1e9),
                                                                                                                                    currencyDisplayName: "低阶钠精研点数",
                                                                                                                                    currencyInternalName: "research",
                                                                                                                                    currencyLayer:"Na",
                                                                                                                                    effect(){let eff = new Decimal(0)
                                                                                                                                        if(getBuyableAmount("Na",21).gte(1)) eff = eff.add(0.03)
                                                                                                                                        if(getBuyableAmount("Na",31).gte(1)) eff = eff.add(0.03)
                                                                                                                                        if(getBuyableAmount("Na",32).gte(1)) eff = eff.add(0.03)
                                                                                                                                        if(getBuyableAmount("Na",51).gte(1)) eff = eff.add(0.03)
                                                                                                                                        if(getBuyableAmount("Na",52).gte(1)) eff = eff.add(0.03)
                                                                                                                                        if(getBuyableAmount("Na",61).gte(1)) eff = eff.add(0.03)
                                                                                                                                        if(getBuyableAmount("Na",62).gte(1)) eff = eff.add(0.03)

                                                                                                                                        if(getBuyableAmount("Na",63).gte(1)) eff = eff.add(0.03)
                                                                                                                                        if(hasUpgrade("Na",55)) eff = eff.mul(3)
                                                                                                                                    return eff},
                                                                                                                                    effectDisplay(){return `+${format(this.effect())}`},
                                                                                                                                    unlocked(){return (hasUpgrade("Na",41))},
                                                                                                                                    },
                                                                                                                                    55: {
                                                                                                                                        title: "丁酸钠(C4H7O2Na)",
                                                                                                                                        description: "琥珀酸钠效果提升3倍",
                                                                                                                                        cost: new Decimal(14),
                                                                                                                                        currencyDisplayName: "硝酸钠研究深度",
                                                                                                                                        currencyInternalName: "layer6",
                                                                                                                                        currencyLayer:"Na",
                                                                                                                                        effect(){let eff = new Decimal(3)
                                                                                                                                        return eff},
                                                                                                                                        effectDisplay(){return `x${format(this.effect())}`},
                                                                                                                                        unlocked(){return (hasUpgrade("Na",41))},
                                                                                                                                        },
                                                                                                                14: {
                                                                                                                    title: "柠檬酸钠(C6H5Na3O7)",
                                                                                                                    description: "钠离子效果变得更好",
                                                                                                                    cost: new Decimal(1),
                                                                                                                    currencyDisplayName: "硫酸钠研究深度",
                                                                                                                    currencyInternalName: "layer3",
                                                                                                                    currencyLayer:"Na",
                                                                                                                    effect(){let eff = new Decimal(1.41)
                                                                                                                        if(hasUpgrade("Na",21)) eff = eff.add(upgradeEffect("Na",21))
                                                                                                                        if(hasUpgrade("Na",54)) eff = eff.add(upgradeEffect("Na",54))
                                                                                                                        return eff},
                                                                                                                    effectDisplay(){return `^${format(this.effect())}`},
                                                                                                                    unlocked(){return true}
                                                                                                                    },
                                                        },
                                                        layer1limit(){ let lim = new Decimal(200).div(tmp.Na.researcheffect)
                                                        if ((player.Na.layer1).gte(11)) lim = lim.mul(new Decimal(1).mul((new Decimal(2).sub(hasUpgrade("Na",24)?0.2:0).pow((player.Na.layer1).sub(10)))))
                                                        if (getBuyableAmount("Na",61).gte(1)) lim = lim.div(buyableEffect("Na",61))
                                                        player.Na.layer1limit = lim
                                                        return lim
                                                        },
                                                        layer2limit(){ let lim = new Decimal(1000).div(tmp.Na.researcheffect)
                                                            if ((player.Na.layer2).gte(10)) lim = lim.mul(new Decimal(1).mul((new Decimal(2.5).sub(hasUpgrade("Na",24)?0.2:0).pow((player.Na.layer2).sub(9)))))
                                                            player.Na.layer2limit = lim
                                                            if (getBuyableAmount("Na",61).gte(1)) lim = lim.div(buyableEffect("Na",61))
                                                            return lim
                                                            },
                                                            layer3limit(){ let lim = new Decimal(400000).div(tmp.Na.researcheffect)
                                                                if ((player.Na.layer3).gte(9)) lim = lim.mul(new Decimal(1).mul((new Decimal(3).sub(hasUpgrade("Na",24)?0.2:0).pow((player.Na.layer3).sub(8)))))
                                                                player.Na.layer3limit = lim
                                                                return lim
                                                                },
                                                                layer4limit(){ let lim = new Decimal(3e8).div(tmp.Na.researcheffect)
                                                                    if ((player.Na.layer4).gte(8)) lim = lim.mul(new Decimal(1).mul((new Decimal(4.5).pow((player.Na.layer4).sub(7)))))
                                                                    player.Na.layer4limit = lim
                                                                    return lim
                                                                    },
                                                                    layer5limit(){ let lim = new Decimal(1e12).div(tmp.Na.researcheffect)
                                                                        if ((player.Na.layer5).gte(7)) lim = lim.mul(new Decimal(1).mul((new Decimal(7).pow((player.Na.layer5).sub(6)))))
                                                                        player.Na.layer5limit = lim
                                                                        return lim
                                                                        },
                                                                        layer6limit(){ let lim = new Decimal(7e19)
                                                                            if ((player.Na.layer6).gte(6)) lim = lim.mul(new Decimal(1).mul((new Decimal(10).pow((player.Na.layer6).sub(5)))))
                                                                            player.Na.layer6limit = lim
                                                                            return lim
                                                                            },
                                                                            layer7limit(){ let lim = new Decimal(3e38)
                                                                                if ((player.Na.layer7).gte(5)) lim = lim.mul(new Decimal(1).mul((new Decimal(20).pow((player.Na.layer7).sub(4)))))
                                                                                player.Na.layer7limit = lim
                                                                                return lim
                                                                                },
                                                        effect(){ 
                                                            if(!hasUpgrade("Na",12))eff = player.Na.points.pow(3)
                                                            if((hasUpgrade("Na",12))&&(!hasUpgrade("Na",23)))eff = player.Na.points.pow(4)
                                                            if(hasUpgrade("Na",23))eff = player.Na.points.pow(new Decimal(4).add(upgradeEffect("Na",23)))
                                                            if(hasUpgrade("Na",11))eff = eff.mul(upgradeEffect("Na",11))
                                                            if(hasUpgrade("Na",13))eff = eff.mul(upgradeEffect("Na",13))
                                                            if(hasUpgrade("Na",32))eff = eff.pow(upgradeEffect("Na",32))
                                                            if(hasUpgrade("Na",33))eff = eff.pow(upgradeEffect("Na",33))
                                                            if(hasUpgrade("Na",51))eff = eff.pow(upgradeEffect("Na",33))
                                                            if(getBuyableAmount("Na",21).gte(1)) eff = eff.mul(buyableEffect("Na",21))
                                                            if(hasUpgrade("Mg",11)) eff = eff.mul(tmp.Mg.MgOeffect)
                                                            player.Na.effect = eff
                                                            return eff},
                                                        effectDescription(){return "提升研究力量<h2 style=color:#F0840C;text-shadow:0px 0px 10px;>" + format(player.Na.effect) + "x<h2>"},
                                                        update(diff){
                                                            if(inChallenge("Na",11)) player.Na.power1 = player.Na.power1.add(((player.Na.effect)).times(diff))
                                                            if(inChallenge("Na",12)) player.Na.power2 = player.Na.power2.add(((player.Na.effect)).times(diff))
                                                            if(inChallenge("Na",21)) player.Na.power3 = player.Na.power3.add(((player.Na.effect)).times(diff))
                                                            if(inChallenge("Na",22)) player.Na.power4 = player.Na.power4.add(((player.Na.effect)).times(diff))
                                                            if(inChallenge("Na",31)) player.Na.power5 = player.Na.power5.add(((player.Na.effect)).times(diff))
                                                            if(inChallenge("Na",32)) player.Na.power6 = player.Na.power6.add(((player.Na.effect)).times(diff))
                                                            if(inChallenge("Na",41)) player.Na.power7 = player.Na.power7.add(((player.Na.effect)).times(diff))
                                                            

                                                            if((player.Na.power1).gte(player.Na.layer1limit)) {player.Na.power1 = player.Na.power1.sub(player.Na.layer1limit);player.Na.layer1 = player.Na.layer1.add(1)}
                                                            if((player.Na.power2).gte(player.Na.layer2limit)) {player.Na.power2 = player.Na.power2.sub(player.Na.layer2limit);player.Na.layer2 = player.Na.layer2.add(1)}
                                                            if((player.Na.power3).gte(player.Na.layer3limit)) {player.Na.power3 = player.Na.power3.sub(player.Na.layer3limit);player.Na.layer3 = player.Na.layer3.add(1)}
                                                            if((player.Na.power4).gte(player.Na.layer4limit)) {player.Na.power4 = player.Na.power4.sub(player.Na.layer4limit);player.Na.layer4 = player.Na.layer4.add(1)}
                                                            if((player.Na.power5).gte(player.Na.layer5limit)) {player.Na.power5 = player.Na.power5.sub(player.Na.layer5limit);player.Na.layer5 = player.Na.layer5.add(1)}
                                                            if((player.Na.power6).gte(player.Na.layer6limit)) {player.Na.power6 = player.Na.power6.sub(player.Na.layer6limit);player.Na.layer6 = player.Na.layer6.add(1)}
                                                            if((player.Na.power7).gte(player.Na.layer7limit)) {player.Na.power7 = player.Na.power7.sub(player.Na.layer7limit);player.Na.layer7 = player.Na.layer7.add(1)}
                                                            if (hasMilestone("Mg",1)) player.Na.power1 = player.Na.power1.add(((player.Na.effect)).times(diff))
                                                        },
                                                        color: "#F0840C",                       // The color for this layer, which affects many elements.
                                                        resource: "钠",
                                                        symbol:"Na",
                                                        position:1,            // The name of this layer's main prestige resource.
                                                        row: 5,                              // The row this layer is on (0 is the first row).
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal("1e950"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                        resetsNothing(){return true},                                    // Also the amount required to unlock the layer.
                                                        branches:["Ne"],
                                                        type: "static",                         // Determines the formula used for calculating prestige currency.
                                                        exponent(){let exp = new Decimal(4.93)

                                                            if (hasUpgrade("Na",25))exp = exp.sub(upgradeEffect("Na",25))
                                                            return exp
                                             
                                             
                                                          },                        // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {      
                                                            let gain = new Decimal(1)                    // Returns the exponent to your gain of the prestige resource.
                                                            return gain
                                                        },
                                                    
                                                        layerShown() { return hasUpgrade("B",24) },          // Returns a bool for if this layer's node should be visible in the tree.
                                                    
                                                        
                                                    })
                                                    function startCChallenge() {
                                                        doReset("C")
                                                        player.C.points = new Decimal(0)
                                                        player.C.Cpower = new Decimal(10)
                                                        player.C.buyables[11] = new Decimal(0)
                                                        player.C.buyables[12] = new Decimal(0)
                                                        player.C.buyables[21] = new Decimal(0)
                                                        player.C.buyables[22] = new Decimal(0)
                                                        player.C.buyables[23] = new Decimal(0)
                                                    }
                                                    addLayer("A", {
                                                        symbol:"A1",
                                                        startData() { return {
                                                            unlocked: true,
                                                            Goals:new Decimal(0)
                                                        }},
                                                        color: "red",
                                                        row: "side",
                                                        layerShown() {return true}, 
                                                        tooltip() { // Optional, tooltip displays when the layer is locked
                                                            return ("第一周期成就")
                                                        },
                                                        achievements: {
                                                            11: {
                                                                name: "氢",
                                                                done() { return player.H.points.gte(1) }
                                                            ,
                                                            onComplete() { player.A.Goals = player.A.Goals.add(1) },
                                                                tooltip: "获得1氢。(完成后+1成就点数)",
                                                            },
                                                            12: {
                                                                name: "阴阳？",
                                                                done() { return hasUpgrade("H",12)&&hasUpgrade("H",13) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(1) },
                                                                tooltip: "解锁氢阴离子和氢阳离子。(+1成就点数)",
                                                            },
                                                            13: {
                                                                name: "你需要一个储氢罐！",
                                                                done() { return player.H.points.gte(150) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(1) },
                                                                tooltip: "获得150氢。(+1成就点数)",
                                                            },
                                                            14: {
                                                                name: "氢之轻",
                                                                done() {return hasUpgrade("H",12)&&hasUpgrade("H",13)&&hasUpgrade("H",11)&&hasUpgrade("H",14) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(1) },
                                                                tooltip: "购买全部氢升级。(+1成就点数)",
                                                            },
                                                            21: {
                                                                name: "氦",
                                                                done() {return player.He.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(2) },
                                                                tooltip: "获得1氦。(+2成就点数)",
                                                            },
                                                            22: {
                                                                name: "氦气罐",
                                                                done() {return player.He.points.gte(5) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(2) },
                                                                tooltip: "获得全部氦气里程碑。(+2成就点数)",
                                                            },
                                                            23: {
                                                                name: "许多氦",
                                                                done() {return player.He.points.gte(300) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(2) },
                                                                tooltip: "获得300氦。(+2成就点数)",
                                                            },
                                                            24: {
                                                                name: "地球大气层氦储量",
                                                                done() {return player.He.points.gte(1e10) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(2) },
                                                                tooltip: "获得1e10氦。(+2成就点数)",
                                                            },
                                                        },

                                                        tabFormat:{
                                                            "Achivements":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            ["display-text",
                                                            function() {return '成就点数：<h2 style=color:yellow;text-shadow:0px 0px 10px;>' + format(player.A.Goals) + '<h2>'},
                                                                {}],
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    }},
                                                   
                                                    })
                                                    addLayer("A2", {
                                                        symbol:"A2",
                                                        startData() { return {
                                                            unlocked: true,
                                                            Goals:new Decimal(0)
                                                        }},
                                                        color: "orange",
                                                        row: "side",
                                                        layerShown() {return player.Li.points.gte(1)}, 
                                                        tooltip() { // Optional, tooltip displays when the layer is locked
                                                            return ("第二周期成就")
                                                        },
                                                        achievements: {
                                                            
                                                            31: {
                                                                name: "锂云石？",
                                                                done() {return player.Li.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(3) },
                                                                tooltip: "获得1锂。(+3成就点数)",
                                                            },
                                                            32: {
                                                                name: "电池",
                                                                done() {return player.Li.points.gte(3) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(3) },
                                                                tooltip: "获得全部锂里程碑。(+3成就点数)",
                                                            },
                                                            33: {
                                                                name: "锂与锂",
                                                                done() {return hasUpgrade("Li",13) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(3) },
                                                                tooltip: "获得3个锂升级。(+3成就点数)",
                                                            },
                                                            34: {
                                                                name: "锂之活",
                                                                done() {return hasChallenge("Li",11) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(3) },
                                                                tooltip: "完成轻型锂合金。(+3成就点数)",
                                                            },
                                                            41: {
                                                                name: "铍合金",
                                                                done() {return player.Be.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(5) },
                                                                tooltip: "获得1铍。(+5成就点数)",
                                                            },
                                                            42: {
                                                                name: "铍没有升级吗？",
                                                                done() {return player.Be.points.gte(2) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(5) },
                                                                tooltip: "获得2铍。(+5成就点数)",
                                                            },
                                                            43: {
                                                                name: "铍玻璃",
                                                                done() {return player.Be.points.gte(4) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(5) },
                                                                tooltip: "获得4铍。(+5成就点数)",
                                                            },
                                                            44: {
                                                                name: "铍之毒",
                                                                done() {return player.Be.points.gte(8) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(5) },
                                                                tooltip: "获得8铍。(+5成就点数)",
                                                            },
                                                            51: {
                                                                name: "硼",
                                                                done() {return player.B.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(8) },
                                                                tooltip: "获得1硼。(+8成就点数)",
                                                            },
                                                            52: {
                                                                name: "硼晶体",
                                                                done() {return player.B.points.gte(5) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(8) },
                                                                tooltip: "获得5硼。(+8成就点数)",
                                                            },
                                                            53: {
                                                                name: "你的“硼有”真多",
                                                                done() {return player.B.points.gte(10) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(8) },
                                                                tooltip: "获得10硼。(+8成就点数)",
                                                            },
                                                            54: {
                                                                name: "硼之重(要)",
                                                                done() {return hasUpgrade("B",24) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(8) },
                                                                tooltip: "获得7个硼升级。(+8成就点数)",
                                                            },
                                                            61: {
                                                                name: "碳",
                                                                done() {return player.C.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "获得1碳。(+13成就点数)",
                                                            },
                                                            62: {
                                                                name: "木炭",
                                                                done() {return player.C.Cpower.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "获得1木炭能量。(+13成就点数)",
                                                            },
                                                            63: {
                                                                name: "木炭增量？？？",
                                                                done() {return player.C.Rank.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "获得1级别。(+13成就点数)",
                                                            },
                                                            64: {
                                                                name: "就是木炭增量啊",
                                                                done() {return player.C.Tier.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "获得1阶层。(+13成就点数)",
                                                            },
                                                            65: {
                                                                name: "又一层？",
                                                                done() {return player.C.Cpower2.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "获得1石墨能量。(+13成就点数)",
                                                            },
                                                            66: {
                                                                name: "石墨升级",
                                                                done() {return hasUpgrade("C",15) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "购买5个石墨升级。(+13成就点数)",
                                                            },
                                                            67: {
                                                                name: "居然还有？",
                                                                done() {return hasUpgrade("C",25) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "购买10个石墨升级。(+13成就点数)",
                                                            },
                                                            68: {
                                                                name: "碳之杂",
                                                                done() {return player.C.points.gte(1e300) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "获得1e300碳。(+13成就点数)",
                                                            },
                                                            71: {
                                                                name: "氮",
                                                                done() {return player.N.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(20) },
                                                                tooltip: "获得1氮。(+20成就点数)",
                                                            },
                                                            72: {
                                                                name: "氮氮氮...蛋？",
                                                                done() {return player.N.points.gte(3) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(20) },
                                                                tooltip: "获得3氮。(+20成就点数)",
                                                            },
                                                            73: {
                                                                name: "氨",
                                                                done() {return hasUpgrade("N",14) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(20) },
                                                                tooltip: "解锁氨气。(+20成就点数)",
                                                            },
                                                            74: {
                                                                name: "氮之淡",
                                                                done() {return player.N.points.gte(10) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(20) },
                                                                tooltip: "获得10氮。(+20成就点数)",
                                                            },
                                                            81: {
                                                                name: "氧",
                                                                done() {return player.O.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(32) },
                                                                tooltip: "获得1氧。(+32成就点数)",
                                                            },
                                                            82: {
                                                                name: "点击者",
                                                                done() {return player.O.points.gte(10000) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(32) },
                                                                tooltip: "获得10000氧。(+32成就点数)",
                                                            },
                                                            83: {
                                                                name: "臭氧层",
                                                                done() {return getBuyableAmount("O",11).gte(100000) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(32) },
                                                                tooltip: "获得100000臭氧。(+32成就点数)",
                                                            },
                                                            84: {
                                                                name: "江河湖海",
                                                                done() {return getBuyableAmount("O",12).gte(1e30) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(32) },
                                                                tooltip: "获得1e30氧化氢。(+32成就点数)",
                                                            },
                                                            85: {
                                                                name: "消毒液",
                                                                done() {return getBuyableAmount("O",13).gte(1e10) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(32) },
                                                                tooltip: "获得1e10过氧化氢。(+32成就点数)",
                                                            },
                                                            91: {
                                                                name: "氟",
                                                                done() {return player.F.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(50) },
                                                                tooltip: "获得1氟。(+50成就点数)",
                                                            },
                                                            92: {
                                                                name: "嗯，这比制取氟单质简单多了",
                                                                done() {return hasChallenge("F",12) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(50) },
                                                                tooltip: "完成1次一氧化二氟。(+50成就点数)",
                                                            },
                                                            93: {
                                                                name: "好多挑战",
                                                                done() {return hasChallenge("F",21) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(50) },
                                                                tooltip: "完成1次次氟酸。(+50成就点数)",
                                                            },
                                                            94: {
                                                                name: "氟之腐",
                                                                done() {return hasChallenge("F",22)},
                                                                onComplete() { player.A.Goals = player.A.Goals.add(50) },
                                                                tooltip: "完成1次氟化锂。(+50成就点数)",
                                                            },
                                                            101: {
                                                                name: "氖",
                                                                done() {return player.Ne.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "获得1氖。(+100成就点数)",
                                                            },
                                                            102: {
                                                                name: "氖氖氖",
                                                                done() {return player.Ne.points.gte(3) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "获得3氖。(+100成就点数)",
                                                            },
                                                            103: {
                                                                name: "它好像坏了？",
                                                                done() {return getBuyableAmount("Ne",11).gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "给濒临损坏的氖光管充电1%。(+100成就点数)",
                                                            },
                                                            104: {
                                                                name: "它真的坏了！",
                                                                done() {return getBuyableAmount("Ne",11).gte(101) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "给濒临损坏的氖光管充电101%。(+100成就点数)",
                                                            },
                                                            105: {
                                                                name: "黑的",
                                                                done() {return getBuyableAmount("Ne",21).gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "给黯淡的氖光管充电1%。(+100成就点数)",
                                                            },
                                                            106: {
                                                                name: "平凡的",
                                                                done() {return getBuyableAmount("Ne",31).gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "给平凡的氖光管充电1%。(+100成就点数)",
                                                            },
                                                            107: {
                                                                name: "亮堂堂！",
                                                                done() {return getBuyableAmount("Ne",41).gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "给明亮的氖光管充电1%。(+100成就点数)",
                                                            },
                                                            108: {
                                                                name: "超级亮堂堂！！",
                                                                done() {return getBuyableAmount("Ne",51).gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "给超亮的氖光管充电1%。(+100成就点数)",
                                                            },
                                                            109: {
                                                                name: "哦不，我的双眼！",
                                                                done() {return getBuyableAmount("Ne",61).gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "给闪瞎双眼的氖光管充电1%。(+100成就点数)",
                                                            },
                                                            110: {
                                                                name: "浑浊",
                                                                done() {return player.Ne.Unpower.gte(1e20) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "获得1e20不纯的氖气。(+100成就点数)",
                                                            },
                                                            111: {
                                                                name: "氖气军团",
                                                                done() {return player.Ne.power.gte(1e20) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "获得1e20氖气。(+100成就点数)",
                                                            },
                                                            112: {
                                                                name: "氖之紫",
                                                                done() {return player.Ne.points.gte(10) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(100) },
                                                                tooltip: "获得10氖。(+100成就点数)",
                                                            },
                                                        },
                                                        tabFormat:{
                                                            "Achivements":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    }},
                                                    })
                                                    addLayer("A3", {
                                                        symbol:"A3",
                                                        startData() { return {
                                                            unlocked: true,
                                                            Goals:new Decimal(0)
                                                        }},
                                                        color: "yellow",
                                                        row: "side",
                                                        layerShown() {return player.Na.points.gte(1)}, 
                                                        tooltip() { // Optional, tooltip displays when the layer is locked
                                                            return ("第三周期成就")
                                                        },
                                                        achievements: {
                                                            121: {
                                                                name: "钠",
                                                                done() {return player.Na.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "获得1钠。(+300成就点数)",
                                                            },
                                                            122: {
                                                                name: "其实你家盐里面就有（",
                                                                done() {return player.Na.layer1.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "获得1钠离子研究深度。(+300成就点数)",
                                                            },
                                                            123: {
                                                                name: "烧碱",
                                                                done() {return player.Na.layer2.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "获得1氢氧化钠研究深度。(+300成就点数)",
                                                            },
                                                            124: {
                                                                name: "硫酸盐",
                                                                done() {return player.Na.layer3.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "获得1硫酸钠研究深度。(+300成就点数)",
                                                            },
                                                            125: {
                                                                name: "我的好“硼”友又多了！",
                                                                done() {return player.Na.layer4.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "获得1硼酸钠研究深度。(+300成就点数)",
                                                            },
                                                            126: {
                                                                name: "苏打",
                                                                done() {return player.Na.layer5.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "获得1碳酸钠研究深度。(+300成就点数)",
                                                            },
                                                            127: {
                                                                name: "人生重来盐",
                                                                done() {return player.Na.layer6.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "获得1硝酸钠研究深度。(+300成就点数)",
                                                            },
                                                            128: {
                                                                name: "我们需要更深入些",
                                                                done() {return hasUpgrade("Na",41) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(300) },
                                                                tooltip: "解锁精研。(+300成就点数)",
                                                            },
                                                            131: {
                                                                name: "镁",
                                                                done() {return player.Mg.points.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(500) },
                                                                tooltip: "获得1镁。(+500成就点数)",
                                                            },
                                                        },

                                                        tabFormat:{
                                                            "Achivements":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    }},
                                                   
                                                    })
                                                    addLayer("A4", {
                                                        symbol:"A4",
                                                        startData() { return {
                                                            unlocked: true,
                                                            Goals:new Decimal(0)
                                                        }},
                                                        color: "green",
                                                        row: "side",
                                                        layerShown() {return false}, 
                                                        tooltip() { // Optional, tooltip displays when the layer is locked
                                                            return ("第四周期成就")
                                                        },
                                                        achievements: {
                                                          
                                                        },

                                                        tabFormat:{
                                                            "Achivements":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    }},
                                                   
                                                    })
                                                    addLayer("A5", {
                                                        symbol:"A5",
                                                        startData() { return {
                                                            unlocked: true,
                                                            Goals:new Decimal(0)
                                                        }},
                                                        color: "cyan",
                                                        row: "side",
                                                        layerShown() {return false}, 
                                                        tooltip() { // Optional, tooltip displays when the layer is locked
                                                            return ("第五周期成就")
                                                        },
                                                        achievements: {
                                                          
                                                        },

                                                        tabFormat:{
                                                            "Achivements":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    }},
                                                   
                                                    })
                                                    addLayer("A6", {
                                                        symbol:"A6",
                                                        startData() { return {
                                                            unlocked: true,
                                                            Goals:new Decimal(0)
                                                        }},
                                                        color: "blue",
                                                        row: "side",
                                                        layerShown() {return false}, 
                                                        tooltip() { // Optional, tooltip displays when the layer is locked
                                                            return ("第六周期成就")
                                                        },
                                                        achievements: {
                                                          
                                                        },

                                                        tabFormat:{
                                                            "Achivements":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            
            "milestones",
            "buyables",
            "upgrades",
           
            "blank",
            , "blank", "blank", ]
                                                    }},
                                                   
                                                    })
                                                    addLayer("A7", {
                                                        symbol:"A7",
                                                        startData() { return {
                                                            unlocked: true,
                                                            Goals:new Decimal(0)

                                                        }},
                                                        color: "purple",
                                                        row: "side",
                                                        layerShown() {return false}, 
                                                        tooltip() { // Optional, tooltip displays when the layer is locked
                                                            return ("第七周期成就")
                                                        },
                                                        achievements: {
                                                          
                                                        },

                                                        tabFormat:{
                                                            "Achivements":{
                                                                content:[ "main-display",
                                                                "prestige-button",
                                                                
                                                            ["bar", "NextCD"],
                                                            ["infobox","introBox"],
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            "upgrades",
            "milestones",
            "buyables",
           
            "blank",
            , "blank", "blank", ]
                                                    }},
                                                   
                                                    })
                                                    addLayer("Mg", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),
                                                            MgO: new Decimal(0),
                                                            MgN: new Decimal(0),
                                                            MgCO3: new Decimal(0),
                                                            MgOLimit: new Decimal(0),
                                                            MgNLimit: new Decimal(90),
                                                            MgCO3Limit: new Decimal(100),
                                                            MgSO4Limit: new Decimal(101),
                                                            Balance11:new Decimal(0),
                                                            Balance12:new Decimal(0),
                                                            Balance13:new Decimal(0),
                                                            Balance14:new Decimal(0),
                                                            Condition1:new Decimal(0),
                                                            bar: new Decimal(0),              // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                        tabFormat:{
                                                            "Main":{
                                                                content:[ "main-display",

                                                                "prestige-button",
                                                                ["bar", "NextBD"],
                                                            ["bar", "NextCD"],
                                                            ["display-text",
                                                            function() {return '您当前拥有<h2 style=color:#0066FF;text-shadow:0px 0px 10px;>' + format(player.Mg.MgO) + '<h2>氧化镁(MgO)，提升研究力量<h2 style=color:#0066FF;text-shadow:0px 0px 10px;>'+format(tmp.Mg.MgOeffect)+"x<h2>"},
                                                                {}],
                                                                ["display-text",
                                                            function() {return '您当前拥有<h2 style=color:#FBB9DF;text-shadow:0px 0px 10px;>' + format(player.Mg.MgN) + '<h2>氮化镁(MgN)，提升氧化镁获取与低阶精研点数获取<h2 style=color:#FBB9DF;text-shadow:0px 0px 10px;>'+format(tmp.Mg.MgNeffect)+"x<h2>"},
                                                                {}],
                                                                ["display-text",
                                                            function() {if(hasUpgrade("Mg",41)) return '您当前拥有<h2 style=color:#444444;text-shadow:0px 0px 10px;>' + format(player.Mg.MgCO3) + '<h2>碳酸镁(MgCO3)，提升氮化镁获取与全部钠研究效果<h2 style=color:#444444;text-shadow:0px 0px 10px;>'+format(tmp.Mg.MgCO3effect)+"x<h2>"},
                                                                {}],
                                                            ["infobox","introBox"],
                                                            ["row",[["buyable", 41], ["buyable", 42]]],
                                                           
                                                            "challenges",
                                                            "achievements",
                                                        "grid",

            "blank",
            "milestones",
            "blank",
            "upgrades",
           
            "blank",
            , "blank", "blank", ]
                                                    },
                                                    "Balance1":{
                                                        content:[ "main-display",

                                                        "prestige-button",
                                                        ["display-text",
                                                            function() {return '<h1 style=color:#FFFFFF;text-shadow:0px 0px 10px;>化学方程式配平<h1><h1 style=color:#0066FF;text-shadow:0px 0px 10px;>(难度：Past 3)<h1>'},
                                                                {}],
                                                                "blank",
                                                                ["display-text",
                                                            function() {return '<h2 style=color:#FFFFFF;text-shadow:0px 0px 10px;>请按要求完成下列化学方程式的配平并标注反应条件！<h2>'},
                                                                {}],
                                                                "blank",
                                                                ["display-text",
                                                            function() {return '<h1 style=color:#AAAAAA;text-shadow:0px 0px 10px;>'+format(player.Mg.Balance11)+'<h1><h1 style=color:#104ea2;text-shadow:0px 0px 10px;>Mg<h1><h1 style=color:#FFFFFF;text-shadow:0px 0px 10px;>+<h1><h1 style=color:#AAAAAA;text-shadow:0px 0px 10px;>'+format(player.Mg.Balance12)+'<h1><h1 style=color:#6495ED;text-shadow:0px 0px 10px;>H<h1><h1 style=color:#FFF68F;text-shadow:0px 0px 10px;>F<h1><h1 style=color:#FFFFFF;text-shadow:0px 0px 10px;>=?=<h1><h1 style=color:#AAAAAA;text-shadow:0px 0px 10px;>'+format(player.Mg.Balance13)+'<h1><h1 style=color:#104ea2;text-shadow:0px 0px 10px;>Mg<h1><h1 style=color:#FFF68F;text-shadow:0px 0px 10px;>F₂<h1><h1 style=color:#FFFFFF;text-shadow:0px 0px 10px;>+<h1><h1 style=color:#AAAAAA;text-shadow:0px 0px 10px;>'+format(player.Mg.Balance14)+'<h1><h1 style=color:#6495ED;text-shadow:0px 0px 10px;>H₂<h1>'},
                                                                {}],
                                                                "blank",
                                                                ["row",[["buyable", 11], ["buyable", 12], ["buyable", 13],["buyable", 14]]],
                                                                ["row",[["buyable", 21], ["buyable", 22], ["buyable", 23],["buyable", 24]]],
                                                                ["buyable",31]
    , "blank", "blank", ],
    unlocked(){return hasUpgrade("Mg",25)}
                                            }},
                                                        bars: {
                                                            NextBD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#AAAAFF"},
                                                                req() {
                                                                    let req =new Decimal("1e11451")
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "到达" + format(this.req()) + " 氢以解锁下一种元素. (" + format(f.log10().div(this.req().log10()).mul(100).min(100)) + "%)"
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let p = f.log10().div(this.req().log10())
                                                                    return p
                                                                },
                                                            },
                                                            NextCD: {
                                                                direction: RIGHT,
                                                                width: 700,
                                                                height: 30,
                                                                fillStyle: {'background-color' : "#0066FF",'color': "silver"},
                                                                Style: {'background-color' : "#0066FF"},
                                                                req() {
                                                                    let req =new Decimal("1e3500")
                                                                    return req
                                                                },
                                                                display() {
                                                                    let f = player.H.points.add(1).max(1)
                                                                    let r = "你的镁条在" + format(player.Mg.bar) + " %的氮气和" + format(new Decimal(100).sub(player.Mg.bar))+ "%的氧气中燃烧。当前燃烧产物："+ (player.Mg.bar.gte(player.Mg.MgNLimit)?((player.Mg.bar.gte(player.Mg.MgCO3Limit)?"碳酸镁":"氮化镁")):"氧化镁")
                                                                    return r
                                                                },
                                                                progress() { 
                                                                    let f = player.Mg.bar
                                                                    let p = f.div(100)
                                                                    return p
                                                                },
                                                            },
                                                        },
                                                        MgOgain(){
                                                        let gain = new Decimal(0.0001)
                                                        if (player.Mg.points.gte(1)) gain = gain.mul(tmp.Mg.effect)
                                                        if(!player.Mg.bar.gte(player.Mg.MgNLimit)) gain = gain.mul((player.Mg.MgNLimit.sub(player.Mg.bar)).mul(10))
                                                        if(player.Mg.bar.gte(player.Mg.MgNLimit)) gain = new Decimal(0)
                                                        if(hasUpgrade("Mg",14)) gain = gain.mul(tmp.Mg.MgNeffect)
                                                        
                                                        return gain
                                                        },
                                                        MgNgain(){
                                                        let gain = new Decimal(0.0001)
                                                        if (player.Mg.points.gte(1)) gain = gain.mul(tmp.Mg.effect)
                                                        if(!player.Mg.bar.gte(player.Mg.MgNLimit)) gain = new Decimal(0)
                                                        if((player.Mg.bar.gte(player.Mg.MgNLimit))&&(!player.Mg.bar.gte((player.Mg.MgCO3Limit.add(player.Mg.MgNLimit)).div(2)))) gain = gain.mul((player.Mg.bar.sub(player.Mg.MgNLimit)).mul(10))
                                                        if((!player.Mg.bar.gte(player.Mg.MgCO3Limit))&&(player.Mg.bar.gte((player.Mg.MgCO3Limit.add(player.Mg.MgNLimit)).div(2)))) gain = gain.mul((player.Mg.MgCO3Limit.sub(player.Mg.bar)).mul(10))
                                                        if(hasUpgrade("Mg",15)) gain = gain.mul(tmp.Mg.MgNeffect.sqrt())
                                                        if(hasUpgrade("Mg",42))gain = gain.mul(tmp.Mg.MgCO3effect)
                                                        return gain
                                                        },
                                                        MgCO3gain(){
                                                            let gain = new Decimal(1e-10)
                                                            if (player.Mg.points.gte(1)) gain = gain.mul(tmp.Mg.effect)
                                                            if(!player.Mg.bar.gte(player.Mg.MgCO3Limit)) gain = new Decimal(0)
                                                            if((player.Mg.bar.gte(player.Mg.MgCO3Limit))&&(!player.Mg.bar.gte((player.Mg.MgCO3Limit.add(player.Mg.MgSO4Limit)).div(2)))) gain = gain.mul((player.Mg.bar.sub(player.Mg.MgCO3Limit)).mul(10))
                                                            if((!player.Mg.bar.gte(player.Mg.MgCO3Limit))&&(player.Mg.bar.gte((player.Mg.MgCO3Limit.add(player.Mg.MgSO4Limit)).div(2)))) gain = gain.mul((player.Mg.MgSO4Limit.sub(player.Mg.bar)).mul(10))
                                                            return gain
                                                            },
                                                        
                                                        milestones:{
                                                            0: {
                                                                requirementDescription: "镁粉(1镁)",
                                                                effectDescription: "每秒钟自动购买最大数量的氖光管",
                                                                done() {
                                                                    return player.Mg.points.gte(1)
                                                                }
                                                            },
                                                            1: {
                                                                requirementDescription: "镁条(4镁)",
                                                                effectDescription: "自动研究钠离子",
                                                                done() {
                                                                    return player.Mg.points.gte(4)
                                                                }
                                                            },

                                                        },
                                                        
                                                        
                                                    upgrades:{
                                                        11: {
                                                            title: "镁原子(Mg)",
                                                            description: "解锁氧化镁效果，镁基础+1",
                                                            cost: new Decimal(200),
                                                            currencyDisplayName: "氧化镁",
                                                            currencyInternalName: "MgO",
                                                            currencyLayer:"Mg",
                                                            effect(){let eff = new Decimal(1)
                                                                return eff},
                                                            effectDisplay(){return `+${format(this.effect())}`},
                                                            unlocked(){return true}
                                                            },
                                                        12: {
                                                            title: "氟化镁(MgF2)",
                                                            description: "平方氧化镁效果，氢获取提升10000倍，但无效化氢阴离子",
                                                            cost: new Decimal(1000),
                                                            currencyDisplayName: "氧化镁",
                                                            currencyInternalName: "MgO",
                                                            currencyLayer:"Mg",
                                                            effect(){let eff = new Decimal(2)
                                                                return eff},
                                                            effectDisplay(){return `^${format(this.effect())}`},
                                                            unlocked(){return true}
                                                            },
                                                            13: {
                                                                title: "氢氧化镁(Mg(OH)2)",
                                                                description: "镁效应提升3倍，钠-25提升至3次方，但无效化氢气",
                                                                cost: new Decimal(4),
                                                                currencyDisplayName: "镁",
                                                                currencyInternalName: "points",
                                                                currencyLayer:"Mg",
                                                                effect(){let eff = new Decimal(3)
                                                                    return eff},
                                                                effectDisplay(){return `^${format(this.effect())}`},
                                                                unlocked(){return true}
                                                                },
                                                                14: {
                                                                    title: "过氧化镁(MgO2)",
                                                                    description: "您可以向氧气燃烧的集气瓶中添加氮气并生成氮化镁。氧化镁基数提升至5倍，同时解锁很多全新的钠精研！",
                                                                    cost: new Decimal(5e5),
                                                                    currencyDisplayName: "氧化镁",
                                                                    currencyInternalName: "MgO",
                                                                    currencyLayer:"Mg",
                                                                    effect(){let eff = new Decimal(5)
                                                                        return eff},
                                                                    effectDisplay(){return `x${format(this.effect())}`},
                                                                    unlocked(){return true}
                                                                    },
                                                                    15: {
                                                                        title: "超氧化镁(MgO4)",
                                                                        description: "氮化镁效果以削弱的倍率提升自身",
                                                                        cost: new Decimal(5e9),
                                                                        currencyDisplayName: "氧化镁",
                                                                        currencyInternalName: "MgO",
                                                                        currencyLayer:"Mg",
                                                                        effect(){let eff = tmp.Mg.MgNeffect.sqrt()
                                                                            return eff},
                                                                        effectDisplay(){return `x${format(this.effect())}`},
                                                                        unlocked(){return true}
                                                                        },
                                                                        21: {
                                                                            title: "硝酸镁(Mg(NO3)2)",
                                                                            description: "本行每有1个升级，就倍增一次镁效应",
                                                                            cost: new Decimal(3e7),
                                                                            currencyDisplayName: "氮化镁",
                                                                            currencyInternalName: "MgN",
                                                                            currencyLayer:"Mg",
                                                                            effect(){let eff = new Decimal(2)
                                                                                if (hasUpgrade("Mg",22)) eff = eff.mul(2)
                                                                                if (hasUpgrade("Mg",23)) eff = eff.mul(2)
                                                                                if (hasUpgrade("Mg",24)) eff = eff.mul(2)
                                                                                if (hasUpgrade("Mg",25)) eff = eff.mul(2)
                                                                                return eff},
                                                                            effectDisplay(){return `x${format(this.effect())}`},
                                                                            unlocked(){return hasUpgrade("Mg",15)}
                                                                            },
                                                                            22: {
                                                                                title: "镁离子(Mg2+)",
                                                                                description: "镁效应同样生效于氖气(包括不纯的)获取",
                                                                                cost: new Decimal(1e8),
                                                                                currencyDisplayName: "氮化镁",
                                                                                currencyInternalName: "MgN",
                                                                                currencyLayer:"Mg",
                                                                                effect(){let eff = tmp.Mg.effect
                                                                                    return eff},
                                                                                effectDisplay(){return `x${format(this.effect())}`},
                                                                                unlocked(){return hasUpgrade("Mg",15)}
                                                                                },
                                                                                23: {
                                                                                    title: "叠氮化镁(MgN6)",
                                                                                    description: "氮化镁获取阈值降低(90%~100%——>70%~100%)",
                                                                                    cost: new Decimal(1.6e8),
                                                                                    currencyDisplayName: "氮化镁",
                                                                                    currencyInternalName: "MgN",
                                                                                    currencyLayer:"Mg",
                                                                                    effect(){let eff = new Decimal(20)
                                                                                        return eff},
                                                                                    effectDisplay(){return `-${format(this.effect())}`},
                                                                                    unlocked(){return hasUpgrade("Mg",15)}
                                                                                    },
                                                                                    24: {
                                                                                        title: "碳酸氢镁(Mg(HCO3)2)",
                                                                                        description: "氧化镁效果^1.5且同样生效于氖气",
                                                                                        cost: new Decimal(1e9),
                                                                                        currencyDisplayName: "氮化镁",
                                                                                        currencyInternalName: "MgN",
                                                                                        currencyLayer:"Mg",
                                                                                        effect(){let eff = new Decimal(1.5)
                                                                                            return eff},
                                                                                        effectDisplay(){return `^${format(this.effect())}`},
                                                                                        unlocked(){return hasUpgrade("Mg",15)}
                                                                                        },
                                                                                        25: {
                                                                                            title: "氢化镁(MgH2)",
                                                                                            description: "解锁一个小游戏，并且氢超过1e4500的部分倍增镁效应",
                                                                                            cost: new Decimal(2e9),
                                                                                            currencyDisplayName: "氮化镁",
                                                                                            currencyInternalName: "MgN",
                                                                                            currencyLayer:"Mg",
                                                                                            effect(){if(!hasUpgrade("Mg",41))eff = player.H.points.div("1e4500").log10().cbrt()
                                                                                            if(hasUpgrade("Mg",41))eff = player.H.points.div("1e4500").log10().sqrt()
                                                                                                return eff},
                                                                                            effectDisplay(){return `x${format(this.effect())}`},
                                                                                            unlocked(){return hasUpgrade("Mg",15)}
                                                                                            },
                                                                                            31: {
                                                                                                title: "磷酸镁(Mg3(PO3)2)",
                                                                                                description: "将你的氢提纯成超纯氢，并且给予层级很多加成，但所有升级效果变为定值。",
                                                                                                cost: new Decimal(1e11),
                                                                                                currencyDisplayName: "氮化镁",
                                                                                                currencyInternalName: "MgN",
                                                                                                currencyLayer:"Mg",
                                                                                                effect(){let eff = player.H.points.div("1e4500").log10().cbrt()
                                                                                                    return eff},
                                                                                                effectDisplay(){return `详情请查看氢层级的超纯奖励。`},
                                                                                                unlocked(){return hasUpgrade("Mg",25)},
                                                                                                style() { return {'border-radius': "25px", height: "100px", width: "600px"}},
                                                                                                },
                                                                                                41: {
                                                                                                    title: "硼酸镁(MgBO3)",
                                                                                                    description: "解锁碳酸镁，降低氮化镁与氧化镁阈值，氢化镁效果更好",
                                                                                                    cost: new Decimal(1e13),
                                                                                                    currencyDisplayName: "氮化镁",
                                                                                                    currencyInternalName: "MgN",
                                                                                                    currencyLayer:"Mg",
                                                                                                    effect(){let eff = player.H.points.div("1e4500").log10().cbrt()
                                                                                                        return eff},
                                                                                                    effectDisplay(){return `x${format(this.effect())}`},
                                                                                                    unlocked(){return hasUpgrade("Mg",31)}
                                                                                                    },
                                                                                                    42: {
                                                                                                        title: "苦土(轻烧镁)",
                                                                                                        description: "解锁碳酸镁效应",
                                                                                                        cost: new Decimal(1.5e6),
                                                                                                        currencyDisplayName: "碳酸镁",
                                                                                                        currencyInternalName: "MgCO3",
                                                                                                        currencyLayer:"Mg",
                                                                                                        effect(){let eff = tmp.Mg.MgCO3effect
                                                                                                            return eff},
                                                                                                        effectDisplay(){return `x${format(this.effect())}`},
                                                                                                        unlocked(){return hasUpgrade("Mg",31)}
                                                                                                        },
                                                                                                        43: {
                                                                                                            title: "丙戊酸镁(CHMgO)",
                                                                                                            description: "氮化镁效应提升至^1.5",
                                                                                                            cost: new Decimal(1e15),
                                                                                                            currencyDisplayName: "氮化镁",
                                                                                                            currencyInternalName: "MgN",
                                                                                                            currencyLayer:"Mg",
                                                                                                            effect(){let eff = new Decimal(1.5)
                                                                                                                return eff},
                                                                                                            effectDisplay(){return `^${format(this.effect())}`},
                                                                                                            unlocked(){return hasUpgrade("Mg",31)}
                                                                                                            },
                                                                                                            44: {
                                                                                                                title: "硬脂酸镁(C36H70MgO4)",
                                                                                                                description: "钠-28对其自身再生效一次。",
                                                                                                                cost: new Decimal(1e16),
                                                                                                                currencyDisplayName: "低阶钠精研点数",
                                                                                                                currencyInternalName: "research",
                                                                                                                currencyLayer:"Na",
                                                                                                                effect(){let eff = new Decimal(2)
                                                                                                                    return eff},
                                                                                                                effectDisplay(){return `^${format(this.effect())}`},
                                                                                                                unlocked(){return hasUpgrade("Mg",31)}
                                                                                                                },
                                                                                                                45: {
                                                                                                                    title: "亚硝酸镁(Mg(NO2)2)",
                                                                                                                    description: "钠-28对其自身再生效2次，同时解锁一个新层级！",
                                                                                                                    cost: new Decimal(1e8),
                                                                                                                    currencyDisplayName: "碳酸镁",
                                                                                                                    currencyInternalName: "MgCO3",
                                                                                                                    currencyLayer:"Mg",
                                                                                                                    effect(){let eff = new Decimal(3)
                                                                                                                        return eff},
                                                                                                                    effectDisplay(){return `^${format(this.effect())}`},
                                                                                                                    unlocked(){return hasUpgrade("Mg",31)}
                                                                                                                    },
                                                        },
                                                    update(diff){
                                                        if(player.Mg.bar.gte(0.031))player.Mg.bar = player.Mg.bar.sub(diff)
                                                        if(player.Mg.points.gte(1)) player.Mg.MgO = player.Mg.MgO.add(tmp.Mg.MgOgain.mul(diff))
                                                        
                                                        if(player.Mg.bar.gte(player.Mg.MgNLimit)) player.Mg.MgN = player.Mg.MgN.add(tmp.Mg.MgNgain.mul(diff))
                                                        if(player.Mg.bar.gte(player.Mg.MgCO3Limit)) player.Mg.MgCO3 = player.Mg.MgCO3.add(tmp.Mg.MgCO3gain.mul(diff))
                                                        if(!hasUpgrade("Mg",23)) player.Mg.MgNLimit = new Decimal(90)
                                                        if((hasUpgrade("Mg",23))&&(!hasUpgrade("Mg",41))) player.Mg.MgNLimit = new Decimal(70)
                                                        if((hasUpgrade("Mg",23))&&(hasUpgrade("Mg",41))) player.Mg.MgNLimit = new Decimal(40)
                                                        if((hasUpgrade("Mg",23))&&(!hasUpgrade("Mg",41))) player.Mg.MgCO3Limit = new Decimal(100)
                                                        if((hasUpgrade("Mg",23))&&(hasUpgrade("Mg",41))) player.Mg.MgCO3Limit = new Decimal(85)
                                                    },
                                                    effect(){ let eff = new Decimal(1)
                                                        if(!hasUpgrade("Mg",11)) eff = eff.mul(new Decimal(2)).pow((player.Mg.points).pow(1.15))
                                                    if(hasUpgrade("Mg",11)) eff = eff.mul(new Decimal(3)).pow((player.Mg.points).pow(1.15))
                                                    if(hasUpgrade("Mg",13)) eff = eff.mul(3)
                                                    if(hasUpgrade("Mg",14)) eff = eff.mul(5)
                                                    if(hasUpgrade("Mg",21)) eff = eff.mul(upgradeEffect("Mg",21))
                                                    if (getBuyableAmount("Na",62).gte(1)) eff = eff.mul(buyableEffect("Na",62))
                                                    if(getBuyableAmount("Na",51).gte(1)) eff = eff.mul(buyableEffect("Na",51).add(1).pow(5))
                                                    if(getBuyableAmount("Mg",31).gte(1)) eff = eff.mul(1.5)
                                                    if(hasUpgrade("Mg",25)) eff = eff.mul(upgradeEffect("Mg",25))
                                                return eff},
                                                    MgOeffect(){let eff = new Decimal(1)
                                                    if(hasUpgrade("Mg",11)) eff = eff.mul((player.Mg.MgO).add(1).log10())
                                                    if(hasUpgrade("Mg",12)) eff = eff.pow(2)
                                                    if(hasUpgrade("Mg",24)) eff = eff.pow(1.5)
                                                    return eff},
                                                    MgNeffect(){let eff = new Decimal(1)
                                                    if(hasUpgrade("Mg",14)) eff = eff.mul((player.Mg.MgN).add(1).log10())
                                                    if(hasUpgrade("Mg",15)) eff = eff.mul((eff.sqrt()))
                                                    if(hasUpgrade("Mg",43)) eff = eff.pow(1.5)
                                                    return eff

                                                    },
                                                    MgCO3effect(){let eff = new Decimal(1)
                                                        if(hasUpgrade("Mg",42)) eff = eff.mul((player.Mg.MgCO3).add(1).log10())
                                                        return eff


                                                    },
                                                    
                                                    effectDescription(){return "提升镁条燃烧效率<h2 style=color:#104ea2;text-shadow:0px 0px 10px;>" + format(tmp.Mg.effect) + "x<h2>"},

                                                    
                                                        color: "#104ea2", 
                                                        nodeStyle() {
                                                            return {
                                                                background: (player.Mg.unlocked || canReset("Mg")) ? ("radial-gradient(circle, #666666 0%, #104ea2 100%)") : "#bf8f8f",
                                                            }
                                                        },                       // The color for this layer, which affects many elements.
                                                        resource: "镁",            // The name of this layer's main prestige resource.
                                                        row: 5,   
                                                        position: 2,                              // The row this layer is on (0 is the first row).
                                                     
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal("1e3500"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "static",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 5,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        resetsNothing(){return true},
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                        branches:["Ne","Na"],
                                                        layerShown() { return player.H.points.gte("1e3000") },          // Returns a bool for if this layer's node should be visible in the tree.
                                                        buyables:{
                                                            11: {
                                                                title: "镁原子",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将化学方程式中镁的化学计量数增加1.")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return true},
                                                                buy() { 
                                                                     player.Mg.Balance11 = player.Mg.Balance11.add(1)
                                                                     if(player.Mg.Balance11.gte(6))player.Mg.Balance11 = new Decimal(0)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { return {'background-color': "#104ea2", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-color': "#003d91",'border-radius': "150px", height: "150px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            12: {
                                                                title: "氟化氢分子",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将化学方程式中氟化氢的化学计量数增加1.")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return true},
                                                                buy() { 
                                                                     player.Mg.Balance12 = player.Mg.Balance12.add(1)
                                                                     if(player.Mg.Balance12.gte(6))player.Mg.Balance12 = new Decimal(0)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { return {'background-color': "#FFFFFF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#AAAAAA",'border-radius': "150px", height: "150px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            13: {
                                                                title: "氟化镁分子",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将化学方程式中氟化镁的化学计量数增加1.")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return true},
                                                                buy() { 
                                                                     player.Mg.Balance13 = player.Mg.Balance13.add(1)
                                                                     if(player.Mg.Balance13.gte(6))player.Mg.Balance13 = new Decimal(0)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { return {'background-color': "#FFCCFF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#EEBBEE",'border-radius': "150px", height: "150px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            14: {
                                                                title: "氢气分子",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将化学方程式中氢气的化学计量数增加1.")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return true},
                                                                buy() { 
                                                                     player.Mg.Balance14 = player.Mg.Balance14.add(1)
                                                                     if(player.Mg.Balance14.gte(6))player.Mg.Balance14 = new Decimal(0)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { return {'background-color': "#6495ED", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#5284CB",'border-radius': "150px", height: "150px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            21: {
                                                                title: "无",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将反应条件设置为无")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return !getBuyableAmount(this.layer,this.id).gte(1)},
                                                                buy() { 
                                                                    player.Mg.Condition1 = new Decimal(1)
                                                                     setBuyableAmount(this.layer,this.id,new Decimal(1))
                                                                     setBuyableAmount(this.layer,22,new Decimal(0))
                                                                     setBuyableAmount(this.layer,23,new Decimal(0))
                                                                     setBuyableAmount(this.layer,24,new Decimal(0))
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { if(!getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#FFFFFF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#AAAAAA",'border-radius': "10px", height: "100px", width: "150px"}
                                                                if(getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#00FF00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00DD00",'border-radius': "10px", height: "100px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            22: {
                                                                title: "高温、催化剂",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将反应条件设置为高温、催化剂")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return !getBuyableAmount(this.layer,this.id).gte(1)},
                                                                buy() { 
                                                                    player.Mg.Condition1 = new Decimal(0)
                                                                     setBuyableAmount(this.layer,this.id,new Decimal(1))
                                                                     setBuyableAmount(this.layer,21,new Decimal(0))
                                                                     setBuyableAmount(this.layer,23,new Decimal(0))
                                                                     setBuyableAmount(this.layer,24,new Decimal(0))
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { if(!getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#FFFFFF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#AAAAAA",'border-radius': "10px", height: "100px", width: "150px"}
                                                                if(getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#00FF00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00DD00",'border-radius': "10px", height: "100px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            23: {
                                                                title: "点燃",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将反应条件设置为点燃")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return !getBuyableAmount(this.layer,this.id).gte(1)},
                                                                buy() { 
                                                                    player.Mg.Condition1 = new Decimal(0)
                                                                     setBuyableAmount(this.layer,this.id,new Decimal(1))
                                                                     setBuyableAmount(this.layer,22,new Decimal(0))
                                                                     setBuyableAmount(this.layer,21,new Decimal(0))
                                                                     setBuyableAmount(this.layer,24,new Decimal(0))
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { if(!getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#FFFFFF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#AAAAAA",'border-radius': "10px", height: "100px", width: "150px"}
                                                                if(getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#00FF00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00DD00",'border-radius': "10px", height: "100px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            24: {
                                                                title: "加热",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("将反应条件设置为加热")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return !getBuyableAmount(this.layer,this.id).gte(1)},
                                                                buy() { 
                                                                    player.Mg.Condition1 = new Decimal(0)
                                                                     setBuyableAmount(this.layer,this.id,new Decimal(1))
                                                                     setBuyableAmount(this.layer,22,new Decimal(0))
                                                                     setBuyableAmount(this.layer,23,new Decimal(0))
                                                                     setBuyableAmount(this.layer,21,new Decimal(0))
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { if(!getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#FFFFFF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#AAAAAA",'border-radius': "10px", height: "100px", width: "150px"}
                                                                if(getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#00FF00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00DD00",'border-radius': "10px", height: "100px", width: "150px"}},
                                                                autoed() { return false},
                                                            },
                                                            31: {
                                                                title: "验证答案",
                                                                gain() { 
                                                                    let gain = new Decimal(1)

                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("点击验证答案是否正确。如果该Clickable变绿，则答案正确！<br>答对奖励：x1.5镁效应，x1.5研究力量")
                                                                    return display;
                                                                },
                                                                unlocked() { return true }, 
                                                                canAfford() { return !getBuyableAmount(this.layer,this.id).gte(1)},
                                                                buy() { 
                                                                    if((player.Mg.Condition1 == 1)&&(player.Mg.Balance11 == 1)&&(player.Mg.Balance12 == 2)&&(player.Mg.Balance13 == 1)&&(player.Mg.Balance14 == 1)) setBuyableAmount(this.layer,this.id,new Decimal(1))
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { if(!getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#FFFFFF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#AAAAAA",'border-radius': "10px", height: "300px", width: "300px"}
                                                                if(getBuyableAmount(this.layer,this.id).gte(1))return {'background-color': "#00FF00", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#00DD00",'border-radius': "10px", height: "300px", width: "300px"}},
                                                                autoed() { return false},
                                                            },
                                                            41: {
                                                                title: "充填氮气",
                                                                gain() { 
                                                                    let gain = new Decimal(5)
                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("消耗你所拥有的90%氮，将镁燃烧的集气瓶中加入5%氮气")
                                                                    return display;
                                                                },
                                                                unlocked() { return hasUpgrade("Mg",14) }, 
                                                                canAfford() { return (!player.Mg.bar.gte(95))},
                                                                buy() { 
                                                                     player.Mg.bar = player.Mg.bar.add(5)
                                                                     player.N.points = player.N.points.mul(0.1)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { return {'background-color': "#FBB9DF", filter: "brightness("+new Decimal(100)+"%)", color: "black", 'border-color': "#D997BD",'border-radius': "25px", height: "100px", width: "300px"}},
                                                                autoed() { return false},
                                                            },
                                                            42: {
                                                                title: "充填氧气",
                                                                gain() { 
                                                                    let gain = new Decimal(5)
                                                                return gain
                                                            },
                                                                display() { // Everything else displayed in the buyable button after the title
                                                                    let data = tmp[this.layer].buyables[this.id]
                                                                    let display = ("消耗你所拥有的99%氧，将镁燃烧的集气瓶中加入5%氧气")
                                                                    return display;
                                                                },
                                                                unlocked() { return hasUpgrade("Mg",14) }, 
                                                                canAfford() { return player.Mg.bar.gte(5)},
                                                                effect(){return new Decimal(5)},
                                                                buy() { 
                                                                     player.Mg.bar = player.Mg.bar.sub(5)
                                                                     player.O.points = player.O.points.mul(0.01)
                                                                     
                                                                },
                                                                buyMax() {
                                                                    // I'll do this later ehehe
                                                                },
                                                                style() { return {'background-color': "#0066FF", filter: "brightness("+new Decimal(100)+"%)", color: "white", 'border-color': "#0044DD",'border-radius': "25px", height: "100px", width: "300px"}},
                                                                autoed() { return false},
                                                            },
                                                        },
                                                    })
                                                    addLayer("Al", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                    
                                                        color: "#BBBBFF",                       // The color for this layer, which affects many elements.
                                                        resource: "铝",            // The name of this layer's main prestige resource.
                                                        row: 5,                                 // The row this layer is on (0 is the first row).
                                                        nodeStyle() {return {
                                                            "background": "radial-gradient(#FFFFFF, #BBBBFF)" ,
                                                        }},
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal("1eeeeeeeeeeeeeeeeeeeeeeeeee10"), 
                                                        position:99,
                                                        branches:["Ne","Mg"],   
                                                        resetsNothing(){return true}, 
                                                        effectDescription(){return "此层级还未做好，实际做好后第一次铝重置需要1e11451氢"},         // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "normal",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 1e-308,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                    
                                                        layerShown() { return hasUpgrade("Mg",45) },          // Returns a bool for if this layer's node should be visible in the tree.
                                                    
                                                        upgrades: {
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                    })