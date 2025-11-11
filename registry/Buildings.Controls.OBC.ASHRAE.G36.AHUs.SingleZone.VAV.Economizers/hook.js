const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/Buildings/Controls/OBC/ASHRAE/G36/AHUs/SingleZone/VAV/Economizers/Controller.js");
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
		uFreProSta: await read('uFreProSta'),
		uOpeMod: await read('uOpeMod'),
		uSupFan_actual: await read('uSupFan_actual'),
		VOutMinSet_flow: await read('VOutMinSet_flow'),
		hAirRet: await read('hAirRet'),
		TAirRet: await read('TAirRet'),
		hOut: await read('hOut'),
		TOut: await read('TOut'),
		uZonSta: await read('uZonSta'),
		TAirSup: await read('TAirSup'),
		TSupHeaEcoSet: await read('TSupHeaEcoSet')
  };
  const { yHeaCoi, yOutDam, yOutDam_min, yRetDam } = instance(params);

  await Promise.all([
    await write('yHeaCoi', normalize(yHeaCoi)),
		await write('yOutDam', normalize(yOutDam)),
		await write('yOutDam_min', normalize(yOutDam_min)),
		await write('yRetDam', normalize(yRetDam))
  ]);

  TimeManager.advance(1);
};