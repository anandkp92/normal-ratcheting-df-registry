
// http://example.org#cdl_models.Controls.Subsequences.one_zone_ratchet_heating_single_zone
const constant_655d39b4 = require("../../../Buildings/Controls/OBC/CDL/Logical/Sources/Constant");
const one_zone_ratchet_heating_3d084131 = require("./one_zone_ratchet_heating");

module.exports = (
  {
		reboundDuration = 3600,
		samplePeriodRatchet = 300,
		samplePeriodRebound = 900,
		TRat = -1,
		TRatThreshold = 0.5,
		TReb = 1,
    } = {}
) => {
  // http://example.org#cdl_models.Controls.Subsequences.one_zone_ratchet_heating_single_zone.con4
  const con4Fn = constant_655d39b4({ k: true });
  // http://example.org#cdl_models.Controls.Subsequences.one_zone_ratchet_heating_single_zone.one_zone_ratchet_heating1
  const one_zone_ratchet_heating1Fn = one_zone_ratchet_heating_3d084131({ reboundDuration: reboundDuration, samplePeriodRatchet: samplePeriodRatchet, samplePeriodRebound: samplePeriodRebound, TRat: TRat, TRatThreshold: TRatThreshold, TReb: TReb });

  return (
    { loaShe, TZon, TZonHeaSetCur, TZonHeaSetMin, TZonHeaSetNom }
  ) => {
    const con4 = con4Fn({});
    const one_zone_ratchet_heating1 = one_zone_ratchet_heating1Fn({ loaShe: loaShe, rebSig: con4.y, TZon: TZon, TZonHeaSetCur: TZonHeaSetCur, TZonHeaSetMin: TZonHeaSetMin, TZonHeaSetNom: TZonHeaSetNom });

    return { TZonSetHeaCom: one_zone_ratchet_heating1.TZonSetHeaCom };
  }
}
