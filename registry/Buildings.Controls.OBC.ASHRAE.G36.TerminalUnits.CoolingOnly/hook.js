const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/Buildings/Controls/OBC/ASHRAE/G36/TerminalUnits/CoolingOnly/Controller.js");
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
    uOpeMod: await read('uOpeMod'),
		u1Fan: await read('u1Fan'),
		VDis_flow: await read('VDis_flow'),
		TCooSet: await read('TCooSet'),
		THeaSet: await read('THeaSet'),
		TZon: await read('TZon'),
		oveDamPos: await read('oveDamPos'),
		oveFloSet: await read('oveFloSet'),
		TSup: await read('TSup'),
		ppmCO2: await read('ppmCO2'),
		ppmCO2Set: await read('ppmCO2Set'),
		u1Occ: await read('u1Occ'),
		u1Win: await read('u1Win'),
		TDis: await read('TDis')
  };
  const { VAdjAreBreZon_flow, VAdjPopBreZon_flow, VMinOA_flow, VSet_flow, VZonAbsMin_flow, VZonDesMin_flow, yCO2, yDam, yFloSenAla, yLeaDamAla, yLowFloAla, yZonPreResReq, yZonTemResReq } = instance(params);

  await Promise.all([
    await write('VAdjAreBreZon_flow', normalize(VAdjAreBreZon_flow)),
		await write('VAdjPopBreZon_flow', normalize(VAdjPopBreZon_flow)),
		await write('VMinOA_flow', normalize(VMinOA_flow)),
		await write('VSet_flow', normalize(VSet_flow)),
		await write('VZonAbsMin_flow', normalize(VZonAbsMin_flow)),
		await write('VZonDesMin_flow', normalize(VZonDesMin_flow)),
		await write('yCO2', normalize(yCO2)),
		await write('yDam', normalize(yDam)),
		await write('yFloSenAla', normalize(yFloSenAla)),
		await write('yLeaDamAla', normalize(yLeaDamAla)),
		await write('yLowFloAla', normalize(yLowFloAla)),
		await write('yZonPreResReq', normalize(yZonPreResReq)),
		await write('yZonTemResReq', normalize(yZonTemResReq))
  ]);

  TimeManager.advance(1);
};