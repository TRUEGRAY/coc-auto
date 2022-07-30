auto.waitFor()
const width = device.width, height = device.height, androidRelease = parseInt( device.release )
appName = "部落冲突",
  breakTimeArr = [ 100, 340, 580, 1060, 1300 ],//820
  phoneScreen = [ width, height ],
  points = {
    //此为位置点
    chatOn: [ 14, 319 ], //打开部落聊天
    chatOff: [ 530, 319 ], //关闭部落聊天
    chatUp: [ [ 470, 87, 4, 4 ], [ "#89C513", 2, 80 ] ],
    chatDown: [ [ 470, 607, 4, 4 ], [ "#5DA515", 2, 80 ] ],
    challenge: [
      [ [ 310, 677, 6, 6 ], [ "#D7F37F", 4, 80 ] ],
      [ 993, 431 ],
    ], //友谊战
    errorClick: [ [ 1235, 49 ], [ 530, 319 ], [ 1270, 200 ] ],
    //军队
  theDonate: [[],[]],
    armyRecruit: [ 50, 526 ], //招募军队
    armyOut: [ [ 1181, 45, 5, 5 ], [ "#ED1515", 2, 40 ] ],
    quckRecruitTab: [ 1100, 45 ], //一键训练栏
    troopTab: [ 384, 45 ],
    spellsTab: [ 600, 45 ],
    machinesTab: [ 816, 45 ],
    quckRecruit: [
      [ 1100, 150, 5, 5 ],
      [ 1100, 322, 5, 5 ],
      [ 1100, 473, 5, 5 ],
      [ 1100, 623, 5, 5 ],
      [ "#B6E45E", 3, 60 ],
    ], //快速训练上——>下
    finishTrain: [
      [ [ 892, 300, 4, 4 ], [ "#B6E45E", 4, 42 ] ],
      [ 634, 468 ],
    ], //1发起2确认
    quckHeroes: [
      [ 876, 401 ],
      [ 970, 401 ],
      [ 1066, 401 ],
      [ 1161, 401 ],
    ], //一键恢复英雄
    attack: [
      [ 76, 625 ],
      [ [ 911, 487, 6, 6 ], [ "#CC5B17", 3, 50 ] ],
    ], //发起
    attacking: [
      [ 1149, 269 ],//军队坐标
      [ 954, 243 ],//药水坐标
      [ [ 61, 550, 5, 5 ], [ "#FB5D63", 3, 30 ] ]
    ], //军队和药水初始放置地点
    troopsTab: [
      [ 195, 630 ],
      [ 600, 630 ],
      [ 500, 630 ],
      [ 800, 630 ],
      [ 400, 630 ],
      [ 700, 630 ],
      [ 800, 630 ],
      [ 297, 630 ],
    ],
    attackBack: [ [ 615, 643, 3, 3 ], [ "#6DBB1F", 3, 35 ] ],
  }

let isAttack = true, errAttack = 0

function myClick ( x, y ) {
  x = x
  y = y
  if ( androidRelease > 7 ) click( x, y )
  else {
    const ra = new RootAutomator()
    ra.tap( 720 - y, x )
    ra.exit()
  }
}

function myStop () {
  points = null
  console.log( "---------此脚本结束运行----------" )
  engines.myEngine().forceStop()
}

function close_and_recycle ( packageName, isError ) {
  let name = getPackageName( packageName )
  if ( !name ) {
    if ( getAppName( packageName ) ) {
      name = packageName
    } else {
      return false
    }
  }
  app.openAppSetting( name )
  sleep( 5000 )
  text( app.getAppName( name ) ).waitFor()
  const theEnd = textMatches( /(.*强.*|.*停.*|.*结.*|.*行.*)/ ).findOne()
  if ( theEnd.enabled() ) {
    theEnd.click()
    sleep( 5000 )
    const isConfirm = textMatches( /(.*确.*|.*定.*)/ ).findOne()
    if ( isConfirm ) isConfirm.click()
    toast( "强行停止" )
    log( app.getAppName( name ) + "应用已被关闭" )
    name = null
    if ( !isError ) myStop()
  } else {
    log( app.getAppName( name ) + "应用不能被正常关闭或不在后台运行" )
    name = null
    if ( !isError ) myStop()
  }
}

