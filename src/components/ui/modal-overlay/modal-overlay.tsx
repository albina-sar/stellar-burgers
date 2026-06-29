import { FC, memo } from 'react';
import styles from './modal-overlay.module.css';
import { TModalOverlayUIProps } from './type';

export const ModalOverlayUI: FC<TModalOverlayUIProps> = memo(
  ({ onClick, ...props }) => (
    <div
      className={styles.overlay}
      onClick={onClick}
      data-testid='modal-overlay'
      {...props}
    />
  )
);
