
// http://example.org#cdl_models.Controls.Controller
const constant_655d39b4 = require("../../Buildings/Controls/OBC/CDL/Logical/Sources/Constant");
const timetable_61011cf1 = require("../../Buildings/Controls/OBC/CDL/Logical/Sources/TimeTable");
const switch_1e2c142e = require("../../Buildings/Controls/OBC/CDL/Logical/Switch");
const add_53459d33 = require("../../Buildings/Controls/OBC/CDL/Reals/Add");
const constant_d2aca5e8 = require("../../Buildings/Controls/OBC/CDL/Reals/Sources/Constant");
const subtract_040901c2 = require("../../Buildings/Controls/OBC/CDL/Reals/Subtract");
const switch_91d77162 = require("../../Buildings/Controls/OBC/CDL/Reals/Switch");
const booleanscalarreplicator_85f98ef6 = require("../../Buildings/Controls/OBC/CDL/Routing/BooleanScalarReplicator");
const realscalarreplicator_6941df46 = require("../../Buildings/Controls/OBC/CDL/Routing/RealScalarReplicator");
const single_zone_ratchet_cooling_96ede778 = require("./Subsequences/single_zone_ratchet_cooling");
const single_zone_ratchet_heating_8d9af371 = require("./Subsequences/single_zone_ratchet_heating");
const temdifselectionmax_44b4133c = require("./Subsequences/temDifSelectionMax");
const temdifselectionmin_44b4142a = require("./Subsequences/temDifSelectionMin");

