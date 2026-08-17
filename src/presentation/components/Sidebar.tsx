import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BiAnalyse } from 'react-icons/bi';
import { MdOutlineCancel } from 'react-icons/md';

import { Tooltip } from '@mui/material';

// eslint-disable-next-line import/no-named-as-default
// import links from '../assets/dummy.js';
import { FiShoppingBag } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store.js';
import {
  toggleActiveMenu,
  falsifyActiveMenu,
} from '../../application/Redux/slices/ActiveMenuSlice.js';
import { useGetSAChainMenuByCompanyLocationUserIdQuery } from '../../infrastructure/api/SAChainMenuApiSlice.js';

const Sidebar = () => {
  // const { activeMenu, setActiveMenu, screenSize, currentColor } =
  //   useStateContext();

  const navigate = useNavigate();

  let userInfo;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  // if (!userInfo?.securityUserId) {
  //   if (localStorage.getItem('userInfo') && localStorage.getItem('brFeature')) {
  //     localStorage.removeItem('userInfo');
  //     localStorage.removeItem('brFeature');
  //   }
  //   navigate('/loginUsername');
  // }

  // const userInfo = {
  //   securityUserId: 1,
  //   UserName: 'DATABIZ',
  //   Email: null,
  //   Password: 'DATABIZ33305',
  //   RememberMe: false,
  //   CompanyId: 1,
  //   LocationId: 1,
  //   ScreenWidth: 1707,
  // };

  const {
    data: SAChainMenuData,
    isLoading: SAChainMenuLoading,
    isError: SAChainMenuGetIsError,
    error: SAChainMenuGetError,
    isFetching: SAChainMenuIsFetching,
    // error: SAChainMenuGetError,
  } = useGetSAChainMenuByCompanyLocationUserIdQuery(
    {
      userId: userInfo?.securityUserId || 0,
      companyId: userInfo?.companyId || 0,
      locationId: userInfo?.locationId || 0,
    },
    { refetchOnMountOrArgChange: true }
  );

  interface ILinks {
    name?: string;
    path?: string;
    icon?: React.ReactNode;
    // icon?: JSX.Element;
    sublinks?: ILinks[];
  }

  // const tasklinks: ILinks[] = [];

  const [allLinks, setAllLinks] = useState<IAllLinks[]>([]);

  // let taskChainsObject = {};
  // if (!SAChainMenuLoading) {
  //   SAChainMenuData?.forEach((item) => {
  //     const tempObj = {
  //       name: item.fixedTaskTemplateName,
  //       path: item.fixedTaskTemplateName.replace(/\s+/g, ''),
  //       icon: <FiShoppingBag />,
  //     };
  //     tasklinks.push(tempObj);
  //   });
  // }

  const allLinksObj: ILinks = {
    name: 'All',
    path: 'AllTemplate',
    icon: <FiShoppingBag />,
  };

  // if (tasklinks.length) {
  //   taskChainsObject = {
  //     title: 'Task Chains',
  //     // links: [allLinksObj, ...tasklinks],
  //     links: [...tasklinks],
  //   };
  // }

  interface IAllLinks {
    title?: string;
    links?: ILinks[];
  }

  // const allLinks: IAllLinks[] = [
  //   { ...taskChainsObject },
  //   {
  //     title: 'Bizness Roots',
  //     links: [
  //       // {
  //       //   name: 'BizEvent Process Config',
  //       //   path: 'bizEventProcConfig',
  //       //   icon: <FiShoppingBag />,
  //       // },
  //       // {
  //       //   name: 'FreshenedUp Page',
  //       //   path: 'structuredPage',
  //       //   icon: <FiShoppingBag />,
  //       // },
  //       // {
  //       //   name: 'Laboratory',
  //       //   path: 'laboratory',
  //       //   icon: <FiShoppingBag />,
  //       // },
  //       {
  //         name: 'Cost Sheet Detail',
  //         path: 'costSheetDetail',
  //         icon: <FiShoppingBag />,
  //       },
  //       // {
  //       //   name: 'Cheque Book Management',
  //       //   path: 'chequeBookManagement',
  //       //   icon: <FiShoppingBag />,
  //       // },
  //       {
  //         name: 'LC Voucher',
  //         path: 'transactionalLcVoucher',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'Tender Voucher',
  //         path: 'transactionalTenderVoucher',
  //         icon: <FiShoppingBag />,
  //       },
  //       // {
  //       //   name: 'Dynamic Report',
  //       //   path: 'DynamicReport',
  //       //   icon: <FiShoppingBag />,
  //       // },
  //       // {
  //       //   name: 'Tender Requisition',
  //       //   path: 'tenderRequisition',
  //       //   icon: <FiShoppingBag />,
  //       // },
  //       // {
  //       //   name: 'Transaction Event Voucher',
  //       //   path: 'transactionalEventVoucher',
  //       //   icon: <FiShoppingBag />,
  //       // },
  //     ],
  //   },
  //   {
  //     title: 'Reports',
  //     links: [
  //       {
  //         name: 'Customer Wise BG Rpt',
  //         path: 'cutomerWiseBgRpt',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'BG Detail Date wise exp',
  //         path: 'bgDetailDateWiseExp',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'Tender Summary Rpt',
  //         path: 'tenderSummaryReport',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'Tender AdditionalCost Rpt',
  //         path: 'tenderAdditionalCostReport',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'Purchase Summary Rpt',
  //         path: 'purchaseSummaryReport',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'Analysis Transaction Rpt',
  //         path: 'analysisHeadWiseTransactionReport',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'Chain Config List Rpt',
  //         path: 'chainConfigListReport',
  //         icon: <FiShoppingBag />,
  //       },
  //       {
  //         name: 'Chains With NextStep Rpt',
  //         path: 'runningChainsAndNextTaskReport',
  //         icon: <FiShoppingBag />,
  //       },
  //     ],
  //   },
  // ];

  useEffect(() => {
    if (
      !SAChainMenuLoading &&
      !SAChainMenuGetIsError &&
      !SAChainMenuIsFetching &&
      !SAChainMenuGetError &&
      SAChainMenuData
    ) {
      const tasklinks: ILinks[] = [];
      const reportlinks: ILinks[] = [];
      const staticMenulinks: ILinks[] = [];
      SAChainMenuData?.forEach((item) => {
        // if (!item.biznessEventProcessConfigurationId) {
        //   const tempTaskChainObj = {
        //     name: item.fixedTaskTemplateName,
        //     path: item.fixedTaskTemplateName.replace(/\s+/g, ''),
        //     icon: <FiShoppingBag />,
        //   };
        //   tasklinks.push(tempTaskChainObj);
        // }

        // if (item.biznessEventProcessConfigurationId) {
        //   const tempReportObj = {
        //     name: item.fixedTaskTemplateName,
        //     path: item.fixedTaskTemplateName.replace(/\s+/g, ''),
        //     icon: <FiShoppingBag />,
        //   };
        //   reportlinks.push(tempReportObj);
        // }

        if (item.biznessEventProcessConfigurationId === 0) {
          const tempTaskChainObj = {
            name: item.fixedTaskTemplateName,
            path: item.fixedTaskTemplateName.replace(/\s+/g, ''),
            icon: <FiShoppingBag />,
          };
          tasklinks.push(tempTaskChainObj);
        }

        if (item.biznessEventProcessConfigurationId === -1) {
          console.log('DEKH--------------->');
          console.log(item.controllerPath);

          const tempStaticMenuObj = {
            name: item.fixedTaskTemplateName,
            path: item.controllerPath ? item.controllerPath.split('#')[1] : '',
            icon: <FiShoppingBag />,
          };
          staticMenulinks.push(tempStaticMenuObj);
        }

        if (
          item.biznessEventProcessConfigurationId !== 0 &&
          item.biznessEventProcessConfigurationId !== -1
        ) {
          const tempReportObj = {
            name: item.fixedTaskTemplateName,
            path: item.fixedTaskTemplateName.replace(/\s+/g, ''),
            icon: <FiShoppingBag />,
          };
          reportlinks.push(tempReportObj);
        }
      });
      let taskChainsObject = {};
      let reportsObject = {};
      let staticMenuObject = {};

      // setTasklinks(tempTaskLinks);
      if (tasklinks.length) {
        taskChainsObject = {
          title: 'Task Chains',
          // links: [allLinksObj, ...tasklinks],
          links: [...tasklinks],
        };
      }
      if (reportlinks.length) {
        reportsObject = {
          title: 'Reports',
          // links: [allLinksObj, ...tasklinks],
          links: [...reportlinks],
        };
      }

      if (staticMenulinks.length) {
        staticMenuObject = {
          title: 'Static Menus',
          // links: [allLinksObj, ...tasklinks],
          links: [...staticMenulinks],
        };
      }

      const tempAllLinks: IAllLinks[] = [
        { ...taskChainsObject },
        { ...staticMenuObject },

        //  ------------From here hard coded menu starts--------------
        {
          title: 'Bizness Roots',
          links: [
            // {
            //   name: 'BizEvent Process Config',
            //   path: 'bizEventProcConfig',
            //   icon: <FiShoppingBag />,
            // },
            // {
            //   name: 'FreshenedUp Page',
            //   path: 'structuredPage',
            //   icon: <FiShoppingBag />,
            // },
            // {
            //   name: 'Laboratory',
            //   path: 'laboratory',
            //   icon: <FiShoppingBag />,
            // },
            {
              name: 'Cost Sheet Detail',
              path: 'costSheetDetail',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Cheque Book Management',
              path: 'chequeBookManagement',
              icon: <FiShoppingBag />,
            },
            {
              name: 'LC Voucher',
              path: 'transactionalLcVoucher',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Tender Voucher',
              path: 'transactionalTenderVoucher',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Tender Won',
              path: 'tenderWonStatic',
              icon: <FiShoppingBag />,
            },

            {
              name: 'Purchase Comparative',
              path: 'purchaseComparartiveSheetStatic',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Chain Configuration',
              path: 'chainConfiguration',
              icon: <FiShoppingBag />,
            },
            // {
            //   name: 'Chain Configuration Test',
            //   path: 'chainConfigurationTest',
            //   icon: <FiShoppingBag />,
            // },
            {
              name: 'Team and Target',
              path: 'teamAndTarget',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Buyer Sales Report',
              path: 'buyerSalesReport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Region And Target',
              path: 'regionTree',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Buyer And Target',
              path: 'regionBuyerTree',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Incentive Report',
              path: 'incentiveReport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Daily Sales Report',
              path: 'dailySalesReport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Commission Management',
              path: 'commissionManagement',
              icon: <FiShoppingBag />,
            },

            // {
            //   name: 'React Flow Exp',
            //   path: 'reactFlowExp',
            //   icon: <FiShoppingBag />,
            // },
            {
              name: 'Availiable Chain Status',
              path: 'reactFlowExp2',
              icon: <FiShoppingBag />,
            },

            {
              name: 'Tender Costing',
              path: 'tenderCosting',
              icon: <FiShoppingBag />,
            },

            {
              name: 'Current Stock View',
              path: 'currentStockPreview',
              icon: <FiShoppingBag />,
            },

            // {
            //   name: 'Dynamic Report',
            //   path: 'DynamicReport',
            //   icon: <FiShoppingBag />,
            // },
            // {
            //   name: 'Tender Requisition',
            //   path: 'tenderRequisition',
            //   icon: <FiShoppingBag />,
            // },
            // {
            //   name: 'Transaction Event Voucher',
            //   path: 'transactionalEventVoucher',
            //   icon: <FiShoppingBag />,
            // },
          ],
        },

        {
          title: 'Edit Pages',
          links: [
            {
              name: 'Sales Order Edit',
              path: 'salesOrderEdit',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Sales Return Edit',
              path: 'salesReturnEdit',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Local Purchase Edit',
              path: 'lPurchaseInEdit',
              icon: <FiShoppingBag />,
            },

            {
              name: 'Purchase Return Edit',
              path: 'purchaseReturnEdit',
              icon: <FiShoppingBag />,
            },

            // {
            //   name: 'Collection Manipulation',
            //   path: 'collectionEditGh',
            //   icon: <FiShoppingBag />,
            // },
            {
              name: 'Collection Edit',
              path: 'collectionEdit',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Payment Edit',
              path: 'paymentEdit',
              icon: <FiShoppingBag />,
            },

            {
              name: 'Import In Edit',
              path: 'importInEdit',
              icon: <FiShoppingBag />,
            },
          ],
        },

        {
          title: 'Data Migration',
          links: [
            {
              name: 'Sales Migrate',
              path: 'salesImport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Sales Return Migrate',
              path: 'salesReturnImport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Purchase Migrate',
              path: 'purchaseImport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Purchase Return Migrate',
              path: 'purchaseReturnImport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Collection Migrate',
              path: 'collectionImport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Payment Migrate',
              path: 'paymentImport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Voucher Migrate',
              path: 'voucherImport',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Import In Migrate',
              path: 'importLCImport',
              icon: <FiShoppingBag />,
            },
          ],
        },
        //  ------------Here hard coded menu ends--------------
        { ...reportsObject },
      ];

      setAllLinks(tempAllLinks);
    }
  }, [
    SAChainMenuLoading,
    SAChainMenuGetIsError,
    SAChainMenuIsFetching,
    SAChainMenuGetError,
    SAChainMenuData,
  ]);

  const activeMenu = useAppSelector((state) => state.activeMenu.active);
  const screenSize = useAppSelector((state) => state.screenSize.size);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize && screenSize <= 900) {
      dispatch(falsifyActiveMenu());
    }
  };

  const activeLink =
    'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';

  const normalLink =
    'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 transform-all duration-300 dark:text-gray-200 dark:hover:text-black  dark:hover:transform-all duration-300 hover:transform-all duration-300  hover:scale-105 hover:bg-light-gray m-2';

  const subactiveLink =
    'flex items-center gap-5 pl-9 pt-2 pb-2.5 rounded-lg text-white text-md m-2';

  const subnormalLink =
    'flex items-center gap-5 pl-9 pt-3 pb-2.5 rounded-lg text-md text-gray-700 transform-all duration-300 dark:text-gray-200 dark:hover:text-black dark:hover:transform-all duration-300 hover:transform-all duration-300  hover:scale-105 hover:bg-light-gray m-2';

  return (
    <div className="ml-3 scroller h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            {/* Company name & logo */}
            <Link
              to="/"
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
              onClick={handleCloseSidebar}
            >
              <div className=" hover:animate-pulse flex items-center gap-5">
                <BiAnalyse /> <span>Bizness Roots 24</span>
              </div>
            </Link>

            {/* Close button Dashboard */}
            <Tooltip title="Menu" placement="top-start" arrow>
              <button
                type="button"
                aria-label="Menu"
                onClick={() =>
                  // setActiveMenu((prevActiveMenu) => !prevActiveMenu)
                  dispatch(toggleActiveMenu())
                }
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </Tooltip>
          </div>

          {/* menus of Dashboard */}
          {SAChainMenuData && !SAChainMenuIsFetching && !SAChainMenuLoading ? (
            <div className="mt-10">
              {allLinks.map((item) => (
                <div key={item.title}>
                  <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                    {item.title}
                  </p>

                  {item?.links?.map((link) => (
                    <div key={link.name}>
                      {!link.sublinks && (
                        <NavLink
                          to={`/${link.path}`}
                          onClick={handleCloseSidebar}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : '',
                          })}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          {link.icon}
                          <span className="capitalize">{link.name}</span>
                        </NavLink>
                      )}

                      {link.sublinks && (
                        <>
                          <div className="accordion" id="menuAccordion">
                            <div className="accordion-item">
                              <button
                                className="accordion-button menu-accordion-button collapsed relative flex items-center w-[94%] gap-5 px-4 pt-3 pb-2.5 rounded-lg  text-md  transform-all duration-300 hover:scale-105 dark:text-gray-200 dark:hover:text-black   hover:bg-light-gray m-2 text-base text-gray-700 text-left"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${link.name}`}
                                aria-expanded="false"
                                aria-controls={link.name}
                              >
                                {link.icon}
                                <span className="capitalize">{link.name}</span>
                              </button>

                              <div
                                id={link.name}
                                className="accordion-collapse collapse"
                                aria-labelledby={link.name}
                                data-bs-parent="#menuAccordion"
                              >
                                <div className="accordion-body ">
                                  {link.sublinks &&
                                    link.sublinks.map((sublink) => (
                                      <NavLink
                                        to={`/${sublink.path}`}
                                        key={sublink.name}
                                        onClick={handleCloseSidebar}
                                        style={({ isActive }) => ({
                                          backgroundColor: isActive
                                            ? currentColor
                                            : '',
                                        })}
                                        className={({ isActive }) =>
                                          isActive
                                            ? subactiveLink
                                            : subnormalLink
                                        }
                                      >
                                        {sublink.icon}
                                        <span className="capitalize">
                                          {sublink.name}
                                        </span>
                                      </NavLink>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* <NavLink
                                              to={`/${link.name}`}
                                              key={link.name}
                                              onClick={handleCloseSidebar}
                                              style={({ isActive }) => ({
                                                  backgroundColor: isActive ? currentColor : ''
                                              })}
                                              className={({ isActive }) => isActive ? activeLink : normalLink}
                                          >
                                              {link.icon}
                                              <span className='capitalize'>
                                                  {link.name}
                                              </span>
                                          </NavLink>

                                          {link.sublinks && link.sublinks.map((sublink) => (
                                              <NavLink
                                                  to={`/${sublink.name}`}
                                                  key={sublink.name}
                                                  onClick={handleCloseSidebar}
                                                  style={({ isActive }) => ({
                                                      backgroundColor: isActive ? currentColor : ''
                                                  })}
                                                  className={({ isActive }) => isActive ? subactiveLink : subnormalLink}
                                              >
                                                  {sublink.icon}
                                                  <span className='capitalize'>
                                                      {sublink.name}
                                                  </span>
                                              </NavLink>
                                          ))} */}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                LOADING...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
