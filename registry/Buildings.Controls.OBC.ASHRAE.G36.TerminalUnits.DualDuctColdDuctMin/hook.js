const NormalSdk = require("@normalframework/applications-sdk");
const controller = require("../lib/Buildings/Controls/OBC/ASHRAE/G36/TerminalUnits/DualDuctColdDuctMin/Controller.js");
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
		u1CooAHU: await read('u1CooAHU'),
		u1HeaAHU: await read('u1HeaAHU'),
		VColDucDis_flow: await read('VColDucDis_flow'),
		VHotDucDis_flow: await read('VHotDucDis_flow'),
		TCooSet: await read('TCooSet'),
		THeaSet: await read('THeaSet'),
		TZon: await read('TZon'),
		TColSup: await read('TColSup'),
		THotSup: await read('THotSup'),
		ppmCO2: await read('ppmCO2'),
		ppmCO2Set: await read('ppmCO2Set'),
		u1Occ: await read('u1Occ'),
		u1Win: await read('u1Win'),
		oveCooDamPos: await read('oveCooDamPos'),
		oveFloSet: await read('oveFloSet'),
		oveHeaDamPos: await read('oveHeaDamPos'),
		TDis: await read('TDis')
  };
  const { VAdjAreBreZon_flow, VAdjPopBreZon_flow, VMinOA_flow, VSet_flow, VZonAbsMin_flow, VZonDesMin_flow, yCO2, yColDucPreResReq, yColFloSenAla, yColLeaDamAla, yCooDam, yHeaDam, yHeaFanReq, yHotDucPreResReq, yHotFloSenAla, yHotLeaDamAla, yLowFloAla, yZonCooTemResReq, yZonHeaTemResReq } = instance(params);

  await Promise.all([
    await write('VAdjAreBreZon_flow', normalize(VAdjAreBreZon_flow)),
		await write('VAdjPopBreZon_flow', normalize(VAdjPopBreZon_flow)),
		await write('VMinOA_flow', normalize(VMinOA_flow)),
		await write('VSet_flow', normalize(VSet_flow)),
		await write('VZonAbsMin_flow', normalize(VZonAbsMin_flow)),
		await write('VZonDesMin_flow', normalize(VZonDesMin_flow)),
		await write('yCO2', normalize(yCO2)),
		await write('yColDucPreResReq', normalize(yColDucPreResReq)),
		await write('yColFloSenAla', normalize(yColFloSenAla)),
		await write('yColLeaDamAla', normalize(yColLeaDamAla)),
		await write('yCooDam', normalize(yCooDam)),
		await write('yHeaDam', normalize(yHeaDam)),
		await write('yHeaFanReq', normalize(yHeaFanReq)),
		await write('yHotDucPreResReq', normalize(yHotDucPreResReq)),
		await write('yHotFloSenAla', normalize(yHotFloSenAla)),
		await write('yHotLeaDamAla', normalize(yHotLeaDamAla)),
		await write('yLowFloAla', normalize(yLowFloAla)),
		await write('yZonCooTemResReq', normalize(yZonCooTemResReq)),
		await write('yZonHeaTemResReq', normalize(yZonHeaTemResReq))
  ]);

  TimeManager.advance(1);
};