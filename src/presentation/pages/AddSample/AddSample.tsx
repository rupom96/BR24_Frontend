/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef } from 'react';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../../../application/Redux/store/store';
import { addPerson } from '../../../application/Redux/slices/PersonSlice';

const AddSample = () => {
  const name = useRef<string>('');
  const dispatch = useAppDispatch();
  return (
    <form className="">
      <label htmlFor="personName">Person Name:</label>
      <input
        id="personName"
        className=""
        onChange={(e) => {
          name.current = e.target.value;
        }}
      />
      <Button
        onClick={() => {
          dispatch(addPerson({ name: name.current }));
        }}
        variant="contained"
      >
        Add
      </Button>
    </form>
  );
};

export default AddSample;