function clickAndSleep ( x, y, msg ) {
  myClick( x, y )
  sleep( 1000 )
  console.log( msg + new Date().toTimeString() )
}

function colorM ( arr1, arr2 ) {
  point = [ arr1[ 0 ], arr1[ 1 ], arr1[ 2 ], arr1[ 3 ] ]
  color = arr2[ 0 ]
  r = arr2[ 1 ]
  m = arr2[ 2 ]
  const findColorMethod = []
  for ( let i = 1; i <= r; i++ ) {
    for ( let j = 1; j <= r; j++ ) {
      findColorMethod.push( new Array( i, j, color ) )
      if ( i !== j ) findColorMethod.push( new Array( j, i, color ) )
    }
  }
  let p = images.findMultiColors( captureScreen(), color, findColorMethod, {
    region: point,
    threshold: m,
  } )
  findColorMethod = null
  if ( p ) return p
  else return false
}

function currentTime () {
  const current_time = new Date()
  const res = current_time.getHours() * 60 + current_time.getMinutes()
  current_time = null
  return res
}

function isBreak () {
  const curT = currentTime()
  for ( let i = 0; i < breakTimeArr.length; i++ ) {
    if ( curT >= breakTimeArr[ i ] && breakTimeArr[ i ] + 10 > curT ) return true
  }
  return false
}

function inCoc () {
  if ( colorM( points.challenge[ 0 ][ 0 ], points.challenge[ 0 ][ 1 ] ) ) {
    return true
  } else {
    checkError()
    clickAndSleep( points.chatOn[ 0 ], points.chatOn[ 1 ], '打开聊天' )
    return false
  }
}

function checkError () {
  const arr = points.errorClick
  for ( let i = 0; i < arr.length; i++ ) {
    myClick( arr[ i ][ 0 ], arr[ i ][ 1 ] )
  }
  arr = null
}
function restart () {
  launchApp( appName )
  main()
}

function errorAndRestart ( err ) {
  close_and_recycle( appName, true )
  if ( !err ) sleep( 600001 )
  else sleep( 30000 )
  restart()
}


function openAddAndCheck () {
  myClick( points.armyRecruit[ 0 ], points.armyRecruit[ 1 ] )
  sleep( 2000 )
  let i = 0
  while ( !colorM( points.armyOut[ 0 ], points.armyOut[ 1 ] ) && i < 3 ) {
    checkError()
    clickAndSleep( points.armyRecruit[ 0 ], points.armyRecruit[ 1 ], "打开训练" )
    i++
  }
  if ( i === 3 ) return false
  return true
}

function confirmClick () {
  myClick( points.finishTrain[ 1 ][ 0 ], points.finishTrain[ 1 ][ 1 ] ) //确认
}

function quckClick ( x, y, army ) {
  clickAndSleep( x, y, "打开" + army )
  const arr = points.finishTrain
  if ( colorM( arr[ 0 ][ 0 ], arr[ 0 ][ 1 ] ) ) {
    clickAndSleep( arr[ 0 ][ 0 ][ 0 ], arr[ 0 ][ 0 ][ 1 ], "一键" + army )
    confirmClick()
  }
  arr = null
  return
}

function quckTrain () {
  quckClick( points.troopTab[ 0 ], points.troopTab[ 1 ], "军队" )
  quckClick( points.spellsTab[ 0 ], points.spellsTab[ 1 ], "药水" )
  quckClick( points.machinesTab[ 0 ], points.machinesTab[ 1 ], "车" )
}

function quckAddArmy ( arr1, arr2, i ) {
  let p = colorM( arr1, arr2 )
  while ( p && i < 25 ) {
    myClick( arr1[ 0 ], arr1[ 1 ] )
    p = colorM( arr1, arr2 )
    ++i
  }
  return i
}

function addArmy () {
  clickAndSleep( points.quckRecruitTab[ 0 ], points.quckRecruitTab[ 1 ], "打开一键" )
  const arr = points.quckRecruit
  myClick( arr[ 0 ][ 0 ], arr[ 0 ][ 1 ] )
  for ( let j = 0, i = 0; j < 4 && i < 20; j++ ) {
    i = quckAddArmy( arr[ j ], arr[ 4 ], i )
  }
  quckTrain()
  myClick( points.armyOut[ 0 ][ 0 ], points.armyOut[ 0 ][ 1 ] )
  arr = null
}

