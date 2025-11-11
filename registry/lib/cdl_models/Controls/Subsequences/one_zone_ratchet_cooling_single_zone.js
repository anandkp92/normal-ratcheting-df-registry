
// http://example.org#cdl_models.Controls.Subsequences.one_zone_ratchet_cooling_single_zone
const constant_655d39b4 = require("../../../Buildings/Controls/OBC/CDL/Logical/Sources/Constant");
const one_zone_ratchet_cooling_465b3538 = require("./one_zone_ratchet_cooling");

module.exports = (
  {
		reboundDuration = 3600,
		samplePeriodRatchet = 300,
		samplePeriodRebound = 900,
		TRat = 1,
		TRatThreshold = 0.5,
		TReb = -1,
    } = {}
) => {
  // http://example.org#cdl_models.Controls.Subsequences.one_zone_ratchet_cooling_single_zone.con4
  const con4Fn = constant_655d39b4({ k: true });
  // http://example.org#cdl_models.Controls.Subsequences.one_zone_ratchet_cooling_single_zone.one_zone_ratchet_cooling1
  const one_zone_ratchet_cooling1Fn = one_zone_ratchet_cooling_465b3538({ reboundDuration: reboundDuration, samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });

  return (
    { loaShe, TZon, TZonCooSetCur, TZonCooSetMax, TZonCooSetNom }
  ) => {
    const con4 = con4Fn({});
    const one_zone_ratchet_cooling1 = one_zone_ratchet_cooling1Fn({ loaShe: loaShe, rebSig: con4.y, TZon: TZon, TZonCooSetCur: TZonCooSetCur, TZonCooSetMax: TZonCooSetMax, TZonCooSetNom: TZonCooSetNom });

    return { TZonCooSetCom: one_zone_ratchet_cooling1.TZonCooSetCom };
  }
}
