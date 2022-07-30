const points = {
  armyRecruit: [ 134, 778 ], //招募军队
  armyOut: [ 2005, 65 ],
  isArmy: [ [ 1911, 66, 10, 10 ][ "#5E5451", 10, 10 ] ],
  quckRecruitTab: [ 1744, 65 ], //一键训练栏
  troopTab: [ 756, 66 ],
  spellsTab: [ 1076, 61 ],
  machinesTab: [ 1415, 60 ],
  quckRecruit: [
    [ 1821, 278, 5, 5 ],
    [ 1821, 509, 5, 5 ],
    [ 1821, 735, 5, 5 ],
    [ 1821, 964, 5, 5 ],
    [ "#86D436", 5 ],
  ], //快速训练上——>下
  finishTrain: [
    [ [ 1521, 496, 10, 10 ][ "#78C12E", 10, 12 ] ],
    [ 1198, 679 ],
  ], //1发起2确认
  quckHeroes: [
    [ 1499, 582 ],
    [ 1653, 575 ],
    [ 1794, 573 ],
    [ 1938, 573 ],
  ], //一键恢复英雄
  attack: [
    [ 190, 932 ],
    [ [ 1791, 737, 14, 14 ], [ "#D45D18", 14, 30 ] ],
  ], //发起
  attacking: [
    [ 2044, 364 ],//军队坐标
    [ 1801, 310 ],//药水坐标
    [ [ 156, 785, 16, 16 ], [ "#FC5D64", 16, 30 ] ]
  ], //军队和药水初始放置地点
  troopsTab: [
    [ 464, 953 ],
    [ 1092, 953 ],
    [ 927, 953 ],
    [ 1380, 953 ],
    [ 790, 953 ],
    [ 1213, 953 ],
    [ 1380, 953 ],
    [ 633, 953 ],
  ],
  attackBack: [ [ 1137, 1003, 11, 11 ], [ "#6DBB1F", 11, 35 ] ],
},
  attackRegion = [ 120, 480 ]
  
function openAddAndCheck () {
  myClick( points.armyRecruit[ 0 ], points.armyRecruit[ 1 ] )
  sleep( 2000 )
  let i = 0
  while ( !colorM( points.isArmy[ 0 ], points.isArmy[ 1 ] ) && i < 3 ) {
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
    clickAndSleep( arr[ 1 ][ 0 ], arr[ 1 ][ 1 ], "一键" + army )
    confirmClick()
  }
  return
}

function quckTrain () {
  quckClick( points.troopTab[ 0 ], points.troopTab[ 1 ], "军队" )
  quckClick( points.spellsTab[ 0 ], points.spellsTab[ 1 ], "药水" )
  quckClick( points.machinesTab[ 0 ], points.machinesTab[ 1 ], "车" )
}

function quckAddArmy ( arr1, arr2, i ) {
  let p = colorM( arr1, arr2 )
  while ( p && i < 25) {
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
  myClick( points.armyOut[ 0 ], points.armyOut[ 1 ] )
}

function prepare () {
  if ( !openAddAndCheck() ) return false
  const arr = points.quckHeroes
  for ( let i = 0; i < arr.length; i++ ) {
    myClick( arr[ i ][ 0 ], arr[ i ][ 1 ] )
    confirmClick()
  }
  addArmy()
  return true
}

function attack () {
  if ( !prepare() ) return
  const arr = points.attack
  clickAndSleep( arr[ 0 ][ 0 ], arr[ 0 ][ 1 ], "打开攻击" )
  if ( !colorM( arr[ 1 ][ 0 ], arr[ 1 ][ 1 ] ) ) {
    checkError()
    notAttack = true
    return
  }
  clickAndSleep( arr[ 1 ][ 0 ][ 0 ], arr[ 1 ][ 0 ][ 1 ], "匹配" )
  const time = new Date().getTime()
  while ( time + 100000 >= new Date() ) {
    if ( colorM( points.attacking[ 2 ][ 0 ], points.attacking[ 2 ][ 1 ] ) ) break
  }
  if ( time + 100000 < new Date() ) return
  attacking()
}

function clickCountTroops ( p, count ) {
  for ( let i = 0; i < count; i++ ) {
    myClick( p[ 0 ], p[ 1 ] )
  }
}

function clickCountSpells ( p, count, i ) {
  for ( i; i < count; i++ ) {
    if ( i % 2 === 0 ) myClick( p[ 0 ] - i * 100, p[ 1 ] + i )
    else myClick( p[ 0 ] - i * 100, p[ 1 ] + 160 )
  }
}

function attacking () {
  const arr = points.troopsTab
  const time = new Date().getTime()
  for ( let index = 0; index < arr.length; index++ ) {
    myClick( arr[ index ][ 0 ], arr[ index ][ 1 ] )
    if ( index === 0 ) clickCountTroops( points.attacking[ 0 ], 7 )
    else if ( index === 3 ) {
      clickCountSpells( points.attacking[ 1 ], 2, 0 )
      sleep( 2000 )
    } else if ( index === 6 ) clickCountSpells( points.attacking[ 1 ], 4, 2 )
    else myClick( points.attacking[ 0 ][ 0 ], points.attacking[ 0 ][ 1 ] )
  }
  const gap = new Date().getTime() - time
  sleep( 195000 - gap )
  myClick( points.attackBack[ 0 ][ 0 ], points.attackBack[ 0 ][ 1 ] )
  sleep( 10000 )
}