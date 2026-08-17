import React, { useState } from 'react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

interface ButtonItem {
  biznessEventPCPageGenActionName: string;
  pageName: string;
  biznessEventPCPageButtonAccessId?: number | null;
}

interface Props {
  items: any[];
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  deletedItems: any[];
  setDeletedItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const ListSelectorButton: React.FC<Props> = ({
  items,
  selectedItems,
  setSelectedItems,
  deletedItems,
  setDeletedItems,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = items.filter(
    (item) =>
      item.biznessEventPCPageGenActionName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.pageName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (item: any) => {
    const isSelected = selectedItems.some(
      (i) =>
        i.biznessEventPCPageGenActionName ===
        item.biznessEventPCPageGenActionName
    );

    if (isSelected) {
      setSelectedItems((prev) =>
        prev.filter(
          (i) =>
            i.biznessEventPCPageGenActionName !==
            item.biznessEventPCPageGenActionName
        )
      );
      if (item.biznessEventPCPageButtonAccessId) {
        setDeletedItems((prev) => [...prev, item]);
      }
    } else {
      const isInDeleted = deletedItems.some(
        (i) =>
          i.biznessEventPCPageGenActionName ===
          item.biznessEventPCPageGenActionName
      );
      if (isInDeleted) {
        setDeletedItems((prev) =>
          prev.filter(
            (i) =>
              i.biznessEventPCPageGenActionName !==
              item.biznessEventPCPageGenActionName
          )
        );
      }
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems);
      setDeletedItems((prev) =>
        prev.filter(
          (item) =>
            !filteredItems.some(
              (i) =>
                i.biznessEventPCPageGenActionName ===
                item.biznessEventPCPageGenActionName
            )
        )
      );
    } else {
      const itemsToDelete = filteredItems.filter(
        (item) => item.biznessEventPCPageButtonAccessId
      );
      setDeletedItems((prev) => [...prev, ...itemsToDelete]);
      setSelectedItems([]);
    }
  };

  const isAllChecked = filteredItems.every((item) =>
    selectedItems.some(
      (i) =>
        i.biznessEventPCPageGenActionName ===
        item.biznessEventPCPageGenActionName
    )
  );

  return (
    <div className="p-4">
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={isAllChecked}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>ButtonName</TableCell>
              <TableCell>PageName</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.biznessEventPCPageGenActionName}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.some(
                      (i) =>
                        i.biznessEventPCPageGenActionName ===
                        item.biznessEventPCPageGenActionName
                    )}
                    onChange={() => handleCheckboxChange(item)}
                  />
                </TableCell>
                <TableCell>{item.biznessEventPCPageGenActionName}</TableCell>
                <TableCell>{item.pageName || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListSelectorButton;
