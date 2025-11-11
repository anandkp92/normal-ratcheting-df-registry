const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/Buildings/Controls/OBC/ASHRAE/G36/AHUs/MultiZone/VAV/Economizers/Controller.js");
const TimeManager = require("../lib/TimeManager");
const instance = controller({});

const EPSILON = 1e-6;

/**
 * Normalize value to 0 if it is close to 0
 * @param {number} value
 * @returns {number}
 */
function normalize(value) {
  if (!value || isNaN(value)) {
    return 0;
  }
  if (value < EPSILON) {
    return 0;
  }
  return value;
}

/**
 * Invoke hook function
 * @param {NormalSdk.InvokeParams} params
 * @returns {NormalSdk.InvokeResult}
 */
module.exports = async ({points, groupVariables}) => {
  const read = async (label) => {
    const point = points.byLabel(label).first();
    if (!point) {
      return 0;
    }
    const [value] = await point.read();
    return normalize(value?.value?.real);
  };

  const write = async (label, value) => {
    const point = groupVariables.byLabel(label).first();
    if (!point) {
      return;
    }
    await point.write(value);
  };

  const params = {
    u1SupFan: await read('u1SupFan'),
		uOpeMod: await read('uOpeMod'),
		VOut_flow_normalized: await read('VOut_flow_normalized'),
		VOutMinSet_flow_normalized: await read('VOutMinSet_flow_normalized'),
		hAirRet: await read('hAirRet'),
		TAirRet: await read('TAirRet'),
		hAirOut: await read('hAirOut'),
		TOut: await read('TOut'),
		uFreProSta: await read('uFreProSta'),
		uTSup: await read('uTSup'),
		uSupFan: await read('uSupFan'),
		dpMinOutDam: await read('dpMinOutDam'),
		effAbsOutAir_normalized: await read('effAbsOutAir_normalized'),
		effDesOutAir_normalized: await read('effDesOutAir_normalized'),
		uCO2Loo_max: await read('uCO2Loo_max')
  };
  const { y1MinOutDam, yEnaMinOut, yMinOutDam, yOutDam, yOutDam_min, yRelDam, yRetDam } = instance(params);

  await Promise.all([
    await write('y1MinOutDam', normalize(y1MinOutDam)),
		await write('yEnaMinOut', normalize(yEnaMinOut)),
		await write('yMinOutDam', normalize(yMinOutDam)),
		await write('yOutDam', normalize(yOutDam)),
		await write('yOutDam_min', normalize(yOutDam_min)),
		await write('yRelDam', normalize(yRelDam)),
		await write('yRetDam', normalize(yRetDam))
  ]);

  TimeManager.advance(1);
};