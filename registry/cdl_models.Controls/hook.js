const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/cdl_models/Controls/Controller.js");
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
module.exports = async ({points}) => {
  const read = async (label) => {
    const point = points.byLabel(label).first();
    if (!point) {
      return 0;
    }
    const [value] = await point.read();
    return normalize(value?.value?.real);
  };

  const write = async (label, value) => {
    const point = points.byLabel(label).first();
    if (!point) {
      return;
    }
    await point.write(value);
  };

  const params = {
    TZon: await read('TZon'),
		TZonCooSetCur: await read('TZonCooSetCur'),
		TZonHeaSetCur: await read('TZonHeaSetCur'),
		occSta: await read('occSta')
  };
  const { TZonCooSetCom, TZonHeaSetCom } = instance(params);

  await Promise.all([
    await write('TZonCooSetCom', normalize(TZonCooSetCom)),
		await write('TZonHeaSetCom', normalize(TZonHeaSetCom))
  ]);

  TimeManager.advance(1);
};