import { FC } from 'react';
import classNames from 'classnames';
import {
  registerUniformComponent,
  useUniformCurrentComposition,
  ComponentProps,
  UniformText,
} from '@uniformdev/canvas-react';
import Button from '../components/Button';
import { getTextClass } from '../utilities/styling';
import { formatProjectMapLink } from '../utilities';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';

export type Props = ComponentProps<{
  eyebrowText: string;
  title: string;
  titleStyle: Types.HeadingStyles;
  description: string;
  primaryButtonCopy: string;
  primaryButtonLink: Types.ProjectMapLink;
  primaryButtonStyle: Types.ButtonStyles;
  primaryButtonAnimationType?: Types.AnimationType;
  secondaryButtonCopy: string;
  secondaryButtonLink: Types.ProjectMapLink;
  secondaryButtonStyle: Types.ButtonStyles;
  secondaryButtonAnimationType?: Types.AnimationType;
  textColor?: Types.AvailableTextColor;
}>;

export enum CallToActionVariant {
  AlignLeft = 'alignLeft',
  AlignRight = 'alignRight',
  Featured = 'featured',
}

const getCallToActionContentClass = (variantId?: string) => {
  switch (variantId) {
    case CallToActionVariant.AlignLeft:
      return 'flex-col text-start items-start w-full';
    case CallToActionVariant.AlignRight:
      return 'flex-col text-end items-end w-full';
    case CallToActionVariant.Featured:
      return 'flex-col lg:flex-row  text-start items-center justify-between w-full';
    default:
      return 'flex-col text-center items-center w-full';
  }
};

const getCallToActionTextWrappersClass = (variantId?: string) => {
  switch (variantId) {
    case CallToActionVariant.Featured:
      return 'w-4/5';
    default:
      return '';
  }
};

const CallToAction: FC<Props> = ({
  titleStyle: TitleTag = 'h2',
  primaryButtonCopy,
  primaryButtonLink,
  primaryButtonStyle,
  primaryButtonAnimationType,
  secondaryButtonCopy,
  secondaryButtonLink,
  secondaryButtonStyle,
  secondaryButtonAnimationType,
  textColor,
  component: { variant } = {},
}) => {
  const { isContextualEditing } = useUniformCurrentComposition();
  const { secondaryFont } = useComponentStarterKitContext();

  const isLightTextColor = textColor === 'Light';
  const eyebrowTextColorStyle = isLightTextColor ? 'text-secondary' : 'text-primary';
  const textColorStyle = isLightTextColor ? 'text-primary-content' : 'text-secondary-content';

  return (
    <div
      className={classNames(
        'flex flex-wrap items-center justify-between w-full lg:flex-nowrap rounded-xl',
        secondaryFont?.className,
        textColorStyle
      )}
    >
      <div className={classNames('flex', getCallToActionContentClass(variant))}>
        <div className={getCallToActionTextWrappersClass(variant)}>
          <UniformText
            placeholder="Eyebrow text goes here"
            parameterId="eyebrowText"
            as="div"
            className={classNames(
              'text-sm font-bold tracking-wider uppercase text-primary my-3',
              eyebrowTextColorStyle
            )}
          />
          <UniformText
            placeholder="Title goes here"
            parameterId="title"
            as={TitleTag}
            className={classNames('font-medium', getTextClass(TitleTag))}
          />
          <UniformText placeholder="Description goes here" parameterId="description" as="p" className="py-6 text-xl" />
        </div>
        <div className="flex justify-between">
          {Boolean(primaryButtonLink && primaryButtonCopy) && (
            <Button
              href={formatProjectMapLink(primaryButtonLink)}
              animationType={primaryButtonAnimationType}
              copy={
                <UniformText
                  placeholder="Description goes here"
                  parameterId="primaryButtonCopy"
                  onClick={isContextualEditing ? e => e.preventDefault() : undefined}
                />
              }
              style={primaryButtonStyle}
            />
          )}
          {Boolean(secondaryButtonCopy && secondaryButtonLink) && (
            <Button
              href={formatProjectMapLink(secondaryButtonLink)}
              animationType={secondaryButtonAnimationType}
              copy={
                <UniformText
                  placeholder="Description goes here"
                  parameterId="secondaryButtonCopy"
                  onClick={isContextualEditing ? e => e.preventDefault() : undefined}
                />
              }
              style={secondaryButtonStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

[
  undefined,
  CallToActionVariant.AlignLeft,
  CallToActionVariant.AlignLeft,
  CallToActionVariant.AlignRight,
  CallToActionVariant.Featured,
].forEach(variantId => {
  registerUniformComponent({
    type: 'callToAction',
    component: CallToAction,
    variantId,
  });
});

export default CallToAction;
