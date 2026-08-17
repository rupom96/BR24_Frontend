import {
  IIsClicked,
  setAllFeatureIsClicked,
} from '../../application/Redux/slices/IsClickedSlice';
import { useAppDispatch } from '../../application/Redux/store/store';

interface ButtonProps {
  icon?: React.ReactNode;
  bgColor?: string;
  color?: string;
  bgHoverColor?: string;
  size?: string;
  text?: string;
  borderRadius?: string;
  width?: string;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  bgColor,
  color,
  bgHoverColor,
  size,
  text,
  borderRadius,
  width,
}) => {
  // const { setIsClicked, initialState } = useStateContext();

  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      onClick={() => {
        // setIsClicked(initialState);
        const initialState: IIsClicked = {
          chat: false,
          cart: false,
          userProfile: false,
          notification: false,
        };
        dispatch(setAllFeatureIsClicked({ obj: initialState }));
      }}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={`transform-all duration-300 hover:scale-105 transform-gpu focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-1 active:shadow-lg text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
