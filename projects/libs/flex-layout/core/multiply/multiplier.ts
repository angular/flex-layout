export interface Multiplier {
  readonly unit: string;
  readonly value: number;
}

const MULTIPLIER_SUFFIX = 'x';

export function multiply(value: string, multiplier?: Multiplier): string {
  if (multiplier === undefined) {
    return value;
  }

  const transformValue = (possibleValue: string) => {
    const numberValue = +(possibleValue.slice(0, -MULTIPLIER_SUFFIX.length));

    if (value.endsWith(MULTIPLIER_SUFFIX) && !isNaN(numberValue)) {
      return `${numberValue * multiplier.value}${multiplier.unit}`;
    }

    return value;
  };

  return value.includes(' ') ?
    value.split(' ').map(transformValue).join(' ') : transformValue(value);
}
