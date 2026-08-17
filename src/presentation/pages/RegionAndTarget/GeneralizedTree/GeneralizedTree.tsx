import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */

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
import { toast } from 'react-toastify';

type GeneralizedTreeProps = {
  itemLabelProperty: string;
  itemIdProperty: string;
  dataToMap: any[];
  childComponent: ReactNode;
};

const GeneralizedTree: React.FC<GeneralizedTreeProps> = ({
  itemLabelProperty,
  itemIdProperty,
  dataToMap,
  childComponent,
}) => {
  // ------------------------ENDING API CALLS AND ASSOCIATED USE-EFFECTS------------------------

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

  const CustomTreeItemWithButton: React.FC<{
    label: string;
    itemId: number;
    children: ReactNode;
  }> = ({ label, itemId, children }) => (
    <CustomTreeItem
      key={itemId}
      itemId={itemId.toString()}
      label={
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <span className="mr-3"> {label}</span>{' '}
          {/* Label takes the remaining space */}
          <Tooltip
            className=""
            arrow
            placement="right"
            title="Edit Team and Member"
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
      {/* <TeamTargetGridTest itemId={1} month={2} year={2024} />
                  <TeamTargetGrid itemId={1} month={2} year={2024} /> */}
      <SimpleTreeView defaultExpandedItems={['grid']}>
        {dataToMap?.map((dataRow) => {
          return (
            <CustomTreeItemWithButton
              key={dataRow[itemIdProperty] as number}
              label={dataRow[itemLabelProperty] as string}
              itemId={dataRow[itemIdProperty] as number}
            >
              {/* <TeamTargetGrid itemId={teamRow.itemId} /> */}
              {childComponent}
            </CustomTreeItemWithButton>
          );
        })}
      </SimpleTreeView>
    </div>
  );
};

export default GeneralizedTree;
