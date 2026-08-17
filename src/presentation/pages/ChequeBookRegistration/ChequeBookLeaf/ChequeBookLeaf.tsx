/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { Block, BlockRounded, Cancel, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { Controller, useForm } from 'react-hook-form';
import { ExportToCsv } from 'export-to-csv';
import Swal from 'sweetalert2';
import { original } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { IChequeBookDetail } from '../../../../domain/interfaces/ChequeBookDetailInterface';
import {
  ICancelChequeBookDetailCommand,
  IChequeBook,
} from '../../../../domain/interfaces/ChequeBookInterface';
import CreateChequeLeaf from '../CreateChequeLeaf/CreateChequeLeaf';
import avatarColored3 from '../../../assets/data/AvatarColored3.png'; // eitar direct link ashbe, backend jekhane host kora shekhan theke
import { IBankComboBox } from '../../../../domain/interfaces/BankComboBoxInterface';
import {
  useCancelChequeBookDetailMutation,
  useGetChequeBookDetailByChequeBookIdQuery,
} from '../../../../infrastructure/api/ChequeBookApiSlice';

const BR2_URL = window.BR2_URL;

// const chequeBookDetail: IChequeBookDetail[] = [
//   {
//     chequeBookDetailId: 8876,
//     chequeBookId: 986,
//     chequeLeafNo: 'IFIC00S001',
//     used: 'Y', // used
//     vendorId: 1,
//     vendorName: 'DATABIZ',
//     vendorImage: '',
//     paymentNo: 'PAY-0001',
//     paymentDate: '10 April, 2024',
//     attachmentLink:
//       'https://images.pexels.com/photos/14918477/pexels-photo-14918477.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
//   },
//   {
//     chequeBookDetailId: 8876,
//     chequeBookId: 986,
//     chequeLeafNo: 'IFIC00S002',
//     used: 'C', // cancelled
//     vendorId: 1,
//     vendorName: 'DATABIZ',
//     vendorImage: '',
//     paymentNo: 'PAY-0001',
//     paymentDate: '10 April, 2024',
//     attachmentLink:
//       'https://images.pexels.com/photos/14918477/pexels-photo-14918477.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
//   },
//   {
//     chequeBookDetailId: 8876,
//     chequeBookId: 986,
//     chequeLeafNo: 'IFIC00S002',
//     used: 'N', // unused
//     vendorId: null,
//     vendorName: '',
//     vendorImage: '',
//     paymentNo: '',
//     paymentDate: '',
//     attachmentLink: '',
//   },
// ];

interface ChequeBookLeafProps {
  chequeBookInfo: IChequeBook | null | undefined;
  chequeBookMasterRefetch: VoidFunction;
}

const ChequeBookLeaf: React.FC<ChequeBookLeafProps> = ({
  chequeBookInfo,
  chequeBookMasterRefetch,
}) => {
  const navigate = useNavigate();

  let userInfo;
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

  const { register, getValues, reset, control, setValue } = useForm();

  const [createLeafModalOpen, setCreateLeafModalOpen] = useState(false);
  const handleCreateLeafModalOpen = () => setCreateLeafModalOpen(true);
  const handleCreateLeafModalClose = () => setCreateLeafModalOpen(false);
  const [columnVisibility, setColumnVisibility] = useState<any>([]);

  // ---------[api hooks]----------
  // Cheque Book Detail Grid Data
  const {
    data: chequeBookDetail,
    isLoading: chequeBookDetailLoading,
    error: chequeBookDetailError,
    isFetching: chequeBookDetailFetching,
    refetch: chequeBookDetailRefetch,
  } = useGetChequeBookDetailByChequeBookIdQuery({
    chequeBookId: chequeBookInfo?.chequeBookId || 0,
  });

  const [
    cancelChequeBookDetail,
    {
      isLoading: cancelChequeBookDetailLoading,
      isError: cancelChequeBookDetailError,
      error: cancelChequeBookDetailErrorObj,
      isSuccess: cancelChequeBookDetailIsSuccess,
    },
  ] = useCancelChequeBookDetailMutation();

  // ----------------[Function]-------------------

  const handleChequeDetailCancel = (rowToCancel: IChequeBookDetail) => {
    console.log(
      'handleChequeDetailCancel pressed, where chequeBookDetailId: !'
    );
    console.log(rowToCancel.chequeBookDetailId);
    const message = `Are you sure you want to cancel '${rowToCancel.chequeLeafNo}'`;

    Swal.fire({
      title: `Are you sure you want to cancel '${rowToCancel.chequeLeafNo}'`,
      // text: `Are you sure you want to delete the cheque book serial: ${rowToDelete.leafSerialFrom}-${rowToDelete.leafSerialTo} of '${rowToDelete.bankName}'`,
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
        const objToCancel: ICancelChequeBookDetailCommand = {
          chequeBookDetailId: rowToCancel.chequeBookDetailId,
        };
        cancelChequeBookDetail(objToCancel);
      }
    });

    // cancelChequeBookDetail

    // erpor rtkQuery hook call
  };
  const handleChequeDetailDelete = (chequeBookDetailId: number) => {
    console.log(
      'handleChequeDetailDelete pressed, where chequeBookDetailId: !'
    );
    console.log(chequeBookDetailId);
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
          column?.id !== 'cancel' &&
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

  // ---------------------------[UseEffects]-------------------------------
  useEffect(() => {
    if (
      !cancelChequeBookDetailLoading &&
      !cancelChequeBookDetailError &&
      cancelChequeBookDetailIsSuccess
    ) {
      setLoaderSpinnerForThisPage(false);
      toast.success('The cheque leaf has been cancelled successfully!');
      // resetting all fields
      chequeBookDetailRefetch();
      chequeBookMasterRefetch();
    } else if (!cancelChequeBookDetailLoading && cancelChequeBookDetailError) {
      setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something got error in backend when cancelling the cheque book leaf! Check Console!'
      );
      console.log('cancelChequeBookDetailErrorObj, PLEASE SEE:');
      console.log(cancelChequeBookDetailErrorObj);
    } else if (cancelChequeBookDetailLoading) {
      setLoaderSpinnerForThisPage(true);
    }
  }, [
    cancelChequeBookDetailLoading,
    cancelChequeBookDetailError,
    cancelChequeBookDetailIsSuccess,
    cancelChequeBookDetailErrorObj,
  ]);

  useEffect(() => {
    if (chequeBookDetailError) {
      toast.error(
        'Got error while fetching data for ChequeBook Leaf! See console!'
      );
      console.log('Cheque Book Detail Error--------->');
      console.log(chequeBookDetailError);
      setChequeBookLeafGrid([]);
    } else {
      let chequeBookDetailWithEmpty: IChequeBookDetail[] = [];
      let numberOfEmptyRows: number = 0;
      if (chequeBookDetail) {
        chequeBookDetailWithEmpty = JSON.parse(
          JSON.stringify(chequeBookDetail)
        );
        numberOfEmptyRows = 12 - (chequeBookDetailWithEmpty?.length || 0);
      }

      for (let i = 0; i < numberOfEmptyRows; i++) {
        chequeBookDetailWithEmpty.push({
          chequeBookDetailId: 0,
          chequeBookId: 0,
          chequeLeafNo: '',
          used: null,
          vendorId: null,
          vendorName: null,
          vendorImage: null,
          paymentNo: null,
          paymentDate: null,
          attachmentLink: null,
        });
      }
      setChequeBookLeafGrid(chequeBookDetailWithEmpty || []);
    }
  }, [
    chequeBookDetail,
    chequeBookDetailError,
    chequeBookDetailLoading,
    chequeBookDetailFetching,
  ]);

  // --------------------------[variable initializations]---------------

  const chequeBookLeafColumns = useMemo<MRT_ColumnDef<IChequeBookDetail>[]>(
    () => [
      {
        // accessorKey: 'delete', // access nested data with dot notation
        id: 'cancel', // access nested data with dot notation
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
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (
            (row.original.used === 'N' || !row.original.used) &&
            row.original.chequeBookDetailId
          ) {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
            {row.original.chequeBookDetailId ? (
              //   {/* <Tooltip
              //   className={
              //     // row.original.accountsId ||
              //     // row.original.amount ||
              //     // row.original.groupName ||
              //     // row.original.name
              //     //   ? 'visible'
              //     //   : 'invisible'
              //     'visible'
              //   }
              //   arrow
              //   placement="right"
              //   title="Delete"
              // >
              //   <IconButton
              //     color="error"
              //     onClick={() => {
              //       handleChequeDetailDelete(row.original.chequeBookDetailId);
              //     }}
              //   >
              //     <Delete />
              //   </IconButton>
              // </Tooltip> */}
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
                title="Cancel"
              >
                <IconButton
                  color={
                    row.original.used === 'Y' || row.original.used === 'C'
                      ? 'default'
                      : 'error'
                  }
                  onClick={() => {
                    if (row.original.used === 'Y') {
                      toast.info(
                        'This Cheque Leaf has already been used! Cannot be cancelled after usage!'
                      );
                    } else if (row.original.used === 'C') {
                      toast.info(
                        'This Cheque Leaf has already been cancelled!'
                      );
                    } else {
                      handleChequeDetailCancel(row.original);
                    }
                  }}
                >
                  <Block />
                </IconButton>
              </Tooltip>
            ) : (
              ''
            )}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.chequeLeafNo ?? '', // access nested data with dot notation
        id: 'chequeLeafNo',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Leaf No.',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
        accessorFn: (row) => row.used ?? '', // access nested data with dot notation
        id: 'used',
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Status',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
          let textInDiv = renderedCellValue;
          if (renderedCellValue === 'Y') {
            divClass =
              'rounded-full border border-slate-300 py-1 px-2 bg-slate-100';
            iconClass = 'fas fa-circle fa-xs text-slate-500';
            textInDiv = 'Used';
          } else if (renderedCellValue === 'N') {
            divClass =
              'rounded-full border border-slate-300 py-1 px-2 bg-green-100';
            iconClass = 'fas fa-circle fa-xs text-green-700';
            textInDiv = 'Unused';
          } else if (renderedCellValue === 'C') {
            divClass =
              'rounded-full border border-slate-300 py-1 px-2 bg-red-100';
            iconClass = 'fas fa-circle fa-xs text-red-700';
            textInDiv = 'Cancelled';
          }

          return (
            <div className="w-full flex justify-center">
              {row.original.chequeBookDetailId ? (
                <div className={divClass}>
                  <i className={iconClass} /> {textInDiv}
                </div>
              ) : (
                // {/* <div className="rounded-full border bg-slate-100 py-1 px-2">
                //   <i className=" fas fa-circle text-slate-500 text-[10px]" />{' '}
                //   {renderedCellValue}
                // </div>
                // <div className="rounded-full border bg-red-100 py-1 px-2">
                //   <i className=" fas fa-circle text-red-700 text-[10px]" />{' '}
                //   {renderedCellValue}
                // </div> */}
                ''
              )}
            </div>
          );
        },
      },

      {
        // accessorFn: (row) => row.leafSerialTo ?? '', // access nested data with dot notation
        id: 'leafEntryDate',
        accessorKey: '', // access nested data with dot notation
        header: 'Leaf Entry Date',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
              value={
                (row.original.chequeBookDetailId &&
                  chequeBookInfo?.entryDate) ||
                ''
              }
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
        id: 'leafApprovedBy',
        accessorKey: '', // access nested data with dot notation
        header: 'Leaf Approved By',
        // size: 1, // small column
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
            bgCellColor = '#fceded';
          }
          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {row.original.chequeBookDetailId &&
              chequeBookInfo?.approvedByName ? (
                <img
                  className="rounded-full h-7 w-7 bg-gray-500"
                  alt="avatar"
                  // src={row.performedByImage? avatarColored3}
                  src={
                    chequeBookInfo?.approvedByImage &&
                    chequeBookInfo?.approvedByName
                      ? chequeBookInfo?.approvedByImage
                      : avatarColored3
                  }
                />
              ) : (
                ''
              )}

              {row.original.chequeBookDetailId ? (
                <span>{chequeBookInfo?.approvedByName}</span>
              ) : (
                <div className="p-5" />
              )}
            </Box>
          );
        },
      },

      {
        accessorFn: (row) => row.paymentNo ?? '', // access nested data with dot notation
        id: 'paymentNo',
        // accessorKey: 'transactionName',
        header: 'Payment No',
        grow: true,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
        accessorFn: (row) => row.vendorName ?? '', // access nested data with dot notation
        id: 'vendorName',
        header: 'Vendor Name',
        grow: true,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
            bgCellColor = '#fceded';
          }
          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        // Cell: ({ renderedCellValue, row }) => {
        //   return (
        //     <TextField
        //       sx={{ width: '100%' }}
        //       value={renderedCellValue || ''}
        //       InputProps={{
        //         style: { fontSize: 13 },
        //         disableUnderline: true,
        //         readOnly: true,
        //       }}
        //       variant="standard"
        //       size="small"
        //     />
        //   );
        // },
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
                    row.original?.vendorImage && renderedCellValue
                      ? row.original?.vendorImage
                      : avatarColored3
                  }
                />
              ) : (
                ''
              )}

              <span>{renderedCellValue ?? ''}</span>
            </Box>
          );
        },
      },
      {
        accessorFn: (row) => row.paymentDate ?? '', // access nested data with dot notation
        id: 'paymentDate',
        header: 'Payment Date',
        grow: true,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
        // accessorFn: (row) => row.paymentDate ?? '', // access nested data with dot notation
        id: 'approvalDate',
        header: 'Approval Date',
        grow: true,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
              value={
                (row.original.chequeBookDetailId &&
                  chequeBookInfo?.approvalDate) ||
                ''
              }
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
        accessorFn: (row) => row.attachmentLink ?? '', // access nested data with dot notation
        id: 'attachmentLink',
        header: 'Attachment Link',
        grow: true,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = '#ffffff';
          if (row.original.used === 'Y') {
            bgCellColor = '#f0f0f0';
          } else if (row.original.used === 'N') {
            bgCellColor = '#effced';
          } else if (row.original.used === 'C') {
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
            <div className="w-full flex justify-center">
              <div className="">
                {row.original?.attachmentLink ? (
                  <button
                    // disabled={shouldVoucherCreateBtnDisable}
                    className={`transform-all duration-700 ease-in-out border border-slate-300 text-blue-700 hover:bg-blue-700 hover:text-white
                    font-bold py-2 px-2 rounded-full flex items-center focus:outline-none focus:shadow-outline-blue relative overflow-hidden`}
                    onClick={() => {
                      console.log('show attachment/ download the attachment');
                      window.open(
                        `${BR2_URL}${row.original?.attachmentLink as string}`,
                        '_blank'
                      );
                    }}
                  >
                    <span className=" font-bold text-[13px] leading-none">
                      <i className="far fa-eye fa-sm" /> Attachment
                    </span>
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
          );
        },
      },
    ],
    [
      chequeBookInfo?.approvedByName,
      chequeBookInfo?.entryDate,
      chequeBookInfo?.approvalDate,
      chequeBookInfo?.approvedByImage,
    ]
  );

  const tableInitializer: MRT_TableInstance<IChequeBookDetail> =
    useMaterialReactTable({
      columns: chequeBookLeafColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: chequeBookLeafGrid || [],
      state: {
        isLoading: chequeBookDetailLoading || chequeBookDetailFetching,
        columnVisibility,
      },
      onColumnVisibilityChange: setColumnVisibility,
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
          borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora cz raw css diye
          // borderLeft: '1px solid #e0e0e0',
          // borderTop: '1px solid #e0e0e0',
          // borderBottom: '1px solid #e0e0e0',
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
      renderToolbarInternalActions: ({ table }) => {
        const disabledClass =
          'inline-block px-[6px] py-1 bg-gray-500 text-white font-medium text-xs leading-tight rounded-full hover:bg-gray-600 hover:shadow-lg hover:scale-110 focus:bg-gray-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-600  active:-translate-y-1 active:shadow-lg transform-all duration-700 ease-in-out cursor-not-allowed';
        const enabledClass =
          'inline-block px-[6px] py-1 bg-blue-700 text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-900 hover:shadow-lg hover:scale-110 focus:bg-blue-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-700 ease-in-out';

        return (
          <>
            {/* built-in buttons (must pass in table prop for them to work!) */}
            <MRT_ToggleGlobalFilterButton table={table} />
            <div className="mx-2">
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className={
                  chequeBookInfo?.approved === 'Y'
                    ? disabledClass
                    : enabledClass
                }
                onClick={() => {
                  if (chequeBookInfo?.approved === 'Y') {
                    toast.info(
                      'You cannot add new leaf to a approved cheque book!'
                    );
                  } else {
                    setCreateLeafModalOpen(true);
                  }
                }}
              >
                +Add Leaves
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
                  handleExportData(chequeBookDetail, chequeBookLeafColumns);
                }}
              >
                <i className="fas fa-file-excel" />
              </button>
            </div>
            {/* add your own custom print button or something */}
          </>
        );
      },
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

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block w-[100%]">
          {/* Main Card */}
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
            {/* Main Card header */}
            <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              {/* -----[Laboratory experimental place starts here]----- */}
              Cheque Book Leaf Management
              {/* ---//--[Laboratory experimental place ENDS here]----- */}
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start h-[76vh] gap-4 mt-2">
              <div className="grid grid-cols-4 gap-x-4 mx-1">
                <div className="mt-2">
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
                        InputProps={{ readOnly: true, style: { fontSize: 13 } }}
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
                <div className="mt-2">
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
                        InputProps={{ readOnly: true, style: { fontSize: 13 } }}
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
            chequeBookInfo={chequeBookInfo}
            chequeBookMasterRefetch={chequeBookMasterRefetch}
            chequeBookDetailRefetch={chequeBookDetailRefetch}
            handleCreateLeafModalClose={handleCreateLeafModalClose}
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

export default ChequeBookLeaf;
