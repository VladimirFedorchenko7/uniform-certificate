import { FC, useCallback } from 'react';
import { registerUniformComponent, ComponentProps } from '@uniformdev/canvas-react';
import BaseAddToCart from '../components/BaseAddToCart';

export type Props = ComponentProps<{
  buttonCopy?: string;
  buttonStyle: Types.ButtonStyles;
  buttonAnimationType?: Types.AnimationType;
}>;

const AddToCart: FC<Props> = ({ buttonStyle, buttonCopy, buttonAnimationType }) => {
  const handleButtonClick = useCallback((quantity: number) => {
    window.alert(`This is add to cart event placeholder. quantity: ${quantity}.`);
  }, []);

  return (
    <BaseAddToCart
      animationType={buttonAnimationType}
      buttonStyle={buttonStyle}
      buttonCopy={buttonCopy}
      onClick={handleButtonClick}
    />
  );
};

registerUniformComponent({
  type: 'addToCart',
  component: AddToCart,
});

export default AddToCart;
