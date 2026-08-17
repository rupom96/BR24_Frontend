import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
  type MRT_Virtualizer,
} from 'material-react-table';
import {
  IBiznessEventProcessConfiguration,
  IDeleteBiznessEventProcessConfiguration,
} from '../../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
import { useGetFixedTaskTemplateComboOptionsQuery } from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
import { useGetBiznessEventProcessConfigurationsByFixedTaskTemplateIdQuery } from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import AttachmentLoader from '../../components/AttachmentLoader';

const API_BASE_URL = window.API_BASE_URL;

let a = 0;

const StructuredPageTSSample = () => {
  const [attachments, setAttachments] = useState([]);
  const [deletedRegedAttach, setDeletedRegedAttach] = useState([]);
  console.log('HAHA function caleed');
  // const {
  //   data: fixedTaskTemplateData,
  //   isLoading: dataloading,
  //   error: rtkError,
  // } = useGetFixedTaskTemplateComboOptionsQuery(11);
  // // console.log('data of hook fixed task template:');
  // // console.log(`Looading: ${dataloading}`);
  // // console.log(fixedTaskTemplateData);

  const [rupom, setRupom] = useState<boolean>(false);

  const {
    data: rtkTableData,
    isLoading: tableDataLoading,
    error: rtkTableDataError,
  } = useGetBiznessEventProcessConfigurationsByFixedTaskTemplateIdQuery(1);
  console.log('data of hook Table Data template:');
  console.log(`Looading: ${tableDataLoading}`);
  console.log(rtkTableData);

  const functExp = () => {
    console.log('functExp called hochse');
    return 1;
  };

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }
  const columns = useMemo<MRT_ColumnDef<IBiznessEventProcessConfiguration>[]>(
    () => [
      {
        accessorKey: 'biznessEventId',
        header: 'Bizness Event Id',
        // size: 150,
      },
      {
        accessorKey: 'controllerPath', // access nested data with dot notation
        header: 'Controller Path',
        // size: 150,
      },
      {
        accessorKey: 'controllerParameter', // access nested data with dot notation
        header: 'Controller Parameter',
        // size: 150,
      },
      {
        accessorKey: 'mailTemplate', // access nested data with dot notation
        header: 'Mail Template',
        // size: 300,
      },
      {
        accessorKey: 'smsTemplate', // access nested data with dot notation
        header: 'SMS Template',
      },
      {
        accessorKey: 'isAction', // access nested data with dot notation
        // header: 'Actions',
        header: 'Action',
      },
      {
        accessorKey: 'delete', // access nested data with dot notation
        // header: 'Actions',
        header: '',
      },
    ],
    []
  );

  const [num, setNum] = useState<number>(0);

  const [tableData, setTableData] = useState<
    IBiznessEventProcessConfiguration[]
  >([]);
  const [tableDataPrev, setTableDataPrev] = useState<
    IBiznessEventProcessConfiguration[]
  >([]);

  const [deletedTableData, setDeletedTableData] = useState<
    IDeleteBiznessEventProcessConfiguration[]
  >([]);

  /// /////////////--------------[Functions]-------------------///////////////

  const getFixedTaskOpts = () => {
    fetch(`${API_BASE_URL}/FixedTaskTemplate/getAll`, {
      headers: {
        Authorization: `Bearer ${userInfo?.userToken || ''}`,
      },
    })
      .then((res) => res.json())
      .then((apiRes) => {
        console.log('getFixedTaskOpts');
        console.log(apiRes);
      });
  };

  const getTableData = () => {
    // fetch(`${API_BASE_URL}/BiznessEventProcessConfiguration/getAll`)
    //   .then((res) => res.json())
    //   .then((apiRes) => {
    //     console.log('getTableData');
    //     console.log(apiRes);
    //     setTableData([...apiRes]);
    //   });
    // const { data } = useGetFixedTaskTemplateComboOptionsQuery(1);
    // if (rtkTableData) {
    //   setTableData([...rtkTableData]);
    // }
  };

  const getTableDataPuraan = () => {
    fetch(`${API_BASE_URL}/BiznessEventProcessConfiguration/getAll`, {
      headers: {
        Authorization: `Bearer ${userInfo?.userToken || ''}`,
      },
    })
      .then((res) => res.json())
      .then((apiRes) => {
        console.log('getTableData');
        console.log(apiRes);
        setTableData([...apiRes]);
      });
  };

  // optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && tableDataLoading === false) {
  //     // setData(makeData(10_000));
  //     setIsLoading(false);
  //   }
  // }, [tableDataLoading]);
  useEffect(() => {
    // scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  const tableInitializer = useMaterialReactTable({
    columns,
    data: tableData, // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableBottomToolbar: false,
    enableColumnResizing: true,
    enableGlobalFilterModes: true,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    // enableDensityToggle: false,
    initialState: { density: 'compact' },
    muiTablePaperProps: {
      elevation: 0, // change the mui box shadow
      // customize paper styles
      sx: {
        borderRadius: '0',
        border: '1px dashed #e0e0e0',
      },
    },
    // muiTableBodyProps: { //maybe ei property ase documentation dekh
    //   sx: {
    //     border: '1px solid #e0e0e0', // add a border between columns
    //     // borderLeft: '1px solid #e0e0e0',
    //     // borderTop: '1px solid #e0e0e0',
    //     // borderBottom: '1px solid #e0e0e0',
    //     fontSize: '13px',
    //   },
    // },
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

    muiTableContainerProps: { sx: { maxHeight: '380px' } },
    onSortingChange: setSorting,
    state: { isLoading, sorting },
    rowVirtualizerInstanceRef, // optional
    rowVirtualizerOptions: { overscan: 5 }, // optionally customize the row virtualizer
  });

  // virtualization

  /// /////////////--------------[UseEffects]-------------------///////////////

  // useEffect(() => {
  //   // get fetch api
  //   getTableData();
  // }, [tableDataLoading]);

  // useEffect(() => {
  //   // get fetch api
  //   getTableDataPuraan();
  // }, []);

  /// /---------------------[]--------------------------////

  function testFunc() {
    // console.log('tableData');
    // console.log(tableData);
    // setRupom(!rupom);
    // setNum(num + 1);
    a += 1;
    console.log(a);
  }

  // const handleDeleteRow = (index: number) => {
  //   console.log(`delete e chaap disi from ${index} no row`);
  //   if (tableData[index].biznessEventProcessConfigurationId) {
  //     console.log(`delete er if er moddhe dhuksi`);
  //     const tempObj = {
  //       biznessEventProcessConfigurationId:
  //         tableData[index].biznessEventProcessConfigurationId,
  //     };
  //     console.log(`deleted object:`);
  //     console.log(tempObj);
  //     deletedTableData.push(tempObj);
  //   }
  //   tableData.splice(index, 1);
  //   setTableData([...tableData]);
  // };

  // const saveTableData = () => {
  //   console.log('save button clicked');

  //   const dataB4Edit = JSON.parse(JSON.stringify(tableDataPrev));
  //   dataB4Edit.sort(
  //     (a, b) =>
  //       a.biznessEventProcessConfigurationId -
  //       b.biznessEventProcessConfigurationId
  //   );

  //   const gridDataCopy = JSON.parse(JSON.stringify(tableData));
  //   const rowNoThoseDonotHaveBizEventId = [];
  //   const validGridWithId = [];
  //   const validGridWithoutId = [];

  //   for (let i = 0; i < gridDataCopy.length; i++) {
  //     if (
  //       (gridDataCopy[i].controllerPath ||
  //         gridDataCopy[i].controllerParameter ||
  //         gridDataCopy[i].mailTemplate ||
  //         gridDataCopy[i].sMSTemplate ||
  //         gridDataCopy[i].isAction) &&
  //       !gridDataCopy[i].biznessEventId
  //     ) {
  //       rowNoThoseDonotHaveBizEventId.push(i + 1); // rowNo ta dhukaya ditesi
  //     } else if (
  //       gridDataCopy[i].biznessEventProcessConfigurationId &&
  //       gridDataCopy[i].biznessEventId
  //     ) {
  //       validGridWithId.push(gridDataCopy[i]);
  //     } else if (
  //       !gridDataCopy[i].biznessEventProcessConfigurationId &&
  //       gridDataCopy[i].biznessEventId
  //     ) {
  //       validGridWithoutId.push(gridDataCopy[i]);
  //     }
  //   }

  //   if (rowNoThoseDonotHaveBizEventId.length > 0) {
  //     const concatedArray = rowNoThoseDonotHaveBizEventId.join(', ');
  //     toast.error(
  //       `Value of Bizness Event Id must be non-empty or greater than zero, in row no.: ${concatedArray}`
  //     );
  //     return;
  //   }

  //   const validGridWithIdWithDeleted = [
  //     ...validGridWithId,
  //     ...deletedTableData,
  //   ];
  //   validGridWithIdWithDeleted.sort(
  //     (a, b) =>
  //       a.biznessEventProcessConfigurationId -
  //       b.biznessEventProcessConfigurationId
  //   );

  //   const gridRowsToUpdate = [];

  //   for (let i = 0; i < validGridWithIdWithDeleted.length; i++) {
  //     const prevRow = JSON.stringify(dataB4Edit[i]);
  //     const gridRow = JSON.stringify(validGridWithIdWithDeleted[i]);

  //     if (prevRow !== gridRow) {
  //       if (
  //         validGridWithIdWithDeleted[i].biznessEventProcessConfigurationId &&
  //         validGridWithIdWithDeleted[i].biznessEventId
  //       ) {
  //         gridRowsToUpdate.push(validGridWithIdWithDeleted[i]);
  //       }
  //     }
  //   }

  //   if (
  //     gridRowsToUpdate.length === 0 &&
  //     validGridWithoutId.length === 0 &&
  //     deletedTableData.length === 0
  //   ) {
  //     console.log('no changes');
  //     toast.error('No changes has been made!!');
  //     return;
  //   }

  //   const sendingObj = {
  //     createCommand: validGridWithoutId,
  //     updateCommand: gridRowsToUpdate,
  //     deleteCommand: deletedTableData,
  //   };

  //   console.log('sending obj');
  //   console.log(sendingObj);

  //   axios
  //     .post(
  //       `${API_BASE_URL}/BiznessEventProcessConfiguration/process`,
  //       sendingObj
  //     )
  //     .then((res) => {
  //       // console.log("insert er axios!!");
  //       if (res?.data) {
  //         // toast.success(`All data saved successfully!`);
  //         getTableDataByFixedTaskTemplateId(
  //           selectedFixedTaskTemplate?.fixedTaskTemplateId
  //         );
  //         toast.success(`All data saved successfully!`);
  //         setDeletedTableData([]);
  //       } else {
  //         toast.error('Error!!');
  //         toast.error(
  //           `Something Wrong while saving in backend!! Error: ${res?.data}, StatusCode: ${res?.statusText}`
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle the error here
  //       // toast.error('Error in Axios request:', error);
  //       toast.error('An error occurred while making the request.');
  //     });
  // };

  const memoizedJSX = useMemo(() => {
    return (
      // return wrapper div
      <div className="mt-16 md:mt-2">
        <div className="m-2 flex justify-center">
          <div className="block w-11/12 ">
            {/* Main Card */}
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                Bizness Event Process Configuration
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className=" px-6 text-start grid grid-cols-4 gap-4 mt-2">
                <div className="col-span-4">
                  <form className="">
                    <div className="w-full grid-cols-1 grid gap-x-2 gap-y-1">
                      <div className="mb-5 w-full">
                        {a}
                        <MaterialReactTable table={tableInitializer} />

                        <AttachmentLoader
                          attachments={attachments}
                          setAttachments={setAttachments}
                          deletedRegedAttach={deletedRegedAttach}
                          setDeletedRegedAttach={setDeletedRegedAttach}
                          imgPerSlide={4}
                        />
                      </div>
                    </div>
                  </form>
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
                      testFunc();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
            {/* Main Card--/-- */}
          </div>
        </div>

        {/* // modals --- out of html normal body/position */}
      </div>
      // return wrapper div--/--
    );
  }, [rupom, attachments, deletedRegedAttach]);
  return memoizedJSX;
};

export default StructuredPageTSSample;
