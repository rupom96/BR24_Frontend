/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { ExportToCsv } from 'export-to-csv';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {
  IApproveChequeBookCommandsVM,
  IChequeBook,
  IDeleteChequeBookCommandsVM,
} from '../../../domain/interfaces/ChequeBookInterface';
import ChequeBookLeaf from './ChequeBookLeaf/ChequeBookLeaf';
import CreateChequeLeaf from './CreateChequeLeaf/CreateChequeLeaf';
import CreateChequeBook from './CreateChequeBook';
import avatarColored3 from '../../assets/data/AvatarColored3.png'; // eitar direct link ashbe, backend jekhane host kora shekhan theke
import { IBankComboBox } from '../../../domain/interfaces/BankComboBoxInterface';
import { IChequeLeafComboBox } from '../../../domain/interfaces/ChequeLeafOptionsComboBox';
import { useGetBanksComboOptionsQuery } from '../../../infrastructure/api/GetBanksForChequeBookApiSlice';
import {
  useApproveChequeBookMutation,
  useDeleteChequeBookChequeBookDetailMutation,
  useGetChequeBookByBankLeafNoQuery,
  useGetChequeLeafNoByBankIdQuery,
} from '../../../infrastructure/api/ChequeBookApiSlice';
import { useAppDispatch } from '../../../application/Redux/store/store';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';

