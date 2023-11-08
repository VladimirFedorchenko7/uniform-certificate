import { registerUniformComponent } from '@uniformdev/canvas-react';
import { ContainerVariants } from '../components/Container';
import BaseProductGallery, { type BaseProductGalleryProps } from '../components/BaseProductGallery';
import { withoutContainer } from '../hocs/withoutContainer';

export type Props = BaseProductGalleryProps;

[undefined, ContainerVariants.BackgroundInContainer, ContainerVariants.FluentContent].forEach(variantId => {
  registerUniformComponent({
    type: 'productGallery',
    component: withoutContainer(BaseProductGallery),
    variantId,
  });
});

export default BaseProductGallery;
