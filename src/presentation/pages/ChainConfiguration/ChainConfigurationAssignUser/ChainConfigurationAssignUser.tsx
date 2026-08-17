// import React from 'react';

// type Props = {};

// const ChainConfigurationAssignUser = (props: Props) => {
//   const x = 0;

//   interface IBiznessEventProcessConfigurationInfoForChainConfig {
//     biznessEventProcessConfigurationId: number; //
//     fixedTastTemplateId: number; //
//     biznessEventId: number; //
//     biznessEventName: string | null;
//     controllerPath: string | null;
//     controllerParamater: string | null;
//     sequence: number | null;
//     mailTemplate: string | null;
//     smsTemplate: string | null;
//     dateOfEntry: string | null;
//     enteredById: number | null;
//     mandatoryAttachment: boolean | null;
//     actionType: string | null;
//     prevBiznessEventId: number | null;
//     nextActionMethod: string | null;
//     relationKey: string; //
//     maxTimeInHours: number; //
//     maxTimeInDays: number; //
//     extenderBiznessEventId: string | null;
//     pcLocationListDtos: IPCLocationListDtos[] | null;
//     pcProductGroupListDtos: IPCProductGroupListDtos[] | null;
//     pcBrandListDto: IPCBrandListDto[] | null;
//   }
//   interface IPCLocationListDtos {
//     biznessEventPCLocationId: number;
//     biznessEventProcessConfigurationId: number;
//     locationId: number;
//     locationName: string;
//     pcUserListDtos: IPCUserListDtos[];
//   }
//   interface IPCUserListDtos {
//     biznessEventPCLocationId: number | null;
//     biznessEventPCUserId: number;
//     biznessEventProcessConfigurationId: number;
//     userId: number;
//     userName: string;
//     mandatory: boolean | null;
//     crud: string;
//     maxActionTimeInDays: number;
//     totalEventValueLimit: number;
//     pcUserProductGroupListDtos: IPCUserProductGroupListDtos[] | null;
//     pcUserBrandListDtos: IPCUserBrandListDtos[] | null;
//     pcButtonListDtos: IPCButtonListDtos[] | null;
//   }
//   interface IPCUserProductGroupListDtos {
//     biznessEventPCUserProductGroupId: number;
//     biznessEventPCUserId: number;
//     productGroupId: number;
//     productGroupName: string;
//     productValueLimit: number;
//   }
//   interface IPCUserBrandListDtos {
//     biznessEventPCUserBrandId: number;
//     biznessEventPCUserId: number;
//     brandId: number;
//     brandValueLimit: number;
//   }
//   interface IPCButtonListDtos {
//     biznessEventPCPageButtonAccessId: number;
//     biznessEventPCPageGenActionId: number; // buttonId
//     biznessEventPCPageGenActionName: string; // buttonName
//     biznessEventPCUserId: number;
//   }
//   interface IPCProductGroupListDtos {
//     biznessEventProcessConfigurationId: number;
//     productGroupId: number;
//     productGroupName: string;
//   }
//   interface IPCBrandListDto {
//     biznessEventProcessConfigurationId: number;
//     brandId: number;
//     brandName: string;
//   }

