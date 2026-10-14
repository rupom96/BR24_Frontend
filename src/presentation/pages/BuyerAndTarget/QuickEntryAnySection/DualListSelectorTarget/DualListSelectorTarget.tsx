/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, { useState, useMemo } from 'react';
import {
  Checkbox,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Menu,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// interface Item {
//   [key: string]: any;
// }
import './DualListSelectorTarget.css';
import { Controller, useForm } from 'react-hook-form';
// Importing the CSS file

interface DualListSelectorTargetProps {
  items: any[];
  selectedItems: any[];
  prevMonthItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  // deletedItems: any[];
  // setDeletedItems: React.Dispatch<React.SetStateAction<any[]>>;
  // primaryKeyToDelete: string;
  // parentPrimaryKey: string;
  idKey: string;
  optionName: string;
  targetProperty: string;
  caption: string;
}

const DualListSelectorTarget: React.FC<DualListSelectorTargetProps> = ({
  items,
  selectedItems,
  prevMonthItems,
  setSelectedItems,
  // deletedItems,
  // setDeletedItems,
  // primaryKeyToDelete,
  // parentPrimaryKey,
  idKey,
  optionName,
  targetProperty,
  caption,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { register, getValues, reset, control, setValue } = useForm();

  const unselectedItems = useMemo(() => {
    return items.filter(
      (item) =>
        !selectedItems.some((selected) => selected[idKey] === item[idKey])
    );
  }, [items, selectedItems, idKey]);

  const filteredSelected = selectedItems.filter(
    (item) => item[optionName]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredUnselected = unselectedItems.filter(
    (item) => item[optionName]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: any) => {
    // maane jodi deletedItems er moddhe thaake, tahole to aar select korle abar deleted array er moddhe thakbena, oikhan theke ore ber kore dite hobe, jehetu state immutable tai splice na kore filtered array re abar deletedArray er moddhe set kora
    // if (item[primaryKeyToDelete]) {
    //   setDeletedItems(
    //     deletedItems.filter(
    //       (row) => row[primaryKeyToDelete] !== item[primaryKeyToDelete]
    //     )
    //   );
    // }
    /// ///////////////////

    setSelectedItems([...selectedItems, item]);
  };

  const handleUnselect = (item: any) => {
    // handle delete
    // if (item[primaryKeyToDelete]) {
    //   const rowToDelete = {
    //     [primaryKeyToDelete]: item[primaryKeyToDelete],
    //     // [parentPrimaryKey]: item[parentPrimaryKey],
    //   };
    //   setDeletedItems([...deletedItems, rowToDelete]);
    // }

    setSelectedItems(
      selectedItems.filter((selected) => selected[idKey] !== item[idKey])
    );
  };

  const handleSelectAll = () => {
    // maane jodi deletedItems er moddhe thaake, tahole to aar select korle abar deleted array er moddhe thakbena, oikhan theke ore ber kore dite hobe, jehetu state immutable tai splice na kore filtered array re abar deletedArray er moddhe set kora
    // Filter deletedItems to exclude items with matching biznessEventId in newItems
    // const deletedRowsRevised = deletedItems.filter(
    //   (deletedItem) =>
    //     !items.some(
    //       (item) => item[primaryKeyToDelete] === deletedItem[primaryKeyToDelete]
    //     )
    // );
    // setDeletedItems(deletedRowsRevised);
    /// ///////////////////

    setSelectedItems(items);
  };

  const handleUnselectAll = () => {
    // handle delete
    const rowsToDelete = [];
    // for (let i = 0; i < selectedItems.length; i++) {
    //   if (selectedItems[i][primaryKeyToDelete]) {
    //     const rowToDelete = {
    //       [primaryKeyToDelete]: selectedItems[i][primaryKeyToDelete],
    //       // [parentPrimaryKey]: selectedItems[i][parentPrimaryKey],
    //     };
    //     rowsToDelete.push(rowToDelete);
    //   }
    // }
    // setDeletedItems([...deletedItems, ...rowsToDelete]);

    setSelectedItems([]);
  };
  const handleTargetSet = (rowObj: any, newTarget: number) => {
    // const getIndex = (array, obj) => {
    //   const index = array.findIndex((obj) => obj === rowObj);
    //   return index !== -1 ? index : null;
    // };
    const getIndex = (array: any, targetObject: any) => {
      const index = array.findIndex((obj: any) => obj === targetObject);
      return index;
    };

    const index = getIndex(selectedItems, rowObj);
    if (index !== -1) {
      selectedItems[index][targetProperty] = newTarget;
      setSelectedItems([...selectedItems]);
    }
  };

  const setTargetToAllSelected = () => {
    console.log('setTargetToAllSelected');
    const targetToSetInAll = getValues().target;
    console.log(targetToSetInAll);

    // selectedItems.forEach((rowObj) => {
    //   rowObj[targetProperty] = targetToSetInAll;
    // });
    for (let i = 0; i < selectedItems.length; i++) {
      selectedItems[i][targetProperty] = targetToSetInAll
        ? parseFloat(targetToSetInAll)
        : 0;
    }
    // selectedItems.splice(1, 1);
    setSelectedItems([...selectedItems]);
    console.log(selectedItems);
  };

  const setTargetSplittedToAllSelected = () => {
    console.log('setTargetToAllSelected');
    const targetSplitToSetInAll =
      parseFloat(getValues().target) / selectedItems.length;
    console.log(targetSplitToSetInAll);

    // selectedItems.forEach((rowObj) => {
    //   rowObj[targetProperty] = targetSplitToSetInAll;
    // });
    for (let i = 0; i < selectedItems.length; i++) {
      selectedItems[i][targetProperty] = targetSplitToSetInAll || 0;
    }
    // selectedItems.splice(1, 1);
    setSelectedItems([...selectedItems]);
    console.log(selectedItems);
  };

  const setPreviousTargetToAllSelected = () => {
    console.log('setPreviousMonthTargetToAllSelected');

    const updatedSelectedItems = selectedItems.map((item) => {
      const match = prevMonthItems.find((p) => p[idKey] === item[idKey]);
      return match
        ? { ...item, [targetProperty]: match[targetProperty] } // Overwrite target if match found
        : item; // Keep as is if no match
    });

    // selectedItems.splice(1, 1);
    setSelectedItems([...updatedSelectedItems]);
    console.log(updatedSelectedItems);
  };

  // -----Mouse right click handling for target field----
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX + 2,
      mouseY: e.clientY - 6,
    });
  };

  const handleCopyPreviousTarget = () => {
    setPreviousTargetToAllSelected();
    setContextMenu(null);
  };

  return (
    <div className="duelListSelectorCustom">
      <Box mt={2}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <p
              className=" font-bold"
              style={{ fontSize: '0.8125rem', marginLeft: 4 }}
            >
              Select {caption}:
            </p>
          </Grid>
          <Grid item xs={6}>
            {/* <TextField
            label={`Search ${caption}`}
            variant="outlined"
            size="small"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiInputBase-root': { fontSize: '0.8125rem' },
              '& .MuiInputLabel-root': { fontSize: '0.8125rem' }, // Set label font size
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          /> */}

            <FormControl
              sx={{
                width: '100%',
                '& .MuiInputBase-input': { fontSize: '0.8125rem' },
              }}
              size="small"
              variant="outlined"
            >
              <InputLabel
                htmlFor="outlined-adornment-username"
                sx={{ fontSize: '0.8125rem' }} // Set font size for the label
              >
                {`Search ${caption}`}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-username"
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                onChange={(e) => setSearchTerm(e.target.value)}
                label={`Search ${caption}`}
                sx={{
                  fontSize: '0.8125rem', // Set font size for the input
                  '& .MuiOutlinedInput-notchedOutline': { fontSize: '0.8125rem' }, // Ensure font size consistency
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ mt: '0px' }}>
          <Grid item xs={6}>
            <Box
              border={1}
              borderColor="grey.300"
              height="280px"
              overflow="hidden"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                position="sticky"
                top={0}
                bgcolor="white"
                // zIndex={1}
                sx={{
                  borderBottom: 1,
                  borderColor: 'grey.300',
                  paddingLeft: '0.5rem',
                  zIndex: 'auto',
                }}
              >
                <p className=" font-bold" style={{ fontSize: '0.8125rem' }}>
                  Selected Items:
                </p>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={false}
                      onChange={handleUnselectAll}
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: '1.125rem' },
                      }}
                    />
                  }
                  label="Deselect All"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.8125rem' } }}
                />
              </Box>
              <List style={{ overflowY: 'auto', maxHeight: '15.4375rem' }}>
                {filteredSelected.map((item) => (
                  <ListItem
                    key={item[idKey]}
                    button
                    // onClick={() => handleUnselect(item)}
                    sx={{ paddingY: 0, zIndex: 'auto' }}
                  >
                    <div className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-8 flex gap-2">
                        <Checkbox
                          className="self-start"
                          sx={{ '& .MuiSvgIcon-root': { fontSize: '1rem' } }}
                          onClick={() => handleUnselect(item)}
                          checked
                        />
                        <ListItemText
                          className="flex-grow self-start break-words whitespace-normal"
                          primary={item[optionName]}
                          sx={{ '& .MuiTypography-root': { fontSize: '0.8125rem' } }}
                        />
                      </div>
                      <div className="col-span-4 mt-1 flex items-center gap-1 text-[0.8125rem]">
                        <span>Target:</span>
                        {/* <input
                          type="number"
                          className="border rounded p-1 text-[0.8125rem] w-16"
                          min="1"
                          value={item[targetProperty]}
                          onBlur={(event) => {
                            const newTarget = event.target.value
                              ? parseFloat(event.target.value)
                              : 0;
                            handleTargetSet(item, newTarget);
                          }}
                        /> */}

                        <div onContextMenu={handleContextMenu}>
                          <Controller
                            name=""
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                // defaultValue={item[targetProperty]}
                                type="number"
                                sx={{ width: '100%' }}
                                InputProps={{
                                  style: { fontSize: '0.8125rem', padding: '0' },
                                }}
                                inputProps={{
                                  style: { padding: '0.25rem' }, // Directly set padding on the input element
                                }}
                                // InputLabelProps={{
                                //   style: { fontSize: '0.875rem' },
                                //   shrink: field.value,
                                // }}
                                inputRef={(node) => {
                                  if (node) {
                                    node.value =
                                      (
                                        Math.ceil(item[targetProperty] * 100) /
                                        100
                                      ).toFixed(2) || 0;
                                  }
                                }}
                                onBlur={(event) => {
                                  const newTarget = event.target.value
                                    ? parseFloat(event.target.value)
                                    : 0;
                                  handleTargetSet(item, newTarget);
                                }}
                                id=""
                                // label="Target"
                                variant="outlined"
                                size="small"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              border={1}
              borderColor="grey.300"
              height="280px"
              overflow="hidden"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                position="sticky"
                top={0}
                bgcolor="white"
                // zIndex={1}
                // p={1}
                sx={{
                  borderBottom: 1,
                  borderColor: 'grey.300',
                  paddingLeft: '0.5rem',
                  zIndex: 'auto',
                }}
              >
                <p className=" font-bold" style={{ fontSize: '0.8125rem' }}>
                  Unselected Items:
                </p>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={false}
                      onChange={handleSelectAll}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }}
                    />
                  }
                  label="Select All"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.8125rem' } }}
                />
              </Box>
              <List style={{ overflowY: 'auto', maxHeight: '15.4375rem' }}>
                {filteredUnselected.map((item) => (
                  <ListItem
                    key={item[idKey]}
                    button
                    onClick={() => handleSelect(item)}
                    sx={{ paddingY: 0, zIndex: 'auto' }}
                  >
                    <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }} />
                    <ListItemText
                      primary={item[optionName]}
                      sx={{
                        '& .MuiTypography-root': { fontSize: '0.8125rem' },
                        zIndex: '0',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <div className="flex gap-1 justify-between items-center mt-5 w-1/2">
        <Controller
          name="target"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              sx={{ width: '65%' }}
              InputProps={{ style: { fontSize: '0.8125rem' } }}
              InputLabelProps={{
                style: { fontSize: '0.875rem' },
                shrink: field.value,
              }}
              id=""
              label="Target"
              variant="outlined"
              size="small"
            />
          )}
        />
        <button
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
          onClick={() => {
            setTargetToAllSelected();
          }}
        >
          Set
        </button>
        <button
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
          onClick={() => {
            setTargetSplittedToAllSelected();
          }}
        >
          Split Set
        </button>
        {/* <button
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
          onClick={() => {
            setPreviousTargetToAllSelected();
          }}
        >
          Set Target of Previous Months
        </button> */}
      </div>

      {/* Context Menu Component */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => contextMenu && handleCopyPreviousTarget()}>
          Copy previous month target for all
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DualListSelectorTarget;
