auto.waitFor()
const width = device.width, height = device.height, androidRelease = parseInt(device.release)
appName = "部落冲突",
  breakTimeArr = [100, 340, 580, 1060],//820, 1300
  phoneScreen = [width, height],
  findPictureRegion = [318, 67, 185, 593],//
  donateRegion = [355, 581, 120, 35],
  donatePath = "./cocPicture/donate.jpg",
  findQuckBtn = [940, 86, 250, 510],//
  quckBtnRegion = [965, 530, 200, 35],
  quckBtnPath = "./cocPicture/quckBtn.jpg",
  donateReturnPath = "./cocPicture/donateReturn.jpg",
  points = {
    //此为位置点
    chatOn: [14, 319], //打开部落聊天
    chatOff: [530, 319], //关闭部落聊天
    chatUp: [[470, 87, 4, 4], ["#89C513", 2, 80]],
    chatDown: [[470, 607, 4, 4], ["#5DA515", 2, 80]],
    challenge: [
      [[310, 677, 6, 6], ["#D7F37F", 4, 80]],
      [993, 431],
    ], //友谊战
    donateRange: [[538, 30, 646, 482], ["#75AF15", 10, 25]],
  errorClick: [[1235, 49], [530, 319], [1270, 200], [615, 643]],
  MacPoint: [1140, 204, 620, 204]
  },
  attackPoints = {
    //此为位置点
    chatOn: [14, 319], //打开部落聊天
    chatOff: [530, 319], //关闭部落聊天
    chatUp: [[470, 87, 4, 4], ["#89C513", 2, 80]],
    chatDown: [[470, 607, 4, 4], ["#5DA515", 2, 80]],
    challenge: [
      [[310, 677, 6, 6], ["#D7F37F", 4, 80]],
      [993, 431],
    ], //友谊战
  errorClick: [[1235, 49], [530, 319], [1270, 200], [615, 643]],
    //军队
    armyRecruit: [50, 526], //招募军队
    armyOut: [[1181, 45, 5, 5], ["#ED1515", 2, 40]],
    quckRecruitTab: [1100, 45], //一键训练栏
    troopTab: [384, 45],
    spellsTab: [600, 45],
    machinesTab: [816, 45],
    quckRecruit: [
      [1100, 150, 5, 5],
      [1100, 322, 5, 5],
      [1100, 473, 5, 5],
      [1100, 623, 5, 5],
      ["#B6E45E", 3, 60],
    ], //快速训练上——>下
    finishTrain: [
      [[892, 300, 4, 4], ["#B6E45E", 4, 42]],
      [634, 468],
    ], //1发起2确认
    quckHeroes: [
      [876, 401],
      [970, 401],
      [1066, 401],
      [1161, 401],
    ], //一键恢复英雄
    attack: [
      [76, 625],
      [[960, 473, 6, 6], ["#CC5B17", 3, 50], [975, 500]],
    ], //发起
    attacking: [
      [1149, 269],//军队坐标
      [954, 243],//药水坐标
      [[61, 550, 5, 5], ["#FB5D63", 3, 65]]
    ], //军队和药水初始放置地点
    troopsTab: [
      [195, 630],
      [600, 630],
      [500, 630],
      [800, 630],
      [400, 630],
      [700, 630],
      [800, 630],
      [297, 630],
  ],
  backPoint: [505, 143],
    attackBack: [[615, 643, 3, 3], ["#6DBB1F", 3, 35]],
}

let isAttack = false,
  donate, errAttack = 0

function myClick (x, y) {
  if (androidRelease > 7) click(x, y)
  else {
    const ra = new RootAutomator()
    ra.tap(720 - y, x)
    ra.exit()
  }
}

function mySwipe (arr) {
  if (androidRelease > 7) swipe(arr[0], arr[1], arr[2], arr[3])
  else {
    const ra = new RootAutomator()
    ra.swipe(720 - arr[1], arr[0], 720 - arr[3], arr[2])
    ra.exit()
  }
}

function myStop () {
  points = null
  console.log("---------此脚本结束运行----------")
  engines.myEngine().forceStop()
}

