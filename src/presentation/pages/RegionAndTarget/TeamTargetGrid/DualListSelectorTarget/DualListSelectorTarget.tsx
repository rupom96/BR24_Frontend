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
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  deletedItems?: any[];
  setDeletedItems?: React.Dispatch<React.SetStateAction<any[]>>;
  primaryKeyToDelete?: string;
  // parentPrimaryKey: string;
  idKey: string;
  optionName: string;
  targetProperty: string;
  caption: string;
}

const DualListSelectorTarget: React.FC<DualListSelectorTargetProps> = ({
  items,
  selectedItems,
  setSelectedItems,
  deletedItems,
  setDeletedItems,
  primaryKeyToDelete,
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
    if (
      deletedItems &&
      primaryKeyToDelete &&
      setDeletedItems &&
      item[primaryKeyToDelete]
    ) {
      setDeletedItems(
        deletedItems.filter(
          (row) => row[primaryKeyToDelete] !== item[primaryKeyToDelete]
        )
      );
    }
    /// ///////////////////

    setSelectedItems([...selectedItems, item]);
  };

  const handleUnselect = (item: any) => {
    // handle delete
    if (
      deletedItems &&
      primaryKeyToDelete &&
      setDeletedItems &&
      item[primaryKeyToDelete]
    ) {
      const rowToDelete = {
        [primaryKeyToDelete]: item[primaryKeyToDelete],
        // [parentPrimaryKey]: item[parentPrimaryKey],
      };
      setDeletedItems([...deletedItems, rowToDelete]);
    }

    setSelectedItems(
      selectedItems.filter((selected) => selected[idKey] !== item[idKey])
    );
  };

  const handleSelectAll = () => {
    // maane jodi deletedItems er moddhe thaake, tahole to aar select korle abar deleted array er moddhe thakbena, oikhan theke ore ber kore dite hobe, jehetu state immutable tai splice na kore filtered array re abar deletedArray er moddhe set kora
    // Filter deletedItems to exclude items with matching biznessEventId in newItems
    if (deletedItems && primaryKeyToDelete && setDeletedItems) {
      const deletedRowsRevised = deletedItems.filter(
        (deletedItem) =>
          !items.some(
            (item) =>
              item[primaryKeyToDelete] === deletedItem[primaryKeyToDelete]
          )
      );
      setDeletedItems(deletedRowsRevised);
    }
    /// ///////////////////

    setSelectedItems(items);
  };

  const handleUnselectAll = () => {
    // handle delete
    if (deletedItems && primaryKeyToDelete && setDeletedItems) {
      const rowsToDelete = [];
      for (let i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i][primaryKeyToDelete]) {
          const rowToDelete = {
            [primaryKeyToDelete]: selectedItems[i][primaryKeyToDelete],
            // [parentPrimaryKey]: selectedItems[i][parentPrimaryKey],
          };
          rowsToDelete.push(rowToDelete);
        }
      }
      setDeletedItems([...deletedItems, ...rowsToDelete]);
    }

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

  return (
    <div className="duelListSelectorCustom">
      <Box mt={2}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <p
              className=" font-bold"
              style={{ fontSize: '13px', marginLeft: 4 }}
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
              '& .MuiInputBase-root': { fontSize: '13px' },
              '& .MuiInputLabel-root': { fontSize: '13px' }, // Set label font size
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
                '& .MuiInputBase-input': { fontSize: '13px' },
              }}
              size="small"
              variant="outlined"
            >
              <InputLabel
                htmlFor="outlined-adornment-username"
                sx={{ fontSize: '13px' }} // Set font size for the label
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
                  fontSize: '13px', // Set font size for the input
                  '& .MuiOutlinedInput-notchedOutline': { fontSize: '13px' }, // Ensure font size consistency
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
                  paddingLeft: '8px',
                  zIndex: 'auto',
                }}
              >
                <p className=" font-bold" style={{ fontSize: '13px' }}>
                  Selected Items:
                </p>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={false}
                      onChange={handleUnselectAll}
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 18 },
                      }}
                    />
                  }
                  label="Deselect All"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
                />
              </Box>
              <List style={{ overflowY: 'auto', maxHeight: '247px' }}>
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
                          sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}
                          onClick={() => handleUnselect(item)}
                          checked
                        />
                        <ListItemText
                          className="flex-grow self-start break-words whitespace-normal"
                          primary={item[optionName]}
                          sx={{ '& .MuiTypography-root': { fontSize: '13px' } }}
                        />
                      </div>
                      <div className="col-span-4 mt-1 flex items-center gap-1 text-[13px]">
                        <span>Target:</span>
                        {/* <input
                          type="number"
                          className="border rounded p-1 text-[13px] w-16"
                          min="1"
                          value={item[targetProperty]}
                          onBlur={(event) => {
                            const newTarget = event.target.value
                              ? parseFloat(event.target.value)
                              : 0;
                            handleTargetSet(item, newTarget);
                          }}
                        /> */}
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
                                style: { fontSize: 13, padding: '0px' },
                              }}
                              inputProps={{
                                style: { padding: '4px' }, // Directly set padding on the input element
                              }}
                              // InputLabelProps={{
                              //   style: { fontSize: 14 },
                              //   shrink: field.value,
                              // }}
                              inputRef={(node) => {
                                if (node) {
                                  node.value = item[targetProperty] || 0;
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
                  paddingLeft: '8px',
                  zIndex: 'auto',
                }}
              >
                <p className=" font-bold" style={{ fontSize: '13px' }}>
                  Unselected Items:
                </p>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={false}
                      onChange={handleSelectAll}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                    />
                  }
                  label="Select All"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
                />
              </Box>
              <List style={{ overflowY: 'auto', maxHeight: '247px' }}>
                {filteredUnselected.map((item) => (
                  <ListItem
                    key={item[idKey]}
                    button
                    onClick={() => handleSelect(item)}
                    sx={{ paddingY: 0, zIndex: 'auto' }}
                  >
                    <Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />
                    <ListItemText
                      primary={item[optionName]}
                      sx={{
                        '& .MuiTypography-root': { fontSize: '13px' },
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
              InputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{
                style: { fontSize: 14 },
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
      </div>
      {/* <div className="flex gap-4 justify-between items-center mt-5 w-1/2">
        <Controller
          name="target"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              sx={{ width: '100%' }}
              InputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{
                style: { fontSize: 14 },
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
      </div> */}
    </div>
  );
};

export default DualListSelectorTarget;