//   const rupomData: IBiznessEventProcessConfigurationInfoForChainConfig[] = [
//     {
//       biznessEventProcessConfigurationId: 13,
//       fixedTastTemplateId: 1,
//       biznessEventId: 1,
//       biznessEventName: 'Sales',
//       controllerPath: 'url#/Approval/Index?value=PRE',
//       controllerParamater: 'string',
//       sequence: 1,
//       mailTemplate: 'string',
//       smsTemplate: 'string',
//       dateOfEntry: '2023-12-17 16:54:25.177',
//       enteredById: 1,
//       mandatoryAttachment: true,
//       actionType: 'E',
//       prevBiznessEventId: 1012,
//       nextActionMethod: null,
//       relationKey: 'ProcurementRequisition.RequisitionNo',
//       maxTimeInHours: 11,
//       maxTimeInDays: 11,
//       extenderBiznessEventId: '81#82',
//       pcLocationListDtos: [
//         {
//           biznessEventPCLocationId: 1,
//           biznessEventProcessConfigurationId: 13,
//           locationId: 1,
//           locationName: 'Head office',
//           pcUserListDtos: [
//             {
//               biznessEventPCLocationId: 1,
//               biznessEventPCUserId: 1,
//               biznessEventProcessConfigurationId: 13,
//               userId: 1,
//               userName: 'DATABIZ',
//               mandatory: true,
//               crud: 'CRUD',
//               maxActionTimeInDays: 22,
//               totalEventValueLimit: 22,
//               pcUserProductGroupListDtos: [
//                 {
//                   biznessEventPCUserProductGroupId: 1,
//                   biznessEventPCUserId: 1,
//                   productGroupId: 356,
//                   productValueLimit: 5000,
//                 },
//                 {
//                   biznessEventPCUserProductGroupId: 2,
//                   biznessEventPCUserId: 1,
//                   productGroupId: 357,
//                   productValueLimit: 6000,
//                 },
//               ],
//               pcUserBrandListDtos: [
//                 {
//                   biznessEventPCUserBrandId: 1,
//                   biznessEventPCUserId: 1,
//                   brandId: 1,
//                   brandValueLimit: 1000,
//                 },
//                 {
//                   biznessEventPCUserBrandId: 2,
//                   biznessEventPCUserId: 1,
//                   brandId: 2,
//                   brandValueLimit: 2000,
//                 },
//               ],
//               pcButtonListDtos: [
//                 {
//                   biznessEventPCPageButtonAccessId: 3,
//                   biznessEventPCPageGenActionId: 1,
//                   biznessEventPCPageGenActionName: 'Download A Report',
//                   biznessEventPCUserId: 1,
//                 },
//                 {
//                   biznessEventPCPageButtonAccessId: 4,
//                   biznessEventPCPageGenActionId: 9,
//                   biznessEventPCPageGenActionName: 'Download B Report',
//                   biznessEventPCUserId: 1,
//                 },
//               ],
//             },
//             {
//               biznessEventPCLocationId: 1,
//               biznessEventPCUserId: 2,
//               biznessEventProcessConfigurationId: 13,
//               userId: 2,
//               userName: 'DATABIZ2',
//               mandatory: true,
//               crud: 'CRUD',
//               maxActionTimeInDays: 22,
//               totalEventValueLimit: 22,
//               pcUserProductGroupListDtos: [],
//               pcUserBrandListDtos: [],
//               pcButtonListDtos: [],
//             },
//           ],
//         },
//         {
//           biznessEventPCLocationId: 2,
//           biznessEventProcessConfigurationId: 13,
//           locationId: 2,
//           locationName: 'Elephant Road',
//           pcUserListDtos: [],
//         },
//       ],
//       pcProductGroupListDtos: [
//         {
//           biznessEventProcessConfigurationId: 13,
//           productGroupId: 1,
//           productGroupName: 'Mobile Accessories',
//         },
//         {
//           biznessEventProcessConfigurationId: 13,
//           productGroupId: 2,
//           productGroupName: 'Laptop Accessories',
//         },
//       ],
//       pcBrandListDto: [
//         {
//           biznessEventProcessConfigurationId: 13,
//           brandId: 1,
//           brandName: 'Samsung',
//         },
//         {
//           biznessEventProcessConfigurationId: 13,
//           brandId: 2,
//           brandName: 'Lenevo',
//         },
//       ],
//     },
//     {
//       biznessEventProcessConfigurationId: 14,
//       fixedTastTemplateId: 1,
//       biznessEventId: 2,
//       biznessEventName: 'ProcurementRequisition',
//       controllerPath: 'url#/Approval/Index?value=PRE',
//       controllerParamater: 'string',
//       sequence: 1,
//       mailTemplate: 'string',
//       smsTemplate: 'string',
//       dateOfEntry: '2023-12-17 16:54:25.177',
//       enteredById: 1,
//       mandatoryAttachment: true,
//       actionType: 'E',
//       prevBiznessEventId: 1013,
//       nextActionMethod: null,
//       relationKey: 'ProcurementRequisition.RequisitionNo',
//       maxTimeInHours: 11,
//       maxTimeInDays: 11,
//       extenderBiznessEventId: '81#82',
//       pcLocationListDtos: [],
//       pcProductGroupListDtos: [],
//       pcBrandListDto: [],
//     },
//   ];

//   return <div>ChainConfigurationAssignUser</div>;
// };

// export default ChainConfigurationAssignUser;
