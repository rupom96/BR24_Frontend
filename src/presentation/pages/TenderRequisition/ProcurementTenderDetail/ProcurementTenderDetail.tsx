/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/button-has-type */
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
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Popper,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { ExportToCsv } from 'export-to-csv';
import axios from 'axios';
import { useGetProductGroupByCompanyIdQuery } from '../../../../infrastructure/api/ProductApiSlice';
import { useAppDispatch } from '../../../../application/Redux/store/store';
import { setNavbarShow } from '../../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../../application/Redux/slices/ShowPanelSlice';
import {
  IDeleteProcurementTenderDetailCommand,
  IProcurementTenderDetail,
} from '../../../../domain/interfaces/ProcurementTenderDetailInterface';
import {
  IBrand,
  IProductComboBox,
  IProductGroupComboBox,
  IUserProduct,
} from '../../../../domain/interfaces/ProductInterfaces';
import { useGetProcurementTenderDetailByTenderIdQuery } from '../../../../infrastructure/api/TenderApiSlice';
import { IFormProps } from '../../../../domain/interfaces/FormPropsInterface';
import { ITenderNoComboBox } from '../../../../domain/interfaces/ProcurementTenderInterface';
import {
  useGetPermissionWiseUserProductGroupQuery,
  useGetPermissionWiseUserProductQuery,
} from '../../../../infrastructure/api/DynamicApiSlice';

const API_BASE_URL = window.API_BASE_URL;

interface AdditionalProps {
  tenderInfo: ITenderNoComboBox | null;
  setTenderInfo: React.Dispatch<React.SetStateAction<ITenderNoComboBox | null>>;
  clickedCardInfo: any;
  procurementTenderDetailState: IProcurementTenderDetail[];
  setProcurementTenderDetailState: React.Dispatch<
    React.SetStateAction<IProcurementTenderDetail[]>
  >;
  procurementTenderDetailStatePrev: IProcurementTenderDetail[];
  setProcurementTenderDetailStatePrev: React.Dispatch<
    React.SetStateAction<IProcurementTenderDetail[]>
  >;
  deletedRowProcurementTenderDetail: IDeleteProcurementTenderDetailCommand[];
  setDeletedRowProcurementTenderDetail: React.Dispatch<
    React.SetStateAction<IDeleteProcurementTenderDetailCommand[]>
  >;
}

interface ProcurementTenderDetailComponentProps extends AdditionalProps {
  formProps: IFormProps;
}

const ProcurementTenderDetail: React.FC<
  ProcurementTenderDetailComponentProps
