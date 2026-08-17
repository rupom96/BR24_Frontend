/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

import {
  Autocomplete,
  Box,
  // Button,
  Modal,
  TextField,
  Tooltip,
} from '@mui/material';
import { BsCurrencyDollar, BsShield } from 'react-icons/bs';
import { FiCreditCard } from 'react-icons/fi';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import avatar from '../assets/data/avatar.jpg';
import Button from './Button';
import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store.js';
import {
  IIsClicked,
  setAllFeatureIsClicked,
} from '../../application/Redux/slices/IsClickedSlice.js';
import { ILocationDto } from '../../domain/interfaces/UserInfoInterface.js';

const API_BASE_URL = window.API_BASE_URL;

// import { userProfileData } from '../assets/data/dummy.jsx';
// export const userProfileData = [
//   {
//     icon: <BsCurrencyDollar />,
//     title: 'My Profile',
//     desc: 'Account Settings',
//     iconColor: '#03C9D7',
//     iconBg: '#E5FAFB',
//   },
//   {
//     icon: <BsShield />,
//     title: 'My Inbox',
//     desc: 'Messages & Emails',
//     iconColor: 'rgb(0, 194, 146)',
//     iconBg: 'rgb(235, 250, 242)',
//   },
//   {
//     icon: <FiCreditCard />,
//     title: 'My Tasks',
//     desc: 'To-do and Daily Tasks',
//     iconColor: 'rgb(255, 244, 229)',
//     iconBg: 'rgb(254, 201, 15)',
//   },
//   {
//     icon: <BsShield />,
//     title: 'Change Location',
//     desc: `Current Location: ${userSession.locationName}`,
//     iconColor: 'rgb(0, 194, 146)',
//     iconBg: 'rgb(235, 250, 242)',
//   },
// ];

