
// http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating
const booleantoreal_552dc85b = require("../../../Buildings/Controls/OBC/CDL/Conversions/BooleanToReal");
const sampler_dd234808 = require("../../../Buildings/Controls/OBC/CDL/Discrete/Sampler");
const and_f2b4cf1d = require("../../../Buildings/Controls/OBC/CDL/Logical/And");
const not_f2b50019 = require("../../../Buildings/Controls/OBC/CDL/Logical/Not");
const add_53459d33 = require("../../../Buildings/Controls/OBC/CDL/Reals/Add");
const greater_2582f78c = require("../../../Buildings/Controls/OBC/CDL/Reals/Greater");
const less_15730f47 = require("../../../Buildings/Controls/OBC/CDL/Reals/Less");
const lessthreshold_854034e4 = require("../../../Buildings/Controls/OBC/CDL/Reals/LessThreshold");
const max_5345c9f6 = require("../../../Buildings/Controls/OBC/CDL/Reals/Max");
const min_5345cae4 = require("../../../Buildings/Controls/OBC/CDL/Reals/Min");
const subtract_040901c2 = require("../../../Buildings/Controls/OBC/CDL/Reals/Subtract");
const switch_91d77162 = require("../../../Buildings/Controls/OBC/CDL/Reals/Switch");

module.exports = (
  {
		samplePeriodRatchet = 300,
		samplePeriodRebound = 900,
		TRat = -1,
		TRatThreshold = 0.5,
		TReb = 1,
    } = {}
) => {
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.gre3
  const gre3Fn = greater_2582f78c({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.not2
  const not2Fn = not_f2b50019({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.les1
  const les1Fn = less_15730f47({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.not1
  const not1Fn = not_f2b50019({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.subt
  const subtFn = subtract_040901c2({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.lesThr
  const lesThrFn = lessthreshold_854034e4({ h: 0, t: TRatThreshold });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.and2
  const and2Fn = and_f2b4cf1d({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.booToRea
  const booToReaFn = booleantoreal_552dc85b({ realFalse: 0, realTrue: -TRat });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.booToRea1
  const booToRea1Fn = booleantoreal_552dc85b({ realFalse: 0, realTrue: TReb });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.swi6
  const swi6Fn = switch_91d77162({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.add
  const addFn = add_53459d33({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.min1
  const min1Fn = min_5345cae4({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.max1
  const max1Fn = max_5345c9f6({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.sam
  const samFn = sampler_dd234808({ samplePeriod: samplePeriodRatchet });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.sam1
  const sam1Fn = sampler_dd234808({ samplePeriod: samplePeriodRebound });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_heating.swi1
  const swi1Fn = switch_91d77162({});

  return (
    { TZonHeaSetCur, ratSig, rebSig, TZonHeaSetMin, TZonHeaSetNom, TZon, loaShe }
  ) => {
    const gre3 = gre3Fn({ u1: TZonHeaSetCur, u2: TZonHeaSetMin });
    const not2 = not2Fn({ u: gre3.y });
    const les1 = les1Fn({ u1: TZonHeaSetCur, u2: TZonHeaSetNom });
    const not1 = not1Fn({ u: les1.y });
    const subt = subtFn({ u1: TZon, u2: TZonHeaSetCur });
    const lesThr = lesThrFn({ u: subt.y });
    const and2 = and2Fn({ u1: lesThr.y, u2: ratSig });
    const booToRea = booToReaFn({ u: and2.y });
    const booToRea1 = booToRea1Fn({ u: rebSig });
    const swi6 = swi6Fn({ u1: booToRea.y, u2: loaShe, u3: booToRea1.y });
    const add = addFn({ u1: swi6.y, u2: TZonHeaSetCur });
    const min1 = min1Fn({ u1: add.y, u2: TZonHeaSetNom });
    const max1 = max1Fn({ u1: min1.y, u2: TZonHeaSetMin });
    const sam = samFn({ u: max1.y });
    const sam1 = sam1Fn({ u: max1.y });
    const swi1 = swi1Fn({ u1: sam.y, u2: loaShe, u3: sam1.y });

    return { reachTZonHeaSetMin: not2.y, reachTZonHeaSetNom: not1.y, TZonSetHeaCom: swi1.y };
  }
}
