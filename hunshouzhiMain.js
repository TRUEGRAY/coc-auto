auto.waitFor()
const width = device.width, height = device.height, androidRelease = parseInt( device.release )
appName = "部落冲突",
  breakTimeArr = [ 100, 340, 580, 1060, 1300 ],//820
  phoneScreen = [ width, height ],
  findPictureRegion = [ 318, 67, 185, 593 ],//
  donateRegion = [ 355, 581, 120, 35 ],
  donatePath = "./cocPicture/donate.jpg",
  findQuckBtn = [ 940, 86, 250, 510 ],//
  quckBtnRegion = [ 965, 530, 200, 35 ],
  quckBtnPath = "./cocPicture/quckBtn.jpg",
  donateReturnPath = "./cocPicture/donateReturn.jpg",
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
    donateRange: [ [ 538, 30, 646, 482 ], [ "#75AF15", 4, 20 ] ],
    errorClick: [ [ 1235, 49 ], [ 530, 319 ], [ 1270, 200 ] ],
  }

let isAttack = true,
  donate

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

function isInPicture ( march, mode, r ) {
  const region = [ r[ 0 ], r[ 1 ], r[ 2 ], r[ 3 ] ]
  let p = findImage( captureScreen(), mode, {
    threshold: march,
    region: region
  } )
  region = null
  if ( p ) return p
  else return false
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


function helps ( arr1, arr2 ) {
  let p = colorM( arr1, arr2 )
  const donateReturn = initPictureStart( quckBtnRegion, donateReturnPath )
  sleep( 1000 )
  let i = 0
  while ( p && i < 25 && !isBreak() ) {
    if ( !isInPicture( 0.8, donateReturn, findQuckBtn ) ) break
    myClick( p.x + 10, p.y )
    p = colorM( arr1, arr2 )
    ++i
  }
  donateReturn = null
  p = null
  return i
}

function doHelp ( i, j ) {
  let p = isInPicture( 0.9, donate, findPictureRegion )
  if ( p ) {
    clickAndSleep( p.x, p.y, "点击捐兵按钮" )
    const quckDonate = initPictureStart( quckBtnRegion, quckBtnPath )
    let pp = isInPicture( 0.7, quckDonate, findQuckBtn )
    if ( pp ) {
      myClick( pp.x, pp.y )
      helps( points.donateRange[ 0 ], points.donateRange[ 1 ] )
    }
  } else {
    while (
      i === 0 &&
      colorM( points.chatUp[ 0 ], points.chatUp[ 1 ] ) && !isBreak()
    ) {
      myClick( points.chatUp[ 0 ][ 0 ], points.chatUp[ 0 ][ 1 ] )
      sleep( 1000 )
      console.log( '上滚' )
    }
    if (
      i === 1 &&
      colorM( points.chatDown[ 0 ], points.chatDown[ 1 ] )
    ) {
      myClick( points.chatDown[ 0 ][ 0 ], points.chatDown[ 0 ][ 1 ] )
      doHelp( 1, j )
    } else if ( i === 0 ) {
      doHelp( 1, j )
    }
    if ( j <= 4 ) doHelp( 2, ++j )
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
  for ( let i = 0; i < breakTimeArr.length; i++ ) {
    if ( curT >= breakTimeArr[ i ] && breakTimeArr[ i ] + 10 > curT ) return true
  }
  return false
}

function save ( x, y, w, h, p ) {
  x = x
  y = y
  w = w
  h = h
  const target = images.clip( captureScreen(), x, y, w, h )
  images.save(
    target,
    p
  )
  target.recycle()
}

function inCoc () {
  if ( colorM( points.challenge[ 0 ][ 0 ], points.challenge[ 0 ][ 1 ] ) ) {
    return true
  } else {
    checkError()
    clickAndSleep( points.chatOn[ 0 ], points.chatOn[ 1 ], '打开聊天' )
  }
  return false
}

function checkError () {
  home()
  sleep(1000)
  launchApp( appName )
  sleep(1000)
  const arr = points.errorClick
  for ( let i = 0; i < arr.length; i++ ) {
    myClick( arr[ i ][ 0 ], arr[ i ][ 1 ] )
  }
  arr = null
}

function initPictureStart ( a, p ) {
  if ( !files.isFile( p ) ) {
    console.log( '需要截图保存' )
    if ( !files.isDir( "./cocPicture/" ) ) files.create( "./cocPicture/" )
    save( a[ 0 ], a[ 1 ], a[ 2 ], a[ 3 ], p )
  }
  return images.read( p )
}

function errorAndRestart ( err ) {
  close_and_recycle( appName, true )
  if ( !err ) sleep( 600001 )
  else sleep( 30000 )
  launchApp( appName )
  main()
}

function main () {
  let reStartFlag = false, err = false
  clickAndSleep( points.chatOn[ 0 ], points.chatOn[ 1 ], '打开聊天' )
  donate = initPictureStart( donateRegion, donatePath )
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
  reStartFlag = true
  let time = currentTime()
  while ( !isBreak() ) {
    myClick( points.chatOn[ 0 ], points.chatOn[ 1 ] )
    sleep( 1000 )
    while ( !isBreak() ) {
      if ( !doHelp( 0, 0 ) ) break
    }
    sleep( 1000 )
    clickAndSleep( points.errorClick[ 2 ][ 0 ], points.errorClick[ 2 ][ 1 ], '关闭捐赠界面' )
    if ( time + 20 < currentTime() && !inCoc() ) {
      sleep( 1000 )
      if ( !inCoc() ) {
        err = true
        break
      }
      time = currentTime()
    }
  }
  donate = null
  time = null
  if ( reStartFlag ) errorAndRestart( err )
}
images.requestScreenCapture( true )
setScreenMetrics( phoneScreen[ 0 ], phoneScreen[ 1 ] )
launchApp( appName )
sleep( 30000 )
main()