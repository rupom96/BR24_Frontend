/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */

import dayjs, { Dayjs } from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  MRT_ColumnDef,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import { Delete, Edit, EditNotifications } from '@mui/icons-material';
import { PropagateLoader } from 'react-spinners';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/Redux/store/store';
import { changeFromMonthYear } from '../../../application/Redux/slices/RegionMasterAndTargetSlice/FromMonthYearSlice';
import { changeToMonthYear } from '../../../application/Redux/slices/RegionMasterAndTargetSlice/ToMonthYearSlice';
import MonthYearRangePicker from '../../components/biz24Components/MonthYearRangePicker/MonthYearRangePicker';
import { useLazyGetRegionMasterByCompanyIdMonthYearQuery } from '../../../infrastructure/api/RegionMasterApiSlice';
import { useLazyGetRegionByRegionMasterCompanyIdMonthYearQuery } from '../../../infrastructure/api/RegionApiSlice';
import { useLazyGetDivisionByRegionCompanyIdMonthYearQuery } from '../../../infrastructure/api/DivisionApiSlice';
import { useLazyGetDistrictByDivisionCompanyIdMonthYearQuery } from '../../../infrastructure/api/DistrictApiSlice';
import GeneralizedTree from './GeneralizedTree/GeneralizedTree';
import DistrictTargetGrid from './TeamTargetGrid/DistrictTargetGrid';
import QuickEntryAnySection from './QuickEntryAnySection/QuickEntryAnySection';
import { changeQuickEntryAnySectionModalInfo } from '../../../application/Redux/slices/RegionMasterAndTargetSlice/QuickEntryAnySectionModalInfoSlice';

type Props = {};
const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));
// const AreaAndTarget = () => {
//   return <div>AreaAndTarget</div>;
// };

const regionMasterDemoData = [
  {
    regionMasterId: 1,
    regionMasterName: 'Bangladesh',
    inchargeId: 1001,
    inchargeName: 'Rupom',
  },
  {
    regionMasterId: 2,
    regionMasterName: 'India',
    inchargeId: 2001,
    inchargeName: 'Singh',
  },
  {
    regionMasterId: 3,
    regionMasterName: 'Canada',
    inchargeId: 3001,
    inchargeName: 'Chris',
  },
];

const regionDemoData = [
  {
    regionMasterId: 1,
    regionId: 10,
    regionName: 'East Bangladesh',
    inchargeId: 1002,
    inchargeName: 'Reaz',
  },
  {
    regionMasterId: 1,
    regionId: 20,
    regionName: 'West Bangladesh',
    inchargeId: 2002,
    inchargeName: 'Haque',
  },
  {
    regionMasterId: 2,
    regionId: 30,
    regionName: 'East India',
    inchargeId: 1002,
    inchargeName: 'Rahim',
  },
  {
    regionMasterId: 2,
    regionId: 40,
    regionName: 'West India',
    inchargeId: 2002,
    inchargeName: 'Rahima',
  },
  {
    regionMasterId: 3,
    regionId: 50,
    regionName: 'East Canada',
    inchargeId: 1002,
    inchargeName: 'Karim',
  },
  {
    regionMasterId: 3,
    regionId: 60,
    regionName: 'West Canada',
    inchargeId: 2002,
    inchargeName: 'Karima',
  },
];
const divisionDemoData = [
  {
    regionId: 10,
    divisionId: 100,
    divisionName: 'Dhaka1',
    inchargeId: 1002,
    inchargeName: 'Reazi1',
  },
  {
    regionId: 10,
    divisionId: 200,
    divisionName: 'Dhaka2',
    inchargeId: 2002,
    inchargeName: 'Reazi2',
  },
  {
    regionId: 20,
    divisionId: 300,
    divisionName: 'Khulna1',
    inchargeId: 1002,
    inchargeName: 'Rahim',
  },
  {
    regionId: 20,
    divisionId: 40,
    divisionName: 'Khulna2',
    inchargeId: 2002,
    inchargeName: 'Rahima',
  },
  {
    regionId: 30,
    divisionId: 50,
    divisionName: 'East Canada',
    inchargeId: 1002,
    inchargeName: 'Karim',
  },
  {
    regionId: 3,
    divisionId: 60,
    divisionName: 'West Canada',
    inchargeId: 2002,
    inchargeName: 'Karima',
  },
];