const ChequeBookRegistration = (props: any) => {
  // ------------[session user info works]----------------

  const dispatch = useAppDispatch();
  dispatch(setNavbarShow(true));
  dispatch(setPanelShow(true));

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

  // ---------end//---[session user info works]----------------

  const isFirstRender = useRef(true);
  const [chequeBookGrid, setChequeBookGrid] = useState<IChequeBook[]>([]);

  const [loaderSpinnerForThisPage, setLoaderSpinnerForThisPage] =
    useState<boolean>(false);

  const [bankOptionsComboBox, setBankOptionsComboBox] = useState<
    IBankComboBox[]
  >([]);
  const [bankOutput, setBankOutput] = useState<IBankComboBox | null>(null);

  const [leafNoFromOptions, setLeafNoFromOptions] = useState<
    IChequeLeafComboBox[]
  >([]);
  const [leafNoFromOutput, setLeafNoFromOutput] =
    useState<IChequeLeafComboBox | null>(null);

  const [leafNoToOptions, setLeafNoToOptions] = useState<IChequeLeafComboBox[]>(
    []
  );
  const [leafNoToOutput, setLeafNoToOutput] =
    useState<IChequeLeafComboBox | null>(null);

  const [leafModalOpen, setLeafModalOpen] = useState(false);
  const handleLeafModalOpen = () => setLeafModalOpen(true);
  const handleLeafModalClose = () => setLeafModalOpen(false);

  const [createLeafModalOpen, setCreateLeafModalOpen] = useState(false);
  const handleCreateLeafModalOpen = () => setCreateLeafModalOpen(true);
  const handleCreateLeafModalClose = () => setCreateLeafModalOpen(false);

  const [createChequeBookModalOpen, setCreateChequeBookModalOpen] =
    useState(false);
  const handleCreateChequeBookModalOpen = () =>
    setCreateChequeBookModalOpen(true);
  const handleCreateChequeBookModalClose = () =>
    setCreateChequeBookModalOpen(false);

  const [currentChequeBookRow, setCurrentChequeBookRow] =
    useState<IChequeBook | null>();

  const [columnVisibility, setColumnVisibility] = useState<any>([]);

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

  // chequeLeafNo autocomp options
  const {
    data: leafNoOptions,
    isLoading: leafNoOptionsLoading,
    error: leafNoOptionsError,
    refetch: leafNoOptionsRefetch,
  } = useGetChequeLeafNoByBankIdQuery(
    {
      bankId: bankOutput?.bankId ?? 0,
    },
    { skip: !bankOutput?.bankId }
  );

  // Cheque Book Grid Data
  const {
    data: chequeBookMaster,
    isLoading: chequeBookMasterLoading,
    error: chequeBookMasterError,
    isFetching: chequeBookMasterFetching,
    refetch: chequeBookMasterRefetch,
  } = useGetChequeBookByBankLeafNoQuery({
    bankId: bankOutput?.bankId || 0,
    leafNoFrom: leafNoFromOutput?.chequeLeafNo || '',
    leafNoTo: leafNoToOutput?.chequeLeafNo || '',
  });

  // useDeleteChequeBookChequeBookDetailMutation
  // delete cheque book
  const [
    deleteChequeBookChequeBookDetail,
    {
      isLoading: deleteChequeBookChequeBookDetailLoading,
      isError: deleteChequeBookChequeBookDetailError,
      error: deleteChequeBookChequeBookDetailErrorObj,
      isSuccess: deleteChequeBookChequeBookDetailIsSuccess,
    },
  ] = useDeleteChequeBookChequeBookDetailMutation();

  const [
    appproveChequeBook,
    {
      isLoading: appproveChequeBookLoading,
      isError: appproveChequeBookError,
      error: appproveChequeBookErrorObj,
      isSuccess: appproveChequeBookIsSuccess,
    },
  ] = useApproveChequeBookMutation();

  // --------[Functions]------------

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

  const extractOptionsForLeafNoFrom = (
    selectedLeafFrom: IChequeLeafComboBox | null
  ) => {
    const selectedLeafFromSplit = selectedLeafFrom?.chequeLeafNo
      ? splitAtLastNonNumeric(selectedLeafFrom?.chequeLeafNo)
      : ['', ''];

    const selectedLeafFromIntial = selectedLeafFromSplit[0];
    const selectedLeafFromSerial = selectedLeafFromSplit[1]
      ? parseInt(selectedLeafFromSplit[1], 10)
      : null;

    const extractedOptions = leafNoOptions?.filter((obj: any) => {
      const perObjSplitted = splitAtLastNonNumeric(obj.chequeLeafNo);
      const perObjInitial = perObjSplitted[0];
      const perObjSerial = parseInt(perObjSplitted[1], 10);

      console.log('perObjInitial');
      console.log(perObjInitial);
      console.log('perObjSerial');
      console.log(perObjSerial);
      console.log('selectedLeafFromIntial');
      console.log(selectedLeafFromIntial);
      console.log('selectedLeafFromSerial');
      console.log(selectedLeafFromSerial);

      if (
        perObjSerial &&
        selectedLeafFromSerial &&
        perObjInitial === selectedLeafFromIntial &&
        perObjSerial >= selectedLeafFromSerial
      ) {
        return true;
      }
      return false;
    });
    return extractedOptions;
  };

  const handleRemoveChequeBook = (rowToDelete: IChequeBook) => {
    Swal.fire({
      title: `Are you sure to delete!`,
      text: `Are you sure you want to delete the cheque book serial: ${rowToDelete.leafSerialFrom}-${rowToDelete.leafSerialTo} of '${rowToDelete.bankName}'`,
      showDenyButton: true,
      allowOutsideClick: true,
      // target: 'body',
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Yes!',
      denyButtonText: `No!`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const objToDelete: IDeleteChequeBookCommandsVM = {
          deleteChequeBookCommand: {
            chequeBookId: rowToDelete.chequeBookId,
          },
          deleteChequeBookDetailCommand: [
            {
              chequeBookId: rowToDelete.chequeBookId,
            },
          ],
        };
        deleteChequeBookChequeBookDetail(objToDelete);
      }
    });
  };

  const handleApproveNowBtn = (rowToApprove: IChequeBook) => {
    console.log(`chequeBook id to approve: ${rowToApprove.chequeBookId}`);

    const messageForToast = `Cheque book approved successfully!`;

    Swal.fire({
      title: `Are you sure to approve?`,
      text: `Are you sure you want to approve the cheque book serial: ${rowToApprove.leafSerialFrom}-${rowToApprove.leafSerialTo} of '${rowToApprove.bankName}'? You cannot add any leaf after approval!`,
      showDenyButton: true,
      allowOutsideClick: true,
      // target: 'body',
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Yes!',
      denyButtonText: `No!`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const objToApprove: IApproveChequeBookCommandsVM = {
          approveChequeBookCommand: {
            chequeBookId: rowToApprove.chequeBookId,
            approvedBy: userInfo.userId,
          },
        };
        appproveChequeBook(objToApprove);
      }
    });

    // set object jevabe backend chaise, then call rtk hook to send that, then rtk query successful hole refetchChequeMaster hobe
  };

  /// //excel csv/////////////////

  const handleExportData = (gridData: any, gridColumns: any) => {
    console.log('handleExportData');

    console.log('gridData');
    console.log(gridData);

    console.log('columnVisibility');
    console.log(columnVisibility);

    // --------[Getting the hidden columns as property names in an array]----------
    const falsePropertiesArr = Object.keys(columnVisibility).filter(
      (property) => columnVisibility[property] === false
    );
    console.log('falsePropertiesArr');
    console.log(falsePropertiesArr);

    console.log('gridColumns');
    console.log(gridColumns);

    // --------[Getting the arrayOFColumn(headers of excel) for xcel like: [{id: 'bankName',header: 'Bank',},{id: 'status', header: 'Status',}, where the columns aren't hidden]----------
    const visibleGridDataTbColXcel = gridColumns
      .filter(
        (column: any) =>
          column?.id &&
          column?.id !== 'Actions' &&
          column?.id !== 'delete' &&
          !falsePropertiesArr.includes(column.id)
      )
      .map(({ id, header }: any) => ({ id, header }));

    console.log('visibleGridDataTbColXcel');
    console.log(visibleGridDataTbColXcel);

    // --------[Getting the data of excel without those columns which are hidden ]----------
    const gridDataTbXCEL = gridData.map((item: any) => {
      return Object.keys(item).reduce((acc: any, key: any) => {
        if (visibleGridDataTbColXcel.some((column: any) => column.id === key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {});
    });

    console.log('gridDataTbXCEL');
    console.log(gridDataTbXCEL);

    // --------[ekhon, ei exportToCsv library te shalar header (visibleGridDataTbColXcel array r ki) e jevabe property j sequence e declared thake, exactly oi sequence e per obj er property o thatkte hobe. Mane column declared for xcel ase mone kor [{header: 'Voucher No', id: 'VoucherNo'}, {header: 'Buyer Number', id: 'BuyerNumber'}] ei sequence e. excel er data o shea khetre hobe exactly same sequence e. like [{VoucherNo: 123, BuyerNumber: 49 },{VoucherNo: 456, BuyerNumber: 60 }]. Unfortunately jodi [{BuyerNumber: 49, VoucherNo: 123,  },{BuyerNumber: 60, VoucherNo: 456}] dei tahole  VoucherNo header name er niche value boshbe '49', '60'..... tai sort out kore nitesi jaate exactly property gula same sequence e boshe ]---------

    const gridDataTbXCELSorted = gridDataTbXCEL.map((item: any) => {
      const sortedItem: any = {};
      visibleGridDataTbColXcel.forEach((column: any) => {
        sortedItem[column.id] = item[column.id];
      });
      return sortedItem;
    });

    console.log('gridDataTbXCELSorted');
    console.log(gridDataTbXCELSorted);

    // ---[csv er settings]---
    const csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useBom: true,
      useKeysAsHeaders: false,
      headers: visibleGridDataTbColXcel.map((c: any) => c.header),
    };
    const csvExporter = new ExportToCsv(csvOptions);
    csvExporter.generateCsv(gridDataTbXCELSorted);
  };

  // ---------[UseEffects]-----------
  useEffect(() => {
    setBankOptionsComboBox(bankComboOptions || []);
  }, [bankComboOptions]);

  // useEffect(() => {
  //   setLeafNoFromOptions(leafFromToOptions);
  //   setLeafNoToOptions(leafFromToOptions);
  // }, []);

  // bank select/change korle oi wise leafFromNo er options change hobe and selected value faka hoye jabe
  useEffect(() => {
    setLeafNoFromOutput(null); // ei null er kaaj bank autocomplete er moddhe bank set korar agei korte hobe and kora ase, eikhane lekhsi readabilityr jonno, line ta na likhleo hobe
    if (bankOutput?.bankId) {
      // conditional call to leafNoOptions or axios call
      // then oikhane theke j leafNoOptions paabo, oita setState korbo
      setLeafNoFromOptions(leafNoOptions || []);
    } else {
      setLeafNoFromOptions([]);
    }
  }, [bankOutput?.bankId, leafNoOptions]);

  // leafFromNo select/change korle oi wise leafToNo er options change hobe and selected value faka hoye jabe
  useEffect(() => {
    setLeafNoToOutput(null); // ei null er kaaj leafFromNo autocomplete er moddhe leafFrom set korar agei korte hobe, eikhane lekhsi readabilityr jonno, line ta na likhleo hobe
    if (leafNoFromOutput?.chequeLeafNo) {
      const extractedOptions = extractOptionsForLeafNoFrom(leafNoFromOutput);
      setLeafNoToOptions(extractedOptions || []);
    } else {
      setLeafNoToOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafNoFromOutput?.chequeLeafNo]);

  // bank, leafnoFrom, leadNoTo eigula change hoile ajax/axios/ conditional rtk call hobe
  useEffect(() => {
    // if (
    //   (bankOutput?.bankId &&
    //     leafNoFromOutput?.chequeLeafNo &&
    //     leafNoToOutput?.chequeLeafNo) ||
    //   (!bankOutput?.bankId &&
    //     !leafNoFromOutput?.chequeLeafNo &&
    //     !leafNoToOutput?.chequeLeafNo) ||
    //   (bankOutput?.bankId &&
    //     !leafNoFromOutput?.chequeLeafNo &&
    //     !leafNoToOutput?.chequeLeafNo)
    // ) {
    //   // toast.info('call axios/ condition rtk query');
    //   setChequeBookGrid(chequeBookMaster || []); // setChequeBookGrid hobe conditional rtk theke paoa jinish
    // } else {
    //   // toast.info('make the table faka!');
    //   setChequeBookGrid(chequeBookMaster || []); // setChequeBookGrid hobe conditional rtk theke paoa jinish
    //   // setChequeBookGrid([]);
    // }

    let chequeBookMasterWithEmpty: IChequeBook[] = [];
    let numberOfEmptyRows: number = 0;
    if (chequeBookMaster) {
      chequeBookMasterWithEmpty = JSON.parse(JSON.stringify(chequeBookMaster));
      numberOfEmptyRows = 12 - (chequeBookMasterWithEmpty?.length || 0);
    }

    for (let i = 0; i < numberOfEmptyRows; i++) {
      chequeBookMasterWithEmpty.push({
        chequeBookId: 0,
        bankId: 0,
        bankName: '',
        leafSerialFrom: '',
        leafSerialTo: '',
        totalLeafCount: 0,
        enteredById: 0,
        enteredByName: '',
        enteredByImage: null,
        entryDate: '',
        approved: null,
        approvedById: null,
        approvedByName: null,
        approvedByImage: null,
        approvalDate: null,
        status: '',
      });
    }

    setChequeBookGrid(chequeBookMasterWithEmpty || []);
  }, [
    bankOutput?.bankId,
    leafNoFromOutput?.chequeLeafNo,
    leafNoToOutput?.chequeLeafNo,
    chequeBookMaster,
  ]);

  useEffect(() => {
    console.log(
      'ChequeMasterLoading............................>>>>>>>>>>>>>>>>>>>>>>>>>>'
    );
    console.log(chequeBookMasterLoading);
    console.log(
      'chequeBookMasterFetching............................>>>>>>>>>>>>>>>>>>>>>>>>>>'
    );
    console.log(chequeBookMasterFetching);
  }, [chequeBookMasterLoading, chequeBookMasterFetching]);

  useEffect(() => {
    if (
      !deleteChequeBookChequeBookDetailLoading &&
      !deleteChequeBookChequeBookDetailError &&
      deleteChequeBookChequeBookDetailIsSuccess
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.success('Cheque book has been Deleted successfully!');
      // resetting all fields
      chequeBookMasterRefetch();
    } else if (
      !deleteChequeBookChequeBookDetailLoading &&
      deleteChequeBookChequeBookDetailError
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something got error in backend when deleting cheque book data! Check Console!'
      );
      console.log('deleteChequeBookChequeBookDetailErrorObj, PLEASE SEE:');
      console.log(deleteChequeBookChequeBookDetailErrorObj);
    } else if (deleteChequeBookChequeBookDetailLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [
    appproveChequeBookLoading,
    appproveChequeBookError,
    deleteChequeBookChequeBookDetailIsSuccess,
    appproveChequeBookErrorObj,
  ]);
  useEffect(() => {
    if (
      !appproveChequeBookLoading &&
      !appproveChequeBookError &&
      appproveChequeBookIsSuccess
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.success('Cheque book has been approved successfully!');
      // resetting all fields
      chequeBookMasterRefetch();
    } else if (!appproveChequeBookLoading && appproveChequeBookError) {
      setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something got error in backend when approving the cheque book! Check Console!'
      );
      console.log('appproveChequeBookErrorObj, PLEASE SEE:');
      console.log(appproveChequeBookErrorObj);
    } else if (appproveChequeBookLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [
    appproveChequeBookLoading,
    appproveChequeBookError,
    appproveChequeBookIsSuccess,
    appproveChequeBookErrorObj,
  ]);

  // -----------[Grid variables declaration]-------------

  const chequeBookColumns = useMemo<MRT_ColumnDef<IChequeBook>[]>(
    () => [
      {
        id: 'delete', // access nested data with dot notation
        header: '',
        size: 1, // small column
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            {row.original.chequeBookId ? (
              <Tooltip
                className={
                  // row.original.accountsId ||
                  // row.original.amount ||
                  // row.original.groupName ||
                  // row.original.name
                  //   ? 'visible'
                  //   : 'invisible'
                  'visible'
                }
                arrow
                placement="right"
                title="Delete"
              >
                <IconButton
                  color={row.original.approved === 'Y' ? 'default' : 'error'}
                  onClick={() => {
                    if (row.original.approved === 'Y') {
                      toast.info(
                        'After approval, you cannot delete a cheque book!'
                      );
                    } else {
                      handleRemoveChequeBook(row.original);
                    }
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            ) : (
              ''
            )}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.bankName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.bankName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'bankName',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Bank',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              sx={{ width: '100%' }}
              value={renderedCellValue || ''}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
            />
          );
        },
      },
      {
        accessorFn: (row) => row.leafSerialFrom ?? '', // access nested data with dot notation
        id: 'leafSerialFrom',
        enableGlobalFilter: columnVisibility?.leafSerialFrom, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        size: 200,
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Cheque Book Serial',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          //   const currentAccountHead: IAccountsNameComboBox = {
          //     accountsId: row.original.accountsId ?? null,
          //     accountsName: row.original.accountsName ?? '',
          //   };

          const cellValue = row.original.chequeBookId
            ? `${row.original.leafSerialFrom} - ${row.original.leafSerialTo}`
            : '';

          return (
            <TextField
              sx={{ width: '100%' }}
              value={cellValue || ''}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
            />
          );
        },
      },

      {
        accessorFn: (row) => row.approved ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'approved',
        enableGlobalFilter: columnVisibility?.approved, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Approval',
        // size: 1, // small column
        size: 120,

        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        // Cell: ({ renderedCellValue, row }) => (
        //   <div className="w-full flex justify-center">
        //     <div className="flex justify-center">
        //       {row.original.approved !== 'Y' ? (
        //         <div className="flex gap-1">
        //           <button
        //             // disabled={shouldVoucherCreateBtnDisable}
        //             className={`transform-all duration-700 ease-in-out border 'border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white'
        //                 } font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden`}
        //             onClick={() => {
        //               console.log('helllowww');
        //             }}
        //           >
        //             <span className=" font-bold text-[13px] leading-none">
        //               Approve
        //             </span>
        //           </button>
        //         </div>
        //       ) : (
        //         <div className="flex gap-1">Already Approved!</div>
        //       )}
        //     </div>
        //   </div>
        // ),

        Cell: ({ renderedCellValue, row }) => (
          <>
            {row.original.chequeBookId ? (
              <div className="w-full flex justify-center">
                {row.original.approved !== 'Y' ? (
                  <div className="flex gap-1">
                    <button
                      // disabled={shouldVoucherCreateBtnDisable}
                      className="transform-all duration-700 ease-in-out border border-slate-300 text-blue-700 hover:bg-blue-700 hover:text-white py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden"
                      onClick={() => {
                        handleApproveNowBtn(row.original);
                      }}
                    >
                      <span className=" font-semibold text-[13px] leading-none">
                        Approve Now <i className="ml-1 fas fa-arrow-right" />
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="rounded-full border border-slate-300 bg-green-100 py-1 px-2">
                    Approved
                    <i className=" ml-1 fas fa-check-circle text-green-700 fa-lg text-sm" />
                  </div>
                  // <div className="rounded-full border bg-red-100 py-1 px-2">
                  //   Unapproved
                  //   <i className="ml-1 fas fa-times-circle text-red-700 fa-lg text-sm" />
                  // </div>
                )}
              </div>
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        accessorFn: (row) => row.status ?? '', // access nested data with dot notation
        id: 'status',
        enableGlobalFilter: columnVisibility?.status, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        // accessorKey: 'transactionName',
        header: 'Status',
        grow: true,
        size: 110,

        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          let divClass = 'rounded-full border border-slate-300 py-1 px-2';
          let iconClass = 'fas fa-circle fa-xs';
          if (renderedCellValue === 'Used') {
            divClass =
              'rounded-full border border-slate-300 py-1 px-2 bg-slate-100';
            iconClass = 'fas fa-circle fa-xs text-slate-500';
          } else if (renderedCellValue === 'Unused') {
            divClass =
              'rounded-full border border-slate-300 py-1 px-2 bg-green-100';
            iconClass = 'fas fa-circle fa-xs text-green-700';
          } else if (renderedCellValue === 'Cancelled') {
            divClass =
              'rounded-full border border-slate-300 py-1 px-2 bg-red-100';
            iconClass = 'fas fa-circle fa-xs text-red-700';
          }

          return (
            <div className="w-full flex justify-center">
              {row.original.chequeBookId ? (
                <div className={divClass}>
                  <i className={iconClass} /> {renderedCellValue}
                </div>
              ) : (
                ''
              )}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.entryDate ?? '', // access nested data with dot notation
        id: 'entryDate',
        enableGlobalFilter: columnVisibility?.entryDate, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        // accessorKey: 'transactionName',
        header: 'Entry Date',
        grow: true,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              sx={{ width: '100%' }}
              value={renderedCellValue || ''}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
            />
          );
        },
      },
      {
        accessorFn: (row) => row.enteredByName ?? '', // access nested data with dot notation
        id: 'enteredByName',
        enableGlobalFilter: columnVisibility?.enteredByName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Entered By',
        grow: true,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {renderedCellValue ? (
                <img
                  className="rounded-full h-7 w-7 bg-gray-500"
                  alt="avatar"
                  // src={row.performedByImage? avatarColored3}
                  src={
                    row.original.enteredByImage
                      ? row.original.enteredByImage
                      : avatarColored3
                  }
                />
              ) : (
                ''
              )}

              <span>{renderedCellValue}</span>
            </Box>
          );
        },
      },
      {
        id: 'Actions', // access nested data with dot notation
        header: '',
        // size: 3, // small column
        grow: false,
        size: 120,

        // enableSorting: false,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (row.original.status === 'Used') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.status === 'Unused') {
            bgCellColor = '#effced';
          } else if (row.original.status === 'Cancelled') {
            bgCellColor = '#fceded';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => {
          const disabledClass = `transform-all duration-700 ease-in-out border border-slate-300 text-gray-500 hover:bg-gray-500 hover:text-white font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-gray relative overflow-hidden cursor-not-allowed`;
          const enabledClass = `transform-all duration-700 ease-in-out border border-slate-300 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden`;

          return (
            <div className="w-full flex justify-center">
              {row.original.chequeBookId ? (
                <div className="flex justify-center gap-1">
                  <div className="">
                    <button
                      className={
                        row.original.approved === 'Y'
                          ? disabledClass
                          : enabledClass
                      }
                      onClick={() => {
                        if (row.original.approved === 'Y') {
                          toast.info(
                            'New leaf cannot be added to a approved cheque book!'
                          );
                        } else {
                          console.log('currentRow');
                          console.log(row.original);
                          setCurrentChequeBookRow(row.original);
                          setCreateLeafModalOpen(true);
                        }
                      }}
                    >
                      <span className=" font-bold text-[13px] leading-none">
                        Leaf+
                      </span>
                    </button>
                  </div>
                  <div className="">
                    <button
                      // disabled={shouldVoucherCreateBtnDisable}
                      className={`transform-all duration-700 ease-in-out border border-slate-300 text-blue-700 hover:bg-blue-700 hover:text-white
                     font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden`}
                      onClick={() => {
                        console.log('currentRow');
                        console.log(row.original);
                        setCurrentChequeBookRow(row.original);
                        setLeafModalOpen(true);
                      }}
                    >
                      <span className=" font-bold text-[13px] leading-none">
                        <i className="far fa-eye fa-sm" /> Leaves
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5" />
              )}
            </div>
          );
        },
      },
    ],
    [
      handleRemoveChequeBook,
      //   chequeBookGrid,
      //   PopperMy,
    ]
  );

  const tableInitializer: MRT_TableInstance<IChequeBook> =
    useMaterialReactTable({
      columns: chequeBookColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: chequeBookGrid || [],
      state: {
        isLoading: chequeBookMasterLoading || chequeBookMasterFetching,
        columnVisibility,
      },
      onColumnVisibilityChange: setColumnVisibility,
      muiSkeletonProps: {
        animation: 'pulse',
        height: 40,
      },
      enableBottomToolbar: false,
      enableColumnResizing: true,
      enableGlobalFilterModes: true,
      enablePagination: false,
      enableRowNumbers: false,
      enableColumnPinning: true,
      enableStickyHeader: true,
      layoutMode: 'grid',

      // enableRowVirtualization: true,
      // editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
      // enableEditing: true,
      // enableDensityToggle: false,
      initialState: {
        density: 'compact',
        // expanded: true, //expand all groups by default
        // grouping: ['transactionName'], // an array of columns to group by by default (can be multiple)
      },
      muiTablePaperProps: {
        elevation: 0, // change the mui box shadow
        // customize paper styles
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      },
      muiTableBodyCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '13px',
        },
      },
      muiTableHeadCellProps: {
        sx: {
          borderRight: '1px solid #e0e0e0', // add a border between columns
          // borderLeft: '1px solid #e0e0e0',
          borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
          fontSize: '13px',
          whiteSpace: 'nowrap',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '550px' } },
      renderToolbarInternalActions: ({ table }) => (
        <>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleGlobalFilterButton table={table} />
          <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-700 ease-in-out"
              onClick={() => {
                setCreateChequeBookModalOpen(true);
              }}
            >
              +Add Cheque Book
            </button>
          </div>
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleFullScreenButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <div className="mx-2">
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={() => {
                handleExportData(chequeBookGrid, chequeBookColumns);
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),
      // onSortingChange: setSorting,
      // state: { isLoading, sorting },
      // rowVirtualizerInstanceRef, // optional
      // rowVirtualizerOptions: { overscan: 5 }, // optionally customize the row virtualizer

      // enableGrouping: true,

      // displayColumnDefOptions: {
      //   'mrt-row-expand': {
      //     // enableResizing: true,
      //     enablePinning: true,
      //     size: 5,
      //     // grow: false,
      //     // enableColumnActions: true,
      //   },
      // },
      // muiToolbarAlertBannerProps: { sx: { display: 'none' } }, // eita na dile upore grouped by Transaction Name ashe.. oita bondho kora
      // state: {
      //   showAlertBanner: false,
      // },
      // muiToolbarAlertBannerChipProps: { color: 'primary' },
    });

  /// //////////////EXCEL CSV/////////////////////////////

  // const taskReportGridHeaderXcel = [
  //   {
  //     accessorKey: 'performedByName',
  //     header: 'Entry By',
  //   },
  //   // {
  //   //   accessorKey: 'biznessEventFrequency',
  //   //   header: 'Reporting Frequency',
  //   // },
  //   {
  //     accessorKey: 'date',
  //     header: 'Date',
  //   },
  //   {
  //     accessorKey: 'progressPReported',
  //     header: 'Progress%',
  //   },
  //   {
  //     accessorKey: 'startTime',
  //     header: 'Start Time',
  //   },
  //   {
  //     accessorKey: 'endTime',
  //     header: 'End Time',
  //   },
  //   {
  //     accessorKey: 'note',
  //     header: 'Note',
  //   },
  // ];

  // const csvOptions = {
  //   fieldSeparator: ',',
  //   quoteStrings: '"',
  //   decimalSeparator: '.',
  //   showLabels: true,
  //   useBom: true,
  //   useKeysAsHeaders: false,
  //   headers: taskReportGridHeaderXcel.map((c) => c.header),
  // };
  // const csvExporter = new ExportToCsv(csvOptions);

  // const handleExportData = () => {
  //   const chequeBookGridXCEL = [];
  //   if (jsonForTaskReporting) {
  //     // eslint-disable-next-line for-direction
  //     for (let i = jsonForTaskReporting.length - 1; i >= 0; i--) {
  //       // ulta kore array loop chalaitesi, cz i need descending order
  //       const tempObj = {
  //         performedByName: jsonForTaskReporting[i].performedByName,
  //         date: jsonForTaskReporting[i].date,
  //         progressPReported: jsonForTaskReporting[i].progressPReported,
  //         startTime: jsonForTaskReporting[i].startTime,
  //         endTime: jsonForTaskReporting[i].endTime,
  //         note: jsonForTaskReporting[i].note,
  //       };
  //       chequeBookGridXCEL.push(tempObj);
  //     }
  //   }
  //   csvExporter.generateCsv(chequeBookGridXCEL);
  // };

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block w-11/12 ">
          {/* Main Card */}
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
            {/* Main Card header */}
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              {/* -----[Laboratory experimental place starts here]----- */}
              Cheque Book Management
              {/* ---//--[Laboratory experimental place ENDS here]----- */}
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
              <div className="grid grid-cols-4 gap-x-4 mx-1">
                <div className="mt-2">
                  <Autocomplete
                    id="bank"
                    clearOnEscape
                    size="small"
                    options={bankOptionsComboBox ?? []}
                    value={bankOutput || null}
                    // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                    getOptionLabel={(option) =>
                      option?.bankName ? option.bankName : ''
                    }
                    onChange={(e, selectedOption) => {
                      setLeafNoFromOutput(null);
                      setBankOutput(selectedOption);
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
                        label="Bank"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
                <div className="mt-2">
                  <Autocomplete
                    id="leafNoFrom"
                    clearOnEscape
                    size="small"
                    options={leafNoFromOptions ?? []}
                    value={leafNoFromOutput || null}
                    // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                    getOptionLabel={(option) =>
                      option?.chequeLeafNo ? option.chequeLeafNo : ''
                    }
                    onChange={(e, selectedOption) => {
                      // if (selectedOption) {
                      setLeafNoToOutput(null);
                      setLeafNoFromOutput(selectedOption);
                      extractOptionsForLeafNoFrom(selectedOption);
                      // }
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
                        label="Cheque Leaf No. From."
                        variant="outlined"
                      />
                    )}
                  />
                </div>
                <div className="mt-2">
                  <Autocomplete
                    id="leafNoTo"
                    clearOnEscape
                    size="small"
                    options={leafNoToOptions ?? []}
                    value={leafNoToOutput || null}
                    // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                    getOptionLabel={(option) =>
                      option?.chequeLeafNo ? option.chequeLeafNo : ''
                    }
                    onChange={(e, selectedOption) => {
                      // if (selectedOption) {
                      setLeafNoToOutput(selectedOption);
                      // }
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
                        label="Cheque Leaf No. To"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="w-full m-1 modifiedEditTable">
                <MaterialReactTable table={tableInitializer} />
              </div>
            </div>
            {/* Main Card Body--/-- */}

            {/* Main Card footer */}
            <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
              {/* <div className="flex gap-x-3">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    saveTableData();
                  }}
                >
                  Save
                </button>
              </div> */}
            </div>
            {/* Main Card footer--/-- */}
          </div>
          {/* Main Card--/-- */}
        </div>
      </div>

      {/* // modals --- out of html normal body/position */}

      <Modal
        open={leafModalOpen} // leaf view modal
        onClose={handleLeafModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',

          // transition: 'transform 0.9s ease-in',
          // transform: PreviewModalOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '95vw', // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            // backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          {/* <div className="bg-red-500">RUPOM</div> */}
          <IconButton
            aria-label="close"
            onClick={handleLeafModalClose}
            sx={{
              position: 'absolute',
              top: { xs: '10%', md: '2%' },
              right: { xs: '4%', md: '1%' },
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>
          <ChequeBookLeaf
            chequeBookInfo={currentChequeBookRow}
            chequeBookMasterRefetch={chequeBookMasterRefetch}
          />
        </Box>
      </Modal>

      <Modal
        open={createLeafModalOpen} // create leaf modal
        onClose={handleCreateLeafModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '80vw', md: '35vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCreateLeafModalClose}
            sx={{
              position: 'absolute',
              // top: { xs: '25%', sm: '25%', md: '4%' },
              // right: { xs: '4%', sm: '10%', md: '2%' },
              top: '4%',
              right: '4%',
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>
          <CreateChequeLeaf
            chequeBookInfo={currentChequeBookRow}
            chequeBookMasterRefetch={chequeBookMasterRefetch}
            chequeBookDetailRefetch={null}
            handleCreateLeafModalClose={handleCreateLeafModalClose}
          />
        </Box>
      </Modal>

      <Modal
        open={createChequeBookModalOpen} // create cheque book modal
        onClose={handleCreateChequeBookModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: 'flex',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '80vw', md: '35vw' }, // Set the width of the modal to full screen
            // height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'white',
            // overflow: 'hidden',
            // borderRadius: '20px 20px 20px 20px',
            // transition: 'transform 0.9s ease-in', // Add a transition for the transform property
            // transform: historyModalOpen ? 'translateY(0)' : 'translateY(100%)', // Move the modal down (hidden) or up (visible)
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCreateChequeBookModalClose}
            sx={{
              position: 'absolute',
              // top: { xs: '25%', sm: '25%', md: '4%' },
              // right: { xs: '4%', sm: '10%', md: '2%' },
              top: '4%',
              right: '4%',
              color: 'gray',
            }}
          >
            <CloseIcon />
          </IconButton>
          <CreateChequeBook
            chequeBookInfo={currentChequeBookRow}
            chequeBookMasterRefetch={chequeBookMasterRefetch}
          />
        </Box>
      </Modal>

      {/* --------------------------[Making a loader modal]--------------------------------------- */}
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
            width: '100vw', // Set the width of the modal to full screen
            height: '100vh', // Set the height of the modal to full screen
            backgroundColor: 'rgba(251, 255, 255, 0)',
            overflow: 'hidden',
          }}
          // className="voucherGenModal"
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

export default ChequeBookRegistration;
