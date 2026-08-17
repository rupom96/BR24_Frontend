/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { PhoneAndroid } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import { useAppDispatch } from '../../../application/Redux/store/store';

const API_BASE_URL = window.API_BASE_URL;

type Props = {};

const LoginPhoneLayer = (props: Props) => {
  const { register, getValues } = useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setNavbarShow(false));
    dispatch(setPanelShow(false));

    const cachedBuyerInfo = localStorage.getItem('buyerInfo');
    if (cachedBuyerInfo) {
      navigate('/dashboard');
    }
  }, [dispatch, navigate]);

  const btnNext = () => {
    const phoneNo = String(getValues().phoneNo || '').trim();

    if (!phoneNo) {
      toast.info('Enter your phone number');
      return;
    }

    if (!/^\d{11}$/.test(phoneNo)) {
      toast.info('Phone number must be 11 digits');
      return;
    }

    setLoading(true);

    axios
      .post(`${API_BASE_URL}/Login/request-otp`, JSON.stringify(phoneNo), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        localStorage.setItem('otpLoginPhoneNo', phoneNo);
        toast.success(
          typeof res.data === 'string' ? res.data : 'OTP sent successfully.'
        );
        navigate('/loginOtp');
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data || `something wrong in backend: ${error}`;
        toast.error(
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Failed to send OTP.'
        );
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center items-center px-4 py-6">
      <div className="w-full max-w-md">
        <div className="text-center text-xl md:text-2xl font-semibold text-slate-700 mb-6">
          BIZROOTS BrainWave
        </div>

        <div className="rounded-lg shadow-lg bg-white text-center overflow-hidden">
          <div className="py-4 text-xl text-start px-6 border-b border-gray-300 font-semibold">
            LOGIN
          </div>

          <div className="px-6 text-start py-8">
            <div className="mb-2 text-sm text-gray-600">
              Enter your phone number to receive OTP
            </div>

            <FormControl
              sx={{ mt: 1, width: '100%' }}
              size="small"
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-phone">
                Phone Number
              </InputLabel>
              <OutlinedInput
                {...register('phoneNo')}
                id="outlined-adornment-phone"
                type="text"
                inputProps={{ maxLength: 11 }}
                endAdornment={
                  <InputAdornment position="end">
                    <PhoneAndroid />
                  </InputAdornment>
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    btnNext();
                  }
                }}
                label="Phone Number"
                placeholder="01XXXXXXXXX"
              />
            </FormControl>
          </div>

          <div className="py-4 px-6 border-t text-start border-gray-300 text-gray-600">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:shadow-lg transform-all duration-150 ease-in-out ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={btnNext}
              disabled={loading}
            >
              {loading && <CircularProgress size={12} color="inherit" />}
              {'  '}
              {loading ? 'Please wait...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPhoneLayer;