interface DistrictAndTargetProps {
  divisionId: number;
}
const DistrictAndTarget: React.FC<DistrictAndTargetProps> = ({
  divisionId,
}) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );

  const dispatch = useAppDispatch();
  const handleChangeFromMonthYear = (date: Dayjs) => {
    dispatch(changeFromMonthYear({ fromMonthYear: date }));
  };
  const handleChangeToMonthYear = (date: Dayjs) => {
    dispatch(changeToMonthYear({ toMonthYear: date }));
  };

  // -------------------------------------API RTK CALLS--------------------------------------
  const [
    triggerGetDistrict,
    {
      data: districtData,
      error: districtError,
      isError: districtIsError,
      isSuccess: districtIsSuccess,
      isLoading: districtIsLoading,
      isFetching: districtIsFetching,
    },
  ] = useLazyGetDistrictByDivisionCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (districtIsError) {
      toast.error(
        'Something wrong from backend while fetching districtData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching districtData, see console--->:'
      );
      console.log(districtError);
    }
    if (districtIsSuccess) {
      console.log('districtIsSuccess');
      console.log(districtIsSuccess);
    }
  }, [
    districtData,
    districtIsLoading,
    districtError,
    districtIsError,
    districtIsFetching,
    districtIsSuccess,
  ]);

  useEffect(() => {
    console.log('fromMonthYearValue');
    console.log(fromMonthYearValue);

    console.log('toMonthYearValue');
    console.log(toMonthYearValue);
    triggerGetDistrict({
      companyId: userInfo?.companyId || 0,
      divisionId: divisionId || 0,
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
    });

    // triggerGetRegionMaster({companyId: user})
  }, [fromMonthYearValue, toMonthYearValue, triggerGetDistrict, divisionId]);

  const CustomTreeItemWithButton: React.FC<{
    label: string;
    itemId: number;
    row: any;
    children: ReactNode;
  }> = ({ label, itemId, row, children }) => (
    <CustomTreeItem
      key={itemId}
      itemId={itemId.toString()}
      label={
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span className="mr-3">
            {' '}
            {label}{' '}
            {`(Incharge: ${row.inchargeName}; Target: ${(
              Math.ceil(row.target * 100) / 100
            ).toFixed(2)})`}
          </span>{' '}
          {/* Label takes the remaining space */}
          <Tooltip
            className=""
            arrow
            placement="right"
            title="Quick Target Entry"
          >
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="ml-[1px] inline-block px-[4px] py-[1px] bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={(event) => {
                event.stopPropagation(); // Prevent TreeItem toggle
                dispatch(
                  changeQuickEntryAnySectionModalInfo({
                    regionMasterId: 0,
                    regionMasterName: '',
                    regionId: 0,
                    regionName: '',
                    divisionId: 0,
                    divisionName: '',
                    districtId: row.districtId,
                    districtName: row.districtName,
                    quickEntryAnySectionModal: true,
                  })
                );
              }}
            >
              <Edit sx={{ fontSize: '10px' }} />
              {/* <i className="fas fa-edit text-[10px]" /> */}
            </button>
          </Tooltip>
        </div>
      }
    >
      {children}
    </CustomTreeItem>
  );

  return (
    <div className="grid grid-cols-1 ">
      <SimpleTreeView defaultExpandedItems={['grid']}>
        {districtData?.map((districtRow) => {
          return (
            <CustomTreeItemWithButton
              key={districtRow.districtId}
              label={districtRow.districtName}
              itemId={districtRow.districtId}
              row={districtRow}
            >
              {/* <div>Area&TargetSP Grid</div> */}
              <DistrictTargetGrid districtId={districtRow.districtId} />
            </CustomTreeItemWithButton>
          );
        })}
        {!districtData || districtData?.length === 0 ? (
          <div>No District Found</div>
        ) : (
          ''
        )}
      </SimpleTreeView>
    </div>
  );
};

