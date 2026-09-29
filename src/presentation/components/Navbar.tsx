import { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
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
import {
  APP_BUILD_STAMP,
  APP_VERSION,
} from '../constants/buildInfo';

interface NavButtonProps {
  title?: string;
  customFunc?: () => void;
  icon?: React.ReactNode;
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
      className="br24-nav-icon-btn relative rounded-xl p-2.5 text-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--br24-accent)_35%,transparent)] active:scale-95"
    >
      <span
        style={{ background: dotColor }}
        className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full"
      />
      {icon}
    </button>
  </Tooltip>
);

const Navbar = () => {
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
  }, [dispatch]);

  useEffect(() => {
    if (screenSize && screenSize <= 900) {
      dispatch(falsifyActiveMenu());
    } else {
      dispatch(truthifyActiveMenu());
    }
  }, [screenSize, dispatch]);

  return (
    <div className="br24-shell-navbar br24-anim-fade-in relative flex justify-between px-3 py-2 md:mx-4 md:mt-2 md:rounded-2xl">
      <NavButton
        title="Menu"
        customFunc={() => {
          dispatch(toggleActiveMenu());
        }}
        color={currentColor}
        dotColor=""
        icon={<AiOutlineMenu />}
      />

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-[0.625rem] font-medium uppercase tracking-wider text-slate-400">
            Version {APP_VERSION}
          </p>
          <p className="text-[0.625rem] text-slate-400">{APP_BUILD_STAMP}</p>
        </div>

        <Tooltip title="Profile" placement="bottom" arrow>
          <div
            className="br24-nav-icon-btn flex cursor-pointer items-center gap-2 rounded-xl p-1.5 transition-all duration-300 hover:scale-[1.02] focus:outline-none active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={() => {
              dispatch(
                toggleACertainFeatureClick({ propertyName: 'userProfile' })
              );
            }}
            onClick={() => {
              dispatch(
                toggleACertainFeatureClick({ propertyName: 'userProfile' })
              );
            }}
          >
            <img
              alt="userProfilePic"
              className="h-8 w-8 rounded-full shadow-md ring-2 ring-white/70 dark:ring-slate-600/80"
              src={avatar}
            />
            <p className="hidden md:block">
              <span className="text-14 text-slate-400">Hi, </span>
              <span className="ml-1 text-14 font-semibold text-slate-700 dark:text-slate-100">
                {userInfo?.userName ? userInfo.userName : 'Anonymous'}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-14 text-slate-400" />
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
