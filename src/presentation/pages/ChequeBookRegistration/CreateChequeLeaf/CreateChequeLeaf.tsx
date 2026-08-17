/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import {
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IChequeBookDetail } from '../../../../domain/interfaces/ChequeBookDetailInterface';
import {
  IChequeBook,
  ICreateChequeBookDetail,
  IUpdateChequeBookCommandsVM,
} from '../../../../domain/interfaces/ChequeBookInterface';
import { useUpdateChequeBookCreateChequeBookDetailMutation } from '../../../../infrastructure/api/ChequeBookApiSlice';

const API_BASE_URL = window.API_BASE_URL;

interface CreateChequeLeafProps {
  chequeBookInfo: IChequeBook | null | undefined;
  chequeBookMasterRefetch: VoidFunction;
  chequeBookDetailRefetch: VoidFunction | null;
  handleCreateLeafModalClose: VoidFunction;
}

const CreateChequeLeaf: React.FC<CreateChequeLeafProps> = ({
  chequeBookInfo,
  chequeBookMasterRefetch,
  chequeBookDetailRefetch,
  handleCreateLeafModalClose,
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

  const [chequeBookLeafGrid, setChequeBookLeafGrid] = useState<
    IChequeBookDetail[]
  >([]);

  const [loaderSpinnerForThisPage, setLoaderSpinnerForThisPage] =
    useState<boolean>(false);

  // form initialization
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

  // ----------------------split function------------------

  function splitAtLastNonNumeric(str: string) {
    // This regex has two parts:
    //   1. ^(.*) matches any character (.) as many times as possible (*) from the start (^)
    //      making sure it captures the longest possible string up to the last occurrence of the pattern.
    //   2. (\d+)$ matches one or more digits (\d+) at the end of the string ($).
    const regex = /^(.*\D)?(\d+)$/;
    const match = str.match(regex);

    if (match) {
      // If match[1] is undefined (in case there are only digits), use an empty string for the first part
      return [match[1] || '', match[2]];
    }
    // In case there are no digits at the end, return the original string and an empty string
    return [str, ''];
  }

  // ------------------------formatting numbers upto some digits------------------------

  function addAndFormat(inputString: string, additionValue: number) {
    // Convert the string to a number
    let num = parseInt(inputString, 10);

    // Add the value
    num += additionValue;

    // Convert it back to a string
    let formattedResult = num.toString();

    // Check if the result exceeds three digits
    if (formattedResult.length > inputString.length) {
      toast.error(
        `Result exceeds maximum allowed length of ${inputString.length} digits. No cheque leaf can be inserted`
      );
    }
    // Pad with zeros if necessary
    formattedResult = formattedResult.padStart(inputString.length, '0');
    return formattedResult;
  }

  // ---------------------[api hooks]---------------------

  // create cheque book
  const [
    updateChequeBookCreateChequeBookDetail,
    {
      isLoading: updateChequeBookCreateChequeBookDetailLoading,
      isError: updateChequeBookCreateChequeBookDetailError,
      error: updateChequeBookCreateChequeBookDetailErrorObj,
      isSuccess: updateChequeBookCreateChequeBookDetailIsSuccess,
    },
  ] = useUpdateChequeBookCreateChequeBookDetailMutation();

  // Example usage:
  // const result1 = addAndFormat('001', 10);
  // console.log(result1); // Outputs: '011'

  // const result2 = addAndFormat('999', 10);
  // console.log(result2); // Outputs: "Result exceeds maximum allowed length of 3 digits."

  // --------------[Use Effect]----------------

  // cheque book number theke initial ber kore boshaitesi and serial from tao boshay ditesi
  useEffect(() => {
    const chequeNumberTo = chequeBookInfo?.leafSerialTo
      ? chequeBookInfo?.leafSerialTo
      : '';
    const chequeInitial = splitAtLastNonNumeric(chequeNumberTo)[0];
    const chequeTo = splitAtLastNonNumeric(chequeNumberTo)[1];
    const defaultChequeTo = addAndFormat(chequeTo, 1);
    setValue('leafInitial', chequeInitial);
    setValue('from', defaultChequeTo);

    // setValue('from', defaultChequeTo);
  }, []);

  useEffect(() => {
    if (
      !updateChequeBookCreateChequeBookDetailLoading &&
      !updateChequeBookCreateChequeBookDetailError &&
      updateChequeBookCreateChequeBookDetailIsSuccess
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.success('Cheque book leaves have been created successfully!');
      // resetting all fields
      reset();
      handleCreateLeafModalClose();
      if (chequeBookDetailRefetch) {
        chequeBookDetailRefetch();
      }
      chequeBookMasterRefetch();
    } else if (
      !updateChequeBookCreateChequeBookDetailLoading &&
      updateChequeBookCreateChequeBookDetailError
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something got error in backend when saving cheque book leaf data! Check Console!'
      );
      console.log(
        'updateChequeBookCreateChequeBookDetailErrorObj, PLEASE SEE:'
      );
      console.log(updateChequeBookCreateChequeBookDetailErrorObj);
    } else if (updateChequeBookCreateChequeBookDetailLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [
    updateChequeBookCreateChequeBookDetailLoading,
    updateChequeBookCreateChequeBookDetailError,
    updateChequeBookCreateChequeBookDetailIsSuccess,
    updateChequeBookCreateChequeBookDetailErrorObj,
  ]);

  // --------------[functions]----------------

  // const saveChequeLeaves = () => {
  //   const chequeBookInitial = getValues().chequeBookInitial;
  //   const fromNo = getValues().from;
  //   const toNo = getValues().to;

  //   console.log('save Datas');
  //   console.log(`chequeBookInitial: ${chequeBookInitial}`);
  //   console.log(`fromNo: ${fromNo}`);
  //   console.log(`toNo: ${toNo}`);
  // };

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

    const objToOnFormSub = {
      leafInitial: data.leafInitial,
      leafFrom: data.from,
      leafTo: data.to,
      bankId: chequeBookInfo?.bankId,
      chequeBookId: chequeBookInfo?.chequeBookId,
    };

    console.log('On save object hoho CHEQUE - LEAF:---->');
    console.log(objToOnFormSub);

    const leafSerialArray = generateLeafSerialFromRange(
      data.leafInitial || '',
      data.from,
      data.to
    );

    const chequeBookDetailObj: ICreateChequeBookDetail[] = [];
    for (let i = 0; i < leafSerialArray.length; i++) {
      const tempObj: ICreateChequeBookDetail = {
        chequeBookDetailId: 0,
        chequeBookId: chequeBookInfo?.chequeBookId || 0,
        chequeLeafNo: leafSerialArray[i],
        used: 'N',
        vendorId: null,
      };
      chequeBookDetailObj.push(tempObj);
    }

    const objToSend: IUpdateChequeBookCommandsVM = {
      updateChequeBookCommand: {
        chequeBookId: chequeBookInfo?.chequeBookId || 0,
        leafSerialTo: leafSerialArray[leafSerialArray.length - 1],
        totalLeafCount:
          (chequeBookInfo?.totalLeafCount || 0) + leafSerialArray.length,
        enterdBy: userInfo.securityUserId,
        entryDate: null,
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
          bankId: chequeBookInfo?.bankId || 0,
          leafFrom: `${data.leafInitial || ''}${data.from}`,
          leafTo: `${data.leafInitial || ''}${data.to}`,
        },
      })
      .then((response) => {
        // Handle success
        console.log('response.data Validation of duplicate serial... >>>>');
        console.log(response.data);

        if (!response.data) {
          setLoaderSpinnerForThisPage(false);
          updateChequeBookCreateChequeBookDetail(objToSend);
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

    // trigger();
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
      trigger('from');
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
                Add Cheque Leaf
                {/* ---//--[Laboratory experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className=" px-6 text-start mb-8 gap-4 mt-2">
                <div className="grid grid-cols-6 gap-x-4 mx-1">
                  <div className="mt-2 col-span-3">
                    <Controller
                      name="bankName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...field}
                          sx={{ width: '100%', borderRadius: '50px' }}
                          value={
                            chequeBookInfo?.bankName
                              ? chequeBookInfo.bankName
                              : ''
                          }
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: 13 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 14 },
                            shrink: field.value,
                            // shrink: (field.value ? true : false)
                          }}
                          id=""
                          label="Bank"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </div>
                  <div className="mt-2 col-span-3">
                    <Controller
                      name="chequeBookNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...field}
                          sx={{ width: '100%', borderRadius: '50px' }}
                          value={
                            chequeBookInfo?.leafSerialFrom
                              ? `${chequeBookInfo.leafSerialFrom}-${chequeBookInfo.leafSerialTo}`
                              : ''
                          }
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: 13 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 14 },
                            shrink: field.value,
                            // shrink: (field.value ? true : false)
                          }}
                          id=""
                          label="Cheque Book Number"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </div>
                  <div className="mt-4 col-span-2">
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
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: 13 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 14 },
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

                  <div className="mt-4 col-span-2">
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
                          InputProps={{
                            readOnly: true,
                            style: { fontSize: 13 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 14 },
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
                  <div className="mt-4 col-span-2">
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
                          InputProps={{ style: { fontSize: 13 } }}
                          InputLabelProps={{
                            style: { fontSize: 14 },
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
                    // onClick={() => {
                    //   saveChequeLeaves();
                    // }}
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
            <div className="mt-[350px] bg-transparent">
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

export default CreateChequeLeaf;
