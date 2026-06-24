import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  selectIngredientsLoading,
  selectIngredients,
  selectIngredientsError
} from '../../services/slices/ingredientsSlice';
import { getUser } from '../../services/slices/userSlice';
import { useEffect } from 'react';
import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  // Функция для получения номера заказа из URL
  const getOrderNumberFromPath = () => {
    const path = location.pathname;
    const match = path.match(/\/(\d+)$/);
    return match ? match[1] : '';
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route
          path='/'
          element={
            <ConstructorPage
              isLoading={isIngredientsLoading}
              ingredients={ingredients}
              error={error}
            />
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${getOrderNumberFromPath().padStart(6, '0')}`}
                onClose={handleModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${getOrderNumberFromPath().padStart(6, '0')}`}
                  onClose={handleModalClose}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
