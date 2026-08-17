/* eslint-disable react/jsx-props-no-spreading */
import { Autocomplete, TextField } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  useLazyGetSdeLogQuery,
  useProcessVoucherSDELogRevertMutation,
} from '../../../../../infrastructure/api/DataMigrationApiSlice';
import { ISDElog } from '../../../../../domain/interfaces/SDEConfigurationInterface';

type Props = {
  biznessEventId: number;
};

const PrevVoucherImportManipulate = ({ biznessEventId }: Props) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  interface IForm {
    selectedDataExportLog: ISDElog | null;
  }

  const {
    register,
    getValues,
    reset,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<IForm>({
    defaultValues: {
      selectedDataExportLog: null, // id, value
    },
  });

  const watchedFields = useWatch({ control });
  // -------------- rtk queries sdeExportLogOption fetching------------------

  const [
    triggerGetSdeLogOptions,
    {
      data: sdeLogOptionsData,
      error: sdeLogOptionsError,
      isError: sdeLogOptionsIsError,
      isSuccess: sdeLogOptionsIsSuccess,
      isLoading: sdeLogOptionsIsLoading,
      isFetching: sdeLogOptionsIsFetching,
    },
  ] = useLazyGetSdeLogQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (sdeLogOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching sdeLogOptionsData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching sdeLogOptionsData, see console--->:'
      );
      console.log(sdeLogOptionsError);
    }
    if (sdeLogOptionsIsSuccess) {
      console.log('sdeLogOptionsIsSuccess');

      console.log(sdeLogOptionsData);
    }
  }, [
    sdeLogOptionsData,
    sdeLogOptionsIsLoading,
    sdeLogOptionsError,
    sdeLogOptionsIsError,
    sdeLogOptionsIsFetching,
    sdeLogOptionsIsSuccess,
  ]);

  const [
    processSDELogRevert,
    {
      isLoading: processSDELogRevertIsLoading,
      isError: processSDELogRevertIsError,
      error: processSDELogRevertError,
      isSuccess: processSDELogRevertIsSuccess,
      data: processSDELogRevertData,
    },
  ] = useProcessVoucherSDELogRevertMutation();

  useEffect(() => {
    if (processSDELogRevertIsSuccess) {
      Swal.fire({
        title: `Select Data Migration Operation has been deleted successfully!`,
        text: '',
        showDenyButton: false,
        allowOutsideClick: false,
        // target: 'body',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK!',
        // denyButtonText: `No, I will set it manually!`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // modalPageOpenerClose();
          console.log('check data after success, see console---->');
          console.log(processSDELogRevertData);
        }
      });
    } else if (processSDELogRevertIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving processSDELogRevert data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving processSDELogRevert data, see console---->'
      );
      console.log(processSDELogRevertError);
    }
  }, [
    processSDELogRevertIsLoading,
    processSDELogRevertIsError,
    processSDELogRevertData,
    processSDELogRevertError,
    processSDELogRevertIsSuccess,
  ]);

  const deleteDataMigrationData = () => {
    console.log('watchedFields.selectedDataExportLog');
    console.log(watchedFields.selectedDataExportLog);

    const sendingSDELog: ISDElog = {
      selectedDataExportLogId:
        watchedFields.selectedDataExportLog?.selectedDataExportLogId,
      sdE_ConfigurationId:
        watchedFields.selectedDataExportLog?.sdE_ConfigurationId,
      dateFrom: watchedFields.selectedDataExportLog?.dateFrom || null,
      dateTo: watchedFields.selectedDataExportLog?.dateTo || null,
      processStartTime:
        watchedFields.selectedDataExportLog?.processStartTime || null,
      processEndTime:
        watchedFields.selectedDataExportLog?.processEndTime || null,
    };

    processSDELogRevert(sendingSDELog);
  };

  useEffect(() => {
    triggerGetSdeLogOptions({
      companyId: userInfo?.companyId,
      biznessEventId,
      userId: userInfo?.securityUserId,
    });
  }, []);

  return (
    // return wrapper div
    <div className="">
      <div className="m-2 flex justify-center">
        <div className="block w-[100%]">
          {/* Main Card */}
          <form onSubmit={() => {}}>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[Laboratory experimental place starts here]----- */}
                Fix Previous Data Imports
                {/* ---//--[Laboratory experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className=" px-6 text-start mb-8 gap-4 mt-2">
                <div className="grid grid-cols-3 gap-x-4 mx-1">
                  <div className=" col-span-3 mt-2">
                    <Controller
                      name="selectedDataExportLog"
                      control={control}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          // multiple //  Enable multi select
                          size="small"
                          loading={false}
                          options={sdeLogOptionsData || []} // Replace with tenderComboOptions
                          value={value}
                          onChange={(event, selectedItems) => {
                            onChange(selectedItems); //  Pass whole array to RHF
                          }}
                          onBlur={onBlur}
                          getOptionLabel={(option) => {
                            if (!option) return '';
                            const dateFrom = option.dateFrom
                              ? dayjs(option.dateFrom).format('DD MMMM, YYYY')
                              : 'N/A';
                            const dateTo = option.dateTo
                              ? dayjs(option.dateTo).format('DD MMMM, YYYY')
                              : 'N/A';
                            const processStart = option.processStartTime
                              ? dayjs(option.processStartTime).format(
                                  'DD MMMM, YYYY - h:mm:ssa'
                                )
                              : 'N/A';

                            return `Voucher from ${dateFrom} - ${dateTo} (Executed on ${processStart})`;
                          }}
                          isOptionEqualToValue={(option, selectedValue) =>
                            option.selectedDataExportLogId ===
                            selectedValue?.selectedDataExportLogId
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="SDE Export Histories"
                              variant="standard"
                              error={!!error}
                              helperText={error ? error.message : null}
                              InputLabelProps={{
                                ...params.InputLabelProps,
                                style: { fontSize: 14 },
                              }}
                              InputProps={{
                                ...params.InputProps,
                                style: { fontSize: 13 },
                              }}
                              sx={{ width: '100%', marginTop: 1 }}
                              inputRef={ref}
                            />
                          )}
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
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      deleteDataMigrationData();
                    }}
                  >
                    Delete
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

      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default PrevVoucherImportManipulate;
