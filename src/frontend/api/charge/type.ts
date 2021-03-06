export interface IGetGiftCardListReqType {}

export interface IDoChargeReqType {
  method: string;
  giftcard: {
    id: number;
    name?: string;
    price: number;
  };
}

export interface IDoApprovalChargeReqType {
  method: string;
  tid: string | null;
  pg_token: string | null; // Localstorage에서 pg_token을 가져오는 과정에서 SSR쪽 이슈로 null처리
}
