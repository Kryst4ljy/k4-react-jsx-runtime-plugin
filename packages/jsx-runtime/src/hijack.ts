import tansferStyle, { STYLE } from './transfer/style';
import transferSpm, { SPM } from './transfer/spm';

// hijack jsx
export function hijackElementProps(props: object): object {
  let transferProps = props;

  // Support rpx unit.
  if (transferProps && STYLE in transferProps) {
    transferProps = tansferStyle(transferProps);
  }

  // spm
  if (transferProps && SPM in transferProps) {
    transferProps = transferSpm(transferProps);
  }

  return transferProps;
}
