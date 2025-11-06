
// http://example.org#cdl_models.Controls.Controller
const booleantoreal_552dc85b = require("../../Buildings/Controls/OBC/CDL/Conversions/BooleanToReal");
const constant_655d39b4 = require("../../Buildings/Controls/OBC/CDL/Logical/Sources/Constant");
const timetable_61011cf1 = require("../../Buildings/Controls/OBC/CDL/Logical/Sources/TimeTable");
const switch_1e2c142e = require("../../Buildings/Controls/OBC/CDL/Logical/Switch");
const add_53459d33 = require("../../Buildings/Controls/OBC/CDL/Reals/Add");
const constant_d2aca5e8 = require("../../Buildings/Controls/OBC/CDL/Reals/Sources/Constant");
const subtract_040901c2 = require("../../Buildings/Controls/OBC/CDL/Reals/Subtract");
const single_zone_ratchet_cooling_96ede778 = require("./Subsequences/single_zone_ratchet_cooling");
const single_zone_ratchet_heating_8d9af371 = require("./Subsequences/single_zone_ratchet_heating");

module.exports = (
  {
		loaSheCooAct = true,
		loaSheHeaAct = true,
		occStaHourEnd = 20,
		occStaHourStart = 7,
		loadShedHourEnd = 21,
		loadShedHourStart = 16,
		loadShedDurationTypical = (loadShedHourEnd -loadShedHourStart)*3600,
		loadShedTempAmount = 5,
		TRat = 0.5556,
		samplePeriodRatchet = loadShedDurationTypical*0.3333*TRat/loadShedTempAmount,
		reboundDuration = 3600,
		TReb = 0.5556,
		samplePeriodRebound = reboundDuration*TReb/loadShedTempAmount,
		TRatThreshold = 1.1111,
		TZonCooSetNomOcc = 273.15 +25.5556,
		TZonCooSetNomUnocc = 273.15 +32.2222,
		TZonHeaSetNomOcc = 273.15 +22.2222,
		TZonHeaSetNomUnocc = 273.15 +15.5556,
    } = {}
) => {
  // http://example.org#cdl_models.Controls.Controller.con2
  const con2Fn = constant_655d39b4({ k: loaSheCooAct });
  // http://example.org#cdl_models.Controls.Controller.con
  const conFn = constant_655d39b4({ k: false });
  // http://example.org#cdl_models.Controls.Controller.logSwi3
  const logSwi3Fn = switch_1e2c142e({});
  // http://example.org#cdl_models.Controls.Controller.con5
  const con5Fn = constant_655d39b4({ k: true });
  // http://example.org#cdl_models.Controls.Controller.con3
  const con3Fn = constant_d2aca5e8({ k: loadShedTempAmount });
  // http://example.org#cdl_models.Controls.Controller.TZonCooSetNom
  const TZonCooSetNomFn = booleantoreal_552dc85b({ realFalse: TZonCooSetNomUnocc, realTrue: TZonCooSetNomOcc });
  // http://example.org#cdl_models.Controls.Controller.TZonCooSetMax
  const TZonCooSetMaxFn = add_53459d33({});
  // http://example.org#cdl_models.Controls.Controller.single_zone_ratchet_cooling
  const single_zone_ratchet_coolingFn = single_zone_ratchet_cooling_96ede778({ reboundDuration: reboundDuration, samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });
  // http://example.org#cdl_models.Controls.Controller.con1
  const con1Fn = constant_655d39b4({ k: loaSheHeaAct });
  // http://example.org#cdl_models.Controls.Controller.logSwi2
  const logSwi2Fn = switch_1e2c142e({});
  // http://example.org#cdl_models.Controls.Controller.con4
  const con4Fn = constant_655d39b4({ k: true });
  // http://example.org#cdl_models.Controls.Controller.TZonHeaSetNom
  const TZonHeaSetNomFn = booleantoreal_552dc85b({ realFalse: TZonHeaSetNomUnocc, realTrue: TZonHeaSetNomOcc });
  // http://example.org#cdl_models.Controls.Controller.TZonHeaSetMin
  const TZonHeaSetMinFn = subtract_040901c2({});
  // http://example.org#cdl_models.Controls.Controller.single_zone_ratchet_heating
  const single_zone_ratchet_heatingFn = single_zone_ratchet_heating_8d9af371({ reboundDuration: reboundDuration, samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });
  // http://example.org#cdl_models.Controls.Controller.loaShe
  const loaSheFn = timetable_61011cf1({ period: 86400, table: [[0,0],[loadShedHourStart,1],[loadShedHourEnd,0],[24,0]], timeScale: 3600 });
  // http://example.org#cdl_models.Controls.Controller.occSta
  const occStaFn = timetable_61011cf1({ period: 86400, table: [[0,0],[occStaHourStart,1],[occStaHourEnd,0],[24,0]], timeScale: 3600 });

  return (
    { TZon, TZonCooSetCur, TZonHeaSetCur }
  ) => {
    const con2 = con2Fn({});
    const con = conFn({});
    const logSwi3 = logSwi3Fn({ u2: con2.y, u3: con.y });
    const con5 = con5Fn({});
    const con3 = con3Fn({});
    const TZonCooSetNom = TZonCooSetNomFn({});
    const TZonCooSetMax = TZonCooSetMaxFn({ u1: con3.y, u2: TZonCooSetNom.y });
    const single_zone_ratchet_cooling = single_zone_ratchet_coolingFn({ loaShe: logSwi3.y, rebSig: con5.y, TZon: TZon, TZonCooSetCur: TZonCooSetCur, TZonCooSetMax: TZonCooSetMax.y, TZonCooSetNom: TZonCooSetNom.y });
    const con1 = con1Fn({});
    const logSwi2 = logSwi2Fn({ u2: con1.y, u3: con.y });
    const con4 = con4Fn({});
    const TZonHeaSetNom = TZonHeaSetNomFn({});
    const TZonHeaSetMin = TZonHeaSetMinFn({ u1: TZonHeaSetNom.y, u2: con3.y });
    const single_zone_ratchet_heating = single_zone_ratchet_heatingFn({ loaShe: logSwi2.y, rebSig: con4.y, TZon: TZon, TZonHeaSetCur: TZonHeaSetCur, TZonHeaSetMin: TZonHeaSetMin.y, TZonHeaSetNom: TZonHeaSetNom.y });
    const loaShe = loaSheFn({});
    const occSta = occStaFn({});

    return { TZonCooSetCom: single_zone_ratchet_cooling.TZonCooSetCom, TZonHeaSetCom: single_zone_ratchet_heating.TZonSetHeaCom };
  }
}