function close_and_recycle (packageName, isError) {
  let name = getPackageName(packageName)
  if (!name) {
    if (getAppName(packageName)) {
      name = packageName
    } else {
      return false
    }
  }
  app.openAppSetting(name)
  sleep(5000)
  text(app.getAppName(name)).waitFor()
  const theEnd = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne()
  if (theEnd.enabled()) {
    theEnd.click()
    sleep(5000)
    const isConfirm = textMatches(/(.*确.*|.*定.*)/).findOne()
    if (isConfirm) isConfirm.click()
    toast("强行停止")
    log(app.getAppName(name) + "应用已被关闭")
    name = null
    if (!isError) myStop()
  } else {
    log(app.getAppName(name) + "应用不能被正常关闭或不在后台运行")
    name = null
    if (!isError) myStop()
  }
}

function clickAndSleep (x, y, msg) {
  myClick(x, y)
  sleep(1000)
  console.log(msg + new Date().toTimeString())
}

function isInPicture (march, mode, r) {
  const region = [r[0], r[1], r[2], r[3]]
  let p = findImage(captureScreen(), mode, {
    threshold: march,
    region: region
  })
  region = null
  if (p) return p
  else return false
}

function colorM (arr1, arr2) {
  point = [arr1[0], arr1[1], arr1[2], arr1[3]]
  color = arr2[0]
  r = arr2[1]
  m = arr2[2]
  const findColorMethod = []
  for (let i = 1; i <= r; i++) {
    for (let j = 1; j <= r; j++) {
      findColorMethod.push(new Array(i, j, color))
      if (i !== j) findColorMethod.push(new Array(j, i, color))
    }
  }
  let p = images.findMultiColors(captureScreen(), color, findColorMethod, {
    region: point,
    threshold: m,
  })
  findColorMethod = null
  if (p) return p
  else return false
}

function leftRow () {
  mySwipe(points.MacPoint)
}

function helps (arr1, arr2, j) {
  let p = colorM(arr1, arr2)
  const donateReturn = initPictureStart(quckBtnRegion, donateReturnPath)
  sleep(1000)
  let i = 0
  while (p && i < 25) {
    if (!isInPicture(0.8, donateReturn, findQuckBtn)) break
    myClick(p.x + 10, p.y)
    p = colorM(arr1, arr2)
    ++i
  }
  if (isInPicture(0.8, donateReturn, findQuckBtn) && i === 0 && j < 2) {
    toast('居然没设置工程车!!!')
    leftRow()
    helps(arr1, arr2, ++j)
  }
  donateReturn = null
  p = null
  return i
}

function doHelp (i, j) {
  let p = isInPicture(0.9, donate, findPictureRegion)
  if (p) {
    clickAndSleep(p.x, p.y, "点击捐兵按钮")
    const quckDonate = initPictureStart(quckBtnRegion, quckBtnPath)
    let pp = isInPicture(0.7, quckDonate, findQuckBtn)
    if (pp) {
      myClick(pp.x, pp.y)
      const ijjjjj = helps(points.donateRange[0], points.donateRange[1], 0)
      if (ijjjjj > 30) return false
    }
  } else {
    while (
      i === 0 &&
      colorM(points.chatUp[0], points.chatUp[1])
    ) {
      myClick(points.chatUp[0][0], points.chatUp[0][1])
      sleep(1000)
      console.log('上滚')
    }
    if (
      i === 1 &&
      colorM(points.chatDown[0], points.chatDown[1])
    ) {
      myClick(points.chatDown[0][0], points.chatDown[0][1])
      doHelp(1, j)
    } else if (i === 0) {
      doHelp(1, j)
    }
    if (j <= 4) doHelp(2, ++j)
    else {
      quckDonate = null
      p = null
      pp = null
      return false
    }
  }
}

function currentTime () {
  const current_time = new Date()
  const res = current_time.getHours() * 60 + current_time.getMinutes()
  current_time = null
  return res
}

function isBreak () {
  const curT = currentTime()
  for (let i = 0; i < breakTimeArr.length; i++) {
    if (curT >= breakTimeArr[i] && breakTimeArr[i] + 10 > curT) return true
  }
  return false
}

