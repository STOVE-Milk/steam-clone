export interface IGetGiftCardListReqType {}

export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface IDoChargeReqType {
  method: string;
  giftcard: {
    id: number;
    name?: string;
    price: number;
  };
}