> = ({
  formProps,
  tenderInfo,
  setTenderInfo,
  clickedCardInfo,
  procurementTenderDetailState,
  setProcurementTenderDetailState,
  procurementTenderDetailStatePrev,
  setProcurementTenderDetailStatePrev,
  deletedRowProcurementTenderDetail,
  setDeletedRowProcurementTenderDetail,
}) => {
  // ---------------------[user session reading works]--------------------
  const navigate = useNavigate();

  const [columnVisibility, setColumnVisibility] = useState<any>([]);
  const dispatch = useAppDispatch();
  dispatch(setNavbarShow(true));
  dispatch(setPanelShow(true));

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

  // destructuring nested formProps
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
    errors,
  } = formProps;

  const [productGroupOptions, setProductGroupOptions] = useState<
    IProductComboBox[] | null
  >([]);

  const [brandOptions, setBrandOptions] = useState<IBrand[] | null>([]);

  const [productOptions, setProductOptions] = useState<
    IProductComboBox[] | null
  >([]);

  // ----------------------[api hooks]---------------

  // procurementTenderDetail autocomp options
  const {
    data: procurementTenderDetailData,
    isLoading: procurementTenderDetailLoading,
    error: procurementTenderDetailError,
    isSuccess: procurementTenderDetailIsSuccess,
    isError: procurementTenderDetailIsError,
    isFetching: procurementTenderDetailIsFetching,
    refetch: procurementTenderDetailRefetch,
  } = useGetProcurementTenderDetailByTenderIdQuery(
    {
      tenderId: tenderInfo?.procurementTenderId || 0,
    },
    { skip: !tenderInfo?.procurementTenderId }
  );

  useEffect(() => {
    if (procurementTenderDetailIsError) {
      setDeletedRowProcurementTenderDetail([]);
      toast.error(
        'Something wrong from backend while fetching procurementTenderDetail grid, see console!'
      );
      console.log(
        'Something wrong from backend while fetching procurementTenderDetail grid, see console--->:'
      );
      console.log(procurementTenderDetailError);
    }

    if (
      !procurementTenderDetailLoading &&
      !procurementTenderDetailIsFetching &&
      !procurementTenderDetailIsError &&
      procurementTenderDetailIsSuccess &&
      procurementTenderDetailData
    ) {
      setDeletedRowProcurementTenderDetail([]);
      console.log('fetched data of procurementTenderDetail grid');
      console.log(procurementTenderDetailData);

      const copyOfProcurementTenderDetail = JSON.parse(
        JSON.stringify(procurementTenderDetailData)
      );
      const copyOfProcurementTenderDetail2 = JSON.parse(
        JSON.stringify(procurementTenderDetailData)
      );

      const emptyProcurementTenderDetailArray = [];
      if (
        copyOfProcurementTenderDetail &&
        copyOfProcurementTenderDetail.length < 10
      ) {
        for (let i = copyOfProcurementTenderDetail.length - 1; i < 10; i++) {
          const emptyProcurementTenderDetailObj: IProcurementTenderDetail = {
            procurementTenderDetailId: null,
            productGroupName: null,
            productGroupId: null,
            quantity: null,
            productName: null,
            productId: null,
            brandId: null,
            brandName: null,
            price: null,
            initialFactor: null,
            loading: false,
          };
          emptyProcurementTenderDetailArray.push(
            emptyProcurementTenderDetailObj
          );
        }
      } else if (
        copyOfProcurementTenderDetail &&
        copyOfProcurementTenderDetail.length > 9
      ) {
        const emptyProcurementTenderDetailObj: IProcurementTenderDetail = {
          procurementTenderDetailId: null,
          productGroupName: null,
          productGroupId: null,
          quantity: null,
          productName: null,
          productId: null,
          brandId: null,
          brandName: null,
          price: null,
          initialFactor: null,
          loading: false,
        };
        emptyProcurementTenderDetailArray.push(emptyProcurementTenderDetailObj);
      }

      setProcurementTenderDetailState([
        ...copyOfProcurementTenderDetail,
        ...emptyProcurementTenderDetailArray,
      ]);
      setProcurementTenderDetailStatePrev(copyOfProcurementTenderDetail2);
    }
  }, [
    procurementTenderDetailLoading,
    procurementTenderDetailIsError,
    procurementTenderDetailError,
    procurementTenderDetailIsSuccess,
    procurementTenderDetailData,
    procurementTenderDetailIsFetching,
  ]);

  // productGroup autocomp options
  // const {
  //   data: productGroupComboOptions,
  //   isLoading: productGroupComboOptionsLoading,
  //   error: productGroupComboOptionsError,
  //   isSuccess: productGroupComboOptionsIsSuccess,
  //   isError: productGroupComboOptionsIsError,
  //   isFetching: productGroupComboOptionIsFetching,
  //   refetch: productGroupComboOptionsRefetch,
  // } = useGetProductGroupByCompanyIdQuery({
  //   companyId: userInfo?.companyId,
  // });

  // useEffect(() => {
  //   if (productGroupComboOptionsIsError) {
  //     toast.error(
  //       'Something wrong from backend while fetching productGroup options for autocomplete, see console!'
  //     );
  //     console.log(
  //       'Something wrong from backend while fetching productGroup NO options for autocomplete, see console--->:'
  //     );
  //     console.log(productGroupComboOptionsError);
  //   }
  // }, [
  //   productGroupComboOptionsLoading,
  //   productGroupComboOptionsIsError,
  //   productGroupComboOptionsError,
  // ]);

  // productGroup autocomp options
  const {
    data: userProductGroupOptions,
    isLoading: userProductGroupOptionsLoading,
    error: userProductGroupOptionsError,
    isSuccess: userProductGroupOptionsIsSuccess,
    isError: userProductGroupOptionsIsError,
    isFetching: userProductGroupIsFetching,
    refetch: userProductGroupRefetch,
  } = useGetPermissionWiseUserProductGroupQuery({
    companyId: userInfo?.companyId || 0,
    biznessEventProcessConfigurationId:
      clickedCardInfo?.biznessEventProcessConfigurationId || 0,
    locationId: userInfo?.locationId || 0,
    userId: userInfo?.securityUserId || 0,
  });

  useEffect(() => {
    if (userProductGroupOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching productGroup options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching productGroup NO options for autocomplete, see console--->:'
      );
      console.log(userProductGroupOptionsError);
    }
  }, [
    userProductGroupOptionsLoading,
    userProductGroupOptionsIsError,
    userProductGroupOptionsError,
  ]);

  // user-product autocomp options
  const {
    data: userProductOptions,
    isLoading: userProductOptionsLoading,
    error: userProductOptionsError,
    isSuccess: userProductOptionsIsSuccess,
    isError: userProductOptionsIsError,
    isFetching: userProductOptionsIsFetching,
    refetch: userProductRefetch,
  } = useGetPermissionWiseUserProductQuery({
    companyId: userInfo?.companyId || 0,
    biznessEventProcessConfigurationId:
      clickedCardInfo?.biznessEventProcessConfigurationId || 0,
    locationId: userInfo?.locationId || 0,
    userId: userInfo?.securityUserId || 0,
  });

  useEffect(() => {
    if (userProductOptionsIsError) {
      toast.error(
        'Something wrong from backend while fetching produc options for autocomplete, see console!'
      );
      console.log(
        'Something wrong from backend while fetching product NO options for autocomplete, see console--->:'
      );
      console.log(userProductOptionsError);
    }
  }, [
    userProductOptionsLoading,
    userProductOptionsIsError,
    userProductOptionsError,
  ]);

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

  // ------------[normal functions]---------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const checkAndSetTableValues = useCallback(
    (index: number) => {
      if (index === procurementTenderDetailState.length - 1) {
        const emptyProcurementTenderDetailObj: IProcurementTenderDetail = {
          procurementTenderDetailId: null,
          productGroupName: null,
          productGroupId: null,
          quantity: null,
          productName: null,
          productId: null,
          brandId: null,
          brandName: null,
          price: null,
          initialFactor: null,
          loading: false,
        };
        setProcurementTenderDetailState([
          ...procurementTenderDetailState,
          emptyProcurementTenderDetailObj,
        ]);
      } else {
        setProcurementTenderDetailState([...procurementTenderDetailState]);
      }
    },
    [procurementTenderDetailState]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleProductGroupChange = (selectedItem: any, rowIndex: number) => {
    console.log('Selected item:', selectedItem);
    if (selectedItem) {
      procurementTenderDetailState[rowIndex].productGroupId =
        selectedItem?.productGroupId;
      procurementTenderDetailState[rowIndex].productGroupName =
        selectedItem?.productGroupName;
    } else {
      procurementTenderDetailState[rowIndex].productGroupId = null;
      procurementTenderDetailState[rowIndex].productGroupName = '';
    }
    // clearing productSelelction onChange product group
    procurementTenderDetailState[rowIndex].productId = null;
    procurementTenderDetailState[rowIndex].productName = '';
    checkAndSetTableValues(rowIndex);
  };

  const fetchProducts = async (productGroupId: number) => {
    try {
      const dataToReturn = [];
      const response = await axios.get(
        `${API_BASE_URL}/Product/getProductByCompanyProductGroupId?companyId=${userInfo?.companyId}&groupId=${productGroupId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.userToken || ''}`,
          },
        }
      );
      let prodOptions = response?.data || [];
      if (
        !userProductOptionsIsError &&
        !userProductOptionsIsFetching &&
        !userProductOptionsLoading &&
        response?.data &&
        userProductOptions
      ) {
        console.log(
          'userProductOptionsuserProductOptionsuserProductOptions----->'
        );
        console.log(userProductOptions);
        const filteredOptions = prodOptions
          .filter((product: IProductComboBox) =>
            userProductOptions.some(
              (userProduct) => userProduct.productId === product.productId
            )
          )
          .map((product: IProductComboBox) => {
            const userProductData = userProductOptions.find(
              (userProductRow: IUserProduct) =>
                userProductRow.productId === product.productId
            );
            return { ...product, limit: userProductData?.limit || 0 };
          });
        prodOptions = [...filteredOptions];
        console.log(filteredOptions);
      }
      return prodOptions;
    } catch (error) {
      toast.error(
        `Error fetching products from backend, for this group :${error}`
      );
      return [];
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleProductFocus = async (rowIndex: number) => {
    setProductOptions([]);

    const productGroupId = procurementTenderDetailState
      ? procurementTenderDetailState[rowIndex].productGroupId
      : 0;

    console.log('productGroupId');
    console.log(productGroupId);

    if (productGroupId && procurementTenderDetailState) {
      procurementTenderDetailState[rowIndex].loading = true;
      setProcurementTenderDetailState(procurementTenderDetailState);
      const productOptionsFetched: IProductComboBox[] =
        await fetchProducts(productGroupId);

      console.log(productOptionsFetched);
      setProductOptions(productOptionsFetched);
      procurementTenderDetailState[rowIndex].loading = false;
      setProcurementTenderDetailState(procurementTenderDetailState);
    }
  };

  // ----set 10 empty rows if no tenderNo
  useEffect(() => {
    if (!tenderInfo?.procurementTenderId) {
      const emptyArray = [];
      for (let i = 0; i < 10; i++) {
        const emptyProcurementTenderDetailObj: IProcurementTenderDetail = {
          procurementTenderDetailId: null,
          productGroupName: null,
          productGroupId: null,
          quantity: null,
          productName: null,
          productId: null,
          brandId: null,
          brandName: null,
          price: null,
          initialFactor: null,
          loading: false,
        };
        emptyArray.push(emptyProcurementTenderDetailObj);
      }
      setProcurementTenderDetailState([...emptyArray]);
    }
  }, [tenderInfo?.procurementTenderId, tenderInfo]);

  /// /-----------------auto comp list style-----------------
  interface AutoCompResStyles {
    popper: {
      maxWidth: string;
      // minWidth: string;
      fontSize: string;
    };
  }
  const autoCompResStyles: AutoCompResStyles = {
    popper: {
      maxWidth: 'fit-content',
      // minWidth: 'inherit',
      fontSize: '12px',
    },
  };
  const PopperMy = useCallback(
    (propsPopper: any) => {
      return <Popper {...propsPopper} style={autoCompResStyles.popper} />;
    },
    [autoCompResStyles.popper]
  ); // Empty dependency array as PopperMy doesn't depend on any external variables

  // -----------------[validation functions]-----------------------
  const validatePreworkShareOfLoadDeliveryTime = (
    value: any,
    allFields: IProcurementTenderDetail
  ) => {
    // console.log('Validation function, VALUE:--->');
    // console.log(value);
    // console.log('Validation function, ROW:--->');
    // console.log(allFields);
    // Check if all other attributes of the row are empty

    console.log('current row');
    console.log(allFields);

    const isPreworkShareOfLoadDeliveryTimeMandatory =
      userInfo.brFeatureList.find(
        (f: any) => f.featureName === 'PreworkShareOfLoadDeliveryTimeMandatory'
      )?.isAllowed ?? false;

    const allFieldsAsAny = allFields as {
      [key: string]: any;
    };
    const otherAttributesAreEmpty = Object.keys(allFieldsAsAny).every((key) => {
      // Assuming `key` is not `productGroup` and `allFields[key]` is empty
      // return key === `productGroup_row${row.index}` || !allFields[key];
      return !allFieldsAsAny[key];
    });
    // If other attributes are empty, productGroup is required
    console.log('otherAttributesAreEmpty');

    console.log(value);

    console.log('!otherAttributesAreEmpty && !value');
    console.log(!otherAttributesAreEmpty && !value);
    if (
      !otherAttributesAreEmpty &&
      !value &&
      isPreworkShareOfLoadDeliveryTimeMandatory
    ) {
      return '*Required';
    }
    return true;
  };
  const validateProduct = (value: any, allFields: IProcurementTenderDetail) => {
    console.log('Validation function, VALUE:--->');
    console.log(value);
    console.log('Validation function, ROW:--->');
    console.log(allFields);
    // Check if all other attributes of the row are empty
    const allFieldsAsAny = allFields as {
      [key: string]: any;
    };
    const otherAttributesAreEmpty = Object.keys(allFieldsAsAny).every((key) => {
      // Assuming `key` is not `productGroup` and `allFields[key]` is empty
      // return key === `productGroup_row${row.index}` || !allFields[key];
      return !allFieldsAsAny[key];
    });
    // If other attributes are empty, productGroup is required
    if (!otherAttributesAreEmpty && !value?.productId) {
      return '*Required';
    }
    return true;
  };

  const validateProductGroup = (
    value: any,
    allFields: IProcurementTenderDetail
  ) => {
    // console.log('Validation function, VALUE:--->');
    // console.log(value);
    // console.log('Validation function, ROW:--->');
    // console.log(allFields);
    // Check if all other attributes of the row are empty

    console.log('current row');
    console.log(allFields);

    const allFieldsAsAny = allFields as {
      [key: string]: any;
    };
    const otherAttributesAreEmpty = Object.keys(allFieldsAsAny).every((key) => {
      // Assuming `key` is not `productGroup` and `allFields[key]` is empty
      // return key === `productGroup_row${row.index}` || !allFields[key];
      return !allFieldsAsAny[key];
    });
    // If other attributes are empty, productGroup is required
    // console.log('!otherAttributesAreEmpty');
    // console.log(!otherAttributesAreEmpty);
    // console.log('!value');
    // console.log(!value);
    // console.log(value);

    console.log('!otherAttributesAreEmpty && !value');
    console.log(!otherAttributesAreEmpty && !value);
    if (!otherAttributesAreEmpty && !value?.productGroupId) {
      return '*Required';
    }
    return true;
  };

  const isTheFieldDisabled = (
    productGroupId: number,
    productId: number,
    brandId: number
  ) => {
    let isDisabled: boolean = false;

    let ifProductGroupExists: boolean = true;
    let ifProductExists: boolean = true;
    const ifBrandExists: boolean = true;

    if (productGroupId && userProductGroupOptions) {
      ifProductGroupExists = userProductGroupOptions.some(
        (row) => row.productGroupId === productGroupId
      );
    }
    if (productId && userProductOptions) {
      ifProductExists = userProductOptions.some(
        (row) => row.productId === productId
      );
    }
    if (brandId) {
      // ifBrandExists = userBrandOptions.some((row) => row.brandId === brandId);
    }

    isDisabled = !(ifProductGroupExists && ifProductExists && ifBrandExists);
    return isDisabled;
  };
  // -----------[Grid variables declaration]-------------

  const procurementTenderDetailColumns = useMemo<
    MRT_ColumnDef<IProcurementTenderDetail>[]
  >(
    () => [
      {
        id: 'delete', // access nested data with dot notation
        header: '',
        size: 1, // small column
        grow: false,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,
        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),
        Cell: ({ renderedCellValue, row }) => (
          <div className="w-full flex justify-center">
            <Tooltip
              className={
                (row.original.productGroupId ||
                  row.original.productId ||
                  row.original.quantity ||
                  row.original.price ||
                  row.original.initialFactor) &&
                !isTheFieldDisabled(
                  row.original.productGroupId || 0,
                  row.original.productId || 0,
                  row.original?.brandId || 0
                )
                  ? 'visible'
                  : 'invisible'
              }
              arrow
              placement="right"
              title="Delete"
            >
              <IconButton
                color="error"
                onClick={() => {
                  // handleDeleteRow(row.index, row.original);
                  if (row.original.procurementTenderDetailId) {
                    const tempDeletedObj: IDeleteProcurementTenderDetailCommand =
                      {
                        procurementTenderDetailId:
                          row.original.procurementTenderDetailId,
                      };

                    deletedRowProcurementTenderDetail?.push(tempDeletedObj);
                  }
                  procurementTenderDetailState?.splice(row.index, 1);
                  if (procurementTenderDetailState) {
                    setProcurementTenderDetailState([
                      ...procurementTenderDetailState,
                    ]);
                  } else {
                    setProcurementTenderDetailState([]);
                  }
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
      {
        accessorFn: (row) => row.productGroupName ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.productGroupName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'productGroupName',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Product Group',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          // ekhane error er value and message set korbi
          // const error = false;
          // const errorMessage = 'Hello';
          const currentProductGroup = {
            productGroupId:
              procurementTenderDetailState[row.index].productGroupId || null,
            productGroupName:
              procurementTenderDetailState[row.index].productGroupName || '',
          };
          setValue(`productGroup_row${row.index}`, currentProductGroup);

          return (
            <Controller
              name={`productGroup_row${row.index}`}
              control={control}
              rules={{
                // required: '*Required',
                validate: (value) => validateProductGroup(value, row.original),
              }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id=""
                  size="small"
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  clearOnEscape
                  // disableClearable
                  freeSolo
                  // options={productGroupComboOptions || []} // Make sure bankComboOptions is defined
                  disabled={isTheFieldDisabled(
                    row.original.productGroupId || 0,
                    row.original.productId || 0,
                    row.original.brandId || 0
                  )}
                  options={
                    Array.from(
                      new Map(
                        userProductGroupOptions?.map(
                          (userProductGroupOption) => [
                            userProductGroupOption.productGroupName,
                            userProductGroupOption,
                          ]
                        )
                      ).values()
                    ) || []
                  } // making sure that the array is unique by productGroupName, else autocomplete search ultapalta behave kore
                  value={currentProductGroup}
                  onChange={(event, selectedOption) => {
                    handleProductGroupChange(selectedOption, row.index);
                    setValue(`productGroup_row${row.index}`, selectedOption);
                    onChange(selectedOption);
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.productGroupName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.productGroupId === selectedValue?.productGroupId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                        disableUnderline: true,
                      }}
                      sx={{ width: '100%' }}
                      // inputRef={ref}
                      inputRef={(node) => {
                        if (node) {
                          // eslint-disable-next-line no-param-reassign
                          node.value = renderedCellValue;
                        }
                      }}
                      // onBlur={() => { console.log(this) }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },
      // {
      //   accessorFn: (row) => row.productName ?? '',
      //   id: 'productName',
      //   header: 'Product Name',
      //   Cell: ({ cell, row }) => {
      //     // ekhane error er value and message set korbi
      //     const error = false;
      //     const errorMessage = 'Hello';
      //     const currentProduct = {
      //       productId: row.original.productId || null,
      //       productName: row.original.productName || '',
      //     };
      //     return (
      //       <Autocomplete
      //         options={productOptions || []}
      //         value={currentProduct}
      //         sx={{ width: '100%' }}
      //         PopperComponent={PopperMy}
      //         clearOnEscape
      //         disableClearable
      //         freeSolo
      //         loading={row.original.loading || false}
      //         onChange={(event, selectedOption: any) => {
      //           // handleProductChange(newValue as string, row.index)

      //           procurementTenderDetailState[row.index].productId =
      //             selectedOption?.productId || null;
      //           procurementTenderDetailState[row.index].productName =
      //             selectedOption?.productName || '';
      //           checkAndSetTableValues(row.index);
      //         }}
      //         isOptionEqualToValue={(options, selectedOption) =>
      //           options.productId === selectedOption.productId
      //         }
      //         getOptionLabel={(option: any) =>
      //           option ? option.productName : ''
      //         }
      //         renderInput={(params) => (
      //           <TextField
      //             {...params}
      //             // label="Product"

      //             onFocus={() => handleProductFocus(row.index)}
      //             InputProps={{
      //               ...params.InputProps,
      //               style: { fontSize: 13 },
      //               disableUnderline: true,
      //               endAdornment: (
      //                 <>
      //                   {row.original.loading ? (
      //                     <CircularProgress color="inherit" size={20} />
      //                   ) : null}
      //                   {params.InputProps.endAdornment}
      //                 </>
      //               ),
      //             }}
      //             variant="standard"
      //             size="small"
      //             error={!!error}
      //             helperText={error ? errorMessage : null}
      //             FormHelperTextProps={{
      //               sx: {
      //                 fontSize: 10, // Set the font size
      //                 marginTop: 0, // Set the margin
      //                 color: 'red', // Set the color (example)
      //               },
      //             }}
      //           />
      //         )}
      //       />
      //     );
      //   },
      // },

      {
        accessorFn: (row) => row.brandName ?? '', // access nested data with dot notation
        id: 'brand',
        enableGlobalFilter: columnVisibility?.brandName, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        size: 200,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Brand',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: true,
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
            />
          );
        },
      },

      {
        accessorFn: (row) => row.productName ?? '',
        id: 'productName',
        header: 'Product Name',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ cell, row }) => {
          // ekhane error er value and message set korbi

          const currentProduct = {
            productId: row.original.productId || null,
            productName: row.original.productName || '',
          };
          setValue(`product_row${row.index}`, currentProduct);
          return (
            <Controller
              name={`product_row${row.index}`}
              control={control}
              rules={
                {
                  // required: '*Required',
                  // validate: (value) => validateProduct(value, row.original),
                }
              }
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  // options={productOptions || []}
                  options={
                    Array.from(
                      new Map(
                        productOptions?.map((productOption) => [
                          productOption.productName,
                          productOption,
                        ])
                      ).values()
                    ) || []
                  } // making sure that the array is unique by productName, else autocomplete search ultapalta behave kore
                  value={currentProduct}
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  disabled={isTheFieldDisabled(
                    row.original.productGroupId || 0,
                    row.original.productId || 0,
                    row.original.brandId || 0
                  )}
                  clearOnEscape
                  // disableClearable
                  freeSolo
                  loading={row.original.loading || false}
                  onChange={(event, selectedOption: any) => {
                    // handleProductChange(newValue as string, row.index)

                    procurementTenderDetailState[row.index].productId =
                      selectedOption?.productId || null;
                    procurementTenderDetailState[row.index].productName =
                      selectedOption?.productName || '';
                    procurementTenderDetailState[row.index].brandId =
                      selectedOption?.brandId || null;
                    procurementTenderDetailState[row.index].brandName =
                      selectedOption?.brandName || '';
                    checkAndSetTableValues(row.index);
                    setValue(`product_row${row.index}`, selectedOption);
                    onChange(selectedOption);
                  }}
                  onBlur={onBlur} // Trigger validation on blur
                  isOptionEqualToValue={(options, selectedOption) =>
                    options.productId === selectedOption.productId
                  }
                  getOptionLabel={(option: any) =>
                    option ? option.productName : ''
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // label="Product"

                      onFocus={() => handleProductFocus(row.index)}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                        disableUnderline: true,
                        endAdornment: (
                          <>
                            {row.original.loading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },

      {
        accessorFn: (row) => row.quantity ?? '', // access nested data with dot notation
        id: 'quantity',
        enableGlobalFilter: columnVisibility?.quantity, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        size: 200,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        // accessorKey: 'transactionName', // access nested data with dot notation
        header: 'Quantity',
        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: isTheFieldDisabled(
                  row.original.productGroupId || 0,
                  row.original.productId || 0,
                  row.original.brandId || 0
                ),
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                procurementTenderDetailState[row.index].quantity = Number.isNaN(
                  parseInt(e.target.value, 10)
                )
                  ? null
                  : Math.abs(parseInt(e.target.value, 10));
                checkAndSetTableValues(row.index);
                // checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.price ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'price',
        enableGlobalFilter: columnVisibility?.price, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Price',
        // size: 1, // small column
        size: 120,
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        grow: false,
        // enableSorting: false,
        // enableColumnActions: false,
        // enableResizing: false,
        // enableColumnFilter: false,

        muiTableHeadCellProps: ({ column }) => ({
          align: 'left',
        }),

        Cell: ({ renderedCellValue, row }) => {
          return (
            <TextField
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: isTheFieldDisabled(
                  row.original.productGroupId || 0,
                  row.original.productId || 0,
                  row.original.brandId || 0
                ),
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                procurementTenderDetailState[row.index].price = Number.isNaN(
                  parseFloat(e.target.value)
                )
                  ? null
                  : Math.abs(parseFloat(e.target.value));
                checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.productSource || '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.productSource, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'productSource',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Product Source',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          // ekhane error er value and message set korbi
          // const error = false;
          // const errorMessage = 'Hello';
          // const currentProductSource = {
          //   productSourceId: row.original.productSource,
          //   productSourceName: row.original.productSource,
          // };
          setValue(`productSource_row${row.index}`, row.original.productSource);

          return (
            <Controller
              name={`productSource_row${row.index}`}
              control={control}
              rules={
                {
                  // required: '*Required',
                  // validate: (value) => validateProductGroup(value, row.original),
                }
              }
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id=""
                  size="small"
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  clearOnEscape
                  // disableClearable
                  freeSolo
                  // options={productGroupComboOptions || []} // Make sure bankComboOptions is defined
                  disabled={isTheFieldDisabled(
                    row.original.productGroupId || 0,
                    row.original.productId || 0,
                    row.original.brandId || 0
                  )}
                  options={[
                    { productSource: 'FOB' },
                    { productSource: 'STOCK' },
                    { productSource: 'LOCAL' },
                  ]} // making sure that the array is unique by productGroupName, else autocomplete search ultapalta behave kore
                  value={{ productSource: row.original.productSource || '' }}
                  onChange={(event, selectedOption) => {
                    if (typeof selectedOption !== 'string') {
                      setValue(`productSource_row${row.index}`, selectedOption);
                      procurementTenderDetailState[row.index].productSource =
                        selectedOption?.productSource || '';
                      checkAndSetTableValues(row.index);
                      onChange(selectedOption);
                    }
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.productSource : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.productSource === selectedValue?.productSource
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                        disableUnderline: true,
                      }}
                      sx={{ width: '100%' }}
                      // inputRef={ref}
                      inputRef={(node) => {
                        if (node) {
                          // eslint-disable-next-line no-param-reassign
                          node.value = renderedCellValue;
                        }
                      }}
                      // onBlur={() => { console.log(this) }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.prework ?? '', // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.prework, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'prework',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Prework',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          // ekhane error er value and message set korbi
          // const error = false;
          // const errorMessage = 'Hello';
          // const currentProductSource = {
          //   productSourceId: row.original.productSource,
          //   productSourceName: row.original.productSource,
          // };

          const optionNameTemp =
            row.original.prework === 'Y'
              ? 'Yes'
              : row.original.prework === 'N'
                ? 'No'
                : '';

          const currentPrework = {
            optionValue: row.original.prework,
            optionName: optionNameTemp,
          };
          setValue(`prework_row${row.index}`, row.original.prework);

          return (
            <Controller
              name={`prework_row${row.index}`}
              control={control}
              rules={{
                // required: '*Required',
                validate: (value) =>
                  validatePreworkShareOfLoadDeliveryTime(value, row.original),
              }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id=""
                  size="small"
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  clearOnEscape
                  // disableClearable
                  freeSolo
                  // options={productGroupComboOptions || []} // Make sure bankComboOptions is defined
                  disabled={isTheFieldDisabled(
                    row.original.productGroupId || 0,
                    row.original.productId || 0,
                    row.original.brandId || 0
                  )}
                  options={[
                    { optionValue: 'Y', optionName: 'Yes' },
                    { optionValue: 'N', optionName: 'No' },
                  ]} // making sure that the array is unique by productGroupName, else autocomplete search ultapalta behave kore
                  value={currentPrework}
                  onChange={(event, selectedOption) => {
                    if (typeof selectedOption !== 'string') {
                      procurementTenderDetailState[row.index].prework =
                        selectedOption?.optionValue || '';
                      checkAndSetTableValues(row.index);
                      // setValue(`product_row${row.index}`, selectedOption);
                      onChange(selectedOption);
                    }
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.optionName : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.optionValue === selectedValue?.optionValue
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                        disableUnderline: true,
                      }}
                      sx={{ width: '100%' }}
                      // inputRef={ref}
                      inputRef={(node) => {
                        if (node) {
                          // eslint-disable-next-line no-param-reassign
                          node.value = renderedCellValue;
                        }
                      }}
                      // onBlur={() => { console.log(this) }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },

      {
        accessorFn: (row) => (row?.shareOfLoad ? row?.shareOfLoad : ''), // access nested data with dot notation
        enableGlobalFilter: columnVisibility?.shareOfLoad, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        id: 'shareOfLoad',
        // accessorKey: 'productGroup', // access nested data with dot notation
        header: 'Share Of Load',
        muiTableBodyCellProps: ({ cell, column, row }) => {
          let bgCellColor = 'fafafc';
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          // ekhane error er value and message set korbi
          // const error = false;
          // const errorMessage = 'Hello';
          // const currentProductSource = {
          //   productSourceId: row.original.productSource,
          //   productSourceName: row.original.productSource,
          // };
          setValue(
            `shareOfLoad_row${row.index}`,
            row.original.shareOfLoad || ''
          );

          return (
            <Controller
              name={`shareOfLoad_row${row.index}`}
              control={control}
              rules={{
                // required: '*Required',
                validate: (value) =>
                  validatePreworkShareOfLoadDeliveryTime(value, row.original),
              }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <Autocomplete
                  id=""
                  size="small"
                  sx={{ width: '100%' }}
                  PopperComponent={PopperMy}
                  clearOnEscape
                  // disableClearable
                  freeSolo
                  // options={productGroupComboOptions || []} // Make sure bankComboOptions is defined
                  disabled={isTheFieldDisabled(
                    row.original.productGroupId || 0,
                    row.original.productId || 0,
                    row.original.brandId || 0
                  )}
                  options={[
                    { shareOfLoad: 10 },
                    { shareOfLoad: 20 },
                    { shareOfLoad: 30 },
                    { shareOfLoad: 40 },
                    { shareOfLoad: 50 },
                    { shareOfLoad: 60 },
                    { shareOfLoad: 70 },
                    { shareOfLoad: 80 },
                    { shareOfLoad: 90 },
                    { shareOfLoad: 100 },
                  ]} // making sure that the array is unique by productGroupName, else autocomplete search ultapalta behave kore
                  value={{ shareOfLoad: row.original.shareOfLoad || '' }}
                  onChange={(event, selectedOption) => {
                    if (typeof selectedOption !== 'string') {
                      setValue(
                        `shareOfLoad_row${row.index}`,
                        selectedOption?.shareOfLoad || ''
                      );
                      procurementTenderDetailState[row.index].shareOfLoad =
                        (selectedOption?.shareOfLoad || 0) as number;
                      checkAndSetTableValues(row.index);
                      onChange(selectedOption);
                    }
                  }} // React-hook-form manages the state
                  onBlur={onBlur} // Trigger validation on blur
                  getOptionLabel={(option: any) =>
                    option ? option.shareOfLoad : ''
                  }
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.shareOfLoad === selectedValue?.shareOfLoad
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      size="small"
                      error={!!error}
                      helperText={error ? error.message : null}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: 10, // Set the font size
                          marginTop: 0, // Set the margin
                          color: 'red', // Set the color (example)
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { fontSize: 13 },
                        disableUnderline: true,
                      }}
                      sx={{ width: '100%' }}
                      // inputRef={ref}
                      inputRef={(node) => {
                        if (node) {
                          // eslint-disable-next-line no-param-reassign
                          node.value = renderedCellValue;
                        }
                      }}
                      // onBlur={() => { console.log(this) }}
                    />
                  )}
                />
              )}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.initialFactor ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'initialFactor',
        enableGlobalFilter: columnVisibility?.initialFactor, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Factor',
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
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
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
              type="number"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: isTheFieldDisabled(
                  row.original.productGroupId || 0,
                  row.original.productId || 0,
                  row.original.brandId || 0
                ),
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                procurementTenderDetailState[row.index].initialFactor =
                  Number.isNaN(parseFloat(e.target.value))
                    ? null
                    : Math.abs(parseFloat(e.target.value));
                checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.deliveryTimeline ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'deliveryTimeline',
        enableGlobalFilter: columnVisibility?.deliveryTimeline, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Delivery Timeline(Days)',
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
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
          }

          return {
            sx: {
              backgroundColor: `${bgCellColor}`,
            },
          };
        },
        Cell: ({ renderedCellValue, row }) => {
          // keep RHF in sync with initial value
          setValue(
            `deliveryTimeline_row${row.index}`,
            row.original.deliveryTimeline ?? ''
          );

          const disabled = isTheFieldDisabled(
            row.original.productGroupId || 0,
            row.original.productId || 0,
            row.original.brandId || 0
          );

          return (
            <Controller
              name={`deliveryTimeline_row${row.index}`}
              control={control}
              rules={{
                validate: (value) => {
                  // optional: disabled hole validate skip
                  if (disabled) return true;

                  return validatePreworkShareOfLoadDeliveryTime(
                    value,
                    row.original
                  );
                },
              }}
              render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { error },
              }) => (
                <TextField
                  type="number"
                  sx={{ width: '100%' }}
                  variant="standard"
                  size="small"
                  value={value ?? ''}
                  inputRef={ref}
                  error={!!error}
                  helperText={error ? error.message : null}
                  FormHelperTextProps={{
                    sx: {
                      fontSize: 10,
                      marginTop: 0,
                      color: 'red',
                    },
                  }}
                  InputProps={{
                    style: { fontSize: 13 },
                    disableUnderline: true,
                    readOnly: disabled,
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;

                    onChange(raw);

                    procurementTenderDetailState[row.index].deliveryTimeline =
                      Number.isNaN(parseInt(raw, 10))
                        ? null
                        : Math.abs(parseInt(raw, 10));

                    checkAndSetTableValues(row.index);
                  }}
                  onBlur={(e) => {
                    onBlur(); //  triggers validation like shareOfLoad

                    const raw = e.target.value;

                    procurementTenderDetailState[row.index].deliveryTimeline =
                      Number.isNaN(parseInt(raw, 10))
                        ? null
                        : Math.abs(parseInt(raw, 10));

                    checkAndSetTableValues(row.index);
                  }}
                />
              )}
            />
          );
        },
      },
      {
        accessorFn: (row) => row.remarks ?? '', // access nested data with dot notation
        // accessorKey: 'approved', // access nested data with dot notation
        id: 'remarks',
        enableGlobalFilter: columnVisibility?.remarks, // maane, jodi column ta keo hide kore dey, oita diye global search hobena
        header: 'Remarks',
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
          if (
            isTheFieldDisabled(
              row.original.productGroupId || 0,
              row.original.productId || 0,
              row.original.brandId || 0
            )
          ) {
            bgCellColor = '#f0f0f0';
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
              type="text"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: 13 },
                disableUnderline: true,
                readOnly: isTheFieldDisabled(
                  row.original.productGroupId || 0,
                  row.original.productId || 0,
                  row.original.brandId || 0
                ),
              }}
              variant="standard"
              size="small"
              inputRef={(node) => {
                if (node) {
                  node.value = renderedCellValue;
                }
              }}
              onBlur={(e) => {
                procurementTenderDetailState[row.index].remarks =
                  e.target.value || '';
                checkAndSetTableValues(row.index);
              }}
            />
          );
        },
      },
    ],
    [
      PopperMy,
      checkAndSetTableValues,
      columnVisibility?.initialFactor,
      columnVisibility?.price,
      columnVisibility?.productGroupName,
      columnVisibility?.quantity,
      handleProductFocus,
      handleProductGroupChange,
      isTheFieldDisabled,
      procurementTenderDetailState,
      // productGroupComboOptions,
      userProductGroupOptions,
      productOptions,
    ]
  );

  const tableInitializer: MRT_TableInstance<IProcurementTenderDetail> =
    useMaterialReactTable({
      columns: procurementTenderDetailColumns,
      //   data: chequeBookGrid || [], // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
      data: procurementTenderDetailState || [],
      state: {
        isLoading:
          procurementTenderDetailLoading || procurementTenderDetailIsFetching,
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
      enableFilterMatchHighlighting: false, // disable filter match highlighting
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
          // borderRight: '1px solid #e0e0e0', // add a border between columns //eigulla shobi use kora jaay but comment out kora
          fontSize: '13px',
          color: '#ea1143',
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
          backgroundColor: '#ECEFF9',
          color: '#1c1c1c',
          fontWeight: '800',
        },
      },

      muiTableContainerProps: { sx: { maxHeight: '200px' } },
      renderToolbarInternalActions: ({ table }) => (
        <>
          {/* built-in buttons (must pass in table prop for them to work!) */}
          <MRT_ToggleGlobalFilterButton table={table} />

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
                handleExportData(
                  procurementTenderDetailState,
                  procurementTenderDetailColumns
                );
              }}
            >
              <i className="fas fa-file-excel" />
            </button>
          </div>
          {/* add your own custom print button or something */}
        </>
      ),

      renderTopToolbarCustomActions: ({ table }) => (
        <div className="">
          <p className=" mt-1 font-bold text-[13px]">
            Procurment Tender Detail
          </p>
        </div>
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

  return (
    // return wrapper div

    <div className="mt-0 grid grid-cols-1">
      {/* <p>Procurement Tender Detail</p> */}
      <div className="w-full m-1 modifiedEditTable">
        <MaterialReactTable table={tableInitializer} />
      </div>
    </div>

    // return wrapper div--/--
  );
};

export default ProcurementTenderDetail;
