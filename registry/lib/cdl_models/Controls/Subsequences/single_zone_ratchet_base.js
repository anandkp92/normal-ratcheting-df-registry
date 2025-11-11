
// http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base
const booleantoreal_552dc85b = require("../../../Buildings/Controls/OBC/CDL/Conversions/BooleanToReal");
const constant_655d39b4 = require("../../../Buildings/Controls/OBC/CDL/Logical/Sources/Constant");
const switch_1e2c142e = require("../../../Buildings/Controls/OBC/CDL/Logical/Switch");
const add_53459d33 = require("../../../Buildings/Controls/OBC/CDL/Reals/Add");
const constant_d2aca5e8 = require("../../../Buildings/Controls/OBC/CDL/Reals/Sources/Constant");
const subtract_040901c2 = require("../../../Buildings/Controls/OBC/CDL/Reals/Subtract");
const one_zone_ratchet_cooling_single_zone_569444bc = require("./one_zone_ratchet_cooling_single_zone");
const one_zone_ratchet_heating_single_zone_507a2335 = require("./one_zone_ratchet_heating_single_zone");

module.exports = (
  {
		loaSheCooAct = true,
		loaSheHeaAct = true,
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
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.con2
  const con2Fn = constant_655d39b4({ k: loaSheCooAct });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.con1
  const con1Fn = constant_655d39b4({ k: false });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.logSwi3
  const logSwi3Fn = switch_1e2c142e({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.con3
  const con3Fn = constant_d2aca5e8({ k: loadShedTempAmount });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.TZonCooSetNom
  const TZonCooSetNomFn = booleantoreal_552dc85b({ realFalse: TZonCooSetNomUnocc, realTrue: TZonCooSetNomOcc });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.TZonCooSetMax
  const TZonCooSetMaxFn = add_53459d33({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.ratCoo
  const ratCooFn = one_zone_ratchet_cooling_single_zone_569444bc({ reboundDuration: reboundDuration, samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.con
  const conFn = constant_655d39b4({ k: loaSheHeaAct });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.logSwi2
  const logSwi2Fn = switch_1e2c142e({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.TZonHeaSetNom
  const TZonHeaSetNomFn = booleantoreal_552dc85b({ realFalse: TZonHeaSetNomUnocc, realTrue: TZonHeaSetNomOcc });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.TZonHeaSetMin
  const TZonHeaSetMinFn = subtract_040901c2({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_base.ratHea
  const ratHeaFn = one_zone_ratchet_heating_single_zone_507a2335({ reboundDuration: reboundDuration, samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });

  return (
    { loaShe, TZon, TZonCooSetCur, TZonHeaSetCur, occSta }
  ) => {
    const con2 = con2Fn({});
    const con1 = con1Fn({});
    const logSwi3 = logSwi3Fn({ u1: loaShe, u2: con2.y, u3: con1.y });
    const con3 = con3Fn({});
    const TZonCooSetNom = TZonCooSetNomFn({ u: occSta });
    const TZonCooSetMax = TZonCooSetMaxFn({ u1: con3.y, u2: TZonCooSetNom.y });
    const ratCoo = ratCooFn({ loaShe: logSwi3.y, TZon: TZon, TZonCooSetCur: TZonCooSetCur, TZonCooSetMax: TZonCooSetMax.y, TZonCooSetNom: TZonCooSetNom.y });
    const con = conFn({});
    const logSwi2 = logSwi2Fn({ u1: loaShe, u2: con.y, u3: con1.y });
    const TZonHeaSetNom = TZonHeaSetNomFn({ u: occSta });
    const TZonHeaSetMin = TZonHeaSetMinFn({ u1: TZonHeaSetNom.y, u2: con3.y });
    const ratHea = ratHeaFn({ loaShe: logSwi2.y, TZon: TZon, TZonHeaSetCur: TZonHeaSetCur, TZonHeaSetMin: TZonHeaSetMin.y, TZonHeaSetNom: TZonHeaSetNom.y });

    return { TZonCooSetCom: ratCoo.TZonCooSetCom, TZonHeaSetCom: ratHea.TZonSetHeaCom };
  }
}
