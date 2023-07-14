// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';

interface Exchange {
    spotV1PublicGetCommonSymbols (params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetMarketTrades (params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetMarketDepth (params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetTradeQuery (params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetTradeOpenOrders (params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetTradeHistoryOrders (params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetAccountBalance (params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeOrder (params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeCancel (params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetGetAssetTransfer (params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetAssetTransfer (params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetCapitalDepositHisrec (params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetCapitalWithdrawHistory (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetServerTime (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteContracts (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuotePrice (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteDepth (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteTrades (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuotePremiumIndex (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteFundingRate (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteKlines (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteOpenInterest (params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteTicker (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserBalance (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserPositions (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserIncome (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeOpenOrders (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeOrder (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeMarginType (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeLeverage (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeForceOrders (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeAllOrders (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeAllFillOrders (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserIncomeExport (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserCommissionRate (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetQuoteBookTicker (params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeOrder (params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeBatchOrders (params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeCloseAllPositions (params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeMarginType (params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeLeverage (params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradePositionMargin (params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeOrderTest (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateDeleteTradeOrder (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateDeleteTradeBatchOrders (params?: {}): Promise<implicitReturnType>;
    swapV2PrivateDeleteTradeAllOpenOrders (params?: {}): Promise<implicitReturnType>;
    contractV1PrivateGetAllPosition (params?: {}): Promise<implicitReturnType>;
    contractV1PrivateGetAllOrders (params?: {}): Promise<implicitReturnType>;
    contractV1PrivateGetBalance (params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalConfigGetall (params?: {}): Promise<implicitReturnType>;
    walletsV1PrivatePostCapitalWithdrawApply (params?: {}): Promise<implicitReturnType>;
}
abstract class Exchange extends _Exchange {}

export default Exchange
