import { FC } from 'react';
import styles from './constructor-page.module.css';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';

type ConstructorPageProps = {
  isLoading?: boolean;
  ingredients?: any[];
  error?: string | null;
};

export const ConstructorPage: FC<ConstructorPageProps> = ({
  isLoading = false,
  ingredients = [],
  error = null
}) => {
  if (isLoading) {
    return (
      <main className={styles.containerMain}>
        <Preloader />
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.containerMain}>
        <div className='text text_type_main-medium pt-4' style={{ color: 'red' }}>
          {error}
        </div>
      </main>
    );
  }

  if (!ingredients || ingredients.length === 0) {
    return (
      <main className={styles.containerMain}>
        <div className='text text_type_main-medium pt-4'>
          Нет ингредиентов
        </div>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
