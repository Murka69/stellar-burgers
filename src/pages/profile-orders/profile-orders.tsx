import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  ordersHistory,
  getUserOrdersLoading,
  getUserOrdersHistory
} from '../../slice/userOrderHistorySlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const isLoad = useSelector(getUserOrdersLoading);
  const orders: TOrder[] = useSelector(getUserOrdersHistory);

  useEffect(() => {
    dispatch(ordersHistory());
  }, [dispatch]);

  if (isLoad) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
