import { DefaultMessage } from '../constants';

export const PURPOSE_OF_TESTING_DATA = [
  { name: 'BIS FULL TESTING', value: 'BIS_FULLTESTING' },
  { name: 'BIS MODIFICATION', value: 'BIS_MODIFICATION' },
  { name: 'NABL PERFORMANCE', value: 'NABL_PERFORMANCE' },
  { name: 'MEITY SURVEILANCE ORDER', value: 'MEITY_SUR_ORDER' },
  { name: 'R&D', value: 'R_AND_D' },
  { name: 'OTHERS', value: 'OTHERS' },
];

export const getPurposeOfTestingDisplayName = (val) => {
  const obj = PURPOSE_OF_TESTING_DATA.find((e) => e.value === val);
  if (obj) {
    const { name } = obj;
    return name;
  }
  return DefaultMessage.NOT_AVAILABLE;
};
