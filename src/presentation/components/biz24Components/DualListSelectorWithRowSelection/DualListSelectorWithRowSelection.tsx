/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

import './DualListSelectorWithRowSelection.css';

interface DualListSelectorWithRowSelectionProps {
  items: any[];
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  deletedItems: any[];
  setDeletedItems: React.Dispatch<React.SetStateAction<any[]>>;
  highlightedRow: any | null;
  setHighlightedRow: React.Dispatch<React.SetStateAction<any | null>>;
  primaryKeyToDelete: string;
  parentPrimaryKey: string;
  idKey: string;
  optionName: string;
  caption: string;
}

const DualListSelectorWithRowSelection: React.FC<
  DualListSelectorWithRowSelectionProps
> = ({
  items,
  selectedItems,
  setSelectedItems,
  deletedItems,
  setDeletedItems,
  highlightedRow,
  setHighlightedRow,
  primaryKeyToDelete,
  parentPrimaryKey,
  idKey,
  optionName,
  caption,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleCheckSelect = (item: any) => {
    // maane jodi deletedItems er moddhe thaake, tahole to aar select korle abar deleted array er moddhe thakbena, oikhan theke ore ber kore dite hobe, jehetu state immutable tai splice na kore filtered array re abar deletedArray er moddhe set kora
    if (item[primaryKeyToDelete]) {
      setDeletedItems(
        deletedItems.filter(
          (row) => row[primaryKeyToDelete] !== item[primaryKeyToDelete]
        )
      );
    }
    /// ///////////////////
    setSelectedItems([...selectedItems, item]);
  };

  const handleCheckUnselect = (item: any, itemIndex: number) => {
    // jodi jeita unselect(delete) kortesi, oita already highlighted thaake then highlight uthe jaabe

    const obj = {
      [idKey]: item[idKey],
      [optionName]: item[optionName],
    };
    if (highlightedRow && highlightedRow[idKey] === obj[idKey]) {
      setHighlightedRow(null);
    }

    // handle delete
    if (item[primaryKeyToDelete]) {
      const rowToDelete = {
        [primaryKeyToDelete]: item[primaryKeyToDelete],
        [parentPrimaryKey]: item[parentPrimaryKey],
      };
      setDeletedItems([...deletedItems, rowToDelete]);
    }
    setTimeout(() => {
      setSelectedItems(
        selectedItems.filter((selected) => selected[idKey] !== item[idKey])
      );
    });
  };

  const handleCheckSelectAll = () => {
    // maane jodi deletedItems er moddhe thaake, tahole to aar select korle abar deleted array er moddhe thakbena, oikhan theke ore ber kore dite hobe, jehetu state immutable tai splice na kore filtered array re abar deletedArray er moddhe set kora
    // Filter deletedItems
    const deletedRowsRevised = deletedItems.filter(
      (deletedItem) =>
        !filteredUnselected.some(
          (item) => item[primaryKeyToDelete] === deletedItem[primaryKeyToDelete]
        )
    );
    setDeletedItems(deletedRowsRevised);
    /// ///////////////////

    setSelectedItems([...selectedItems, ...filteredUnselected]);
  };

  const handleCheckUnselectAll = () => {
    // handle delete
    const rowsToDelete = [];
    const filteredSelectedTemp = selectedItems.filter(
      (item) =>
        item[optionName]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const highlightExistsInFilteredSelected = filteredSelectedTemp.some(
      (item) => item[idKey] === highlightedRow[idKey]
    );

    if (highlightExistsInFilteredSelected) {
      // kaaron, selected items er checks change houa maanei selected highlight uthaya dibo
      setHighlightedRow(null);
    }

    for (let i = 0; i < filteredSelectedTemp.length; i++) {
      if (filteredSelectedTemp[i][primaryKeyToDelete]) {
        const rowToDelete = {
          [primaryKeyToDelete]: filteredSelectedTemp[i][primaryKeyToDelete],
          [parentPrimaryKey]: filteredSelectedTemp[i][parentPrimaryKey],
        };
        rowsToDelete.push(rowToDelete);
      }
    }
    setDeletedItems([...deletedItems, ...rowsToDelete]);

    setTimeout(() => {
      const result = selectedItems.filter(
        (selectedItemRow) =>
          !filteredSelectedTemp.some(
            (filteredSelectedRow) =>
              filteredSelectedRow[idKey] === selectedItemRow[idKey]
          )
      );
      setSelectedItems([...result]);
    });
  };

  const handleRowSelect = (item: any) => {
    const obj = {
      [idKey]: item[idKey],
      [optionName]: item[optionName],
    };
    if (highlightedRow && highlightedRow[idKey] === obj[idKey]) {
      setHighlightedRow(null);
    } else {
      setHighlightedRow(obj);
    }
    // if (highlightedRow === index) {
    //   setHighlightedRow(null);
    // } else {
    //   setHighlightedRow(index);
    // }
  };

  return (
    <div className="dualListSelectorWithRowSelectionCustom">
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
                zIndex={10}
                sx={{
                  borderBottom: 1,
                  borderColor: 'grey.300',
                  paddingLeft: '0.5rem',
                }}
              >
                <p className=" font-bold" style={{ fontSize: '0.8125rem' }}>
                  Selected Items:
                </p>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={false}
                      onChange={() => {
                        if (filteredSelected.length) {
                          handleCheckUnselectAll();
                        }
                      }}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }}
                    />
                  }
                  label="Deselect All"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.8125rem' } }}
                />
              </Box>
              <List style={{ overflowY: 'auto', maxHeight: '15.4375rem' }}>
                {filteredSelected.map((item, index) => (
                  <ListItem
                    key={item[idKey]}
                    button
                    // onClick={() => handleCheckUnselect(item)}
                    // onClick={() => handleRowSelect(index, item)}
                    sx={{
                      paddingY: 0,
                      backgroundColor:
                        highlightedRow && highlightedRow[idKey] === item[idKey]
                          ? 'rgba(25, 118, 210, 0.2)'
                          : 'transparent',
                      // '&:hover': {
                      //   backgroundColor: 'rgba(25, 118, 210, 0.1)', // Optional hover effect
                      // },
                    }}
                  >
                    <Checkbox
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }}
                      checked
                      onClick={() => handleCheckUnselect(item, index)}
                    />
                    <ListItemText
                      primary={item[optionName]}
                      sx={{ '& .MuiTypography-root': { fontSize: '0.8125rem' } }}
                    />
                    <span onClick={() => handleRowSelect(item)}>
                      <i className="fas fa-edit" />
                    </span>
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
                zIndex={10}
                // p={1}
                sx={{
                  borderBottom: 1,
                  borderColor: 'grey.300',
                  paddingLeft: '0.5rem',
                }}
              >
                <p className=" font-bold" style={{ fontSize: '0.8125rem' }}>
                  Unselected Items:
                </p>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={false}
                      onChange={() => {
                        if (filteredUnselected.length) {
                          handleCheckSelectAll();
                        }
                      }}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }}
                    />
                  }
                  label="Select All"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.8125rem' } }}
                />
              </Box>
              <List style={{ overflowY: 'auto', maxHeight: '15.4375rem' }}>
                {filteredUnselected.map((item, index) => (
                  <ListItem
                    key={item[idKey]}
                    button
                    // onClick={() => handleRowSelect(item)}
                    onClick={() => handleCheckSelect(item)}
                    sx={{ paddingY: 0 }}
                  >
                    <Checkbox
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.125rem' } }}
                      // onClick={() => handleCheckSelect(item)}
                    />
                    <ListItemText
                      primary={item[optionName]}
                      sx={{ '& .MuiTypography-root': { fontSize: '0.8125rem' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default DualListSelectorWithRowSelection;
