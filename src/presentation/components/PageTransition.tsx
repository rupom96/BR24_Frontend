import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';
import { Routes, useLocation, type Location } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type PageTransitionProps = {
  children: ReactNode;
};

/** Freeze Routes on the keyed location so exit trees don't jump to the new page. */
function injectRoutesLocation(node: ReactNode, location: Location): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;

    if (child.type === Routes) {
      return cloneElement(
        child as ReactElement<{ location?: Location }>,
        { location }
      );
    }

    const nested = (child.props as { children?: ReactNode })?.children;
    if (nested != null) {
      return cloneElement(
        child as ReactElement<{ children?: ReactNode }>,
        {
          children: injectRoutesLocation(nested, location),
        }
      );
    }

    return child;
  });
}

/**
 * Soft route enter/exit. Routes must receive the same `location` as the
 * motion key — otherwise the old panel flashes the new page before exit.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const content = injectRoutesLocation(children, location);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="br24-page-transition"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.28, ease }
        }
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
