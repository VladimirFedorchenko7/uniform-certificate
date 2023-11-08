import { FC, Fragment, ReactNode, useCallback } from 'react';
import { ComponentProps, UniformSlot, UniformText, UniformSlotWrapperComponentProps } from '@uniformdev/canvas-react';
import Masonry from 'react-responsive-masonry';
import classNames from 'classnames';
import { useComponentStarterKitContext } from '../context/ComponentStarterKitContext';
import BaseContainer, {
  Props as BaseContainerProps,
  ContainerVariants,
  ScreenContainer,
} from '../components/Container';
import AnimatedContainer, { AnimationVariant } from '../components/AnimatedContainer';
import { getTextClass } from '../utilities/styling';

export type BaseProductGalleryProps = ComponentProps<
  BaseContainerProps & {
    title?: string;
    titleStyle?: Types.HeadingStyles;
    description?: string;
    maxItems?: number;
    animationType?: Types.AnimationType;
    oneByOneAnimation?: boolean;
    duration?: Types.DurationType;
    useCustomRendering?: boolean;
    customItems?: ReactNode[];
  }
>;

type SlotWrapperComponentProps = Partial<Omit<UniformSlotWrapperComponentProps, 'slotName'>>;

const galleryConfig = {
  firstLineCount: 2,
  secondLineCount: 3,
  otherLinesCount: 4,
};

const BaseProductGallery: FC<BaseProductGalleryProps> = ({
  titleStyle: TitleTag = 'h1',
  maxItems,
  animationType,
  oneByOneAnimation = false,
  duration = 'medium',
  useCustomRendering,
  customItems,
  ...props
}) => {
  const { secondaryFont, isJavaDrip } = useComponentStarterKitContext();
  const variant = props.component?.variant;

  const isFluentContent = variant === ContainerVariants.FluentContent;

  const Wrapper = isFluentContent ? ScreenContainer : Fragment;

  const getDelay = useCallback((index: number) => index / 10, []);

  const GalleryInner = useCallback(
    ({ items }: SlotWrapperComponentProps) => {
      const imagesGroups = items?.reduce<ReactNode[][]>(
        (acc, item, index) => {
          if (maxItems && index >= maxItems) return acc;
          if (index < galleryConfig.firstLineCount) {
            const dynamicAnimationVariant = index ? AnimationVariant.FadeInLeft : AnimationVariant.FadeInRight;
            acc[0].push(
              animationType ? (
                <AnimatedContainer
                  animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : dynamicAnimationVariant}
                  duration={duration}
                  delay={oneByOneAnimation ? getDelay(index) : 0}
                >
                  {item}
                </AnimatedContainer>
              ) : (
                item
              )
            );
          } else if (index < galleryConfig.firstLineCount + galleryConfig.secondLineCount) {
            const dynamicAnimationVariant =
              (maxItems || items.length) < 6 ? AnimationVariant.FadeInBottom : AnimationVariant.FadeIn;
            acc[1].push(
              animationType ? (
                <AnimatedContainer
                  animationVariant={animationType === 'static' ? AnimationVariant.FadeIn : dynamicAnimationVariant}
                  duration={duration}
                  delay={oneByOneAnimation ? getDelay(index) : 0}
                >
                  {item}
                </AnimatedContainer>
              ) : (
                item
              )
            );
          } else {
            acc[2].push(
              animationType ? (
                <AnimatedContainer
                  animationVariant={AnimationVariant.FadeIn}
                  duration={duration}
                  delay={oneByOneAnimation ? getDelay(index) : 0}
                >
                  {item}
                </AnimatedContainer>
              ) : (
                item
              )
            );
          }
          return acc;
        },
        [[], [], []]
      );

      return (
        <div className="flex flex-col gap-6 mt-12">
          {imagesGroups?.map((images, lineIndex) =>
            images.length ? (
              <Masonry
                key={`line-${lineIndex}`}
                columnsCount={
                  lineIndex < 2 || images.length < galleryConfig.otherLinesCount
                    ? images.length
                    : galleryConfig.otherLinesCount
                }
                gutter="24px"
              >
                {images.map((img, ImageIndex) => (
                  <div key={`Img-${ImageIndex}`}>{img}</div>
                ))}
              </Masonry>
            ) : null
          )}
        </div>
      );
    },
    [animationType, duration, getDelay, maxItems, oneByOneAnimation]
  );

  return (
    <BaseContainer {...props} containerVariant={props?.component?.variant}>
      <Wrapper {...(isFluentContent ? { className: 'xl:px-0 px-4' } : {})}>
        <UniformText
          placeholder="Title goes here"
          parameterId="title"
          as={TitleTag}
          className={classNames('uppercase', getTextClass(TitleTag), secondaryFont?.className, {
            'tracking-[5.5px]': isJavaDrip,
          })}
        />
        <UniformText
          placeholder="Description goes here"
          parameterId="description"
          as="p"
          className={secondaryFont?.className}
        />
      </Wrapper>
      {useCustomRendering ? (
        <GalleryInner items={customItems} />
      ) : (
        <UniformSlot name="images" wrapperComponent={GalleryInner} />
      )}
    </BaseContainer>
  );
};

export default BaseProductGallery;
