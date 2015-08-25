/**
 * Created by USER on 10.07.2015.
 */
module.exports = {
    width: 1024,
    height: 600,
    inputType: "keyboard", //"keyboard", "serialport"
    backgroundSpeed: 150,
    bottomEnemiesSpeed: 220,
    topEnemiesSpeed: 270,
    gravity: 250,
    maxSpeed: 200,
    breatheChanel: "turbine", //"temperature", "turbine"
    breatheSpeed: 350,
    breatheFactor: 10, //50 for turbine, 10 for temperature
    lowerLimitOfBreathe: 30,//40 for turbine, 364 for temperature
    forestLine: 500,
    forestLineScale: 0.8333,
    imageSmoothingEnabled: true,
    fastBonusSpeed: 2,
    slowBonusSpeed: 0.6,
    increaseBonusSize: 1.5,
    decreaseBonusSize: 0.5,
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
    distanceToAngryCloud: 300,
    playerWidth: 0.1113,
    playerHeight: 0.25,
    birdWidth: 0.0977,
    birdHeight: 0.01333,
    cloudWidth: 0.1426,
    cloudHeight: 0.1667,
    bonusWidth: 0.124,
    bonusHeight: 0.17
};