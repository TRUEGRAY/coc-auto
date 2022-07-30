const phoneScreen = [ 720, 1280 ], //竖屏模式下的分辨率,下面是横屏模式下的xy。
  points = {
    //此为位置点
    chatOn: [ 12, 320 ], //打开部落聊天
    chatOff: [ 530, 320 ], //关闭部落聊天
    chatUp: [ 470, 87 ],
    chatDown: [ 470, 607 ],
    challenge: [
      [ 290, 686 ],
      [ 1000, 435 ],
    ], //友谊战
    armyRecruit: [ 50, 526 ], //招募军队
    quckRecruitTab: [ 1100, 45 ], //一键训练栏
    troopTab: [ 384, 45 ],
    spellsTab: [ 600, 45 ],
    machinesTab: [ 816, 45 ],
    quckRecruit: [
      [ 1100, 165 ],
      [ 1100, 335 ],
      [ 1100, 485 ],
      [ 1100, 630 ],
    ], //快速训练上——>下
    finishTrain: [
      [ 892, 300 ],
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
      [ 998, 442 ],
    ], //发起
    attacking: [
      [ 1149, 269 ],
      [ 954, 243 ],
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
    errorClick: [ 1275, 300 ], //屏幕边缘点,用于返回
    isAttacking: [ 61, 550 ],
    attackBack: [ 615, 643 ],
    crossOut: [ 1208, 47 ],
  },
  help = images.read( "./coc_picture/help.jpg" ), //增援按钮截图
  quick_help = images.read( "./coc_picture/quick_help.jpg" ), //快速增援 quick donate
  isReturn = images.read( "./coc_picture/return.jpg" ),
  isAttack = images.read( "./coc_picture/isattack.jpg" ),
  normallyColorHelp1 = "#3D79B5", //
  normallyColorHelp2 = "#6D46BD",
  quckColorHelp = "#76AF15",
  clickColor = "#B6E45E",
  crossOutColor = "#ED1515",
  chartUpDown = "#8EC93B",
  attackCrossOutColor = "#FB5D63"
let notAttack = false,
  isFriend = true,
  isAdd = true
function isInPicture ( march, mode ) {
  let p = findImage( captureScreen(), mode, {
    threshold: march,
  } )
  if ( p ) return p
  else return false
}

function close_and_recycle ( packageName ) {
  help.recycle()
  quick_help.recycle()
  isReturn.recycle()
  isAttack.recycle()
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
  let is_sure = textMatches( /(.*强.*|.*停.*|.*结.*|.*行.*)/ ).findOne()
  if ( is_sure.enabled() ) {
    textMatches( /(.*强.*|.*停.*|.*结.*|.*行.*)/ )
      .findOne()
      .click() //click("强行停止",0)
    toast( "强行停止" )
    sleep( 2000 )
    textMatches( /(.*确.*|.*定.*)/ )
      .findOne()
      .click() //click("强行停止",1)
    toast( "强行停止" )
    log( app.getAppName( name ) + "应用已被关闭" )
    sleep( 10000 )
    back()
  } else {
    log( app.getAppName( name ) + "应用不能被正常关闭或不在后台运行" )
    back()
  }
  engines.myEngine().forceStop()
}
function clickAndSleep ( x, y, msg ) {
  click( x, y )
  sleep( 1000 )
  console.log( msg + new Date().toTimeString() )
}
function save ( x, y, w, h ) {
  const targe = images.clip( captureScreen(), x, y, w, h )
  images.save(
    targe,
    "./error/" + new Date().toTimeString() + "unrecognizable.png"
  )
  targe.recycle()
}
function colorM ( color, region ) {
  const findColorMethod1 = [
    [ 1, 1, color ],
    [ 2, 2, color ],
    [ 3, 2, color ],
    [ 4, 2, color ],
    [ 5, 2, color ],
    [ 6, 2, color ],
    [ 7, 2, color ],
    [ 8, 2, color ],
    [ 9, 2, color ],
    [ 1, 1, color ],
    [ 2, 2, color ],
    [ 2, 3, color ],
    [ 2, 4, color ],
    [ 2, 5, color ],
    [ 2, 6, color ],
    [ 2, 7, color ],
    [ 2, 8, color ],
    [ 2, 9, color ],
  ],
    findColorMethod2 = [ [ 1, 1, color ] ]
  let fin = findColorMethod1
  if ( region[ 2 ] * region[ 3 ] <= 30 ) fin = findColorMethod2
  let p = images.findMultiColors( captureScreen(), color, fin, {
    region: region,
    threshold: 50,
  } )
  if ( p ) return p
  else return false
}
function helps ( color, is_quck ) {
  let region = [ 530, 100, 660, 415 ]
  let p = colorM( color, region )
  if ( p ) {
    if ( is_quck && !isInPicture( 0.85, isReturn ) ) return
    if ( !is_quck && !isInPicture( 0.85, quick_help ) ) return
    click( p.x + 10, p.y + 10 )
    if ( !is_quck && Math.random() >= 0.6 ) isAdd = true
  } else {
    return
  }
  helps( color, is_quck )
}
function do_help ( i, j ) {
  let p = isInPicture( 0.9, help )
  if ( p ) {
    clickAndSleep( p.x + 100, p.y + 30, "点击捐兵按钮" )
    helps( normallyColorHelp1, false )
    helps( normallyColorHelp2, false )
    let pp = isInPicture( 0.9, quick_help )
    if ( pp ) {
      click( pp.x + 100, pp.y + 30 )
      helps( quckColorHelp, true )
    }
  } else {
    while (
      i === 0 &&
      colorM( chartUpDown, [ points.chatUp[ 0 ], points.chatUp[ 1 ], 5, 5 ] )
    ) {
      click( points.chatUp[ 0 ], points.chatUp[ 1 ] )
    }
    if (
      i !== 2 &&
      colorM( chartUpDown, [ points.chatDown[ 0 ], points.chatDown[ 1 ], 5, 5 ] )
    ) {
      click( points.chatDown[ 0 ], points.chatDown[ 1 ] )
      do_help( 1, j )
    } else if ( i === 0 ) {
      do_help( 2, j )
    }
    if ( j <= 2 ) do_help( 2, ++j )
  }
  return false
}

function attackFriend () {
  clickAndSleep( points.challenge[ 0 ][ 0 ], points.challenge[ 0 ][ 1 ] )
  click( points.challenge[ 1 ][ 0 ], points.challenge[ 1 ][ 1 ] )
}

function in_coc () {
  click( points.chatOn[ 0 ], points.chatOn[ 1 ] )
  if (
    colorM( clickColor, [ points.challenge[ 0 ][ 0 ], points.challenge[ 0 ][ 1 ], 10, 10 ] )
  ) {
    return false
  } else {
    if ( isFriend ) {
      if ( Math.random() >= 0.5 ) attackFriend()
    } else {
      if ( Math.random() >= 0.9 ) attackFriend()
    }
    return true
  }
}

function openAddAndCheck () {
  click( points.armyRecruit[ 0 ], points.armyRecruit[ 1 ] )
  sleep( 2000 )
  let i = 0
  while ( !colorM( crossOutColor, [ 1181, 45, 5, 5 ] ) && i < 3 ) {
    checkError()
    clickAndSleep( points.armyRecruit[ 0 ], points.armyRecruit[ 1 ], "打开训练" )
    i++
  }
  if ( i === 3 ) return false
  return true
}

function add () {
  clickAndSleep( points.quckRecruitTab[ 0 ], points.quckRecruitTab[ 1 ], "打开一键" )
  click( points.quckRecruit[ 0 ][ 0 ], points.quckRecruit[ 0 ][ 1 ] )
  let i = 0
  while (
    colorM( clickColor, [
      points.quckRecruit[ 1 ][ 0 ],
      points.quckRecruit[ 1 ][ 1 ],
      30,
      30,
    ] ) &&
    i < 20
  ) {
    click( points.quckRecruit[ 1 ][ 0 ], points.quckRecruit[ 1 ][ 1 ] )
    i++
  }
  while (
    colorM( clickColor, [
      points.quckRecruit[ 2 ][ 0 ],
      points.quckRecruit[ 2 ][ 1 ],
      30,
      30,
    ] ) &&
    i < 20
  ) {
    click( points.quckRecruit[ 2 ][ 0 ], points.quckRecruit[ 2 ][ 1 ] )
    i++
  }
  while (
    colorM( clickColor, [
      points.quckRecruit[ 3 ][ 0 ],
      points.quckRecruit[ 3 ][ 1 ],
      30,
      30,
    ] ) &&
    i < 20
  ) {
    click( points.quckRecruit[ 3 ][ 0 ], points.quckRecruit[ 3 ][ 1 ] )
    i++
  }
  quckTrain()
  click( points.crossOut[ 0 ], points.crossOut[ 1 ] )
}
function confirmClick () {
  click( points.finishTrain[ 1 ][ 0 ], points.finishTrain[ 1 ][ 1 ] ) //确认
}

function quckC ( x, y, obj ) {
  clickAndSleep( x, y, "打开" + obj )
  if (
    colorM( clickColor, [
      points.finishTrain[ 0 ][ 0 ],
      points.finishTrain[ 0 ][ 1 ],
      5,
      5,
    ] )
  ) {
    clickAndSleep(
      points.finishTrain[ 0 ][ 0 ],
      points.finishTrain[ 0 ][ 1 ],
      "一键" + obj
    )
    confirmClick()
  }
  return
}

function quckTrain () {
  quckC( points.troopTab[ 0 ], points.troopTab[ 1 ], "军队" )
  quckC( points.spellsTab[ 0 ], points.spellsTab[ 1 ], "药水" )
  quckC( points.machinesTab[ 0 ], points.machinesTab[ 1 ], "车" )
}

function prepare () {
  if ( !openAddAndCheck() ) return false
  const arr = points.quckHeroes
  for ( let i = 0; i < arr.length; i++ ) {
    click( arr[ i ][ 0 ], arr[ i ][ 1 ] )
    confirmClick()
  }
  add()
  return true
}
function attack () {
  if ( !prepare() ) return
  clickAndSleep( points.attack[ 0 ][ 0 ], points.attack[ 0 ][ 1 ], "打开攻击" )
  if ( !isInPicture( 0.8, isAttack ) ) {
    checkError()
    notAttack = true
    return
  }
  clickAndSleep( points.attack[ 1 ][ 0 ], points.attack[ 1 ][ 1 ], "匹配" )
  const time = new Date().getTime()
  while ( time + 100000 >= new Date() ) {
    if (
      colorM( attackCrossOutColor, [
        points.isAttacking[ 0 ],
        points.isAttacking[ 1 ],
        5,
        5,
      ] )
    )
      break
  }
  if ( time + 100000 < new Date() ) return
  attackin()
}

function clickCountTroops ( p, count ) {
  for ( let i = 0; i < count; i++ ) {
    click( p[ 0 ], p[ 1 ] )
  }
}
function clickCountSpells ( p, count, i ) {
  for ( i; i < count; i++ ) {
    if ( i % 2 === 0 ) click( p[ 0 ] - i * 100, p[ 1 ] + i )
    else click( p[ 0 ] - i * 100, p[ 1 ] + 160 )
  }
}

function attackin () {
  const arr = points.troopsTab
  const time = new Date().getTime()
  for ( let index = 0; index < arr.length; index++ ) {
    click( arr[ index ][ 0 ], arr[ index ][ 1 ] )
    if ( index === 0 ) clickCountTroops( points.attacking[ 0 ], 7 )
    else if ( index === 3 ) {
      clickCountSpells( points.attacking[ 1 ], 2, 0 )
      sleep( 2000 )
    } else if ( index === 6 ) clickCountSpells( points.attacking[ 1 ], 4, 2 )
    else click( points.attacking[ 0 ][ 0 ], points.attacking[ 0 ][ 1 ] )
  }
  const gap = new Date().getTime() - time
  sleep( 195000 - gap )
  click( points.attackBack[ 0 ], points.attackBack[ 1 ] )
  sleep( 10000 )
}

function checkError () {
  click( points.crossOut[ 0 ], points.crossOut[ 1 ] )
  click( points.chatOff[ 0 ], points.chatOff[ 1 ] )
  click( points.errorClick[ 0 ], points.errorClick[ 0 ] )
}

function isBreak ( t, ct ) {
  if ( ct >= t && t + 20 > ct ) return true
  return false
}
function main () {
  setScreenMetrics( phoneScreen[ 0 ], phoneScreen[ 1 ] )
  images.requestScreenCapture( true )
  this.click = function ( x, y ) {
    return shell( "input tap " + x + " " + y, true ).code === 0
  }
  let attempt_times = 0
  while ( true ) {
    launchApp( "部落冲突" )
    sleep( 30000 )
    if ( in_coc() ) {
      click( points.chatOff[ 0 ], points.chatOff[ 1 ] )
      break
    } else if ( attempt_times == 4 ) {
      close_and_recycle( "部落冲突" )
      engines.myEngine().forceStop()
    } else {
      checkError()
      attempt_times++
    }
  }
  const current_time = new Date()
  const current_time_in_minute =
    current_time.getHours() * 60 + current_time.getMinutes()
  let t = current_time_in_minute
  while ( current_time_in_minute + 230 >= t ) {
    const currentTime = new Date()
    const time = currentTime.getHours()
    t = currentTime.getHours() * 60 + currentTime.getMinutes()
    if (
      isBreak( 100, t ) ||
      isBreak( 340, t ) ||
      isBreak( 580, t ) ||
      isBreak( 820, t ) ||
      isBreak( 1060, t ) ||
      isBreak( 1300, t )
    )
      break
    if ( isAdd ) {
      openAddAndCheck()
      add()
      isAdd = false
    }
    while ( true ) {
      click( points.chatOn[ 0 ], points.chatOn[ 1 ] )
      if ( !do_help( 0, 0 ) ) break
    }
    click( points.chatOff[ 0 ], points.chatOff[ 1 ] )
    sleep( 10000 )
    if ( time >= 0 && time <= 12 && !notAttack ) {
      isFriend = false
      attack()
    }
    if ( !in_coc() ) {
      sleep( 2000 )
      if ( !in_coc() ) {
        break
      }
    }
  }
  close_and_recycle( "部落冲突" )
}
main()
