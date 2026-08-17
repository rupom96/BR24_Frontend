/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import {
  ArrowBack,
  Password,
  PhoneAndroid,
  Refresh,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
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

interface BuyerLoginDto {
  buyerId: number;
  buyerName: string;
  phoneNo: string;
  address: string;
  restLimit: number | null;
}

const LoginOtpLayer = (props: Props) => {
  const { register, getValues } = useForm();

  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setNavbarShow(false));
    dispatch(setPanelShow(false));

    const cachedBuyerInfo = localStorage.getItem('buyerInfo');
    if (cachedBuyerInfo) {
      navigate('/dashboard');
      return;
    }

    const cachedPhoneNo = localStorage.getItem('otpLoginPhoneNo');
    if (!cachedPhoneNo) {
      navigate('/loginPhoneLayer');
      return;
    }

    setPhoneNo(cachedPhoneNo);
  }, [dispatch, navigate]);

  const handleClickShowOtp = () => setShowOtp((show) => !show);

  const handleMouseDownOtp = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const btnVerifyOtp = () => {
    const otp = String(getValues().otp || '').trim();
    const cachedPhoneNo = localStorage.getItem('otpLoginPhoneNo') || '';

    if (!cachedPhoneNo || !/^\d{11}$/.test(cachedPhoneNo)) {
      toast.info('Phone number not found. Please try again.');
      navigate('/loginPhoneLayer');
      return;
    }

    if (!otp) {
      toast.info('Enter OTP');
      return;
    }

    setLoading(true);

    axios
      .post(`${API_BASE_URL}/Login/verify-otp`, {
        phoneNo: cachedPhoneNo,
        otp,
      })
      .then((res) => {
        const buyerInfo: BuyerLoginDto = res.data;

        if (buyerInfo && buyerInfo.buyerId) {
          localStorage.setItem('buyerInfo', JSON.stringify(buyerInfo));
          // localStorage.setItem('userInfo', JSON.stringify(buyerInfo));
          localStorage.removeItem('otpLoginPhoneNo');

          dispatch(setNavbarShow(true));
          dispatch(setPanelShow(true));

          toast.success('Login successful');
          navigate('/dashboard');
        } else {
          toast.error('Invalid OTP');
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data || `something wrong in backend: ${error}`;
        toast.error(
          typeof errorMessage === 'string'
            ? errorMessage
            : 'OTP verification failed.'
        );
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const btnResendOtp = () => {
    const cachedPhoneNo = localStorage.getItem('otpLoginPhoneNo') || '';

    if (!cachedPhoneNo || !/^\d{11}$/.test(cachedPhoneNo)) {
      toast.info('Phone number not found. Please try again.');
      navigate('/loginPhoneLayer');
      return;
    }

    setResendLoading(true);

    axios
      .post(
        `${API_BASE_URL}/Login/request-otp`,
        JSON.stringify(cachedPhoneNo),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        toast.success(
          typeof res.data === 'string' ? res.data : 'OTP resent successfully.'
        );
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data || `something wrong in backend: ${error}`;
        toast.error(
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Failed to resend OTP.'
        );
        console.error(error);
      })
      .finally(() => {
        setResendLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center items-center px-4 py-6">
      <div className="w-full max-w-md">
        <div className="text-center text-xl md:text-2xl font-semibold text-slate-700 mb-6">
          BIZROOTS BrainWave
        </div>

        <div className="rounded-lg shadow-lg bg-white text-center overflow-hidden">
          <div className="py-4 text-xl text-start px-6 border-b border-gray-300 font-semibold flex items-center gap-2">
            <IconButton
              size="small"
              onClick={() => {
                localStorage.removeItem('otpLoginPhoneNo');
                navigate('/loginPhoneLayer');
              }}
            >
              <ArrowBack fontSize="small" />
            </IconButton>
            LOGIN
          </div>

          <div className="px-6 text-start py-8">
            <div className="mb-4 text-sm text-gray-600">
              Enter the OTP sent to your phone number
            </div>

            <FormControl
              sx={{ mb: 2, width: '100%' }}
              size="small"
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-phone-readonly">
                Phone Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-phone-readonly"
                type="text"
                value={phoneNo}
                readOnly
                endAdornment={
                  <InputAdornment position="end">
                    <PhoneAndroid />
                  </InputAdornment>
                }
                label="Phone Number"
              />
            </FormControl>

            <FormControl sx={{ width: '100%' }} size="small" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-otp">OTP</InputLabel>
              <OutlinedInput
                {...register('otp')}
                id="outlined-adornment-otp"
                type={showOtp ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle otp visibility"
                      onClick={handleClickShowOtp}
                      onMouseDown={handleMouseDownOtp}
                      edge="end"
                    >
                      {showOtp ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    btnVerifyOtp();
                  }
                }}
                label="OTP"
                placeholder="Enter OTP"
              />
            </FormControl>

            <div className="mt-4">
              <button
                type="button"
                className={`inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 ${
                  resendLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={btnResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <Refresh fontSize="small" />
                )}
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </div>

          <div className="py-4 px-6 border-t text-start border-gray-300 text-gray-600">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className={`inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:shadow-lg transform-all duration-150 ease-in-out ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={btnVerifyOtp}
              disabled={loading}
            >
              {loading && <CircularProgress size={12} color="inherit" />}
              {'  '}
              {loading ? 'Please wait...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOtpLayer;
