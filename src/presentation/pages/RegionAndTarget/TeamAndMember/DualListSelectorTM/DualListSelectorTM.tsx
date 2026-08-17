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
import './DualListSelectorTM.css';
// Importing the CSS file

interface DualListSelectorTMProps {
  items: any[];
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  deletedItems: any[];
  setDeletedItems: React.Dispatch<React.SetStateAction<any[]>>;
  primaryKeyToDelete: string;
  idKey: string;
  optionName: string;
  caption: string;
}

const DualListSelectorTM: React.FC<DualListSelectorTMProps> = ({
  items,
  selectedItems,
  setSelectedItems,
  deletedItems,
  setDeletedItems,
  primaryKeyToDelete,
  idKey,
  optionName,
  caption,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const unselectedItems = useMemo(() => {
    // Create mergedItems by iterating through allItems and checking for matching productId in selecteditems
    // const mergedItems = items.map((itemRow) => {
    //   const match = selectedItems.find(
    //     (selectedItemRow) => selectedItemRow[idKey] === itemRow[idKey]
    //   );
    //   return match || itemRow;
    // });
    /// ////////////////////////////////////////////////////

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

  const handleUnselect = (item: any) => {
    // handle delete
    if (item[primaryKeyToDelete]) {
      const rowToDelete = {
        [primaryKeyToDelete]: item[primaryKeyToDelete],
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
    const deletedRowsRevised = deletedItems.filter(
      (deletedItem) =>
        !items.some(
          (item) => item[primaryKeyToDelete] === deletedItem[primaryKeyToDelete]
        )
    );
    setDeletedItems(deletedRowsRevised);
    /// ///////////////////

    setSelectedItems(items);
  };

  const handleUnselectAll = () => {
    // handle delete
    const rowsToDelete = [];
    for (let i = 0; i < selectedItems.length; i++) {
      if (selectedItems[i][primaryKeyToDelete]) {
        const rowToDelete = {
          [primaryKeyToDelete]: selectedItems[i][primaryKeyToDelete],
        };
        rowsToDelete.push(rowToDelete);
      }
    }
    setDeletedItems([...deletedItems, ...rowsToDelete]);

    setSelectedItems([]);
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
                    onClick={() => handleUnselect(item)}
                    sx={{ paddingY: 0, zIndex: 'auto' }}
                  >
                    <Checkbox
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                      checked
                    />
                    <ListItemText
                      primary={item[optionName]}
                      sx={{ '& .MuiTypography-root': { fontSize: '13px' } }}
                    />
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
    </div>
  );
};

export default DualListSelectorTM;