interface DivisionAndTargetProps {
  regionId: number;
}
const DivisionAndTarget: React.FC<DivisionAndTargetProps> = ({ regionId }) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );

  const dispatch = useAppDispatch();
  const handleChangeFromMonthYear = (date: Dayjs) => {
    dispatch(changeFromMonthYear({ fromMonthYear: date }));
  };
  const handleChangeToMonthYear = (date: Dayjs) => {
    dispatch(changeToMonthYear({ toMonthYear: date }));
  };

  // -------------------------------------API RTK CALLS--------------------------------------
  const [
    triggerGetDivision,
    {
      data: divisionData,
      error: divisionError,
      isError: divisionIsError,
      isSuccess: divisionIsSuccess,
      isLoading: divisionIsLoading,
      isFetching: divisionIsFetching,
    },
  ] = useLazyGetDivisionByRegionCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (divisionIsError) {
      toast.error(
        'Something wrong from backend while fetching divisionData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching divisionData, see console--->:'
      );
      console.log(divisionError);
    }
    if (divisionIsSuccess) {
      console.log('divisionIsSuccess');
      console.log(divisionIsSuccess);
    }
  }, [
    divisionData,
    divisionIsLoading,
    divisionError,
    divisionIsError,
    divisionIsFetching,
    divisionIsSuccess,
  ]);

  useEffect(() => {
    console.log('fromMonthYearValue');
    console.log(fromMonthYearValue);

    console.log('toMonthYearValue');
    console.log(toMonthYearValue);
    triggerGetDivision({
      companyId: userInfo?.companyId || 0,
      regionId: regionId || 0,
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
    });

    // triggerGetRegionMaster({companyId: user})
  }, [fromMonthYearValue, toMonthYearValue, triggerGetDivision, regionId]);

  const CustomTreeItemWithButton: React.FC<{
    label: string;
    itemId: number;
    row: any;
    children: ReactNode;
  }> = ({ label, itemId, row, children }) => (
    <CustomTreeItem
      key={itemId}
      itemId={itemId.toString()}
      label={
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span className="mr-3">
            {' '}
            {label}{' '}
            {`(Incharge: ${row.inchargeName}; Target: ${(
              Math.ceil(row.target * 100) / 100
            ).toFixed(2)})`}
          </span>{' '}
          {/* Label takes the remaining space */}
          <Tooltip
            className=""
            arrow
            placement="right"
            title="Quick Target Entry"
          >
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="ml-[1px] inline-block px-[4px] py-[1px] bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={(event) => {
                event.stopPropagation(); // Prevent TreeItem toggle
                dispatch(
                  changeQuickEntryAnySectionModalInfo({
                    regionMasterId: 0,
                    regionMasterName: '',
                    regionId: 0,
                    regionName: '',
                    divisionId: row.divisionId,
                    divisionName: row.divisionName,
                    districtId: 0,
                    districtName: '',
                    quickEntryAnySectionModal: true,
                  })
                );
              }}
            >
              <Edit sx={{ fontSize: '10px' }} />
              {/* <i className="fas fa-edit text-[10px]" /> */}
            </button>
          </Tooltip>
        </div>
      }
    >
      {children}
    </CustomTreeItem>
  );
  return (
    <div className="grid grid-cols-1 ">
      <SimpleTreeView defaultExpandedItems={['grid']}>
        {divisionData?.map((divisionRow) => {
          return (
            <CustomTreeItemWithButton
              key={divisionRow.divisionId}
              label={divisionRow.divisionName}
              itemId={divisionRow.divisionId}
              row={divisionRow}
            >
              <DistrictAndTarget divisionId={divisionRow.divisionId} />
            </CustomTreeItemWithButton>
          );
        })}
        {!divisionData || divisionData?.length === 0 ? (
          <div>No Division Found</div>
        ) : (
          ''
        )}
      </SimpleTreeView>
    </div>
  );
};

