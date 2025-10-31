const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/Buildings/Controls/OBC/ASHRAE/G36/AHUs/MultiZone/VAV/Controller.js");
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
    uOutAirFra_max: await read('uOutAirFra_max'),
		VAirOut_flow: await read('VAirOut_flow'),
		VSumAdjAreBreZon_flow: await read('VSumAdjAreBreZon_flow'),
		VSumAdjPopBreZon_flow: await read('VSumAdjPopBreZon_flow'),
		VSumZonPri_flow: await read('VSumZonPri_flow'),
		dpDuc: await read('dpDuc'),
		uAhuOpeMod: await read('uAhuOpeMod'),
		uZonPreResReq: await read('uZonPreResReq'),
		TOut: await read('TOut'),
		u1SupFan: await read('u1SupFan'),
		uZonTemResReq: await read('uZonTemResReq'),
		dpMinOutDam: await read('dpMinOutDam'),
		hAirOut: await read('hAirOut'),
		hAirRet: await read('hAirRet'),
		TAirRet: await read('TAirRet'),
		uCO2Loo_max: await read('uCO2Loo_max'),
		TAirMix: await read('TAirMix'),
		TAirSup: await read('TAirSup'),
		u1FreSta: await read('u1FreSta'),
		u1SofSwiRes: await read('u1SofSwiRes'),
		dpBui: await read('dpBui'),
		VAirRet_flow: await read('VAirRet_flow'),
		VAirSup_flow: await read('VAirSup_flow'),
		VSumZonAbsMin_flow: await read('VSumZonAbsMin_flow'),
		VSumZonDesMin_flow: await read('VSumZonDesMin_flow')
  };
  const { dpDisSet, TAirSupSet, VEffAirOut_flow_min, y1EneCHWPum, y1MinOutDam, y1RelDam, y1RelFan, y1RetFan, y1SupFan, yAla, yChiPlaReq, yChiWatResReq, yCooCoi, yDpBui, yHeaCoi, yHotWatPlaReq, yHotWatResReq, yMinOutDam, yOutDam, yRelDam, yRelFan, yRetDam, yRetFan, ySupFan } = instance(params);

  await Promise.all([
    await write('dpDisSet', normalize(dpDisSet)),
		await write('TAirSupSet', normalize(TAirSupSet)),
		await write('VEffAirOut_flow_min', normalize(VEffAirOut_flow_min)),
		await write('y1EneCHWPum', normalize(y1EneCHWPum)),
		await write('y1MinOutDam', normalize(y1MinOutDam)),
		await write('y1RelDam', normalize(y1RelDam)),
		await write('y1RelFan', normalize(y1RelFan)),
		await write('y1RetFan', normalize(y1RetFan)),
		await write('y1SupFan', normalize(y1SupFan)),
		await write('yAla', normalize(yAla)),
		await write('yChiPlaReq', normalize(yChiPlaReq)),
		await write('yChiWatResReq', normalize(yChiWatResReq)),
		await write('yCooCoi', normalize(yCooCoi)),
		await write('yDpBui', normalize(yDpBui)),
		await write('yHeaCoi', normalize(yHeaCoi)),
		await write('yHotWatPlaReq', normalize(yHotWatPlaReq)),
		await write('yHotWatResReq', normalize(yHotWatResReq)),
		await write('yMinOutDam', normalize(yMinOutDam)),
		await write('yOutDam', normalize(yOutDam)),
		await write('yRelDam', normalize(yRelDam)),
		await write('yRelFan', normalize(yRelFan)),
		await write('yRetDam', normalize(yRetDam)),
		await write('yRetFan', normalize(yRetFan)),
		await write('ySupFan', normalize(ySupFan))
  ]);

  TimeManager.advance(1);
};