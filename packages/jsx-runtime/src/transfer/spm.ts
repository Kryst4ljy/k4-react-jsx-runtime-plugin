import { isObject } from '../utils';

export const SPM = 'data-spm';

const transferSpm = function (props: any) {
  if (isObject(props[SPM])) {
    const result = Object.assign({}, props);

    if (!result.onClick) {
      result.onClick = (e) => {
        console.log('spm', result[SPM]);
      };
    } else {
      const sourceClick = result.onClick;
      result.onClick = (e) => {
        sourceClick();
        console.log('spm', result[SPM]);
      };
    }

    return result;
  }

  return props;
};

export default transferSpm;
