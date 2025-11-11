
// http://example.org#cdl_models.Controls.Controller
const timetable_61011cf1 = require("../../Buildings/Controls/OBC/CDL/Logical/Sources/TimeTable");
const single_zone_ratchet_base_e2711fb2 = require("./Subsequences/single_zone_ratchet_base");

module.exports = (
  {
		loaSheCooAct = true,
		loaSheHeaAct = true,
		occStaHourEnd = 4,
		occStaHourStart = 15,
		loadShedHourEnd = 5,
		loadShedHourStart = 0,
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
  // http://example.org#cdl_models.Controls.Controller.single_zone_ratchet_base
  const single_zone_ratchet_baseFn = single_zone_ratchet_base_e2711fb2({ loadShedHourEnd: loadShedHourEnd, loadShedHourStart: loadShedHourStart, loadShedTempAmount: loadShedTempAmount, loaSheCooAct: loaSheCooAct, loaSheHeaAct: loaSheHeaAct, reboundDuration: reboundDuration, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb, TZonCooSetNomOcc: TZonCooSetNomOcc, TZonCooSetNomUnocc: TZonCooSetNomUnocc, TZonHeaSetNomOcc: TZonHeaSetNomOcc, TZonHeaSetNomUnocc: TZonHeaSetNomUnocc });
  // http://example.org#cdl_models.Controls.Controller.loaShe
  const loaSheFn = timetable_61011cf1({ period: 86400, table: [[0,0],[loadShedHourStart,1],[loadShedHourEnd,0],[24,0]], timeScale: 3600 });
  // http://example.org#cdl_models.Controls.Controller.occSta
  const occStaFn = timetable_61011cf1({ period: 86400, table: [[0,1],[occStaHourEnd,0],[occStaHourStart,1],[24,1]], timeScale: 3600 });

  return (
    { TZon, TZonCooSetCur, TZonHeaSetCur }
  ) => {
    const single_zone_ratchet_base = single_zone_ratchet_baseFn({ TZon: TZon, TZonCooSetCur: TZonCooSetCur, TZonHeaSetCur: TZonHeaSetCur });
    const loaShe = loaSheFn({});
    const occSta = occStaFn({});

    return { TZonCooSetCom: single_zone_ratchet_base.TZonCooSetCom, TZonHeaSetCom: single_zone_ratchet_base.TZonHeaSetCom };
  }
}