function save (x, y, w, h, p) {
  x = x
  y = y
  w = w
  h = h
  const target = images.clip(captureScreen(), x, y, w, h)
  images.save(
    target,
    p
  )
  target.recycle()
}

function inCoc () {
  if (colorM(points.challenge[0][0], points.challenge[0][1])) {
    return true
  } else {
    checkError()
    clickAndSleep(points.chatOn[0], points.chatOn[1], '打开聊天')
  }
  return false
}

function checkError () {
  const arr = points.errorClick
  for (let i = 0; i < arr.length; i++) {
    myClick(arr[i][0], arr[i][1])
  }
  arr = null
}

function initPictureStart (a, p) {
  if (!files.isFile(p)) {
    console.log('需要截图保存')
    if (!files.isDir("./cocPicture/")) files.create("./cocPicture/")
    save(a[0], a[1], a[2], a[3], p)
  }
  return images.read(p)
}

function errorAndRestart (err) {
  close_and_recycle(appName, true)
  if (!err) sleep(600001)
  else sleep(60000)
  launchApp(appName)
  main()
}

function openAddAndCheck () {
  toast('打开训练界面')
  myClick(attackPoints.armyRecruit[0], attackPoints.armyRecruit[1])
  sleep(2000)
  let i = 0
  while (!colorM(attackPoints.armyOut[0], attackPoints.armyOut[1]) && i < 3) {
    checkError()
    clickAndSleep(attackPoints.armyRecruit[0], attackPoints.armyRecruit[1], "打开训练")
    i++
  }
  if (i === 3) return false
  return true
}

function confirmClick () {
  myClick(attackPoints.finishTrain[1][0], attackPoints.finishTrain[1][1]) //确认
}

function quckClick (x, y, army) {
  toast('即将快速训练')
  clickAndSleep(x, y, "打开" + army)
  const arr = attackPoints.finishTrain
  if (colorM(arr[0][0], arr[0][1])) {
    clickAndSleep(arr[0][0][0], arr[0][0][1], "一键" + army)
    confirmClick()
  }
  arr = null
  return
}

function quckTrain () {
  quckClick(attackPoints.troopTab[0], attackPoints.troopTab[1], "军队")
  quckClick(attackPoints.spellsTab[0], attackPoints.spellsTab[1], "药水")
  quckClick(attackPoints.machinesTab[0], attackPoints.machinesTab[1], "车")
}

function quckAddArmy (arr1, arr2, i) {
  let p = colorM(arr1, arr2)
  while (p && i < 25) {
    myClick(arr1[0], arr1[1])
    p = colorM(arr1, arr2)
    ++i
  }
  return i
}

function addArmy () {
  clickAndSleep(attackPoints.quckRecruitTab[0], attackPoints.quckRecruitTab[1], "打开一键")
  const arr = attackPoints.quckRecruit
  myClick(arr[0][0], arr[0][1])
  for (let j = 0, i = 0; j < 4 && i < 20; j++) {
    i = quckAddArmy(arr[j], arr[4], i)
  }
  quckTrain()
  myClick(attackPoints.armyOut[0][0], attackPoints.armyOut[0][1])
  arr = null
}

function prepare () {
  toast('攻击准备')
  if (!openAddAndCheck()) return false
  const arr = attackPoints.quckHeroes
  for (let i = 0; i < arr.length; i++) {
    myClick(arr[i][0], arr[i][1])
    confirmClick()
  }
  addArmy()
  arr = null
  return true
}

function attack () {
  toast('可以攻击了！！！')
  if (!prepare()) return false
  const arr = attackPoints.attack
  clickAndSleep(arr[0][0], arr[0][1], "打开攻击")
  if (!colorM(arr[1][0], arr[1][1])) {
    checkError()
    toast('识别错误！！！')
    arr = null
    return false
  }
  clickAndSleep(arr[1][0][0], arr[1][0][1], "匹配")
  clickAndSleep(arr[1][2][0], arr[1][2][1], "匹配")
  arr = null
  const time = new Date().getTime()
  while (time + 100000 >= new Date()) {
    if (colorM(attackPoints.attacking[2][0], attackPoints.attacking[2][1])) break
  }
  toast('终于能打了')
  if (time + 100000 < new Date()) {
    sleep(195000 - 100000)
    myClick(attackPoints.attackBack[0][0], attackPoints.attackBack[0][1])
    time = null
    return
  }
  time = null
  attacking()
  return true
}

