/**
 * Created by USER on 10.07.2015.
 */
module.exports = {
    width: 0,
    height: 0,
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
    forestLineScale: 0.8571,
    imageSmoothingEnabled: true,
    fastBonusSpeed: 2,
    slowBonusSpeed: 0.6,
    increaseBonusSize: 1.5,
    decreaseBonusSize: 0.65,
    playerSpeedX: 1,
    bonusTime: 5,
    timeoutToPortConnection: 5000,
    scoreRate: 0.1,
    levelFromTxt: true,
    cellWidth: 100,
    cellHeight: 100,
    lineCountInLevel: 6,
    debugSprite: true,
    bonusWaveSpeed: 5,
    bonusWaveSize: 0.5,
    distanceToAngryCloudScale: 0.25,
    distanceToAngryCloud: 0,
    //formula of rate in 16:9 : width/height = rate * 9 /16
    playerSizeScale: [0.069, 0.2],
    playerSize: [],
    birdSizeScale: [0.0917, 0.13],
    birdSize: [],
    cloudSizeScale: [0.1178, 0.1429],
    cloudSize: [],
    bonusSizeScale: [0.1010, 0.1429],
    bonusSize: []
};