import { FC, useMemo } from 'react';
import { ComponentProps, registerUniformComponent } from '@uniformdev/canvas-react';
import BaseProductGallery, { BaseProductGalleryProps } from '../components/BaseProductGallery';
import { Props as BaseContainerProps, ContainerVariants } from '../components/Container';
import { withoutContainer } from '../hocs/withoutContainer';
import { getMediaUrl } from '../utilities';
import Image from './Image';

export type Props = ComponentProps<
  BaseContainerProps &
    BaseProductGalleryProps & {
      items: Types.UniformImage[];
    }
>;

const ProductGalleryDAM: FC<Props> = ({ items = [], ...props }) => {
  const imagesToDisplay = useMemo(
    () =>
      (items || []).map((image: Types.UniformImage, index) => (
        <Image
          key={image?.id}
          width={10000}
          height={10000}
          alt={`Product Image ${index}`}
          src={getMediaUrl(image?.url)}
          component={props?.component}
        />
      )),
    [items, props?.component]
  );

  return <BaseProductGallery {...props} useCustomRendering customItems={imagesToDisplay} />;
};

[undefined, ContainerVariants.BackgroundInContainer, ContainerVariants.FluentContent].forEach(variantId => {
  registerUniformComponent({
    type: 'productGalleryDAM',
    component: withoutContainer(ProductGalleryDAM),
    variantId,
  });
});

export default ProductGalleryDAM;
