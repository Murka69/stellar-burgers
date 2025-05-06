import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getIngredientsWithSelector } from '../../slice/ingredientsSlice';
import styles from '../app/app.module.css';
import { IngredientDetailsUI } from '@ui';

type TProps = {
  isModal?: boolean;
};

export const IngredientDetails: FC<TProps> = ({ isModal = false }) => {
  const ingredients = useSelector(getIngredientsWithSelector);
  const { id } = useParams<{ id: string }>();

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <p>Ингредиент не найден</p>;
  }

  return (
    <div className={styles.detailPageWrap}>
      {!isModal && (
        <h1
          className='text text_type_main-large mb-6'
          style={{ textAlign: 'center' }}
        >
          Детали ингредиента
        </h1>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
