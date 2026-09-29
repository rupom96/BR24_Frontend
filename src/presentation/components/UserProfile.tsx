/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Autocomplete, TextField } from '@mui/material';
import { BsShield } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';
import avatar from '../assets/data/avatar.jpg';
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

const UserProfile = () => {
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tempUserSession = localStorage.getItem('userInfo');
  const userSession = tempUserSession ? JSON.parse(tempUserSession) : '';

  const closeProfile = () => {
    const initialState: IIsClicked = {
      chat: false,
      cart: false,
      userProfile: false,
      notification: false,
    };
    dispatch(setAllFeatureIsClicked({ obj: initialState }));
  };

  const logoutBtn = () => {
    closeProfile();

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
        setLoginCompanyOptionsComboBox(response.data);
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
            setLoginLocationOptionsComboBox(response2.data);
          })
          .catch((error: any) => {
            toast.error(
              'Error fetching login probable location options in user profile tab data:',
              error
            );
          });
      })
      .catch((error: any) => {
        toast.error(
          'Error fetching login probable company options in user profile tab data:',
          error
        );
      });
  }, []);

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

  const panel = (
    <>
      <button
        type="button"
        className="br24-profile-backdrop"
        aria-label="Close profile"
        onClick={closeProfile}
      />
      <div
        className="br24-profile-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="br24-user-profile-title"
      >
        <div className="flex items-start justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-600/60">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-teal-700/80 dark:text-teal-300/90">
              Account
            </p>
            <h2
              id="br24-user-profile-title"
              className="mt-0.5 text-lg font-semibold text-slate-800 dark:text-slate-100"
            >
              User Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={closeProfile}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700/60 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <MdOutlineCancel className="text-2xl" />
          </button>
        </div>

        <div className="flex items-center gap-4 border-b border-slate-200/80 px-5 py-5 dark:border-slate-600/60">
          <img
            className="h-16 w-16 rounded-2xl object-cover shadow-md ring-2 ring-white dark:ring-slate-600"
            src={avatar}
            alt="user-profile"
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100">
              {userSession?.userName ? userSession.userName : 'Not Found'}
            </p>
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {userSession?.companyName
                ? userSession.companyName
                : 'Company not found'}
            </p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {userSession?.locationName
                ? userSession.locationName
                : 'Location not found'}
            </p>
            <p className="mt-1 truncate text-xs font-medium text-slate-400">
              {userSession?.emailAddress
                ? userSession.emailAddress
                : 'Email not found'}
            </p>
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50/60 dark:border-slate-600/50 dark:bg-slate-800/40">
            <div
              className="flex cursor-pointer gap-3 p-3 transition hover:bg-white dark:hover:bg-slate-700/50"
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
                style={{
                  color: 'rgb(13, 148, 136)',
                  backgroundColor: 'rgba(204, 251, 241, 0.9)',
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
              >
                <BsShield />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  Change Company & Location
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {userSession.companyName} · {userSession.locationName}
                </p>
                <p className="mt-1 text-[0.6875rem] font-medium text-teal-700">
                  {showCompanyLocationDiv ? 'Hide options' : 'Show options'}
                </p>
              </div>
            </div>

            {showCompanyLocationDiv ? (
              <div className="space-y-3 border-t border-slate-200/80 bg-white px-3 py-3 dark:border-slate-600/50 dark:bg-slate-900/40">
                <Autocomplete
                  size="small"
                  options={loginCompanyOptionsComboBox ?? []}
                  value={loginCompanyOutput || null}
                  getOptionLabel={(option) =>
                    option?.companyName ? option.companyName : ''
                  }
                  onChange={(e, selectedOption) => {
                    if (selectedOption) {
                      setLoginCompanyOutput(selectedOption);
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
                          setLoginLocationOutput(null);
                          setLoginLocationOptionsComboBox(response2.data);
                        })
                        .catch((error: any) => {
                          toast.error(
                            'Error fetching login probable location options in user profile tab data:',
                            error
                          );
                        });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '100%' }}
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: '0.8125rem' },
                      }}
                      InputLabelProps={{
                        ...params.InputLabelProps,
                        style: { fontSize: '0.875rem' },
                      }}
                      label="Company"
                      variant="outlined"
                    />
                  )}
                />

                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-9">
                    <Autocomplete
                      size="small"
                      options={loginLocationOptionsComboBox || []}
                      value={loginLocationOutput || null}
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
                          sx={{ width: '100%' }}
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: '0.8125rem' },
                          }}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: '0.875rem' },
                          }}
                          label="Location"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <button
                      type="button"
                      onClick={() => {
                        changeSessionInfosFunct(
                          loginCompanyOutput,
                          loginLocationOutput
                        );
                      }}
                      className="h-full min-h-[2.5rem] w-full rounded-lg border border-teal-700/20 bg-teal-50 text-teal-800 transition hover:bg-teal-700 hover:text-white"
                      title="Apply company & location"
                    >
                      <i className="fas fa-save" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-slate-200/80 px-5 py-4 dark:border-slate-600/60">
          <button
            type="button"
            onClick={() => logoutBtn()}
            style={{
              backgroundColor: currentColor,
            }}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:brightness-105 hover:shadow-xl active:scale-[0.99]"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(panel, document.body);
};

export default UserProfile;
