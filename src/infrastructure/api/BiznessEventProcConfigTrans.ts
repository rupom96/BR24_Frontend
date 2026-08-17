// import axios from 'axios';

// export function BiznessEventProcConfigTrans1(x: object): string {
//   let mssg: string = '';
//   axios.post(`kisuEkta`, x).then((res) => {
//     if (res) {
//       mssg = 'All data saved successfully';
//       return mssg;
//     }
//     mssg = 'Something is wrong';
//     return mssg;
//   });
//   return mssg;
// }

// export function BiznessEventProcConfigTrans2(x: string): number {
//   fetch(
//     `API/JournalVoucher/Get_VoucherAllInfo?voucherNo=${res.data.VoucherNo}&voucherId=${res.data.VoucherId}`
//   )
//     .then(
//       (res) => res.json()
//       // console.log(res);
//     )
//     .then((data) => {
//       console.log(
//         'Fetched AGAIN AFTER Save, Raw data for voucher Edit, Line No. 716.....'
//       );
//     });

//   return 1;
// }
