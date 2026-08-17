import { MdOutlineCancel } from 'react-icons/md';
import { BsCheck } from 'react-icons/bs';
import { Tooltip } from '@mui/material';
import { v4 as uuid } from 'uuid';

import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store';
import { falsifyThemeSettings } from '../../application/Redux/slices/ThemeSettingsSlice';
import {
  darkenCurrentMode,
  lightenCurrentMode,
} from '../../application/Redux/slices/CurrentModeSlice.js';
import { changeThemeColor } from '../../application/Redux/slices/CurrentColorSlice.js';
// import { themeColors } from '../assets/data/dummy.jsx';

const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'indigo-theme',
    color: '#1c64f2',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

const ThemeSettings = () => {
  // const { setColor, setMode, currentMode, currentColor, setThemeSettings } =
  //   useStateContext();

  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const currentColor = useAppSelector((state) => state.currentColor.color);

  const dispatch = useAppDispatch();

  return (
    // <div className="bg-half-transparent w-screen fixed nav-item top-0 right-0"> /it was bg-half-transparent, rupom changed it
    <div className="bg-transparent backdrop-blur-sm w-screen fixed nav-item top-0 right-0">
      <div className=" float-right h-screen dark:text-gray-200 bg-white dark:bg-[#484B52] w-400">
        <div className="flex justify-between items-center p-4 ml-4">
          <p className="font-semibold text-xl">Settings</p>
          <button
            type="button"
            aria-label="Settings"
            onClick={() => {
              // setThemeSettings(false)
              dispatch(falsifyThemeSettings());
            }}
            style={{ color: 'rgb(153, 171, 180)', borderRadius: '50%' }}
            className="text-2xl p-3 hover:drop-shadow-xl transform-all duration-300 hover:scale-105 hover:bg-light-gray"
          >
            <MdOutlineCancel />
          </button>
        </div>

        <div className="flex-col border-t-1 border-color p-4 ml-4">
          <p className="font-semibold text-lg">Theme Options</p>

          {/* <div className='mt-4'>
                        <input
                            type="radio"
                            id="default"
                            name="theme"
                            value="Default"
                            className="cursor-pointer"
                            onChange={setMode}
                            checked={currentMode === 'Default'}
                        />
                        <label htmlFor="default" className="ml-2 text-md cursor-pointer">
                            Default
                        </label>
                    </div> */}

          <div className="mt-4">
            <input
              type="radio"
              id="light"
              name="theme"
              value="Light"
              className="cursor-pointer hover:scale-105"
              onChange={() => {
                // setMode()
                dispatch(lightenCurrentMode());
                localStorage.setItem('themeMode', 'Light');
                // setThemeSettings(false);
                dispatch(falsifyThemeSettings());
              }}
              checked={currentMode === 'Light'}
            />
            <label htmlFor="light" className="ml-2 text-md cursor-pointer">
              Light
            </label>
          </div>

          <div className="mt-4">
            <input
              type="radio"
              id="dark"
              name="theme"
              value="Dark"
              className="cursor-pointer"
              onChange={() => {
                // setMode
                dispatch(darkenCurrentMode());
                localStorage.setItem('themeMode', 'dark');
                // setThemeSettings(false);
                dispatch(falsifyThemeSettings());
              }}
              checked={currentMode === 'Dark'}
            />
            <label htmlFor="dark" className="ml-2 text-md cursor-pointer">
              Dark
            </label>
          </div>
        </div>

        <div className="flex-col border-t-1 border-color p-4 ml-4">
          <p className="font-semibold text-lg">Theme Colors</p>
          <div className="flex gap-3">
            {themeColors.map((item: any) => (
              <Tooltip key={uuid()} title={item.name} placement="top">
                <div className="relative mt-2 cursor-pointer flex gap-5 items-center">
                  <button
                    type="button"
                    aria-label={item.color}
                    className="h-10  hover:scale-110 transform-all duration-300 hover:transition-all hover:shadow-3xl w-10 rounded-full cursor-pointer"
                    style={{ backgroundColor: item.color }}
                    onClick={() => {
                      console.log(item.color);
                      // setColor(item.color);
                      dispatch(changeThemeColor({ color: item.color }));
                      localStorage.setItem('colorMode', item.color);
                      // setThemeSettings(false);
                      dispatch(falsifyThemeSettings());
                    }}
                  >
                    <BsCheck
                      className={`ml-2 text-2xl text-white ${
                        item.color === currentColor ? 'block' : 'hidden'
                      }`}
                    />
                  </button>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
