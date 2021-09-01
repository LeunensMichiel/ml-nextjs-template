import {
  createPopper,
  Options,
  Placement,
  PositioningStrategy,
} from '@popperjs/core';
import cn from 'classnames';
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Modifier, usePopper } from 'react-popper';

import s from './Tooltip.module.scss';

type Props = {
  text: string;
  children: ReactNode;
  placement?: Placement;
  strategy?: PositioningStrategy;
};

const Tooltip: FC<Props> = ({ text, placement, strategy, children }) => {
  const popperRef = useRef(null);
  const tooltipRef = useRef(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const popperOptions: Omit<Partial<Options>, 'modifiers'> & {
    createPopper?: typeof createPopper;
    modifiers?: ReadonlyArray<Modifier<unknown>>;
  } = useMemo(
    () => ({
      placement: placement ?? 'auto',
      strategy: strategy ?? 'absolute',
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrowRef,
            padding: 8,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    }),
    [arrowRef, placement, strategy]
  );

  const { styles, attributes } = usePopper(
    tooltipRef.current,
    popperRef.current,
    popperOptions
  );

  return (
    <>
      {Children.map(
        children,
        (child) =>
          isValidElement(child) &&
          cloneElement(child, {
            onFocus: () => setIsVisible(true),
            onBlur: () => setIsVisible(false),
            onMouseEnter: () => setIsVisible(true),
            onMouseLeave: () => setIsVisible(false),
            ref: tooltipRef,
            tabIndex: 0,
          })
      )}
      {isVisible && (
        <div
          tabIndex={-1}
          aria-expanded={isVisible}
          ref={popperRef}
          style={styles.popper}
          className={cn(s.tooltip)}
          {...attributes.popper}
        >
          <div ref={setArrowRef} style={styles.arrow} className={cn(s.arrow)} />
          <p>{text}</p>
        </div>
      )}
    </>
  );
};
export default Tooltip;
