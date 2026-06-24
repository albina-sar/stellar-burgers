import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} pathname={location.pathname} />;
};
