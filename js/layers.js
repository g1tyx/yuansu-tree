 addLayer("H", {
    name: "氢", // This is optional, only used in a few places, If absent it just uses the layer id.
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
                effect(){return new Decimal(3)},
                effectDisplay(){return `x${format(this.effect())}`}
                },
           
            12: {
                title: "氢阴离子(H+)",
                description: "提升2.00x氢获取",
                cost: new Decimal(5),
                        effect(){return new Decimal(2)},
                        effectDisplay(){return `x${format(this.effect())}`}
                },
            13: {
                title: "氢阳离子(H-)",
                description: "氢提升基本粒子获取",
                cost: new Decimal(5),
                        effect(){return player.H.points.pow(0.2)},
                        effectDisplay(){return `x${format(this.effect())}`}
                },
            14: {
                    title: "氢气(H₂)",
                    description: "上一个升级以削弱的效果提升氢获取",
                    cost: new Decimal(5),
                    effect(){
                                let eff = player.H.points.pow(0.15)
                            if(hasUpgrade("He",12)) eff = eff.mul(upgradeEffect("He",12))
                             return eff
                        },
                            effectDisplay(){return `x${format(this.effect())}`}
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
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.7, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if(hasUpgrade("He",14)) mult = mult.mul(upgradeEffect("He", 14))
            if(player.B.unlocked) mult = mult.mul(format(tmp.B.CpowerEffect))
             return mult
                },
                gainExp() { // Calculate the exponent on main currency from bonuses
                    exp = new Decimal(1)
                    if (hasUpgrade("Li",13)) exp = exp.times(1.05)
                    return exp

                },
                row: 1, // Row the layer is in on the tree (0 is the first row)
                hotkeys: [
                    {key: "j", description: "J: 重置获得氦", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
                ],
                layerShown(){return true},
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
                            let f = player.points.add(1).max(1)
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
                    requirementDescription: "氦气集气瓶(20氦)",
                    effectDescription: "在重置后保留所有氢升级",
                    done() {
                        return player.He.points.gte(20)
                    }
                },
                1: {
                    requirementDescription: "工业氦气罐(100氦)",
                    effectDescription: "每秒获取50%重置可获得的氢",
                    done() {
                        return player.He.points.gte(100)
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
                            description: "质子提升氢气(H₂)效果",
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
                                        effectDisplay(){return `x${format(this.effect())}`}
                            },
                        },
                        buyables: {
                            11: {
                              title: "氦-3(He-3)",
                              cost(x) {return new Decimal(15).mul(new Decimal(1.15).pow(x)).floor()},
                              canAfford() { return player.He.points.gte(this.cost())},
                              buy() {
                                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                              },
                              display() {return `(*不消耗氦)一种拥有巨大潜力的新型能源，在月球上有巨大储备。\n持有氦-3分子数目： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}氦\n效果：氢获取*${format(this.effect())}倍`},
                              effect(x) { 
                                mult2 = new Decimal(x).add(1).pow(0.7)
                                return new Decimal(mult2)}
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
                 
                 effect(){let effect = player.Li.points.pow(2).add(1)
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
                            effectDescription: "解锁2个锂升级",
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
                                    layerShown(){return true},
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
                                resetsNothing() { return hasMilestone("B",4)},
                                challenges:{
                                11: {
                                    name: "轻型锂合金",
                                    challengeDescription: "基本粒子获取^0.8 . ",
                                    canComplete(){return player.H.points.gte("1000000")},
                                    goalDescription: "1,000,000氢",
                                    rewardDescription(){return "氢获取^1.1。"},
                                  unlocked(){return true},
                                },
                            },
                            autoPrestige() { return (hasMilestone("B", 1))},
                         
                                    
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
                                                title: "锂离子(Li-)",
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
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                        symbol:"Be",
                                                        position: 0,

                                                    
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
        "challenges",
       
        "blank",
        , "blank", "blank", ]
                                                        },
                                                    },
                                                    effect(){
                                                     let eff = player.Be.points.pow(2.5).add(1)
                                                     if (hasUpgrade("N",14)) eff = eff.mul(upgradeEffect("N",14))
                                                     return eff

                                                    },
                                                    
                                                                effectDescription() {
                                                        return "倍增氢获取 " + format(tmp.Be.effect) + "x"
                                                    },
                                                    canBuyMax() { return hasMilestone("Be", 2) },
                                                    resetsNothing() { return true}},
                                                        
                                                    addLayer("B", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),  
                                                            Apower: new Decimal(1),
                                                            Bpower: new Decimal(1),
                                                            Cpower: new Decimal(1), 
                                                            Dpower: new Decimal(1),// "points" is the internal name for the main resource of the layer.
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
                                                        layerShown() { return player.Be.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
                                                        
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
			"blank",
			"milestones", "blank", "blank", "upgrades"],
                                                    
                                                        effect() {
                                                            let eff = new Decimal(4).pow(player.B.points).minus(1)
                                                            if (hasUpgrade("B",11)) eff = eff.pow(1.14514)
                                                            return eff;
                                                        },
                                                        resetsNothing() { return true },
                                                        ApowerEffect(){
                                                        let Apowerbase = new Decimal(5);
                                                        
                                                        Apowerbase = Apowerbase.mul(player.B.Apower).pow(0.4).add(1)
                                                        if (!hasMilestone("B", 0)) Apowerbase = Apowerbase.pow(0)
                                                        if (hasUpgrade("B", 12)) Apowerbase = Apowerbase.pow(upgradeEffect("B",12))
                                                        Apowerbase = Apowerbase.mul(tmp.B.DpowerEffect)
                                                        

                                                        return Apowerbase;
                                                    
                                                        }           , 
                                                        BpowerEffect(){
                                                        let Bpowerbase = new Decimal(4);
                                                        Bpowerbase = Bpowerbase.mul(player.B.Bpower).pow(0.3).add(1)
                                                        if (!hasMilestone("B", 2)) Bpowerbase = Bpowerbase.pow(0)
                                                        if (hasUpgrade("B", 12)) Bpowerbase = Bpowerbase.pow(upgradeEffect("B",12))
                                                        Bpowerbase = Bpowerbase.mul(tmp.B.DpowerEffect)
                                                        return Bpowerbase;
                                                            }    ,
                                                         CpowerEffect(){
                                                                let Cpowerbase = new Decimal(3);
                                                                Cpowerbase = Cpowerbase.mul(player.B.Cpower).pow(0.2).add(1)
                                                                if (!hasMilestone("B", 4)) Cpowerbase = Cpowerbase.pow(0)
                                                                if (hasUpgrade("B", 12)) Cpowerbase = Cpowerbase.pow(upgradeEffect("B",12))
                                                                Cpowerbase = Cpowerbase.mul(tmp.B.DpowerEffect)
                                                                return Cpowerbase;
                                                                
                                                                }     ,      
                                                        DpowerEffect(){
                                                                 let    Dpowerbase = new Decimal(2);
                                                                 Dpowerbase = Dpowerbase.mul(player.B.Dpower).pow(0.1).add(1)
                                                                 if (!hasMilestone("N",2))Dpowerbase = Dpowerbase.pow(0)
                                                                    return Dpowerbase;
                                                                
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
                                                            // Look in the upgrades docs to see what goes here!
                                                        },
                                                    },
                                                    addLayer("C", {
                                                        startData() { return {                  // startData is a function that returns default data for a layer. 
                                                            unlocked: false,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),  
                                                            Cpower: new Decimal(0) ,
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
                                                            if (hasMilestone("C",2)) player.C.Cpower = player.C.Cpower.add(((buyableEffect("C",21)).add(1)).times(diff))
                                                        
                                                       
                                                        
                                                        },
                                                        Cdim1(){return getBuyableAmount("C",21)},
                                                        Rank(){return getBuyableAmount("C",11)},
                                                        Tier(){return getBuyableAmount("C",12)},
                                                        PowerEffect(){let PowerEffect = new Decimal(1)
                                                            if (hasMilestone("C",2)) PowerEffect = (player.C.Cpower).pow(0.3).add(1)
                                                            if (hasUpgrade("N",12)) PowerEffect = PowerEffect.mul(upgradeEffect("N",12))
                                                            return PowerEffect},
                                                        Cdim1effect(){return buyableEffect("C",21)},
                                                    
                                                        color: "#333333",                       // The color for this layer, which affects many elements.
                                                        resource: "碳",            // The name of this layer's main prestige resource.
                                                        row: 2,       
                                                        symbol:"C",   
                                                        position: 2,                        // The row this layer is on (0 is the first row).
                                                        effect(){return player.C.points.pow(0.3)},
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e30),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "normal",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {  let mult = new Decimal(1)
                                                            mult = mult.mul(tmp.C.PowerEffect)
                                                        
                                                            if(hasMilestone("C",4)) mult = mult.mul(2)   
                                                            if(hasMilestone("C",5)) mult = mult.mul(2)  
                                                            if (hasMilestone("C",8)) mult = mult.mul(10)
                                                            if (hasMilestone("C",9)) mult = mult.mul(10)                     // Returns your multiplier to your gain of the prestige resource.
                                                            return mult     
                                                                 // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                    
                                                        layerShown() { return player.B.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
                                                    
                                                        upgrades: {
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
                                                                    if(9<x<100){ return new Decimal(10).mul(new Decimal(5000).pow((x).sub(7)))}
                                                                },
                                                                canAfford() { return player.C.Cpower.gte(this.cost())},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   setBuyableAmount(this.layer, 21,new Decimal(0))
                                                                   setBuyableAmount(this.layer, 22,new Decimal(0))
                                                                   setBuyableAmount(this.layer, 23,new Decimal(0))
                                                                   player.C.Cpower = new Decimal(0)
                                                                   
                                                                },
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
                                                                   player.C.Cpower = new Decimal(0)
                                                                },
                                                                display() {return `重置级别，但提升阶层。\n当前阶层： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}层级\n效果：阶层1：木炭能量获取^1.15。<br>阶层2：木炭能量和碳获取*10，氢获取*1e6。`},
                                                                effect(x) { 
                                                                  eff = new Decimal(x)
                                                                  return new Decimal(eff)}
                                                              },
                                                            21: {
                                                                unlocked(){return layers.C.Rank().gte(1)},
                                                              title: "木炭能量发生器",
                                                              cost(x) {return new Decimal(10).mul(new Decimal(1.5).pow(x))},
                                                              canAfford() { return player.C.Cpower.gte(this.cost())},
                                                              buy() {
                                                                 setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                 player[this.layer].Cpower = player[this.layer].Cpower.sub(tmp[this.layer].buyables[this.id].cost)
                                                              },
                                                              display() {return `生产木炭能量。\n持有木炭能量发生器数量： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}木炭能量\n效果：每秒生产*${format(this.effect())}木炭能量`},
                                                              effect(x) { 
                                                                eff = new Decimal(x)
                                                                eff = eff.mul(tmp.C.buyables[22].effect)
                                                                if (hasUpgrade("N",11)) eff = eff.mul(upgradeEffect("N",11))
                                                                if (hasMilestone("C",8)) eff = eff.mul(10)
                                                                if (hasMilestone("C",9)) eff = eff.mul(10)
                                                                if (hasMilestone("C",7)) eff = eff.pow(1.15)
                                                                
                                                                return eff
                                                            },
                                                        },
                                                            22: {
                                                                title: "木炭能量助推器",
                                                                unlocked(){return layers.C.Rank().gte(2)},
                                                                cost(x) {return new Decimal(100).mul(new Decimal(4).pow(x))},
                                                                canAfford() { return player.C.Cpower.gte(this.cost())},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   player[this.layer].Cpower = player[this.layer].Cpower.sub(tmp[this.layer].buyables[this.id].cost)
                                                                },
                                                                display() {return `倍增木炭能量发生器的效果。\n持有木炭能量助推器数量： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}木炭能量\n效果：木炭能量发生器效果*${format(this.effect())}`},
                                                                effect(x) { 
                                                                  eff = new Decimal(x).mul(2).add(1)
                                                                  eff = eff.pow(tmp.C.buyables[23].effect)
                                                                  return new Decimal(eff)}
                                                              },
                                                              23: {
                                                                title: "木炭能量增强器",
                                                                unlocked(){return layers.C.Rank().gte(3)},
                                                                cost(x) {return new Decimal(1000).mul(new Decimal(9).pow(x))},
                                                                canAfford() { return player.C.Cpower.gte(this.cost())},
                                                                buy() {
                                                                   setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                                                                   player[this.layer].Cpower = player[this.layer].Cpower.sub(tmp[this.layer].buyables[this.id].cost)
                                                                },
                                                                display() {return `指数加成木炭能量助推器的效果。\n持有木炭能量增强器数量： ${format(getBuyableAmount(this.layer, this.id))}\n价格：${format(this.cost())}木炭能量\n效果：木炭能量助推器效果^${format(this.effect())}`},
                                                                effect(x) { 
                                                                  if (getBuyableAmount("C",23)<4) eff = new Decimal(x).mul(0.5).add(1)
                                                                  if (getBuyableAmount("C",23)>3) eff = new Decimal(x).mul(0.1).add(2.5)
                                                                  return new Decimal(eff)}
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
                                                            requirementDescription: "特大型木炭堆(2阶层))",
                                                            effectDescription: "碳和木炭能量获取*10，氢获取*1e6",
                                                            done() {
                                                                return tmp.C.Tier.gte(2)
                                                             
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
        "upgrades",
        "buyables",
       
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Graphite-Energy":{
                                                            buttonStyle: {"border-color": "#FF0000"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                    "prestige-button",
        
        "blank",
        , "blank", "blank", ]
                                                        },
                                                        "Graphite-Upgrades":{
                                                            buttonStyle: {"border-color": "#FF0000"},
                                                            content:["infobox",
                                                        "main-display",
        
                                                    "prestige-button",
        
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
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                    
                                                        color: "#FBB9DF",                       // The color for this layer, which affects many elements.
                                                        resource: "氮",    
                                                        symbol:"N",        // The name of this layer's main prestige resource.
                                                        row: 3,   
                                                        position: 1,                              // The row this layer is on (0 is the first row).
                                                    
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
                                                        Effect(){return new Decimal(3).pow(player.N.points).add(1)},

                                                        upgrades: {
                                                            11: {
                                                                title: "氮原子(N)",
                                                                description: "级别提升木炭能量获取",
                                                                cost: new Decimal(2),
                                                                effect(){return new Decimal((tmp.C.Rank).pow(0.4))},
                                                                effectDisplay(){return `*${format(this.effect())}`},
                                                                unlocked(){return hasMilestone("N",1)}
                                                                },
                                                                12: {
                                                                    title: "氮离子(N3-)",
                                                                    description: "木炭能量增幅碳获取的公式更好",
                                                                    cost: new Decimal(3),
                                                                    effect(){let eff = new Decimal(1.2)
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
                                                            unlocked: true,                     // You can add more variables here to add them to your layer.
                                                            points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
                                                        }},
                                                    
                                                        color: "#0000FF",                       // The color for this layer, which affects many elements.
                                                        resource: "氧",            // The name of this layer's main prestige resource.
                                                        row: 3,  
                                                        position: 10,                               // The row this layer is on (0 is the first row).
                                                    
                                                        baseResource: "氢",                 // The name of the resource your prestige gain is based on.
                                                        baseAmount() { return player.H.points },  // A function to return the current amount of baseResource.
                                                    
                                                        requires: new Decimal(1e100),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                                                                // Also the amount required to unlock the layer.
                                                    
                                                        type: "normal",                         // Determines the formula used for calculating prestige currency.
                                                        exponent: 0.1,                          // "normal" prestige gain is (currency^exponent).
                                                    
                                                        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
                                                            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
                                                        },
                                                        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
                                                            return new Decimal(1)
                                                        },
                                                    
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
                                                                function() {return '你有 ' + format(player.O.points) + '氧，效果正在咕咕中'},
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
                                                    })