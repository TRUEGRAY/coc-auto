auto.waitFor()
const width = device.width, height = device.height, defaultScreen = [ 1080, 2280 ], androidRelease = parseInt(device.release)
const transform = [ width / defaultScreen[ 0 ], height / defaultScreen[ 1 ] ]
const minTransform = Math.min( width / defaultScreen[ 0 ], height / defaultScreen[ 1 ] ),
  appName = "部落冲突",
  breakTimeArr = [ 100, 340, 580, 820, 1060, 1300 ],
  phoneScreen = [ width, height ],
  findPictureRegion = [ 562 * transform[ 0 ], 180 * transform[ 1 ], 240 * transform[ 1 ], 800 * transform[ 0 ] ],
  donateRegion = [ 605 * transform[ 0 ], 866 * transform[ 1 ], 180 * transform[ 0 ], 70 * transform[ 1 ] ],  
  donatePath = "./cocPicture/donate.jpg",
  findQuckBtn = [ 1413 * transform[ 0 ], 147 * transform[ 1 ], 445 * transform[ 1 ], 890 * transform[ 0 ] ],
  quckBtnRegion = [ 1499 * transform[ 0 ], 790 * transform[ 1 ], 260 * transform[ 0 ], 80 * transform[ 1 ] ],
  quckBtnPath = "./cocPicture/quckBtn.jpg",
  donateReturnPath = "./cocPicture/donateReturn.jpg",
  points = {
    //此为位置点
    chatOn: [ 148, 483 ], //打开部落聊天
    chatOff: [ 841, 478 ], //关闭部落聊天
    chatUp: [ [ 769, 135, 4, 4 ], [ "#89C513", 1, 30 ] ],
    chatDown: [ [ 769, 938, 4, 4 ], [ "#5DA515", 1, 30 ] ],
    challenge: [
      [ [ 500, 1010, 6, 6 ], [ "#D7F37F", 6, 40 ] ],
      [ 1646, 634 ],
    ], //友谊战
    donateRange: [ [ 870, 40, 977, 732 ], [ "#75AF15", 2, 50 ] ],
    isDonate: [ [ 926, 777, 20, 20 ], [ "#FFFFFF", 20, 35 ] ],
    //quckDonateBtn: [ [ 1657, 793, 11, 11 ], [ "#DDF685", 11, 35 ] ],
    errorClick: [ [ 2158, 80 ], [ 1976, 60 ], [ 2227, 306 ] ],
  }                                                                                                                                                                    

let isAttack = true,
  donate
function myClick ( x, y ) {
  x = Math.floor( transform[ 0 ] * x )
  y = Math.floor( transform[ 1 ] * y )
  if ( androidRelease > 7 ) click( x, y )
  else RootAutomator.press( x, y, 500 )
    //shell( "input tap " + x + " " + y, true ).code === 0
}

function myStop () {
  console.log( "---------此脚本结束运行----------" )
  engines.myEngine().forceStop()
}
function close_and_recycle ( packageName ) {
  points = null
  let name = getPackageName( packageName )
  if ( !name ) {
    if ( getAppName( packageName ) ) {
      name = packageName
    } else {
      return false
    }
  }
  app.openAppSetting( name )
  console.log( name )
  sleep( 10000 )
  text( app.getAppName( name ) ).waitFor()
  const theEnd = textMatches( /(.*强.*|.*停.*|.*结.*|.*行.*)/ ).findOne()
  if ( theEnd.enabled() ) {
    theEnd.click()
    sleep( 10000 )
    const isConfirm = textMatches( /(.*确.*|.*定.*)/ ).findOne()
    if ( isConfirm ) isConfirm.click()
    toast( "强行停止" )
    log( app.getAppName( name ) + "应用已被关闭" )
    myStop()
  } else {
    log( app.getAppName( name ) + "应用不能被正常关闭或不在后台运行" )
    myStop()
  }
}

function clickAndSleep ( x, y, msg ) {
  myClick( x, y )
  sleep( 1000 )
  console.log( msg + new Date().toTimeString() )
}

