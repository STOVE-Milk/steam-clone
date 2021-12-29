import type { NextPage } from 'next';
import Button from 'components/common/Button';

const Test: NextPage = () => {
  return (
    <>
      <Button color={'#203153'}>Default button</Button>
      <Button color={'#C03C3C'} primary>
        Red button
      </Button>
    </>
  );
};

export default Test;
