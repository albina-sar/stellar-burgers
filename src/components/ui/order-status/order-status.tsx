import React, { FC } from 'react';
import { OrderStatusUIProps } from './type';

export const OrderStatusUI: FC<OrderStatusUIProps> = ({ textStyle, text }) => (
  <span
    className='pt-2'
    style={{
      color: textStyle,
      textAlign: 'left',
      display: 'block',
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px'
    }}
  >
    {text}
  </span>
);