function isInPicture ( march, mode, r ) {
  const region = [ Math.floor( r[ 0 ] ), Math.floor( r[ 1 ] ), Math.floor( r[ 2 ] ), Math.floor( r[ 3 ] )]
  let p = findImage( captureScreen(), mode, {
    threshold: march,
    region: region
  } )
  if ( p ) return p
  else return false
}
function colorM ( arr1, arr2 ) {
  console.log( arr1, arr2 )
  point = [ Math.floor( arr1[ 0 ] * transform[ 0 ] ), Math.floor( arr1[ 1 ] * transform[ 1 ] ), Math.floor( arr1[ 2 ] * transform[ 0 ] ), Math.floor( arr1[ 3 ] * transform[ 1 ] ) ]
  color = arr2[ 0 ]
  r = Math.floor( arr2[ 1 ] * minTransform )
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
  if ( p ) return p
  else return false
}


function helps ( arr1, arr2 ) {
  let p = colorM( arr1, arr2 )
  const donateReturn = initPictureStart( quckBtnRegion, donateReturnPath )
  sleep( 1000 )
  let i = 0
  while ( p && i < 25 ) {
    if ( !isInPicture( 0.9, donateReturn, findQuckBtn ) ) break
    console.log( p.x, p.y, '这是匹配到的可以捐兵的按钮' )
    myClick( p.x, p.y )
    p = colorM( arr1, arr2 )
    ++i
  }
  donateReturn = null
  return i
}

function doHelp ( i, j ) {
  let p = isInPicture( 0.9, donate, findPictureRegion )
  if ( p ) {
    clickAndSleep( p.x, p.y, "点击捐兵按钮" )
    console.log( p.x, p.y, '这是匹配到的捐兵按钮' )
    const quckDonate = initPictureStart( quckBtnRegion, quckBtnPath )
    sleep( 1000 )
    let pp = isInPicture( 0.9, quckDonate, findQuckBtn )
    if ( pp ) {
      myClick( pp.x, pp.y )
      sleep( 1000 )
      helps( points.donateRange[ 0 ], points.donateRange[ 1 ] )
    }
  } else {
    while (
      i === 0 &&
      colorM( points.chatUp[ 0 ], points.chatUp[ 1 ] )
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
  }
  quckDonate = null
  p = null
  return false
}

function currentTime () {
  const current_time = new Date()
  const res = current_time.getHours() * 60 + current_time.getMinutes()
  return res
}

function isBreak () {
  const curT = currentTime()
  for ( let i = 0; i < breakTimeArr.length; i++ ) {
    if ( curT >= breakTimeArr[ i ] && breakTimeArr[ i ] + 20 > curT ) return true
  }
  return false
}

function save ( x, y, w, h, p ) {
  x = Math.floor( x )
  y = Math.floor( y )
  w = Math.floor( w )
  h = Math.floor( h )
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
  }
  return false
}

function checkError () {
  const arr = points.errorClick
  for ( let i = 0; i < arr.length; i++ ) {
    myClick( arr[ i ][ 0 ], arr[ i ][ 1 ] )
  }
}

function initPictureStart ( a, p ) {
  if ( !files.isFile( p ) ) {
    console.log( '需要截图保存' )
    if ( !files.isDir( "./cocPicture/" ) ) files.create( "./cocPicture/" )
    save( a[ 0 ], a[ 1 ], a[ 2 ], a[ 3 ], p )
  }
  return images.read( p )
}

function main () {
  clickAndSleep( points.chatOn[ 0 ], points.chatOn[ 1 ], '打开聊天' )
  donate = initPictureStart( donateRegion, donatePath )
  while ( true ) {
    let i = 0
    while ( !inCoc() ) {
      i++
      if ( i < 4 ) {
        console.log( '没找到' )
        checkError()
      } else {
        console.log( '要关闭了' )
        close_and_recycle( appName )
      }
      sleep( 10000 )
    }
    clickAndSleep( points.chatOff[ 0 ], points.chatOff[ 1 ], '关闭聊天' )
    break
  }
  const time = currentTime()
  while ( time + 230 > currentTime() ) {// && isBreak()
    myClick( points.chatOn[ 0 ], points.chatOn[ 1 ] )
    sleep( 1000 )
    while ( true ) {
      if ( !doHelp( 0, 0 ) ) break
    }
    sleep( 1000 )
    clickAndSleep( points.errorClick[ 2 ][ 0 ], points.errorClick[ 2 ][ 1 ], '关闭捐赠界面' )
    myClick( points.chatOff[ 0 ], points.chatOff[ 1 ] )
  }
  console.log( "结束" )
  donate = null
  close_and_recycle( appName )
}
images.requestScreenCapture( true )
setScreenMetrics( phoneScreen[ 0 ], phoneScreen[ 1 ] )
launchApp( appName )
sleep( 1000 )
main()