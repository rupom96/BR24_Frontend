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
import { Br24MenuSkeleton } from './Br24Loader';
import SidebarBrandParticles from './SidebarBrandParticles';
import ActiveMenuShine from './ActiveMenuShine';
import { getMenuIcon } from '../Utils/menuIcons';
import { onAccentColor } from '../Utils/colorUtils';

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
              name: 'Tender Requisition',
              path: 'tenderRequisition',
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
              name: 'Tender Expense For SP',
              path: 'tenderExpenseForSalesPerson',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Tender Approval TopSheet Rpt',
              path: 'tenderApprovalTopSheetRpt',
              icon: <FiShoppingBag />,
            },
            {
              name: 'Current Stock View',
              path: 'currentStockPreview',
              icon: <FiShoppingBag />,
            },
           
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
  const sidebarMode = useAppSelector((state) => state.activeMenu.mode);
  const screenSize = useAppSelector((state) => state.screenSize.size);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const dispatch = useAppDispatch();

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize && screenSize <= 900) {
      dispatch(falsifyActiveMenu());
    }
    // Rail expand was hover-only; blur so click-focus can't pin it open
    if (sidebarMode === 'rail') {
      const el = document.activeElement;
      if (el instanceof HTMLElement) el.blur();
    }
  };

  const activeLink =
    'br24-nav-link br24-nav-link--active flex items-center gap-3 pl-3 pr-3 pt-2 pb-2 rounded-xl text-sm m-1.5 shadow-md';

  const normalLink =
    'br24-nav-link flex items-center gap-3 pl-3 pr-3 pt-2 pb-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 m-1.5';

  const subactiveLink =
    'br24-nav-link br24-nav-link--active flex items-center gap-3 pl-8 pr-3 pt-2 pb-2 rounded-xl text-sm m-1.5 shadow-md';

  const subnormalLink =
    'br24-nav-link flex items-center gap-3 pl-8 pr-3 pt-2 pb-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 m-1.5';

  return (
    <>
      <div className="br24-sidebar-brand br24-anim-fade-up flex items-center justify-between overflow-hidden px-1">
        <SidebarBrandParticles
          accent={currentColor}
          isDark={currentMode === 'Dark'}
        />
        <Link
          to="/"
          className="br24-sidebar-brand-link relative z-[1] ml-1.5 mt-3 flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          onClick={handleCloseSidebar}
        >
          <div className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]">
            <span
              className="br24-sidebar-brand-mark flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-lg"
              style={{
                backgroundColor: currentColor,
                color: onAccentColor(currentColor),
              }}
            >
              <BiAnalyse className="text-sm" />
            </span>
            <span className="br24-sidebar-brand-text text-sm tracking-tight">
              Bizness Roots 24
            </span>
          </div>
        </Link>

        <Tooltip title="Menu" placement="top-start" arrow>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => dispatch(toggleActiveMenu())}
            className="relative z-[1] mt-3 block rounded-lg p-2 text-lg transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            <MdOutlineCancel />
          </button>
        </Tooltip>
      </div>

      <div className="br24-shell-sidebar scroller overflow-y-auto overflow-x-hidden pb-10">
        {SAChainMenuData && !SAChainMenuIsFetching && !SAChainMenuLoading ? (
          <div className="br24-anim-fade-up-delay mt-4">
            {allLinks.map((item) => {
              if (!item?.title || !item?.links?.length) return null;
              return (
                <div key={item.title}>
                  <p className="br24-sidebar-section-title m-2 mt-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {item.title}
                  </p>

                  {item.links.map((link) => (
                    <div key={link.name}>
                      {!link.sublinks && (
                        <NavLink
                          to={`/${link.path}`}
                          onClick={handleCloseSidebar}
                          title={link.name}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : '',
                          })}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive ? <ActiveMenuShine /> : null}
                              <span className="br24-menu-icon" aria-hidden>
                                {getMenuIcon(link.name, link.path)}
                              </span>
                              <span className="br24-menu-label capitalize">
                                {link.name}
                              </span>
                            </>
                          )}
                        </NavLink>
                      )}

                      {link.sublinks && (
                        <>
                          <div className="accordion" id="menuAccordion">
                            <div className="accordion-item">
                              <button
                                className="menu-accordion-button accordion-button collapsed relative m-2 flex w-[94%] items-center gap-3 rounded-xl px-3 pb-2 pt-2 text-left text-sm text-slate-700 transition-all duration-300 dark:text-gray-200"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${link.name}`}
                                aria-expanded="false"
                                aria-controls={link.name}
                                title={link.name}
                              >
                                <span className="br24-menu-icon" aria-hidden>
                                  {getMenuIcon(link.name, link.path)}
                                </span>
                                <span className="br24-menu-label capitalize">
                                  {link.name}
                                </span>
                              </button>

                              <div
                                id={link.name}
                                className="accordion-collapse collapse"
                                aria-labelledby={link.name}
                                data-bs-parent="#menuAccordion"
                              >
                                <div className="accordion-body ">
                                  {link.sublinks.map((sublink) => (
                                    <NavLink
                                      to={`/${sublink.path}`}
                                      key={sublink.name}
                                      onClick={handleCloseSidebar}
                                      title={sublink.name}
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
                                      {({ isActive }) => (
                                        <>
                                          {isActive ? <ActiveMenuShine /> : null}
                                          <span
                                            className="br24-menu-icon"
                                            aria-hidden
                                          >
                                            {getMenuIcon(
                                              sublink.name,
                                              sublink.path
                                            )}
                                          </span>
                                          <span className="br24-menu-label capitalize">
                                            {sublink.name}
                                          </span>
                                        </>
                                      )}
                                    </NavLink>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <Br24MenuSkeleton />
        )}
      </div>
    </>
  );
};

export default Sidebar;