const UserProfile = () => {
  //   const { currentColor } = useStateContext();
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //   const { setIsClicked, initialState } = useStateContext();
  const tempUserSession = localStorage.getItem('userInfo');
  const userSession = tempUserSession ? JSON.parse(tempUserSession) : '';
  const {
    register,
    getValues,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   bank: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });

  const logoutBtn = () => {
    const initialState: IIsClicked = {
      chat: false,
      cart: false,
      userProfile: false,
      notification: false,
    };

    // setIsClicked(initialState);
    dispatch(setAllFeatureIsClicked({ obj: initialState }));

    if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('brFeature');
    }
    navigate('/');
  };

  interface ILoginCompany {
    securityUserId: number;
    companyId: number;
    companyName: string;
  }

  let userInfo: any;
  const jsonUserInfoTemp = localStorage.getItem('userInfo');
  if (jsonUserInfoTemp) {
    userInfo = JSON.parse(jsonUserInfoTemp);
  }

  const defaultCompany: ILoginCompany = {
    securityUserId: userInfo?.securityUserId || 0,
    companyId: userInfo?.companyId || 0,
    companyName: userInfo?.companyName || '',
  };
  const defaultLocation: ILocationDto = {
    locationId: userInfo?.locationId || 0,
    locationName: userInfo?.locationName || '',
  };

  const [loginCompanyOptionsComboBox, setLoginCompanyOptionsComboBox] =
    useState<ILoginCompany[]>([]);
  const [loginCompanyOutput, setLoginCompanyOutput] =
    useState<ILoginCompany | null>(defaultCompany);

  const [loginLocationOptionsComboBox, setLoginLocationOptionsComboBox] =
    useState<ILocationDto[]>([]);
  const [loginLocationOutput, setLoginLocationOutput] =
    useState<ILocationDto | null>(defaultLocation);

  const [showCompanyLocationDiv, setShowCompanyLocationDiv] =
    useState<boolean>(false);

  // 1st ei logged in user er company gula anlam, then logged in user j company te already logged in shei companyr location gula analam
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Login/getCompanyByUserNamePassword`, {
        params: {
          userName: userInfo?.userName,
          password: userInfo?.encryptedPassword,
        },
        headers: {
          Authorization: `Bearer ${userInfo?.userToken || ''}`,
        },
      })
      .then((response: any) => {
        // Handle success
        setLoginCompanyOptionsComboBox(response.data);
        // corresponding location option gula anlam
        axios
          .get(`${API_BASE_URL}/Login/getLocationByUserNamePasswordCompanyId`, {
            params: {
              userName: userInfo?.userName,
              password: userInfo?.encryptedPassword,
              companyId: userInfo?.companyId,
            },
            headers: {
              Authorization: `Bearer ${userInfo?.userToken || ''}`,
            },
          })
          .then((response2: any) => {
            // Handle success
            setLoginLocationOptionsComboBox(response2.data);
          })
          .catch((error: any) => {
            // Handle error
            toast.error(
              'Error fetching login probable location options in user profile tab data:',
              error
            );
          });
      })
      .catch((error: any) => {
        // Handle error
        toast.error(
          'Error fetching login probable company options in user profile tab data:',
          error
        );
      });
  }, []);

  // useEffect(() => {
  //   setLoginLocationOptionsComboBox([]);
  //   axios
  //     .get(`${API_BASE_URL}/Login/getLocationByUserNamePasswordCompanyId`, {
  //       params: {
  //         userName: userInfo?.userName,
  //         password: userInfo?.encryptedPassword,
  //         companyId: loginCompanyOutput?.companyId,
  //       },
  //     })
  //     .then((response2: any) => {
  //       // Handle success
  //       setLoginLocationOutput(null);
  //       setLoginLocationOptionsComboBox(response2.data);
  //     })
  //     .catch((error: any) => {
  //       // Handle error
  //       toast.error(
  //         'Error fetching login probable location options in user profile tab data:',
  //         error
  //       );
  //     });
  // }, [loginCompanyOutput?.companyId]);

  const changeSessionInfosFunct = (
    selectedCompany: ILoginCompany | null,
    selectedLocation: ILocationDto | null
  ) => {
    if (!selectedCompany) {
      toast.error('Select a company to change current company');
      return;
    }

    if (!selectedLocation) {
      toast.error('Select a location to change current location');
      return;
    }

    if (userInfo.securityUserId && selectedCompany && selectedLocation) {
      userInfo.securityUserId = selectedCompany?.securityUserId;
      userInfo.companyId = selectedCompany.companyId;
      userInfo.companyName = selectedCompany.companyName;
      userInfo.locationId = selectedLocation.locationId;
      userInfo.locationName = selectedLocation.locationName;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      window.location.reload();
    }
  };

  const userProfileData = [
    {
      icon: <BsCurrencyDollar />,
      title: 'My Profile',
      desc: 'Account Settings',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
    },
    // {
    //   icon: <BsShield />,
    //   title: 'My Inbox',
    //   desc: 'Messages & Emails',
    //   iconColor: 'rgb(0, 194, 146)',
    //   iconBg: 'rgb(235, 250, 242)',
    // },
    // {
    //   icon: <FiCreditCard />,
    //   title: 'My Tasks',
    //   desc: 'To-do and Daily Tasks',
    //   iconColor: 'rgb(255, 244, 229)',
    //   iconBg: 'rgb(254, 201, 15)',
    // },
  ];

  // useEffect(() => {
  //   let userInfo: any;
  //   const jsonUserInfoTemp = localStorage.getItem('userInfo');
  //   if (jsonUserInfoTemp) {
  //     userInfo = JSON.parse(jsonUserInfoTemp);
  //   }
  //   if (!userInfo?.securityUserId) {
  //     userInfo.locationId = selectedOption.locationId;
  //     userInfo.locationName = selectedOption.locationName;
  //     localStorage.setItem('userInfo', JSON.stringify(userInfo));
  //     window.location.reload();
  //   }
  // }, []);

  return (
    <div className="nav-item absolute right-1 top-16 bg-transparent border backdrop-blur dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {' '}
            {userSession?.userName ? userSession.userName : 'Not Found'}{' '}
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {' '}
              Company:{' '}
              {userSession?.companyName
                ? userSession.companyName
                : 'Not Found'}{' '}
            </p>
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {' '}
            Location:{' '}
            {userSession?.locationName
              ? userSession.locationName
              : 'Not Found'}{' '}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {' '}
            {userSession?.emailAddress ? userSession.emailAddress : 'Not Found'}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item: any) => (
          <div
            key={uuidv4()}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {' '}
                {item.desc}{' '}
              </p>
            </div>
          </div>
        ))}

        {/* {
      icon: <BsShield />,
      title: 'Change Location',
      desc: `Current Location: ${userSession.locationName}`,
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      reactComponentExtra1: (
        <Autocomplete
          // clearOnEscape
          size="small"
          options={loginCompanyOptionsComboBox ?? []}
          value={loginCompanyOutput || null}
          // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
          getOptionLabel={(option) =>
            option?.companyName ? option.companyName : ''
          }
          onChange={(e, selectedOption) => {
            if (selectedOption) {
              setLoginCompanyOutput(selectedOption);
              // then option append for location and khali the selected location
            }
          }}
          renderInput={(params) => (
            <TextField
              sx={{ width: '100%', marginTop: 1 }}
              {...params}
              // {...register('location')}
              InputProps={{
                ...params.InputProps,
                style: { fontSize: 13 },
              }}
              InputLabelProps={{
                ...params.InputLabelProps,
                style: { fontSize: 14 },
              }}
              label="Location"
              variant="outlined"
            />
          )}
        />
      ),
      reactComponentExtra2: (
        <Autocomplete
          // clearOnEscape
          size="small"
          options={loginLocationOptionsComboBox || []}
          value={loginLocationOutput || null}
          // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
          getOptionLabel={(option) =>
            option?.locationName ? option.locationName : ''
          }
          onChange={(e, selectedOption) => {
            if (selectedOption) {
              setLoginLocationOutput(selectedOption);
            }
          }}
          renderInput={(params) => (
            <TextField
              sx={{ width: '100%', marginTop: 1 }}
              {...params}
              // {...register('location')}
              InputProps={{
                ...params.InputProps,
                style: { fontSize: 13 },
              }}
              InputLabelProps={{
                ...params.InputLabelProps,
                style: { fontSize: 14 },
              }}
              label="Location"
              variant="outlined"
            />
          )}
        />
      ),
    }, */}

        <div
          key={uuidv4()}
          className=" border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
        >
          <div
            className="flex gap-5"
            onClick={() => {
              setShowCompanyLocationDiv((prev) => !prev);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowCompanyLocationDiv((prev) => !prev);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div
              // type="button"

              style={{
                color: 'rgb(0, 194, 146)',
                backgroundColor: 'rgb(235, 250, 242)',
              }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray flex items-center"
            >
              <BsShield />
            </div>

            <div>
              <p className="font-semibold dark:text-gray-200 ">
                Change Company & Location
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {' '}
                Current company: {userSession.companyName}{' '}
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {' '}
                Current Location: {userSession.locationName}{' '}
              </p>
            </div>
          </div>
          <div
            className={showCompanyLocationDiv ? `block mt-2` : `hidden mt-2`}
          >
            <div className="mt-3">
              <Autocomplete
                // clearOnEscape
                size="small"
                options={loginCompanyOptionsComboBox ?? []}
                value={loginCompanyOutput || null}
                // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                getOptionLabel={(option) =>
                  option?.companyName ? option.companyName : ''
                }
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    setLoginCompanyOutput(selectedOption);
                    // then option append for location and khali the selected location
                    setLoginLocationOptionsComboBox([]);
                    axios
                      .get(
                        `${API_BASE_URL}/Login/getLocationByUserNamePasswordCompanyId`,
                        {
                          params: {
                            userName: userInfo?.userName,
                            password: userInfo?.encryptedPassword,
                            companyId: selectedOption?.companyId,
                          },
                          headers: {
                            Authorization: `Bearer ${
                              userInfo?.userToken || ''
                            }`,
                          },
                        }
                      )
                      .then((response2: any) => {
                        // Handle success
                        setLoginLocationOutput(null);
                        setLoginLocationOptionsComboBox(response2.data);
                      })
                      .catch((error: any) => {
                        // Handle error
                        toast.error(
                          'Error fetching login probable location options in user profile tab data:',
                          error
                        );
                      });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    sx={{ width: '100%', marginTop: 1 }}
                    {...params}
                    // {...register('location')}
                    InputProps={{
                      ...params.InputProps,
                      style: { fontSize: 13 },
                    }}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      style: { fontSize: 14 },
                    }}
                    label="Company"
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="mt-3 grid grid-cols-12 gap-1">
              <div className="col-span-10">
                <Autocomplete
                  // clearOnEscape
                  size="small"
                  options={loginLocationOptionsComboBox || []}
                  value={loginLocationOutput || null}
                  // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                  getOptionLabel={(option) =>
                    option?.locationName ? option.locationName : ''
                  }
                  onChange={(e, selectedOption) => {
                    if (selectedOption) {
                      setLoginLocationOutput(selectedOption);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '100%', marginTop: 1 }}
                      {...params}
                      // {...register('location')}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                      }}
                      InputLabelProps={{
                        ...params.InputLabelProps,
                        style: { fontSize: 14 },
                      }}
                      label="Location"
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    changeSessionInfosFunct(
                      loginCompanyOutput,
                      loginLocationOutput
                    );
                  }}
                  className="transform-all bg-transparent border rounded-md duration-300 hover:scale-105 transform-gpu focus:shadow-lg focus:outline-none hover:bg-slate-900 hover:text-white focus:ring-0 active:-translate-y-1 active:shadow-lg p-1 w-full hover:drop-shadow-xl"
                >
                  <i className="fas fa-save" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button
          type="button"
          onClick={() => logoutBtn()}
          style={{
            backgroundColor: currentColor,
            color: 'white',
            borderRadius: '10px',
          }}
          className="transform-all duration-300 hover:scale-105 transform-gpu focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-1 active:shadow-lg p-3 w-full hover:drop-shadow-xl"
        >
          Logout
        </button>
      </div>

      {/* // modals -----start----- out of html normal body/position */}

      {/* Making a loader modal */}
      <Modal
        open={false}
        // onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000000000,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '95vw', // Set the width of the modal to full screen
            height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'rgba(251, 255, 255, 0)',
            overflow: 'hidden',
          }}
          className="voucherGenModal"
        >
          <div className="flex justify-center ">
            <div className="mt-[350px] bg-transparent">
              <div className="mt-10 ml-[-50px] px-3 text-left text-white bg-slate-700 rounded-full">
                Please Wait a bit...
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {/* // modals -----end----- out of html normal body/position */}
    </div>
  );
};

export default UserProfile;
