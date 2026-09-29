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
        <div className="br24-profile-divider flex items-start justify-between px-5 py-4">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--br24-accent)]">
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
            className="br24-profile-icon-btn rounded-xl p-2 text-slate-400"
            aria-label="Close"
          >
            <MdOutlineCancel className="text-2xl" />
          </button>
        </div>

        <div className="br24-profile-divider flex items-center gap-4 px-5 py-5">
          <img
            className="h-16 w-16 rounded-2xl object-cover shadow-md ring-2 ring-white/70 dark:ring-slate-600/70"
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
          <div className="br24-profile-card overflow-hidden rounded-xl">
            <div
              className="br24-profile-card-row flex cursor-pointer gap-3 p-3"
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
                className="br24-profile-card-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
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
                <p className="mt-1 text-[0.6875rem] font-medium text-[color:var(--br24-accent)]">
                  {showCompanyLocationDiv ? 'Hide options' : 'Show options'}
                </p>
              </div>
            </div>

            {showCompanyLocationDiv ? (
              <div className="br24-profile-card-body space-y-3 px-3 py-3">
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
                      className="br24-profile-save-btn h-full min-h-[2.5rem] w-full rounded-lg"
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

        <div className="br24-profile-divider px-5 py-4">
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
