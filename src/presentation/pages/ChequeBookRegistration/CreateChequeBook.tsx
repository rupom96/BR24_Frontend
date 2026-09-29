/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, Box, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  IChequeBook,
  IChequeBookCommandsVM,
  ICreateChequeBook,
  ICreateChequeBookDetail,
} from '../../../domain/interfaces/ChequeBookInterface';
import { useGetBanksComboOptionsQuery } from '../../../infrastructure/api/GetBanksForChequeBookApiSlice';
import { IBankComboBox } from '../../../domain/interfaces/BankComboBoxInterface';
import { useCreateChequeBookMutation } from '../../../infrastructure/api/ChequeBookApiSlice';

const API_BASE_URL = window.API_BASE_URL;

interface CreateChequeBookProps {
  chequeBookInfo: IChequeBook | null | undefined;
  chequeBookMasterRefetch: VoidFunction;
}

// const userInfo = {
//   UserId: 1,
//   UserName: 'DATABIZ',
//   Email: null,
//   Password: 'DATABIZ33305',
//   RememberMe: false,
//   CompanyId: 1,
//   LocationId: 1,
//   ScreenWidth: window.innerWidth,
// };

const CreateChequeBook: React.FC<CreateChequeBookProps> = ({
  chequeBookInfo,
  chequeBookMasterRefetch,
}) => {
  const navigate = useNavigate();

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  if (!userInfo?.securityUserId) {
    if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('brFeature');
    }
    navigate('/loginUsername');
  }

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

  const [loaderSpinnerForThisPage, setLoaderSpinnerForThisPage] =
    useState<boolean>(false);

  // ----------------------[api hooks]---------------
  // bank autocomp options
  const {
    data: bankComboOptions,
    isLoading: bankComboOptionsLoading,
    error: bankComboOptionsError,
    refetch: bankComboOptionsRefetch,
  } = useGetBanksComboOptionsQuery({
    companyId: userInfo.companyId,
  });

  // create cheque book
  const [
    createChequeBook,
    {
      isLoading: createChequeBookLoading,
      isError: createChequeBookError,
      error: createChequeBookErrorObj,
      isSuccess: createChequeBookIsSuccess,
    },
  ] = useCreateChequeBookMutation();

  // --------[useEffects]-----------
  useEffect(() => {
    if (
      !createChequeBookLoading &&
      !createChequeBookError &&
      createChequeBookIsSuccess
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.success('Cheque book has been created successfully!');
      // resetting all fields
      setValue('from', null);
      setValue('to', null);
      chequeBookMasterRefetch();
    } else if (!createChequeBookLoading && createChequeBookError) {
      setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something got error in backend when saving cheque book data! Check Console!'
      );
      console.log('createChequeBookErrorObj, PLEASE SEE:');
      console.log(createChequeBookErrorObj);
    } else if (createChequeBookLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [
    createChequeBookLoading,
    createChequeBookError,
    createChequeBookIsSuccess,
    createChequeBookErrorObj,
  ]);
  useEffect(() => {
    if (!bankComboOptionsLoading && bankComboOptionsError) {
      setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something got error in backend when fetching bank combo options! Check Console!'
      );
      console.log('bankComboOptionsError, PLEASE SEE:');
      console.log(bankComboOptionsError);
    }
  }, [bankComboOptionsError, bankComboOptionsLoading]);

  // -------[functions]----------

  function generateLeafSerialFromRange(
    serialInitial: string | null,
    serialFrom: string,
    serialTo: string
  ) {
    const result = [];

    // Ensure 'from' and 'to' are integers
    const from = parseInt(serialFrom, 10);
    const to = parseInt(serialTo, 10);

    // Determine the number padding based on the length of 'from' or 'to'
    const numberLength = serialFrom.toString().length;

    for (let i = from; i <= to; i++) {
      // Pad the number to maintain leading zeros
      const paddedNumber = i.toString().padStart(numberLength, '0');

      // Check if initial is null or empty and adjust accordingly
      result.push((serialInitial || '') + paddedNumber);
    }

    return result;
  }

  const onSubmit = (data: any) => {
    console.log('On Submit');

    console.log(data);

    const leafSerialArray = generateLeafSerialFromRange(
      data.leafInitial || '',
      data.from,
      data.to
    );

    const entryDate = dayjs().format('YYYY-MM-DD');
    const entryTime = dayjs().format('HH:mm');

    const entryDateFormatted = `${entryDate}T${entryTime}:00.000Z`;

    const chequeBookDetailObj: ICreateChequeBookDetail[] = [];
    for (let i = 0; i < leafSerialArray.length; i++) {
      const tempObj: ICreateChequeBookDetail = {
        chequeBookDetailId: 0,
        chequeBookId: 0,
        chequeLeafNo: leafSerialArray[i],
        used: 'N',
        vendorId: null,
      };
      chequeBookDetailObj.push(tempObj);
    }

    const objToSend: IChequeBookCommandsVM = {
      createChequeBookCommand: {
        chequeBookId: 0,
        bankId: data.bank.bankId,
        leafSerialFrom: `${data.leafInitial || ''}${data.from}`,
        leafSerialTo: `${data.leafInitial || ''}${data.to}`,
        totalLeafCount: leafSerialArray.length,
        enterdBy: userInfo?.securityUserId || 0,
        entryDate: entryDateFormatted,
        approved: 'N',
        approvedBy: null,
        approvalDate: null,
      },
      createChequeBookDetailCommand: chequeBookDetailObj,
    };

    console.log('OBJ to SEND!!! --->');
    console.log(objToSend);

    // erpor ei bank e ei cheque book leaf gula exist kore kina ta dekhte hobe, jodi exist na kore then oi axios er moddhe nicher code gula call hobe
    setLoaderSpinnerForThisPage(true);
    axios
      .get(`${API_BASE_URL}/ChequeBook/duplicateChequeLeaf`, {
        params: {
          bankId: data.bank.bankId,
          leafFrom: `${data.leafInitial || ''}${data.from}`,
          leafTo: `${data.leafInitial || ''}${data.to}`,
        },
        headers: {
          Authorization: `Bearer ${userInfo?.userToken}`,
        },
      })
      .then((response) => {
        // Handle success
        console.log('response.data Validation of duplicate serial... >>>>');
        console.log(response.data);

        if (!response.data) {
          setLoaderSpinnerForThisPage(false);
          createChequeBook(objToSend);
        } else {
          setLoaderSpinnerForThisPage(false);
          toast.error(`${response.data}`);
        }
      })
      .catch((error) => {
        // Handle error
        setLoaderSpinnerForThisPage(false);
        console.error('Error on backend while checking duplicate:', error);
      });
  };

  const handleBankChange = (
    selectedItem: IBankComboBox | null,
    onChange: (value: IBankComboBox | null) => void
  ) => {
    console.log('Selected item:', selectedItem);
    // Additional logic can be placed here
    onChange(selectedItem); // update react-hook-form
  };

  // ------------ [ validation functions ] ----------------

  const validateFromLessThanTo = (value: string) => {
    const toValue = getValues('to');
    const isValid = !toValue || parseInt(value, 10) <= parseInt(toValue, 10);
    if (!isValid) {
      // Trigger validation for 'from' when 'to' changes
      trigger('to');
      // trigger('from');
    }
    return isValid || 'Leaf From serial must be less than Leaf To serial!';
  };

  const validateToGreaterThanFrom = (value: string) => {
    const fromValue = getValues('from');
    const minLength = fromValue.length; // dynamic minLength based on 'from' value
    const maxLength = fromValue.length; // dynamic maxLength same as 'from' value
    const isValid =
      !fromValue || parseInt(value, 10) >= parseInt(fromValue, 10);
    const isValidLength =
      value.length >= minLength && value.length <= maxLength;
    if (!isValidLength) {
      // trigger('from');
      return `Length must be same as Leaf Serial from!`;
    }

    if (!isValid) {
      // Trigger validation for 'from' when 'to' changes
      // trigger('from');
      // trigger('to');
      return isValid || 'Leaf To serial must be greater than Leaf From serial!';
    }
    return true;
  };

  return (
    // return wrapper div
    <div className="">
      <div className="m-2 flex justify-center">
        <div className="block w-[100%]">
          {/* Main Card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[Laboratory experimental place starts here]----- */}
                Add Cheque Book
                {/* ---//--[Laboratory experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className=" px-6 text-start mb-8 gap-4 mt-2">
                <div className="grid grid-cols-3 gap-x-4 mx-1">
                  <div className=" col-span-3 mt-2">
                    {/* <Autocomplete
                      id="bank"
                      clearOnEscape
                      size="small"
                      options={bankComboOptions || []}
                      value={bankOutput || null}
                      // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                      getOptionLabel={(option) =>
                        option?.bankName ? option.bankName : ''
                      }
                      onChange={(e, selectedOption) => {
                        if (selectedOption) {
                          setBankOutput(selectedOption);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '100%', marginTop: 1 }}
                          {...params}
                          // {...register('location')}
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: '0.8125rem' },
                          }}
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            style: { fontSize: '0.875rem' },
                          }}
                          label="Bank"
                          variant="outlined"
                        />
                      )}
                    /> */}
                    <Controller
                      name="bank"
                      control={control}
                      rules={{
                        required: '*Required',
                      }}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          id="bank"
                          size="small"
                          options={bankComboOptions || []} // Make sure bankComboOptions is defined
                          value={value || null}
                          onChange={(event, item) =>
                            handleBankChange(item, onChange)
                          } // React-hook-form manages the state
                          onBlur={onBlur} // Trigger validation on blur
                          getOptionLabel={(option) =>
                            option ? option.bankName : ''
                          }
                          isOptionEqualToValue={(option, selectedValue) =>
                            option.bankId === selectedValue?.bankId
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Bank"
                              variant="outlined"
                              error={!!error}
                              helperText={error ? error.message : null}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: '0.875rem' },
                              }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: '0.8125rem' },
                              }}
                              sx={{ width: '100%', marginTop: 1 }}
                              inputRef={ref}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <Controller
                      name="leafInitial"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          value={value || ''}
                          sx={{ width: '100%' }}
                          InputProps={{ style: { fontSize: '0.8125rem' } }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
                            shrink: value,
                          }}
                          // onBlur={onBlur} // Trigger validation on blur
                          error={!!error}
                          helperText={error ? error.message : null}
                          // inputRef={ref}
                          id=""
                          label="Leaf Initial"
                          variant="outlined"
                          size="small"
                          onBlur={onBlur} // Trigger validation on blur
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <Controller
                      name="from"
                      control={control}
                      rules={{
                        required: '*Required',
                        // validate: validateFromLessThanTo,
                        // pattern: /^\d+$/,
                      }}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          value={value || ''}
                          type="number"
                          inputMode="numeric"
                          sx={{ width: '100%' }}
                          InputProps={{ style: { fontSize: '0.8125rem' } }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
                            shrink: value,
                          }}
                          id=""
                          label="From"
                          variant="outlined"
                          size="small"
                          onBlur={onBlur} // Trigger validation on blur
                          onChange={onChange}
                          // onChange={(e) => {
                          //   validateFromLessThanTo(e.target.value);
                          //   onChange();
                          // }}
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                        />
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <Controller
                      name="to"
                      control={control}
                      rules={{
                        required: '*Required',
                        validate: validateToGreaterThanFrom,

                        // pattern: /^\d+$/,
                      }}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          value={value || ''}
                          type="number"
                          inputMode="numeric"
                          sx={{ width: '100%' }}
                          InputProps={{ style: { fontSize: '0.8125rem' } }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
                            shrink: value,
                          }}
                          id=""
                          label="To"
                          variant="outlined"
                          size="small"
                          onBlur={onBlur} // Trigger validation on blur
                          onChange={onChange}
                          // onChange={(e) => {
                          //   validateToGreaterThanFrom(e.target.value);
                          //   onChange();
                          // }}
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                        />
                      )}
                    />
                  </div>

                  {/* <div className="mt-4">
                    <Controller
                      name="from"
                      control={control}
                      rules={{
                        required: '*Required',
                        validate: validateFromLessThanTo,
                      }}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          sx={{ width: '100%' }}
                          InputProps={{ style: { fontSize: '0.8125rem' } }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
                            shrink: value,
                          }}
                          label="From"
                          variant="outlined"
                          size="small"
                          onBlur={onBlur}
                          onChange={(e) => {
                            onChange(e); // Update value
                            validateFromLessThanTo(e.target.value); // Trigger custom validation and potentially re-validate 'to'
                          }}
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                        />
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <Controller
                      name="to"
                      control={control}
                      rules={{
                        required: '*Required',
                        validate: validateToGreaterThanFrom,
                      }}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <TextField
                          sx={{ width: '100%' }}
                          InputProps={{ style: { fontSize: '0.8125rem' } }}
                          InputLabelProps={{
                            style: { fontSize: '0.875rem' },
                            shrink: value,
                          }}
                          label="To"
                          variant="outlined"
                          size="small"
                          onBlur={onBlur}
                          onChange={(e) => {
                            onChange(e); // Update value
                            validateToGreaterThanFrom(e.target.value); // Trigger custom validation and potentially re-validate 'from'
                          }}
                          error={!!error}
                          helperText={error ? error.message : null}
                          inputRef={ref}
                        />
                      )}
                    />
                  </div> */}
                </div>
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-3">
                  <button
                    type="submit"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      console.log('Haha leaf save hobe hoho');
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>
          {/* Main Card--/-- */}
        </div>
      </div>

      {/* // modals --- out of html normal body/position */}

      {/* Making a loader modal */}
      <Modal
        open={loaderSpinnerForThisPage}
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
          <div className="flex justify-center bg-transparent ">
            <div className="mt-[21.875rem] bg-transparent">
              <PropagateLoader
                color="#36d7b7"
                loading
                // cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <div className="mt-10 ml-[-50px] px-3 text-left text-white bg-slate-700 rounded-full">
                Please Wait a bit...
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default CreateChequeBook;
