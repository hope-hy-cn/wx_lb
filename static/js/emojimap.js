let emojiBaseUrl = `https://ximi-jy.oss-cn-hangzhou.aliyuncs.com/quyue/biaoqing`
const iconEmojiDelete = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAk1BMVEUAAADAwMC3t7e/v7/Gxsa/v7+/v7/AwMC/v7+/v7+/v7++vr7CwsK/v7+/v7+/v7++vr6/v7+/v7+/v7+/v7+/v7/AwMCbm5u/v7+/v7+/v7+/v7/AwMC/v7+/v7+/v7+/v7+/v7+/v7++vr7AwMC9vb2/v7+/v7/CwsLAwMDHx8fExMTIyMjLy8vJycnKysrPz8+3r5/kAAAAKHRSTlMA8Q39A/vcIwf34B0P1uNJIuzPjHFqFwVFmls4J761rMiFoVJ6XTNYKpTiKQAAAylJREFUeF7tmEl3ozAQhNt0ywYM3rfETuJMltEC2P//1w3IVg555olmHjfVlcMnAVUtFfgVFBQUFBQUFBREXAAR8BVnEUNZzF8YwTYdsZQ/Pcc8CsGmNEpyZMoqn/MYzxoFomIIhTDFujtjD3OlEFEyVENqzHUN1HUfx0QiKjliKJEVIorioxuF4LQ0AkW53mddf7Asmh5eNaLQeUfGLtUN4w8wtbaULlshiFZVw3gF7g8Jr4UQ5ZMfQkAvl5pRnWO+teYGhT53YMBbWTP0OAMCrqaJQjmLwKunhmGWkx4MiEZSyZEPQvDeMGRy7MOAbCTRCyHYFqqx+Rxi6KHIC7FhYrCW/gKCQSAuTBRWGwaDCSE4CmmNDtRhJhFxIS5M2o1uweQZmw7iC5N2o58O9EMhyDabjAdxYdJudIINytXiTiGY5tfrKuJBXJjo8a6FsUiMuIynQDfGuEqScgvEgLgwaTU6wVEJFEVDsYxCoOBBXJjI5LvdIOeyoaRTiGGaNowqZ7wuFybYYnT3vlJ928t9H3o2AeoOIdhUHqNbykzb9R/y6jfDDyH40g3jYo3uo6CUEh2jM4TgYE8mv4z+kJIWeFORToDn+FUhEI1/ohNMxtIy5NgyGJBspBDlMvKnYtzMV1SIxo6CYXeiZG69P8g3mbhvIqrGlQyIG1Xi8ukobYzb32UkOu93hrihi6i3QB5G48aD9aKl8B2vlPyAvYehZyc4WZqjMLMLFR5aKdHN5+kC4nvClGcA4Kdwe0ISbMs7g35yTB6B+swTs1wAtUCSpLBZcnt3lTBJTew1GXX+eGrVj69X5/OGkhu5Aeo54y+rGOjh489Py3drmn//z2nlBR5TPKcV5rnr7SEF9nvGuct3HW2uMVzxz8KifAcaDOICRhVboMEg7kiB5m/f+4nyQ34CRtmAGWAnLmD637V2I2Vn7I+8AXPiF0sHiWjyGDrf43W663WPv7wBdW8kqlXUp5Eonn9BfAGTRYxuZX7vVmJGSyQQTcJpiUxLS+QJGKW4fRfavovX3Clmc6f1mtlBXuSQHaSjLAdoU4fvhYdvuIOCgoKCgoL+AXU1fW2kbFGNAAAAAElFTkSuQmCC'
let albumArr = []
let emojiList = {
  "emoji": {
     "[强]": { file: "emoji_0.png" }, "[弱]": { file: "emoji_1.png" },"[外星人]": { file: "emoji_2.png" }, "[生气]": { file: "emoji_3.png" },
      "[难受]": { file: "emoji_4.png" },"[惊讶]": { file: "emoji_5.png" }, 
      "[脸红]": { file: "emoji_6.png" }, "[领结]": { file: "emoji_7.png" }, 
      "[心碎]": { file: "emoji_8.png" }, "[建筑师]": { file: "emoji_9.png" },
      "[哭]": { file: "emoji_10.png" }, "[失望]": { file: "emoji_11.png" },
       "[头晕]": { file: "emoji_12.png" },"[呆滞]": { file: "emoji_13.png" }, 
       "[大眼睛]": { file: "emoji_14.png" }, "[可怕]": { file: "emoji_15.png" },
       "[火]": { file: "emoji_16.png" }, "[发呆]": { file: "emoji_17.png" }, 
       "[鬼]": { file: "emoji_18.png" }, "[呲牙]": { file: "emoji_19.png" }, 
       "[咧嘴笑]": { file: "emoji_20.png" }, "[色]": { file: "emoji_21.png" },
       "[安静]": { file: "emoji_22.png" }, "[天真]": { file: "emoji_23.png" }, 
       "[笑哭]": { file: "emoji_24.png" },"[亲亲]": { file: "emoji_25.png" }, 
       "[大笑]": { file: "emoji_26.png" }, "[口罩]": { file: "emoji_27.png" }, 
       "[自然]": { file: "emoji_28.png" }, "[张嘴]": { file: "emoji_29.png" },
        "[思考]": { file: "emoji_30.png" }, "[坚忍]": { file: "emoji_31.png" },
         "[恐惧]": { file: "emoji_32.png" }, "[睡觉]": { file: "emoji_33.png" },
         "[困]": { file: "emoji_34.png" }, "[阴险]": { file: "emoji_35.png" }, 
         "[大哭]": { file: "emoji_36.png" }, "[鬼脸]": { file: "emoji_37.png" },
          "[得意]": { file: "emoji_38.png" }, "[汗]": { file: "emoji_39.png" },
          "[甜笑]": { file: "emoji_40.png" }, "[难过]": { file: "emoji_41.png" }, 
          "[眨眼]": { file: "emoji_42.png" }, "[美味]": { file: "emoji_43.png" },
           "[心]": { file: "emoji_44.png" }, 
  }
}

for (let emoji in emojiList) {
  let emojiItem = emojiList[emoji]
  for (let key in emojiItem) {
    let item = emojiItem[key]
    item.img = `${emojiBaseUrl}/${item.file}`
  }
}

emojiList['ajmd'] = {}
emojiList['xxy'] = {}
emojiList['lt'] = {}

for (let i = 1; i <= 48; i++) {
  let key = 'ajmd0' + (i >= 10 ? i : '0' + i)
  emojiList['ajmd'][key] = { file: key + '.png' }
}
for (let i = 1; i <= 40; i++) {
  let key = 'xxy0' + (i >= 10 ? i : '0' + i)
  emojiList['xxy'][key] = { file: key + '.png' }
}
for (let i = 1; i <= 20; i++) {
  let key = 'lt0' + (i >= 10 ? i : '0' + i)
  emojiList['lt'][key] = { file: key + '.png' }
}

// 内容
for (let emoji in emojiList) {
  let emojiItem = emojiList[emoji]
  for (let key in emojiItem) {
    let item = emojiItem[key]
    item.img = `${emojiBaseUrl}/${item.file}`
  }
  // 封面
  albumArr.push({
    album: emoji,
    img: emojiItem[Object.keys(emojiItem)[0]]['img']
  })
}
// 添加删除按钮
// emojiList['emoji']['[删除]'] = {}
// emojiList['emoji']['[删除]']['img'] = iconEmojiDelete

export default {
  emojiList,
  albumArr
}