const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/Buildings/Controls/OBC/ASHRAE/G36/AHUs/SingleZone/VAV/Controller.js");
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
    hAirRet: await read('hAirRet'),
		hOut: await read('hOut'),
		TAirRet: await read('TAirRet'),
		TAirSup: await read('TAirSup'),
		uSupFan_actual: await read('uSupFan_actual'),
		TZon: await read('TZon'),
		TAirMix: await read('TAirMix'),
		u1FreSta: await read('u1FreSta'),
		u1SofSwiRes: await read('u1SofSwiRes'),
		ppmCO2: await read('ppmCO2'),
		ppmCO2Set: await read('ppmCO2Set'),
		u1OccSen: await read('u1OccSen'),
		u1Win: await read('u1Win'),
		cooDowTim: await read('cooDowTim'),
		cooSetAdj: await read('cooSetAdj'),
		heaSetAdj: await read('heaSetAdj'),
		setAdj: await read('setAdj'),
		tNexOcc: await read('tNexOcc'),
		TOccCooSet: await read('TOccCooSet'),
		TOccHeaSet: await read('TOccHeaSet'),
		TUnoCooSet: await read('TUnoCooSet'),
		TUnoHeaSet: await read('TUnoHeaSet'),
		u1Occ: await read('u1Occ'),
		uCooDemLimLev: await read('uCooDemLimLev'),
		uHeaDemLimLev: await read('uHeaDemLimLev'),
		warUpTim: await read('warUpTim'),
		uCooCoi_actual: await read('uCooCoi_actual'),
		uHeaCoi_actual: await read('uHeaCoi_actual'),
		uOutDam: await read('uOutDam'),
		dpBui: await read('dpBui')
  };
  const { TSupCooSet, TSupHeaEcoSet, TZonCooSet, TZonHeaSet, y1EneCHWPum, y1ExhDam, y1RelFan, y1RetFan, y1SupFan, yAla, yChiPlaReq, yChiWatResReq, yCooCoi, yHeaCoi, yHotWatPlaReq, yHotWatResReq, yOutDam, yRelDam, yRelFan, yRetDam, yRetFan, ySupFan } = instance(params);

  await Promise.all([
    await write('TSupCooSet', normalize(TSupCooSet)),
		await write('TSupHeaEcoSet', normalize(TSupHeaEcoSet)),
		await write('TZonCooSet', normalize(TZonCooSet)),
		await write('TZonHeaSet', normalize(TZonHeaSet)),
		await write('y1EneCHWPum', normalize(y1EneCHWPum)),
		await write('y1ExhDam', normalize(y1ExhDam)),
		await write('y1RelFan', normalize(y1RelFan)),
		await write('y1RetFan', normalize(y1RetFan)),
		await write('y1SupFan', normalize(y1SupFan)),
		await write('yAla', normalize(yAla)),
		await write('yChiPlaReq', normalize(yChiPlaReq)),
		await write('yChiWatResReq', normalize(yChiWatResReq)),
		await write('yCooCoi', normalize(yCooCoi)),
		await write('yHeaCoi', normalize(yHeaCoi)),
		await write('yHotWatPlaReq', normalize(yHotWatPlaReq)),
		await write('yHotWatResReq', normalize(yHotWatResReq)),
		await write('yOutDam', normalize(yOutDam)),
		await write('yRelDam', normalize(yRelDam)),
		await write('yRelFan', normalize(yRelFan)),
		await write('yRetDam', normalize(yRetDam)),
		await write('yRetFan', normalize(yRetFan)),
		await write('ySupFan', normalize(ySupFan))
  ]);

  TimeManager.advance(1);
};