
// http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax
const not_f2b50019 = require("../../../Buildings/Controls/OBC/CDL/Logical/Not");
const add_53459d33 = require("../../../Buildings/Controls/OBC/CDL/Reals/Add");
const less_15730f47 = require("../../../Buildings/Controls/OBC/CDL/Reals/Less");
const multimax_a5ce0819 = require("../../../Buildings/Controls/OBC/CDL/Reals/MultiMax");
const multiplybyparameter_8938fce0 = require("../../../Buildings/Controls/OBC/CDL/Reals/MultiplyByParameter");
const constant_d2aca5e8 = require("../../../Buildings/Controls/OBC/CDL/Reals/Sources/Constant");
const switch_91d77162 = require("../../../Buildings/Controls/OBC/CDL/Reals/Switch");
const realscalarreplicator_6941df46 = require("../../../Buildings/Controls/OBC/CDL/Routing/RealScalarReplicator");

module.exports = (
  {
		nZones = 3,
    } = {}
) => {
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.con
  const conFn = constant_d2aca5e8({ k: -1000 });
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.swi
  const swiFn = switch_91d77162({});
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.gai
  const gaiFn = multiplybyparameter_8938fce0({ k: 0.000001 });
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.add2
  const add2Fn = add_53459d33({});
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.mulMax
  const mulMaxFn = multimax_a5ce0819({ nin: nZones });
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.reaScaRep
  const reaScaRepFn = realscalarreplicator_6941df46({ nout: nZones });
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.les
  const lesFn = less_15730f47({});
  // http://example.org#cdl_models.Controls.Subsequences.temDifSelectionMax.not1
  const not1Fn = not_f2b50019({});

  return (
    { ignoreFlag, TZonTemDif }
  ) => {
    const con = conFn({});
    const swi = swiFn({ u1: con.y, u2: ignoreFlag, u3: TZonTemDif });
    const gai = gaiFn({});
    const add2 = add2Fn({ u1: swi.y, u2: gai.y });
    const mulMax = mulMaxFn({ u: add2.y });
    const reaScaRep = reaScaRepFn({ u: mulMax.y });
    const les = lesFn({ u1: add2.y, u2: reaScaRep.y });
    const not1 = not1Fn({ u: les.y });

    return { actionFlag: not1.y };
  }
}