interface RegionAndTargetProps {
  regionMasterId: number;
}
const RegionAndTarget: React.FC<RegionAndTargetProps> = ({
  regionMasterId,
}) => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );

  const dispatch = useAppDispatch();
  const handleChangeFromMonthYear = (date: Dayjs) => {
    dispatch(changeFromMonthYear({ fromMonthYear: date }));
  };
  const handleChangeToMonthYear = (date: Dayjs) => {
    dispatch(changeToMonthYear({ toMonthYear: date }));
  };

  // -------------------------------------API RTK CALLS--------------------------------------
  const [
    triggerGetRegion,
    {
      data: regionData,
      error: regionError,
      isError: regionIsError,
      isSuccess: regionIsSuccess,
      isLoading: regionIsLoading,
      isFetching: regionIsFetching,
    },
  ] = useLazyGetRegionByRegionMasterCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (regionIsError) {
      toast.error(
        'Something wrong from backend while fetching regionData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching regionData, see console--->:'
      );
      console.log(regionError);
    }
    if (regionIsSuccess) {
      console.log('regionIsSuccess');
      console.log(regionIsSuccess);
    }
  }, [
    regionData,
    regionIsLoading,
    regionError,
    regionIsError,
    regionIsFetching,
    regionIsSuccess,
  ]);

  useEffect(() => {
    console.log('fromMonthYearValue');
    console.log(fromMonthYearValue);

    console.log('toMonthYearValue');
    console.log(toMonthYearValue);
    triggerGetRegion({
      companyId: userInfo?.companyId || 0,
      regionMasterId: regionMasterId || 0,
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
    });

    // triggerGetRegionMaster({companyId: user})
  }, [fromMonthYearValue, toMonthYearValue, triggerGetRegion, regionMasterId]);

  const CustomTreeItemWithButton: React.FC<{
    label: string;
    itemId: number;
    row: any;
    children: ReactNode;
  }> = ({ label, itemId, row, children }) => (
    <CustomTreeItem
      key={itemId}
      itemId={itemId.toString()}
      label={
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span className="mr-3">
            {' '}
            {label}{' '}
            {`(Incharge: ${row.inchargeName}; Target: ${(
              Math.ceil(row.target * 100) / 100
            ).toFixed(2)})`}
          </span>{' '}
          {/* Label takes the remaining space */}
          <Tooltip
            className=""
            arrow
            placement="right"
            title="Quick Target Entry"
          >
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="ml-[1px] inline-block px-[4px] py-[1px] bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={(event) => {
                event.stopPropagation(); // Prevent TreeItem toggle
                // setTeamSetupModalInfo({
                //   itemId,
                // });
                // setTeamMemberModal(true);
                dispatch(
                  changeQuickEntryAnySectionModalInfo({
                    regionMasterId: 0,
                    regionMasterName: '',
                    regionId: row.regionId,
                    regionName: row.regionName,
                    divisionId: 0,
                    divisionName: '',
                    districtId: 0,
                    districtName: '',
                    quickEntryAnySectionModal: true,
                  })
                );
              }}
            >
              <Edit sx={{ fontSize: '10px' }} />
              {/* <i className="fas fa-edit text-[10px]" /> */}
            </button>
          </Tooltip>
        </div>
      }
    >
      {children}
    </CustomTreeItem>
  );

  return (
    <div className="grid grid-cols-1 ">
      <SimpleTreeView defaultExpandedItems={['grid']}>
        {regionData?.map((regionRow) => {
          return (
            <CustomTreeItemWithButton
              key={regionRow.regionId}
              label={regionRow.regionName}
              itemId={regionRow.regionId}
              row={regionRow}
            >
              <DivisionAndTarget regionId={regionRow.regionId} />
            </CustomTreeItemWithButton>
          );
        })}
        {!regionData || regionData?.length === 0 ? (
          <div>No Division Found</div>
        ) : (
          ''
        )}
      </SimpleTreeView>
    </div>
  );
};

