import { FC } from 'react';
import {
  registerUniformComponent,
  useUniformCurrentComposition,
  ComponentProps,
  UniformText,
} from '@uniformdev/canvas-react';
import BaseButton from '../components/Button';
import { formatProjectMapLink } from '../utilities';

export type Props = ComponentProps<{
  copy: string;
  link: Types.ProjectMapLink;
  style: Types.ButtonStyles;
  animationType?: Types.AnimationType;
}>;

const Button: FC<Props> = ({ link, style, animationType }) => {
  const { isContextualEditing } = useUniformCurrentComposition();
  return (
    <BaseButton
      href={formatProjectMapLink(link)}
      animationType={animationType}
      copy={
        <UniformText
          placeholder="buttonCopy goes here"
          parameterId="copy"
          onClick={isContextualEditing ? e => e.preventDefault() : undefined}
        />
      }
      style={style}
    />
  );
};

registerUniformComponent({
  type: 'button',
  component: Button,
});

export default Button;
