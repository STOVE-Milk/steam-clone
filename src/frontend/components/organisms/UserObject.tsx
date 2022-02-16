import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import styled from 'styled-components';

interface IUserObjectProps {
  x: number;
  y: number;
  width: number;
}

const UserObject = (props: IUserObjectProps) => {
  const { x, y, width } = props;
  const UserImage = (x: any, y: any) => {
    const [image] = useImage('https://i.stack.imgur.com/GsDIl.jpg');

    return (
      <>
        <button onClick={() => console.log('clicked')}>{close}</button>
        <Image x={x} y={y} image={image} height={width} width={width} />
      </>
    );
  };
  return <UserImage />;
};

export default UserObject;
