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
        if(player.B.unlocked) mult = mult.mul(format(tmp.B.BpowerEffect))
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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (inChallenge('Li',11)) exp = exp.times(0.8)
        if (hasChallenge('Li',11)) exp = exp.times(1.1)
        if (hasUpgrade("Li",11)) exp = exp.times(1.05)
        if (hasUpgrade("Li",12)) exp = exp.times(1.05)
        
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: 重置获得氢", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration(){return hasMilestone('He',1)? 1 : 0},
    
    
        upgrades: { // Streaming
            11: {
                title: "氢原子(H)",
                description: "提升3.00x基本粒子获取",
                cost: new Decimal(2),
                effect(){ let eff = new Decimal(3)
                if(hasUpgrade("H",21)) eff = eff.mul(upgradeEffect("H",21))
            return eff},
                effectDisplay(){return `x${format(this.effect())}`}
                },
           
            12: {
                title: "氢阴离子(H-)",
                description: "提升2.00x氢获取",
                cost: new Decimal(2),
                        effect(){return new Decimal(2)},
                        effectDisplay(){return `x${format(this.effect())}`}
                },
            13: {
                title: "氢阳离子(H+)",
                description: "氢提升基本粒子获取",
                cost: new Decimal(2),
                        effect(){eff = player.H.points.pow(0.2)
                        if (eff>1e80) eff = new Decimal(1e80).mul(eff.div(1e80).root(5))
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
                            if (eff>1e80) eff = new Decimal(1e80).mul(eff.div(1e80).root(5))
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
                            let eff = new Decimal(4).pow(tmp.C.Tier)
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
            if(player.B.unlocked) mult = mult.mul(format(tmp.B.CpowerEffect))
            if(hasUpgrade("H",24)) mult = mult.mul(upgradeEffect("H",24))
            if(getBuyableAmount("Be",11).gte(1)) mult = mult.mul(buyableEffect("Be",11))
            if((getBuyableAmount("Ne",11).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",11))
        if((getBuyableAmount("Ne",21).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",21))
        if((getBuyableAmount("Ne",31).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",31))
        if((getBuyableAmount("Ne",41).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",41))
        if((getBuyableAmount("Ne",51).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",51))
        if((getBuyableAmount("Ne",61).gte(1))&&(hasMilestone("Ne",5))) mult = mult.mul(buyableEffect("Ne",61))
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
                                    if (player.B.unlocked) eff = eff.mul(format(tmp.B.CpowerEffect))
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
                                                     return eff

                                                    },
                                                    
                                                                effectDescription() {
                                                        return "倍增氢获取 " + format(tmp.Be.effect) + "x"
                                                    },
                                                    canBuyMax() { return hasMilestone("Be", 2) },
                                                    resetsNothing() { return true}},
                                                        
                                                    addLayer("B", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),  
                                                            Apower: new Decimal(1),
                                                            Bpower: new Decimal(1),
                                                            Cpower: new Decimal(1), 
                                                            Dpower: new Decimal(1),
                                                            Epower: new Decimal(1)// "points" is the internal name for the main resource of the layer.
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
                                                            if (player.B.unlocked) player.B.Apower = player.B.Apower.plus(tmp.B.effect.times(diff).pow(1.2));
                                                        
                                                            
                                                            if (player.B.unlocked) player.B.Bpower = player.B.Bpower.plus(tmp.B.effect.times(diff).pow(0.9));
                                                            
                                                            if (player.B.unlocked) player.B.Cpower = player.B.Cpower.plus(tmp.B.effect.times(diff).pow(0.6));
                                                            
                                                            if (player.B.unlocked) player.B.Dpower = player.B.Dpower.plus(tmp.B.effect.times(diff).pow(0.3));
                                                            if (player.B.unlocked) player.B.Epower = player.B.Epower.plus(tmp.B.effect.times(diff).pow(0.15));
                                                        
                                                        
                                                        },
                                                        tabFormat: ["infobox",
                                                            "main-display",
			
                                                        "prestige-button",
                                                        ["bar","NextCD"],
			"blank",
            ["infobox", "introBox"],
            ["display-text",
				function() {return '你有 ' + format(player.B.points) + ' 硼，每秒生产每种硼烷 '+format(tmp.B.effect)+''},
					{}],
			["display-text",
				function() {return '你有 ' + format(player.B.Apower) + ' 甲硼烷(BH₃，增幅基本粒子获取 '+format(tmp.B.ApowerEffect)+'x'},
					{}],
            ["display-text",
				function() {return '你有 ' + format(player.B.Bpower) + ' 乙硼烷(B₂H₅，增幅氢获取 '+format(tmp.B.BpowerEffect)+'x'},
					{}],
                                        ["display-text",
                    function() {return '你有 ' + format(player.B.Cpower) + ' 丙硼烷(B₃H₇，增幅氦获取与氢化氦效果 '+format(tmp.B.CpowerEffect)+'x'},
                        {}],
                        ["display-text",
                        function() {return '你有 ' + format(player.B.Dpower) + ' 丁硼烷(B₄H₉，增幅前三种硼烷效果 '+format(tmp.B.DpowerEffect)+'x'},
                            {}],
                            ["display-text",
                        function() {return '你有 ' + format(player.B.Epower) + ' 戊硼烷(B₅H₁₁，增幅前四种硼烷效果 '+format(tmp.B.EpowerEffect)+'x'},
                            {}],
			"blank",
			"milestones", "blank", "blank", "upgrades"],
                                                    
                                                        effect() {
                                                            let eff = new Decimal(4).pow(player.B.points).minus(1)
                                                            if (hasUpgrade("B",11)) eff = eff.pow(1.14514)
                                                            if (hasUpgrade("B",22)) eff = eff.pow(1.14514)
                                                            

                                                            if (getBuyableAmount("Be",12)) eff = eff.mul(buyableEffect("Be",12))
                                                            return eff;
                                                        },
                                                        resetsNothing() { return true },
                                                        ApowerEffect(){
                                                        let Apowerbase = new Decimal(5);
                                                        
                                                        Apowerbase = Apowerbase.mul(player.B.Apower).pow(0.4).add(1)
                                                        if (!hasMilestone("B", 0)) Apowerbase = Apowerbase.pow(0)
                                                        if (hasUpgrade("B", 12)) Apowerbase = Apowerbase.pow(upgradeEffect("B",12))
                                                        Apowerbase = Apowerbase.mul(tmp.B.DpowerEffect)
                                                        Apowerbase = Apowerbase.mul(tmp.B.EpowerEffect)
                                                        

                                                        return Apowerbase;
                                                    
                                                        }           , 
                                                        BpowerEffect(){
                                                        let Bpowerbase = new Decimal(4);
                                                        Bpowerbase = Bpowerbase.mul(player.B.Bpower).pow(0.3).add(1)
                                                        if (!hasMilestone("B", 2)) Bpowerbase = Bpowerbase.pow(0)
                                                        if (hasUpgrade("B", 12)) Bpowerbase = Bpowerbase.pow(upgradeEffect("B",12))
                                                        Bpowerbase = Bpowerbase.mul(tmp.B.DpowerEffect)
                                                        Bpowerbase = Bpowerbase.mul(tmp.B.EpowerEffect)
                                                        return Bpowerbase;
                                                            }    ,
                                                         CpowerEffect(){
                                                                let Cpowerbase = new Decimal(3);
                                                                Cpowerbase = Cpowerbase.mul(player.B.Cpower).pow(0.2).add(1)
                                                                if (!hasMilestone("B", 4)) Cpowerbase = Cpowerbase.pow(0)
                                                                if (hasUpgrade("B", 12)) Cpowerbase = Cpowerbase.pow(upgradeEffect("B",12))
                                                                Cpowerbase = Cpowerbase.mul(tmp.B.DpowerEffect)
                                                                Cpowerbase = Cpowerbase.mul(tmp.B.EpowerEffect)
                                                                return Cpowerbase;
                                                                
                                                                }     ,      
                                                        DpowerEffect(){
                                                                 let    Dpowerbase = new Decimal(2);
                                                                 Dpowerbase = Dpowerbase.mul(player.B.Dpower).pow(0.1).add(1)
                                                                 Dpowerbase = Dpowerbase.mul(tmp.B.EpowerEffect)
                                                                 if (!hasMilestone("N",2))Dpowerbase = Dpowerbase.pow(0)
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
                                                                                    eff = eff.mul((tmp.B.DpowerEffect))
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
                                                        Rank(){return getBuyableAmount("C",11)},
                                                        Tier(){return getBuyableAmount("C",12)},
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
                                                                unlocked(){return tmp.C.Rank.gte(5)},
                                                                title: "阶层",
                                                                style: {"background-color":'#00FFFF'},
                                                                cost(x) {return new Decimal(5).add(new Decimal(4).mul(x))},
                                                                canAfford() { return tmp.C.Rank.gte(this.cost())},
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
                                                                if (hasMilestone("C",14)) eff = eff.mul((tmp.C.Tier).add(1).pow(hasMilestone('C',15)? 4 : 1)).mul((tmp.C.Rank).add(1).pow(hasMilestone('C',15)? 4 : 1))
                                                                if(hasUpgrade("H",24)) eff = eff.mul(upgradeEffect("H",24))
                                                                if (getBuyableAmount("He",11).gte(1)) eff = eff.mul(buyableEffect("He",11))
                                                                if(hasUpgrade("He",23)) eff = eff.mul(buyableEffect("He",11))
                                                                if(hasUpgrade("Li",14)) eff = eff.pow(new Decimal(1.15))
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
                                                                if (hasMilestone("C",12)) gain = gain.mul(tmp.C.Rank)
                                                                if (hasMilestone("C",13)) gain = gain.mul(tmp.C.Tier)
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
                                                                    return tmp.C.Rank.gte(2)
                                                                 
                                                                }
                                                            },
                                                            5: {
                                                                requirementDescription: "木炭桶(3级别)",
                                                                effectDescription: "再次双倍碳获取。",
                                                                done() {
                                                                    return tmp.C.Rank.gte(3)
                                                                 
                                                                }
                                                            },
                                                                6: {
                                                                    requirementDescription: "小木炭堆(5级别)",
                                                                    effectDescription: "解锁阶层。",
                                                                    done() {
                                                                        return tmp.C.Rank.gte(5)
                                                                     
                                                                    }
                                                            },
                                                            7: {
                                                                requirementDescription: "木炭堆(1阶层)",
                                                                effectDescription: "木炭能量获取^1.15。",
                                                                done() {
                                                                    return tmp.C.Tier.gte(1)
                                                                 
                                                                }

                                                        },
                                                         
                                                        8: {
                                                            requirementDescription: "大木炭堆(8级别)",
                                                            effectDescription: "碳和木炭能量获取*10",
                                                            done() {
                                                                return tmp.C.Rank.gte(8)
                                                             
                                                            }
                                                        },
                                                        9: {
                                                            requirementDescription: "特大型木炭堆(2阶层)",
                                                            effectDescription: "碳和木炭能量获取*10，氢获取*1e6",
                                                            done() {
                                                                return tmp.C.Tier.gte(2)
                                                             
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
                                                                return tmp.C.Tier.gte(3)
                                                             
                                                            }
                                                        },
                                                        12: {
                                                            requirementDescription: "石墨罐子(15级别)",
                                                            effectDescription: "等级倍增石墨能量获取",
                                                            done() {
                                                                return tmp.C.Rank.gte(15)
                                                             
                                                            }
                                                        },
                                                        13: {
                                                            requirementDescription: "大石墨罐子(4阶层)",
                                                            effectDescription: "阶层倍增石墨能量获取",
                                                            done() {
                                                                return tmp.C.Tier.gte(4)
                                                             
                                                            }
                                                        },
                                                        14: {
                                                            requirementDescription: "小石墨堆(5阶层)",
                                                            effectDescription: "前两个里程碑同样适用于木炭能量",
                                                            done() {
                                                                return tmp.C.Tier.gte(5)
                                                             
                                                            }
                                                        },
                                                        15: {
                                                            requirementDescription: "石墨堆(8阶层)",
                                                            effectDescription: "前一个里程碑效果提升至4次方",
                                                            done() {
                                                                return tmp.C.Tier.gte(8)
                                                             
                                                            }
                                                        },
                                                        16: {
                                                            requirementDescription: "大石墨堆(36级别)",
                                                            effectDescription: "氖气获取提升级别倍",
                                                            done() {
                                                                return tmp.C.Rank.gte(36)
                                                             
                                                            }
                                                        },
                                                        17: {
                                                            requirementDescription: "特大石墨堆(42级别)",
                                                            effectDescription: "氦-3效果同样适用于氖气",
                                                            done() {
                                                                return tmp.C.Rank.gte(42)
                                                             
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
                                                                            effect(){return (player.B.Dpower).pow(0.1)},
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
                                                                        if (eff>1e10) eff = ((eff.div(1e10)).root(100)).mul(1e10)
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
                                                                if (eff>1e60) eff = ((eff.div(1e60)).root(10000)).mul(1e60)
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
                                                                name: "一氧化二氟(F₂O)",
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
                                                                    if (player.Ne.unlocked) c11 = c11.mul(((tmp.Ne.effect).div(100)).add(1))
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
                                                                    if (player.Ne.unlocked) c11 = c11.mul(((tmp.Ne.effect).div(100)).add(1))
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
                                                        eff = eff.add((player.Ne.points.log2()).mul(15))
                                                        return eff
                                                        },
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
                                                          title: "黯淡的氖光管<br>*电量达到6%时，解锁1个氢可购买;电量达到12%、20%、30%时，解锁1个氦升级",
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
                                                  title: "闪瞎双眼的氖光管<br>*电量达到30%时，解锁碳60能量！",
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
                                                    if(hasMilestone("C",16)) gain = gain.mul(tmp.C.Rank)
                                                    if(hasMilestone("C",17)) gain = gain.mul(buyableEffect("He",11))
                                                    if(hasUpgrade("B",23)) gain = gain.mul(upgradeEffect("B",23))
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
                                                            if (player.Ne.unlocked) player.Ne.Unpower = player.Ne.Unpower.plus(tmp.Ne.effect2.times(diff).pow(1));
                                                            if (player.Ne.unlocked) player.Ne.Time = player.Ne.Time.plus(diff)
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
                                                    })
                                                    addLayer("Na", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                    
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
                                                        exponent: 5,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                    
                                                        layerShown() { return hasUpgrade("B",24) },          // Returns a bool for if this layer's node should be visible in the tree.
                                                    
                                                        upgrades: {
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
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
                                                                done() {return tmp.C.Rank.gte(1) },
                                                                onComplete() { player.A.Goals = player.A.Goals.add(13) },
                                                                tooltip: "获得1级别。(+13成就点数)",
                                                            },
                                                            64: {
                                                                name: "就是木炭增量啊",
                                                                done() {return tmp.C.Tier.gte(1) },
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
            "upgrades",
            "milestones",
            "buyables",
           
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