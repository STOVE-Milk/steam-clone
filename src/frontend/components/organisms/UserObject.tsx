import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { source } from 'util/imageSource';

interface IUserObjectProps {
  x: number;
  y: number;
  width: number;
  idx: number;
}

const UserObject = (props: IUserObjectProps) => {
  const { width, idx } = props;
  const UserImage = (x: any, y: any) => {
    const idxParse = Math.floor(idx % 10);
    const [image] = useImage(source[idxParse]);

    return <Image x={props.x} y={props.y} image={image} height={width} width={width} />;
  };
  return <UserImage />;
};

export default React.memo(UserObject);
