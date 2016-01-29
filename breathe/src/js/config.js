/**
 * Created by USER on 10.07.2015.
 */
module.exports = {
    //screen
    width: 1024,
    height: 576,
    imageSmoothingEnabled: true,

    //input
    inputType: "keyboard", //"keyboard", "serialport", "bot"
    breatheChanel: "turbine", //"temperature", "turbine"
    breatheSpeed: 350,
    breatheFactor: 10, //50 for turbine, 10 for temperature
    lowerLimitOfBreathe: 30,//40 for turbine, 364 for temperature
    timeoutToPortConnection: 5000,

    //game
    gravity: 250,
    maxSpeed: 200,
    backgroundSpeed: 100,
    scoreRate: 0.1,
    gameSpeed: 1,
    currentLevel: "town",
    currentMap: "level1", //hard level1
    isHardMode: false,
    isBonusActive: false,
    scoreForBonus: 50,
    timeForGame: 3600,

    //formula of rate in 16:9 : width/height = rate * 9 /16
    //sizes
    forestLine: 0,
    forestLineScale: 0.8671,
    cellSize: [],
    cellSizeScale: [0.1, 0.1429],
    birdSizeScale: [0.0917, 0.13],
    birdSize: [],
    cloudSizeScale: [0.1178, 0.1429],
    cloudSize: [],
    bonusSizeScale: [0.1010, 0.1429],
    bonusSize: [],
    forestHeightScale: 0.1509,
    cloud1Scale: [0.9576, 0.3037],
    cloud2Scale: [0.7237, 0.1806],
    forestTopScale: 0.8488,
    cloudTopScale: 0.05,

    //enemies
    birdSpeed: 220,
    cloudSpeed: 170,
    distanceToAngryCloudScale: 0.25,
    distanceToAngryCloud: 0,

    //bonuses
    fastBonusSpeed: 2,
    slowBonusSpeed: 0.6,
    increaseBonusSize: 1.5,
    decreaseBonusSize: 0.65,
    bonusTime: 6,
    bonusWaveSpeed: 5,
    bonusWaveSize: 0.5,

    //player
    playerSizeScale: [0.069, 0.21],
    playerSize: [],
    playerSpeedX: 1,

    //level
    levelFromTxt: true,
    lineCountInLevel: 7,

    //debug
    debugSprite: false,
    debugCollision: false,
    debugPath: false,
    debugCollisionsOff: false,

    //statistics
    serverUrl: "http://localhost:3000", //https://breatheserver.herokuapp.com http://localhost:3000
    trackingInterval: 200,
    maxTimeToServerConnection: 500,

    //bot
    botDistanceToEnemy: 0,
    botDistanceToEnemyScale: 0.2,
    botDistanceToForest: 0,
    botDistanceToForestScale: 0.4
};