const RegionMasterAndTarget = (props: Props) => {
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

  const fromMonthYearValue = useAppSelector(
    (state) => state.fromMonthYear.fromMonthYear
  );
  const toMonthYearValue = useAppSelector(
    (state) => state.toMonthYear.toMonthYear
  );

  const dispatch = useAppDispatch();
  const handleChangeFromMonthYear = (date: Dayjs) => {
    dispatch(changeFromMonthYear({ fromMonthYear: date }));
  };
  const handleChangeToMonthYear = (date: Dayjs) => {
    dispatch(changeToMonthYear({ toMonthYear: date }));
  };

  const quickEntryModalInfo = useAppSelector(
    (state) => state.quickEntryAnySectionModalInfo
  );
  // const handleChangeQuickEntryModalInfo = (date: Dayjs) => {
  //   dispatch(changeQuickEntryAnySectionModalInfo({
  //     // fromMonth: number;
  //     // fromYear: number,
  //     // toMonth: number,
  //     // toYear: number,

  //     regionMasterId: number,
  //     regionMasterName: string,

  //     regionId: number,
  //     regionName: string,

  //     divisionId: number,
  //     divisionName: string,

  //     districtId: number,
  //     districtName: string,
  //     quickEntryAnySectionModal: boolean }));
  // };

  // -------------------------------------API RTK CALLS--------------------------------------
  const [
    triggerGetRegionMaster,
    {
      data: regionMasterData,
      error: regionMasterError,
      isError: regionMasterIsError,
      isSuccess: regionMasterIsSuccess,
      isLoading: regionMasterIsLoading,
      isFetching: regionMasterIsFetching,
    },
  ] = useLazyGetRegionMasterByCompanyIdMonthYearQuery(); // RTK Query lazy fetch

  useEffect(() => {
    if (regionMasterIsError) {
      toast.error(
        'Something wrong from backend while fetching regionMasterData, see console!'
      );
      console.log(
        'Something wrong from backend while fetching regionMasterData, see console--->:'
      );
      console.log(regionMasterError);
    }
    if (regionMasterIsSuccess) {
      console.log('regionMasterIsSuccess');

      console.log(regionMasterData);
    }
  }, [
    regionMasterData,
    regionMasterIsLoading,
    regionMasterError,
    regionMasterIsError,
    regionMasterIsFetching,
    regionMasterIsSuccess,
  ]);

  useEffect(() => {
    console.log('fromMonthYearValue');
    console.log(fromMonthYearValue);

    console.log('toMonthYearValue');
    console.log(toMonthYearValue);
    triggerGetRegionMaster({
      companyId: userInfo?.companyId || 0,
      fromMonth: dayjs(fromMonthYearValue).month() + 1,
      fromYear: dayjs(fromMonthYearValue).year(),
      toMonth: dayjs(toMonthYearValue).month() + 1,
      toYear: dayjs(toMonthYearValue).year(),
    });

    // triggerGetRegionMaster({companyId: user})
  }, [
    fromMonthYearValue,
    toMonthYearValue,
    triggerGetRegionMaster,
    quickEntryModalInfo,
  ]);

  const CustomTreeItemWithButton: React.FC<{
    label: string;
    itemId: number;
    row: any;
    children: ReactNode;
  }> = ({ label, itemId, row, children }) => (
    <CustomTreeItem
      key={itemId}
      itemId={itemId.toString()}
      label={
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span className="mr-3">
            {' '}
            {label}{' '}
            {`(Incharge: ${row.inchargeName}; Target: ${(
              Math.ceil(row.target * 100) / 100
            ).toFixed(2)})`}
          </span>{' '}
          {/* Label takes the remaining space */}
          <Tooltip
            className=""
            arrow
            placement="right"
            title="Quick Target Entry"
          >
            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="ml-[1px] inline-block px-[4px] py-[1px] bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
              onClick={(event) => {
                event.stopPropagation(); // Prevent TreeItem toggle
                dispatch(
                  changeQuickEntryAnySectionModalInfo({
                    regionMasterId: row.regionMasterId,
                    regionMasterName: row.regionMasterName,
                    regionId: 0,
                    regionName: '',
                    divisionId: 0,
                    divisionName: '',
                    districtId: 0,
                    districtName: '',
                    quickEntryAnySectionModal: true,
                  })
                );
              }}
            >
              <Edit sx={{ fontSize: '10px' }} />
              {/* <i className="fas fa-edit text-[10px]" /> */}
            </button>
          </Tooltip>
        </div>
      }
    >
      {children}
    </CustomTreeItem>
  );

  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="flex justify-center">
        <div className="block w-[98%]">
          {/* Main Card */}
          {/* <form onSubmit={handleSubmit(downloadReport)}> */}
          <form>
            <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
              {/* Main Card header */}
              <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                {/* -----[TransactionEventVoucher experimental place starts here]----- */}
                Master Region And Target
                {/* ---//--[TransactionEventVoucher experimental place ENDS here]----- */}
              </div>
              {/* Main Card header--/-- */}

              {/* Main Card body */}
              <div className="px-6 pb-4 w-full text-start  mt-5">
                <div className="mb-10">
                  <MonthYearRangePicker
                    startDate={fromMonthYearValue}
                    endDate={toMonthYearValue}
                    setStartDate={handleChangeFromMonthYear}
                    setEndDate={handleChangeToMonthYear}
                  />
                </div>

                <div>
                  <span> Master Regions</span>
                  {/* <Tooltip
                    className=""
                    arrow
                    placement="right"
                    title="Create team"
                  >
                    <button
                      type="button"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      className="ml-2 inline-block px-[4px] py-0 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                      onClick={() => {
                        setTeamSetupModalInfo({
                          teamId: 0,
                        });
                        setTeamMemberModal(true);
                      }}
                    >
                      +
                    </button>
                  </Tooltip> */}
                  <div className="ml-2 flex items-center">
                    {/* Dashed Vertical Line */}
                    <div className="w-0.5 h-5 border-l-2 border-dashed border-gray-400 mx-2" />
                    {/* Text */}{' '}
                  </div>
                </div>

                <div className="grid grid-cols-1 ">
                  <SimpleTreeView defaultExpandedItems={['grid']}>
                    {regionMasterData?.map((regionMasterRow) => {
                      return (
                        <CustomTreeItemWithButton
                          key={regionMasterRow.regionMasterId}
                          label={regionMasterRow.regionMasterName}
                          itemId={regionMasterRow.regionMasterId}
                          row={regionMasterRow}
                        >
                          <RegionAndTarget
                            regionMasterId={regionMasterRow.regionMasterId}
                          />
                        </CustomTreeItemWithButton>
                      );
                    })}
                    {!regionMasterData || regionMasterData?.length === 0 ? (
                      <div>No Region Found</div>
                    ) : (
                      ''
                    )}
                  </SimpleTreeView>
                </div>
                {/* </Box> */}
              </div>
              {/* Main Card Body--/-- */}

              {/* Main Card footer */}
              <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                <div className="flex gap-x-1">
                  {/* <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="inline-block m-3 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                    onClick={() => {
                      // setTeamMemberModalEntryMode('newEntry');
                      setTeamSetupModalInfo({
                        teamId: 0,
                      });
                      setTeamMemberModal(true);
                      // setSelectedBepcRow({});
                    }}
                  >
                    Create A Team
                  </button> */}
                </div>
              </div>
              {/* Main Card footer--/-- */}
            </div>
          </form>
          {/* Main Card--/-- */}
        </div>
      </div>

      {/* Modal for fixedTaskTemplate create---- */}
      <QuickEntryAnySection
        // fromMonth={dayjs(fromMonthYearValue).month() + 1}
        // fromYear={dayjs(fromMonthYearValue).year()}
        // toMonth={dayjs(toMonthYearValue).month() + 1}
        // toYear={dayjs(toMonthYearValue).year()}
        regionMasterId={quickEntryModalInfo.regionMasterId}
        regionMasterName={quickEntryModalInfo.regionMasterName}
        regionId={quickEntryModalInfo.regionId}
        regionName={quickEntryModalInfo.regionName}
        divisionId={quickEntryModalInfo.divisionId}
        divisionName={quickEntryModalInfo.divisionName}
        districtId={quickEntryModalInfo.districtId}
        districtName={quickEntryModalInfo.districtName}
        quickEntryAnySectionModal={
          quickEntryModalInfo.quickEntryAnySectionModal
        }
      ></QuickEntryAnySection>
      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default RegionMasterAndTarget;
