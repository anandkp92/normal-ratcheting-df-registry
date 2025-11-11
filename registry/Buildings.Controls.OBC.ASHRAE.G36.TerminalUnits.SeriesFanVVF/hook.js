const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/Buildings/Controls/OBC/ASHRAE/G36/TerminalUnits/SeriesFanVVF/Controller.js");
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
    uOpeMod: await read('uOpeMod'),
		TDis: await read('TDis'),
		TSup: await read('TSup'),
		u1Fan: await read('u1Fan'),
		u1HotPla: await read('u1HotPla'),
		u1TerFan: await read('u1TerFan'),
		VPri_flow: await read('VPri_flow'),
		TCooSet: await read('TCooSet'),
		THeaSet: await read('THeaSet'),
		TZon: await read('TZon'),
		oveFloSet: await read('oveFloSet'),
		TSupSet: await read('TSupSet'),
		ppmCO2: await read('ppmCO2'),
		ppmCO2Set: await read('ppmCO2Set'),
		u1Occ: await read('u1Occ'),
		u1Win: await read('u1Win'),
		oveDamPos: await read('oveDamPos'),
		oveFan: await read('oveFan'),
		uHeaOff: await read('uHeaOff')
  };
  const { VAdjAreBreZon_flow, VAdjPopBreZon_flow, VFan_flow_Set, VMinOA_flow, VSet_flow, VZonAbsMin_flow, VZonDesMin_flow, y1Fan, yCO2, yDam, yFanStaAla, yFloSenAla, yHeaValResReq, yHotWatPlaReq, yLeaDamAla, yLeaValAla, yLowFloAla, yLowTemAla, yVal, yZonPreResReq, yZonTemResReq } = instance(params);

  await Promise.all([
    await write('VAdjAreBreZon_flow', normalize(VAdjAreBreZon_flow)),
		await write('VAdjPopBreZon_flow', normalize(VAdjPopBreZon_flow)),
		await write('VFan_flow_Set', normalize(VFan_flow_Set)),
		await write('VMinOA_flow', normalize(VMinOA_flow)),
		await write('VSet_flow', normalize(VSet_flow)),
		await write('VZonAbsMin_flow', normalize(VZonAbsMin_flow)),
		await write('VZonDesMin_flow', normalize(VZonDesMin_flow)),
		await write('y1Fan', normalize(y1Fan)),
		await write('yCO2', normalize(yCO2)),
		await write('yDam', normalize(yDam)),
		await write('yFanStaAla', normalize(yFanStaAla)),
		await write('yFloSenAla', normalize(yFloSenAla)),
		await write('yHeaValResReq', normalize(yHeaValResReq)),
		await write('yHotWatPlaReq', normalize(yHotWatPlaReq)),
		await write('yLeaDamAla', normalize(yLeaDamAla)),
		await write('yLeaValAla', normalize(yLeaValAla)),
		await write('yLowFloAla', normalize(yLowFloAla)),
		await write('yLowTemAla', normalize(yLowTemAla)),
		await write('yVal', normalize(yVal)),
		await write('yZonPreResReq', normalize(yZonPreResReq)),
		await write('yZonTemResReq', normalize(yZonTemResReq))
  ]);

  TimeManager.advance(1);
};