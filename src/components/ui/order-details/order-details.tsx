import React, { FC, memo } from 'react';
import styles from './order-details.module.css';
import { OrderDetailsUIProps } from './type';
import doneImage from '../../../images/done.svg';

export const OrderDetailsUI: FC<OrderDetailsUIProps> = memo(
  ({ orderNumber }) => (
    <>
      <h2
        className={`text text_type_digits-large mt-4 mb-8 ${styles.number}`}
        data-testid='order-number'
      >
        {orderNumber}
      </h2>
      <p className='text text_type_main-medium'>идентификатор заказа</p>
      <img
        className={`${styles.image} mt-15 mb-15`}
        src={doneImage}
        alt='заказ принят'
      />
      <p className='text text_type_main-default mb-1'>
        Ваш заказ начали готовить
      </p>
      <p className='text text_type_main-default text_color_inactive'>
        Дождитесь готовности на орбитальной станции
      </p>
    </>
  )
);
