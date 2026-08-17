/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { useAppDispatch } from '../../../application/Redux/store/store';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';

type Props = {};

const Dashboard = (props: Props) => {
  const dispatch = useAppDispatch();
  dispatch(setNavbarShow(true));
  dispatch(setPanelShow(true));

  return (
    <div className="w-full font-extrabold text-center">
      Dashboard under development
    </div>
  );
};

export default Dashboard;