function prepare () {
  if ( !openAddAndCheck() ) return false
  const arr = points.quckHeroes
  for ( let i = 0; i < arr.length; i++ ) {
    myClick( arr[ i ][ 0 ], arr[ i ][ 1 ] )
    confirmClick()
  }
  addArmy()
  arr = null
  return true
}

function attack () {
  if ( !prepare() ) return false
  const arr = points.attack
  clickAndSleep( arr[ 0 ][ 0 ], arr[ 0 ][ 1 ], "打开攻击" )
  if ( !colorM( arr[ 1 ][ 0 ], arr[ 1 ][ 1 ] ) ) {
    checkError()
    arr = null
    return false
  }
  clickAndSleep( arr[ 1 ][ 0 ][ 0 ], arr[ 1 ][ 0 ][ 1 ], "匹配" )
  arr = null
  const time = new Date().getTime()
  while ( time + 100000 >= new Date() ) {
    if ( colorM( points.attacking[ 2 ][ 0 ], points.attacking[ 2 ][ 1 ] ) ) break
  }
  if ( time + 100000 < new Date() ) return
  time = null
  attacking()
  return true
}

function clickCountTroops ( p, count ) {
  for ( let i = 0; i < count; i++ ) {
    clickAndSleep( p[ 0 ], p[ 1 ] )
  }
}

function clickCountSpells ( p, count, i ) {
  for ( i; i < count; i++ ) {
    if ( i % 2 === 0 ) clickAndSleep( p[ 0 ] - i * 100, p[ 1 ] + i )
    else clickAndSleep( p[ 0 ] - i * 100, p[ 1 ] + 160 )
  }
}

function attacking () {
  const arr = points.troopsTab
  const time = new Date().getTime()
  for ( let index = 0; index < arr.length; index++ ) {
    clickAndSleep( arr[ index ][ 0 ], arr[ index ][ 1 ] )
    if ( index === 0 ) clickCountTroops( points.attacking[ 0 ], 7 )
    else if ( index === 3 ) {
      clickCountSpells( points.attacking[ 1 ], 2, 0 )
      sleep( 2000 )
    } else if ( index === 6 ) clickCountSpells( points.attacking[ 1 ], 5, 2 )
    else clickAndSleep( points.attacking[ 0 ][ 0 ], points.attacking[ 0 ][ 1 ] )
  }
  const gap = new Date().getTime() - time
  sleep( 195000 - gap )
  myClick( points.attackBack[ 0 ][ 0 ], points.attackBack[ 0 ][ 1 ] )
  sleep( 10000 )
  arr = null
  time = null
  gap = null
}

function main () {
  let err = false
  clickAndSleep( points.chatOn[ 0 ], points.chatOn[ 1 ], '打开聊天' )
  while ( true ) {
    let i = 0
    while ( !inCoc() ) {
      i++
      if ( i < 4 ) {
        console.log( '没找到' )
        sleep( 30000 )
      } else {
        console.log( '要关闭了' )
        close_and_recycle( appName, false )
      }
    }
    clickAndSleep( points.chatOff[ 0 ], points.chatOff[ 1 ], '关闭聊天' )
    break
  }
  const time = currentTime()
  while ( time + 230 > currentTime() && !isBreak() ) {
    sleep( 10000 )
    if ( !attack() ) {
      errAttack++
      break
    }
    sleep(10000)
    myClick( points.chatOn[ 0 ], points.chatOn[ 1 ] )
    sleep( 5000 )
    let j = 0
    while ( !inCoc() ) {
      sleep( 5000 )
      home()
      sleep( 5000 )
      launchApp( appName )
      sleep( 30000 )
      j++
      if ( j < 4 ) {
        err = true
        break
      }
    }
    myClick( points.chatOff[ 0 ], points.chatOff[ 1 ] )
  }
  time = null
  if ( errAttack === 10 ) {
    close_and_recycle( appName, false )
    while ( true ) {
      if ( currentTime() === 820() ) break
    }
    restart()
  } else {
    errorAndRestart( err )
  }
}
images.requestScreenCapture( true )
setScreenMetrics( phoneScreen[ 0 ], phoneScreen[ 1 ] )
launchApp( appName )
sleep( 30000 )
main()