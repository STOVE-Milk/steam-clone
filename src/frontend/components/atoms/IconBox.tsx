import React from 'react';
import Image from 'next/image';

export interface IconBoxProps {
  src: string;
}

export default function IconBox(props: IconBoxProps) {
  return <Image src={props.src} width={50} height={50}></Image>;
}
