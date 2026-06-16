import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructor } from '../../services/slices/constructorSlice';
import { createOrder, selectOrder } from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { clearOrder } from '../../services/slices/orderSlice';
import { TConstructorIngredient } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItemsState = useSelector(selectConstructor);
  const user = useSelector(selectUser);
  const orderState = useSelector(selectOrder);

  // Защита от undefined
  const constructorItems = {
    bun: constructorItemsState?.bun || null,
    ingredients: constructorItemsState?.ingredients || []
  };

  const orderModalData = orderState?.order || null;
  const orderRequest = orderState?.isLoading || false;

  const onOrderClick = () => {
    // Проверяем наличие булки
    if (!constructorItems.bun) {
      alert('Выберите булку!');
      return;
    }
    
    // Проверяем наличие начинки
    if (constructorItems.ingredients.length === 0) {
      alert('Выберите начинку!');
      return;
    }
    
    // Проверяем авторизацию
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Формируем заказ
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    let total = 0;
    if (constructorItems.bun) {
      total += constructorItems.bun.price * 2;
    }
    if (constructorItems.ingredients && constructorItems.ingredients.length > 0) {
      total += constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      );
    }
    return total;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
