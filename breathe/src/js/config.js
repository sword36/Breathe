/**
 * Created by USER on 10.07.2015.
 */
module.exports = {
    width: 1024,
    height: 576,
    inputType: "keyboard", //"keyboard", "serialport"
    backgroundSpeed: 100,
    cloudSpeed: 170,
    birdSpeed: 220,
    gravity: 250,
    maxSpeed: 200,
    breatheChanel: "turbine", //"temperature", "turbine"
    breatheSpeed: 350,
    breatheFactor: 10, //50 for turbine, 10 for temperature
    lowerLimitOfBreathe: 30,//40 for turbine, 364 for temperature
    forestLine: 0,
    forestLineScale: 0.8671,
    imageSmoothingEnabled: true,
    fastBonusSpeed: 2,
    slowBonusSpeed: 0.6,
    increaseBonusSize: 1.5,
    decreaseBonusSize: 0.65,
    playerSpeedX: 1,
    bonusTime: 6,
    timeoutToPortConnection: 5000,
    scoreRate: 0.1,
    levelFromTxt: true,
    cellSize: [],
    cellSizeScale: [0.1, 0.1429],
    lineCountInLevel: 7,
    debugSprite: true,
    debugCollision: true,
    debugPath: true,
    bonusWaveSpeed: 5,
    bonusWaveSize: 0.5,
    distanceToAngryCloudScale: 0.25,
    distanceToAngryCloud: 0,
    //formula of rate in 16:9 : width/height = rate * 9 /16
    playerSizeScale: [0.069, 0.21],
    playerSize: [],
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
    serverUrl: "http://localhost:3000",
    trackingInterval: 100
};