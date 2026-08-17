import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import dayjs from 'dayjs';
import {
  IBuyerOption,
  IGetSalesOrderDetailTrackingDto,
  IProductInfoDto,
  IProductOption,
} from '../../domain/interfaces/SalesOrderTrackingInterface';
import { ISalesOrderTrackingProcessCommandsVM } from '../../domain/interfaces/SalesOrderInterface';

const API_BASE_URL = window.API_BASE_URL;

// ---- Sales Order Summary/List ----
export interface IGetSalesOrderTrackingDto {
  salesOrderId: string;
  salesOrderNo: string;
  salesOrderDate: string;
  orderQuantity: number;
  totalAmount: number;
  salesOrderDeliveryId: string | null;
  deliveryType: string | null;
}

export interface IGetSalesOrderTrackingQueryArg {
  fromDate: Date | string;
  toDate: Date | string;
  buyerId: number;
  status: 'P' | 'D';
}

// ---- Product combo api raw response ----
export interface IProductComboOption {
  productId: number;
  productName: string;
  unitTypeId: number;
}

export interface IGetProductByCompanyProductGroupIdArg {
  companyId?: number | null;
  productGroupId?: number | null;
  brandId?: number | null;
}

// ---- Save api raw response ----
export interface ISaveSalesOrderApiResponse {
  SalesOrderId: string;
  SalesOrderNo: string;
}

// ---- Save api mapped response for frontend ----
export interface ISaveSalesOrderResponse {
  salesOrderId: string;
  salesOrderNo: string;
}

// ---- Dummy data kept only for buyer option list ----
const dummyBuyers: IBuyerOption[] = [
  {
    buyerId: 101,
    name: 'Hridoy',
    address: 'Mirpur, Dhaka',
    phone: '01738639557',
  },
  {
    buyerId: 102,
    name: 'Rahim',
    address: 'Uttara, Dhaka',
    phone: '01800000000',
  },
  {
    buyerId: 103,
    name: 'Karim',
    address: 'Dhanmondi, Dhaka',
    phone: '01900000000',
  },
];

const buildProductByCompanyProductGroupIdUrl = ({
  companyId,
  productGroupId,
  brandId,
}: IGetProductByCompanyProductGroupIdArg) => {
  const params = new URLSearchParams();

  if (companyId != null && Number(companyId) !== 0) {
    params.append('companyId', String(companyId));
  }

  if (productGroupId != null && Number(productGroupId) !== 0) {
    params.append('groupId', String(productGroupId));
  }

  if (brandId != null && Number(brandId) !== 0) {
    params.append('brandId', String(brandId));
  }

  const queryString = params.toString();

  return queryString
    ? `Product/getProductByCompanyProductGroupId?${queryString}`
    : `Product/getProductByCompanyProductGroupId`;
};

export const salesOrderTrackingApi = createApi({
  reducerPath: 'salesOrderTrackingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/`,
  }),
  tagTypes: ['SalesOrderTracking'],
  endpoints: (builder) => ({
    getBuyerOptions: builder.query<
      IBuyerOption[],
      { companyId?: number | null } | void
    >({
      queryFn: async () => ({ data: dummyBuyers }),
    }),

    // ---- Real product combo api, raw response shape ----
    getProductByCompanyProductGroupId: builder.query<
      IProductComboOption[],
      IGetProductByCompanyProductGroupIdArg
    >({
      query: (arg) => ({
        url: buildProductByCompanyProductGroupIdUrl(arg),
        method: 'GET',
      }),
    }),

    // ---- Real product api mapped to your IProductOption shape ----
    getProductOptions: builder.query<
      IProductOption[],
      IGetProductByCompanyProductGroupIdArg
    >({
      query: (arg) => ({
        url: buildProductByCompanyProductGroupIdUrl(arg),
        method: 'GET',
      }),
      transformResponse: (response: IProductComboOption[]): IProductOption[] =>
        (response ?? []).map((item) => ({
          productId: Number(item.productId),
          name: item.productName ?? '',
          unitTypeId: Number(item.unitTypeId) || 0,
          productSpecification: null,
        })),
    }),

    getSalesOrderTracking: builder.query<
      IGetSalesOrderTrackingDto[],
      IGetSalesOrderTrackingQueryArg
    >({
      query: ({ fromDate, toDate, buyerId, status }) => ({
        url: `SalesOrder/getSalesOrderTracking`,
        method: 'GET',
        params: {
          FromDate: dayjs(fromDate)
            .startOf('day')
            .format('YYYY-MM-DDTHH:mm:ss'),
          ToDate: dayjs(toDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
          BuyerId: buyerId,
          Status: status,
        },
      }),
      providesTags: ['SalesOrderTracking'],
    }),

    getSalesOrderDetailTracking: builder.query<
      IGetSalesOrderDetailTrackingDto,
      { salesOrderId: string }
    >({
      query: ({ salesOrderId }) => ({
        url: `SalesOrder/getSalesOrderDetailTracking`,
        method: 'GET',
        params: {
          SalesOrderId: salesOrderId,
        },
      }),
      providesTags: (_res, _err, arg) => [
        { type: 'SalesOrderTracking', id: arg.salesOrderId },
      ],
    }),

    getProductInfo: builder.query<IProductInfoDto, { productId: number }>({
      query: ({ productId }) => ({
        url: `Product/getProductInfo`,
        method: 'GET',
        params: {
          productId,
        },
      }),
    }),

    // ---- Real save api ----
    saveSalesOrder: builder.mutation<
      ISaveSalesOrderResponse,
      ISalesOrderTrackingProcessCommandsVM
    >({
      query: (payload) => ({
        url: `1CD8AF55-D386-464F-B7B0-35C5D0A462FD/7873B9B8-C1BB-4764-9285-22E012C6A1FC`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (
        response: ISaveSalesOrderApiResponse
      ): ISaveSalesOrderResponse => ({
        salesOrderId: response?.SalesOrderId ?? '',
        salesOrderNo: response?.SalesOrderNo ?? '',
      }),
      invalidatesTags: (result) =>
        result?.salesOrderId
          ? [
              'SalesOrderTracking',
              { type: 'SalesOrderTracking', id: result.salesOrderId },
            ]
          : ['SalesOrderTracking'],
    }),
  }),
});

export const {
  useGetSalesOrderTrackingQuery,
  useLazyGetSalesOrderTrackingQuery,

  useGetBuyerOptionsQuery,
  useLazyGetBuyerOptionsQuery,

  useGetProductByCompanyProductGroupIdQuery,
  useLazyGetProductByCompanyProductGroupIdQuery,

  useGetProductOptionsQuery,
  useLazyGetProductOptionsQuery,

  useGetSalesOrderDetailTrackingQuery,
  useLazyGetSalesOrderDetailTrackingQuery,

  useGetProductInfoQuery,
  useLazyGetProductInfoQuery,

  useSaveSalesOrderMutation,
} = salesOrderTrackingApi;
