import type { NextPage } from 'next';
import FilledButton from 'components/atoms/FilledButton';
import DefaultButton from 'components/atoms/DefaultButton';
const Test: NextPage = () => {
  return (
    <>
      <FilledButton types={'primary'}>Default button</FilledButton>
      <FilledButton types={'secondary'}>Red button</FilledButton>
      <DefaultButton types={'primary'}>Red button</DefaultButton>
      <DefaultButton types={'secondary'}>Red button</DefaultButton>
    </>
  );
};

export default Test;
