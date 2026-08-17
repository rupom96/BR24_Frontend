import { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { Tooltip } from '@mui/material';
import avatar from '../assets/data/avatar.jpg';
import Cart from './Cart';
import Chat from './Chat';
import Notification from './Notification';
import UserProfile from './UserProfile';

import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store';
import { changeScreenSize } from '../../application/Redux/slices/ScreenSizeSlice';
import {
  falsifyActiveMenu,
  toggleActiveMenu,
  truthifyActiveMenu,
} from '../../application/Redux/slices/ActiveMenuSlice';
import { toggleACertainFeatureClick } from '../../application/Redux/slices/IsClickedSlice';

interface NavButtonProps {
  title?: string;
  customFunc?: () => void; // Custom function, optional
  icon?: React.ReactNode; // Material-UI icon component
  color?: string;
  dotColor?: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
}) => (
  <Tooltip title={title} placement="bottom" arrow>
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray hover:scale-110 transform-gpu focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-2 active:shadow-lg tranform-all duration-300"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </Tooltip>
);

const Navbar = () => {
  // const {
  //   activeMenu,
  //   setActiveMenu,
  //   isClicked,
  //   setIsClicked,
  //   handleClick,
  //   screenSize,
  //   setScreenSize,
  //   currentColor,
  // } = useStateContext();

  // const activeMenu = useAppSelector((state) => state.activeMenu.active);
  // const showPanel = useAppSelector((state) => state.showPanel.bool);
  // const showNavbar = useAppSelector((state) => state.showNavbar.bool);
  // const currentMode = useAppSelector((state) => state.currentMode.mode);
  // const themeSettings = useAppSelector((state) => state.themeSettings.bool);
  const screenSize = useAppSelector((state) => state.screenSize.size);
  const isClicked = useAppSelector((state) => state.isClicked);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();

  let userInfo;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  useEffect(() => {
    const handleResize = () => {
      dispatch(changeScreenSize({ size: window.innerWidth }));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize && screenSize <= 900) {
      // setActiveMenu(false);
      dispatch(falsifyActiveMenu());
    } else {
      // setActiveMenu(true);
      dispatch(truthifyActiveMenu());
    }
  }, [screenSize]);

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={() => {
          // setActiveMenu((prevActiveMenu) => !prevActiveMenu)
          dispatch(toggleActiveMenu());
        }}
        color={currentColor}
        dotColor=""
        icon={<AiOutlineMenu />}
      />

      <div className="flex">
        {/* <NavButton
          title="Cart"
          customFunc={() => {
            // handleClick('cart')
            dispatch(toggleACertainFeatureClick({ propertyName: 'cart' }));
          }}
          color={currentColor}
          dotColor=""
          icon={<FiShoppingCart />}
        />
        <NavButton
          title="Chat"
          dotColor="#03C9D7"
          customFunc={() => {
            // handleClick('chat')
            dispatch(toggleACertainFeatureClick({ propertyName: 'chat' }));
          }}
          color={currentColor}
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notification"
          dotColor="#03C9D7"
          customFunc={() => {
            // handleClick('notification')
            dispatch(
              toggleACertainFeatureClick({ propertyName: 'notification' })
            );
          }}
          color={currentColor}
          icon={<RiNotification3Line />}
        /> */}

        <div className="flex justify-center items-center mx-6">
          <div>
            <p className="text-[10px] text-stone-600">Verison: 2.2.3.5</p>
            <p className="text-[10px] text-stone-600">Date: 26 May, 2025</p>
          </div>
        </div>

        <Tooltip
          title="Profile"
          placement="bottom"
          // style={{ zIndex: 9999 }}
          arrow
        >
          <div
            className="flex items-center gap-2 cursor-pointer p-1 focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-1 active:shadow-lg hover:bg-light-gray hover:scale-105 transform-gpu tranform-all duration-300 rounded-lg"
            role="button"
            tabIndex={0}
            onKeyDown={() => {
              // handleClick('userProfile');
              dispatch(
                toggleACertainFeatureClick({ propertyName: 'userProfile' })
              );
            }}
            onClick={() => {
              // handleClick('userProfile');
              dispatch(
                toggleACertainFeatureClick({ propertyName: 'userProfile' })
              );
            }}
          >
            <img
              alt="userProfilePic"
              className="rounded-full w-8 h-8"
              src={avatar}
            />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>

              <span className="text-gray-400 font-bold ml-1 text-14">
                {userInfo?.userName ? userInfo.userName : 'Anonymous'}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </Tooltip>

        {isClicked.cart && <Cart />}
        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