module.exports = (
  {
		loadShedHourEnd = 21,
		loadShedHourStart = 16,
		loaSheCooAct = true,
		loaSheHeaAct = true,
		loadShedDurationTypical = 7200,
		loadShedTempAmount = 5,
		nZones = 4,
		TRat = 1,
		samplePeriodRatchet = loadShedDurationTypical*0.3333*TRat/loadShedTempAmount/nZones,
		reboundDuration = 3600,
		TReb = 1,
		samplePeriodRebound = reboundDuration*TReb/loadShedTempAmount/nZones,
		TRatThreshold = 1,
		TZonCooSetNomOcc = 273.15 +25,
		TZonCooSetNomUnocc = 273.15 +32,
		TZonHeaSetNomOcc = 273.15 +20,
		TZonHeaSetNomUnocc = 273.15 +12,
    } = {}
) => {
  // http://example.org#cdl_models.Controls.Controller.booScaRep1
  const booScaRep1Fn = booleanscalarreplicator_85f98ef6({ nout: nZones });
  // http://example.org#cdl_models.Controls.Controller.con2
  const con2Fn = constant_655d39b4({ k: loaSheCooAct });
  // http://example.org#cdl_models.Controls.Controller.con
  const conFn = constant_655d39b4({ k: false });
  // http://example.org#cdl_models.Controls.Controller.logSwi3
  const logSwi3Fn = switch_1e2c142e({});
  // http://example.org#cdl_models.Controls.Controller.con3
  const con3Fn = constant_d2aca5e8({ k: loadShedTempAmount });
  // http://example.org#cdl_models.Controls.Controller.con5
  const con5Fn = constant_d2aca5e8({ k: TZonCooSetNomOcc });
  // http://example.org#cdl_models.Controls.Controller.con7
  const con7Fn = constant_d2aca5e8({ k: TZonCooSetNomUnocc });
  // http://example.org#cdl_models.Controls.Controller.TZonCooSetNom
  const TZonCooSetNomFn = switch_91d77162({});
  // http://example.org#cdl_models.Controls.Controller.TZonCooSetMax
  const TZonCooSetMaxFn = add_53459d33({});
  // http://example.org#cdl_models.Controls.Controller.reaScaRep2
  const reaScaRep2Fn = realscalarreplicator_6941df46({ nout: nZones });
  // http://example.org#cdl_models.Controls.Controller.reaScaRep3
  const reaScaRep3Fn = realscalarreplicator_6941df46({ nout: nZones });
  // http://example.org#cdl_models.Controls.Controller.single_zone_ratchet_cooling
  const single_zone_ratchet_coolingFn = single_zone_ratchet_cooling_96ede778({ samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });
  // http://example.org#cdl_models.Controls.Controller.con1
  const con1Fn = constant_655d39b4({ k: loaSheHeaAct });
  // http://example.org#cdl_models.Controls.Controller.logSwi2
  const logSwi2Fn = switch_1e2c142e({});
  // http://example.org#cdl_models.Controls.Controller.con4
  const con4Fn = constant_d2aca5e8({ k: TZonHeaSetNomOcc });
  // http://example.org#cdl_models.Controls.Controller.con6
  const con6Fn = constant_d2aca5e8({ k: TZonHeaSetNomUnocc });
  // http://example.org#cdl_models.Controls.Controller.TZonHeaSetNom
  const TZonHeaSetNomFn = switch_91d77162({});
  // http://example.org#cdl_models.Controls.Controller.TZonHeaSetMin
  const TZonHeaSetMinFn = subtract_040901c2({});
  // http://example.org#cdl_models.Controls.Controller.reaScaRep
  const reaScaRepFn = realscalarreplicator_6941df46({ nout: nZones });
  // http://example.org#cdl_models.Controls.Controller.reaScaRep1
  const reaScaRep1Fn = realscalarreplicator_6941df46({ nout: nZones });
  // http://example.org#cdl_models.Controls.Controller.single_zone_ratchet_heating
  const single_zone_ratchet_heatingFn = single_zone_ratchet_heating_8d9af371({ samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });
  // http://example.org#cdl_models.Controls.Controller.loaShe
  const loaSheFn = timetable_61011cf1({ period: 86400, table: [[0,0],[loadShedHourStart,1],[loadShedHourEnd,0],[24,0]], timeScale: 3600 });
  // http://example.org#cdl_models.Controls.Controller.subt1
  const subt1Fn = subtract_040901c2({});
  // http://example.org#cdl_models.Controls.Controller.temDifSelectionMaxCooRat
  const temDifSelectionMaxCooRatFn = temdifselectionmax_44b4133c({ nZones: nZones });
  // http://example.org#cdl_models.Controls.Controller.temDifSelectionMinCooReb
  const temDifSelectionMinCooRebFn = temdifselectionmin_44b4142a({ nZones: nZones });
  // http://example.org#cdl_models.Controls.Controller.subt
  const subtFn = subtract_040901c2({});
  // http://example.org#cdl_models.Controls.Controller.temDifSelectionMinHeaRat
  const temDifSelectionMinHeaRatFn = temdifselectionmin_44b4142a({ nZones: nZones });
  // http://example.org#cdl_models.Controls.Controller.temDifSelectionMaxHeaReb
  const temDifSelectionMaxHeaRebFn = temdifselectionmax_44b4133c({ nZones: nZones });

  return (
    { TZon, TZonCooSetCur, TZonHeaSetCur, occSta }
  ) => {
    const booScaRep1 = booScaRep1Fn({});
    const con2 = con2Fn({});
    const con = conFn({});
    const logSwi3 = logSwi3Fn({ u1: booScaRep1.y, u2: con2.y, u3: con.y });
    const con3 = con3Fn({});
    const con5 = con5Fn({});
    const con7 = con7Fn({});
    const TZonCooSetNom = TZonCooSetNomFn({ u1: con5.y, u2: occSta, u3: con7.y });
    const TZonCooSetMax = TZonCooSetMaxFn({ u1: con3.y, u2: TZonCooSetNom.y });
    const reaScaRep2 = reaScaRep2Fn({ u: TZonCooSetMax.y });
    const reaScaRep3 = reaScaRep3Fn({ u: TZonCooSetNom.y });
    const single_zone_ratchet_cooling = single_zone_ratchet_coolingFn({ loaShe: logSwi3.y, TZon: TZon, TZonCooSetCur: TZonCooSetCur, TZonCooSetMax: reaScaRep2.y, TZonCooSetNom: reaScaRep3.y });
    const con1 = con1Fn({});
    const logSwi2 = logSwi2Fn({ u1: booScaRep1.y, u2: con1.y, u3: con.y });
    const con4 = con4Fn({});
    const con6 = con6Fn({});
    const TZonHeaSetNom = TZonHeaSetNomFn({ u1: con4.y, u2: occSta, u3: con6.y });
    const TZonHeaSetMin = TZonHeaSetMinFn({ u1: TZonHeaSetNom.y, u2: con3.y });
    const reaScaRep = reaScaRepFn({ u: TZonHeaSetMin.y });
    const reaScaRep1 = reaScaRep1Fn({ u: TZonHeaSetNom.y });
    const single_zone_ratchet_heating = single_zone_ratchet_heatingFn({ loaShe: logSwi2.y, TZon: TZon, TZonHeaSetCur: TZonHeaSetCur, TZonHeaSetMin: reaScaRep.y, TZonHeaSetNom: reaScaRep1.y });
    const loaShe = loaSheFn({});
    const subt1 = subt1Fn({ u1: TZon, u2: TZonCooSetCur });
    const temDifSelectionMaxCooRat = temDifSelectionMaxCooRatFn({ ignoreFlag: single_zone_ratchet_cooling.reachTZonCooSetMax, TZonTemDif: subt1.y });
    const temDifSelectionMinCooReb = temDifSelectionMinCooRebFn({ ignoreFlag: single_zone_ratchet_cooling.reachTZonCooSetNom, TZonTemDif: subt1.y });
    const subt = subtFn({ u1: TZon, u2: TZonHeaSetCur });
    const temDifSelectionMinHeaRat = temDifSelectionMinHeaRatFn({ ignoreFlag: single_zone_ratchet_heating.reachTZonHeaSetMin, TZonTemDif: subt.y });
    const temDifSelectionMaxHeaReb = temDifSelectionMaxHeaRebFn({ ignoreFlag: single_zone_ratchet_heating.reachTZonHeaSetNom, TZonTemDif: subt.y });

    return { TZonCooSetCom: single_zone_ratchet_cooling.TZonCooSetCom, TZonHeaSetCom: single_zone_ratchet_heating.TZonSetHeaCom };
  }
}