function clickCountTroops (p, count) {
  for (let i = 0; i < count; i++) {
    clickAndSleep(p[0], p[1])
  }
}

function clickCountSpells (p, count, i) {
  for (i; i < count; i++) {
    if (i % 2 === 0) clickAndSleep(p[0] - i * 100, p[1] + i)
    else clickAndSleep(p[0] - i * 100, p[1] + 160)
  }
}

function attacking () {
  toast('正在攻击！！！')
  const arr = attackPoints.troopsTab
  const time = new Date().getTime()
  for (let index = 0; index < arr.length; index++) {
    clickAndSleep(arr[index][0], arr[index][1])
    if (index === 0) clickCountTroops(attackPoints.attacking[0], 15)
    else if (index === 3) {
      clickCountSpells(attackPoints.attacking[1], 2, 0)
      sleep(2000)
    } else if (index === 6) clickCountSpells(attackPoints.attacking[1], 5, 2)
    else clickAndSleep(attackPoints.attacking[0][0], attackPoints.attacking[0][1])
  }
  const gap = new Date().getTime() - time
  sleep(195000 - gap)
  myClick(attackPoints.attackBack[0][0], attackPoints.attackBack[0][1])
  sleep(10000)
  arr = null
  time = null
  gap = null
}

function closeAd () {
  let j = 0
  while (!inCoc()) {
    sleep(5000)
    home()
    sleep(5000)
    launchApp(appName)
    sleep(60000)
    myClick(attackPoints.chatOn[0], attackPoints.chatOn[1])
    sleep(10000)
    j++
    if (j > 12) return false
  }
  return true
}

function attackMain () {
  clickAndSleep(attackPoints.chatOn[0], attackPoints.chatOn[1])
  if (!closeAd()) return false
  clickAndSleep(attackPoints.chatOff[0], attackPoints.chatOff[1], '关闭聊天')
  if (!attack()) errAttack++
  sleep(10000)
  if (errAttack > 4) {
    toast('战斗结束')
    return false
  }
  return true
}

function main () {
  let reStartFlag = false, err = false, isb = true
  clickAndSleep(points.chatOn[0], points.chatOn[1], '打开聊天')
  donate = initPictureStart(donateRegion, donatePath)
  while (true) {
    let i = 0
    while (!inCoc()) {
      i++
      if (i < 4) {
        console.log('没找到')
        sleep(30000)
      } else {
        console.log('要关闭了')
        close_and_recycle(appName, false)
      }
    }
    clickAndSleep(points.chatOff[0], points.chatOff[1], '关闭聊天')
    break
  }
  reStartFlag = true
  let time = currentTime()
  while (isb) {
    myClick(points.chatOn[0], points.chatOn[1])
    sleep(1000)
    while (true) {
      if (!doHelp(0, 0)) break
    }
    sleep(1000)
    clickAndSleep(points.errorClick[2][0], points.errorClick[2][1], '关闭捐赠界面')
    if (isAttack) {
      toast('attack!!!')
      closeAd()
      if (!attackMain()) isAttack = false
    } else if (currentTime() > 180 && currentTime() < 290) {
      toast('攻击时间到！！！')
      isAttack = true
      errAttack = 0
    }
    if (time + 20 < currentTime() && !inCoc()) {
      closeAd()
      sleep(1000)
      let i = 0
      while (!inCoc()) {
        err = true
        while (i < 8) {
          errorAndRestart(err)
          i++
          sleep(1000 * i * i)
        }
        isb = false
        break
      }
      time = currentTime()
    }
  }
  donate = null
  time = null
  errorAndRestart(err)
}
images.requestScreenCapture(true)
setScreenMetrics(phoneScreen[0], phoneScreen[1])
launchApp(appName)
sleep(60000)
main()