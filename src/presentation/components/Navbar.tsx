import { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';

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
} from '../../application/Redux/slices/ActiveMenuSlice';
import { toggleACertainFeatureClick } from '../../application/Redux/slices/IsClickedSlice';
import { APP_BUILD_STAMP, APP_VERSION } from '../constants/buildInfo';

const Navbar = () => {
  const screenSize = useAppSelector((state) => state.screenSize.size);
  const isClicked = useAppSelector((state) => state.isClicked);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const sidebarMode = useAppSelector((state) => state.activeMenu.mode);
  const dispatch = useAppDispatch();

  let userInfo;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const menuTip =
    sidebarMode === 'full'
      ? 'Sidebar: icon rail'
      : sidebarMode === 'rail'
        ? 'Sidebar: hide'
        : 'Sidebar: full';

  useEffect(() => {
    const handleResize = () => {
      dispatch(changeScreenSize({ size: window.innerWidth }));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    // Mobile: force hide. Desktop: leave mode alone (full / rail / hidden cycle).
    if (screenSize && screenSize <= 900) {
      dispatch(falsifyActiveMenu());
    }
  }, [screenSize, dispatch]);

  return (
    <div className="br24-shell-navbar br24-shell-navbar--micro br24-anim-fade-in relative flex items-center justify-between gap-2 px-2 md:mx-3 md:mt-1.5 md:rounded-xl">
      <Tooltip title={menuTip} placement="bottom" arrow>
        <button
          type="button"
          aria-label={menuTip}
          onClick={() => dispatch(toggleActiveMenu())}
          style={{ color: currentColor }}
          className="br24-nav-icon-btn relative shrink-0 rounded-lg p-1.5 text-base transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--br24-accent)_35%,transparent)] active:scale-95"
        >
          <AiOutlineMenu />
        </button>
      </Tooltip>

      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className="br24-navbar-build min-w-0 max-w-[11rem] text-right leading-tight sm:max-w-[14rem]"
          title={`Version ${APP_VERSION} · ${APP_BUILD_STAMP}`}
        >
          <p className="truncate text-[0.65rem] font-semibold tracking-wide text-slate-600 dark:text-slate-300">
            Version {APP_VERSION}
          </p>
          <p className="truncate text-[0.58rem] text-slate-500 dark:text-slate-400">
            {APP_BUILD_STAMP}
          </p>
        </div>

        <Tooltip title="Profile" placement="bottom" arrow>
          <div
            className="br24-nav-profile-btn br24-nav-icon-btn flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-0.5 transition-all duration-200 hover:scale-[1.02] focus:outline-none active:scale-95"
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
              className="br24-nav-profile-avatar h-5 w-5 rounded-full shadow-sm ring-1 ring-white/70 dark:ring-slate-600/80"
              src={avatar}
            />
            <span className="br24-nav-profile-name max-w-[6.5rem] truncate text-[0.7rem] font-semibold leading-none text-slate-700 dark:text-slate-100">
              {userInfo?.userName ? userInfo.userName : 'Anonymous'}
            </span>
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
