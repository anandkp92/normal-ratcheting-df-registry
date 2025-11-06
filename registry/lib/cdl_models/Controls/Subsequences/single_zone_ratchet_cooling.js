
// http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling
const booleantoreal_552dc85b = require("../../../Buildings/Controls/OBC/CDL/Conversions/BooleanToReal");
const sampler_dd234808 = require("../../../Buildings/Controls/OBC/CDL/Discrete/Sampler");
const and_f2b4cf1d = require("../../../Buildings/Controls/OBC/CDL/Logical/And");
const not_f2b50019 = require("../../../Buildings/Controls/OBC/CDL/Logical/Not");
const truedelay_17dc655b = require("../../../Buildings/Controls/OBC/CDL/Logical/TrueDelay");
const add_53459d33 = require("../../../Buildings/Controls/OBC/CDL/Reals/Add");
const greater_2582f78c = require("../../../Buildings/Controls/OBC/CDL/Reals/Greater");
const greaterthreshold_7c60ca3f = require("../../../Buildings/Controls/OBC/CDL/Reals/GreaterThreshold");
const less_15730f47 = require("../../../Buildings/Controls/OBC/CDL/Reals/Less");
const max_5345c9f6 = require("../../../Buildings/Controls/OBC/CDL/Reals/Max");
const min_5345cae4 = require("../../../Buildings/Controls/OBC/CDL/Reals/Min");
const subtract_040901c2 = require("../../../Buildings/Controls/OBC/CDL/Reals/Subtract");
const switch_91d77162 = require("../../../Buildings/Controls/OBC/CDL/Reals/Switch");

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
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.les
  const lesFn = less_15730f47({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.not3
  const not3Fn = not_f2b50019({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.gre2
  const gre2Fn = greater_2582f78c({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.not4
  const not4Fn = not_f2b50019({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.subt
  const subtFn = subtract_040901c2({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.greThr
  const greThrFn = greaterthreshold_7c60ca3f({ h: 0, t: -1*TRatThreshold });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.and2
  const and2Fn = and_f2b4cf1d({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.booToRea
  const booToReaFn = booleantoreal_552dc85b({ realFalse: 0, realTrue: TRat });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.booToRea1
  const booToRea1Fn = booleantoreal_552dc85b({ realFalse: 0, realTrue: -TReb });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.swi6
  const swi6Fn = switch_91d77162({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.add
  const addFn = add_53459d33({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.min1
  const min1Fn = min_5345cae4({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.max1
  const max1Fn = max_5345c9f6({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.sam
  const samFn = sampler_dd234808({ samplePeriod: samplePeriodRatchet });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.sam1
  const sam1Fn = sampler_dd234808({ samplePeriod: samplePeriodRebound });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.swi1
  const swi1Fn = switch_91d77162({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.not2
  const not2Fn = not_f2b50019({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.truDel
  const truDelFn = truedelay_17dc655b({ delayTime: reboundDuration });
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.not1
  const not1Fn = not_f2b50019({});
  // http://example.org#cdl_models.Controls.Subsequences.single_zone_ratchet_cooling.swi2
  const swi2Fn = switch_91d77162({});

  return (
    { TZonCooSetCur, ratSig, rebSig, TZonCooSetNom, TZonCooSetMax, loaShe, TZon }
  ) => {
    const les = lesFn({ u1: TZonCooSetCur, u2: TZonCooSetMax });
    const not3 = not3Fn({ u: les.y });
    const gre2 = gre2Fn({ u1: TZonCooSetCur, u2: TZonCooSetNom });
    const not4 = not4Fn({ u: gre2.y });
    const subt = subtFn({ u1: TZon, u2: TZonCooSetCur });
    const greThr = greThrFn({ u: subt.y });
    const and2 = and2Fn({ u1: greThr.y, u2: ratSig });
    const booToRea = booToReaFn({ u: and2.y });
    const booToRea1 = booToRea1Fn({ u: rebSig });
    const swi6 = swi6Fn({ u1: booToRea.y, u2: loaShe, u3: booToRea1.y });
    const add = addFn({ u1: swi6.y, u2: TZonCooSetCur });
    const min1 = min1Fn({ u1: add.y, u2: TZonCooSetMax });
    const max1 = max1Fn({ u1: min1.y, u2: TZonCooSetNom });
    const sam = samFn({ u: max1.y });
    const sam1 = sam1Fn({ u: max1.y });
    const swi1 = swi1Fn({ u1: sam.y, u2: loaShe, u3: sam1.y });
    const not2 = not2Fn({ u: loaShe });
    const truDel = truDelFn({ u: not2.y });
    const not1 = not1Fn({ u: truDel.y });
    const swi2 = swi2Fn({ u1: swi1.y, u2: not1.y, u3: TZonCooSetNom });

    return { reachTZonCooSetMax: not3.y, reachTZonCooSetNom: not4.y, TZonCooSetCom: swi2.y };
  }
}
