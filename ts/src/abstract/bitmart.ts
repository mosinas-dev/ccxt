// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';

interface Exchange {
    publicGetSystemTime (params?: {}): Promise<implicitReturnType>;
    publicGetSystemService (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1Currencies (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1Symbols (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1SymbolsDetails (params?: {}): Promise<implicitReturnType>;
    publicGetSpotQuotationV3Tickers (params?: {}): Promise<implicitReturnType>;
    publicGetSpotQuotationV3Ticker (params?: {}): Promise<implicitReturnType>;
    publicGetSpotQuotationV3LiteKlines (params?: {}): Promise<implicitReturnType>;
    publicGetSpotQuotationV3Klines (params?: {}): Promise<implicitReturnType>;
    publicGetSpotQuotationV3Books (params?: {}): Promise<implicitReturnType>;
    publicGetSpotQuotationV3Trades (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1Ticker (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV2Ticker (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1TickerDetail (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1Steps (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1SymbolsKline (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1SymbolsBook (params?: {}): Promise<implicitReturnType>;
    publicGetSpotV1SymbolsTrades (params?: {}): Promise<implicitReturnType>;
    publicGetContractV1Tickers (params?: {}): Promise<implicitReturnType>;
    publicGetContractPublicDetails (params?: {}): Promise<implicitReturnType>;
    publicGetContractPublicDepth (params?: {}): Promise<implicitReturnType>;
    publicGetContractPublicOpenInterest (params?: {}): Promise<implicitReturnType>;
    publicGetContractPublicFundingRate (params?: {}): Promise<implicitReturnType>;
    publicGetContractPublicKline (params?: {}): Promise<implicitReturnType>;
    publicGetAccountV1Currencies (params?: {}): Promise<implicitReturnType>;
    privateGetAccountSubAccountV1TransferList (params?: {}): Promise<implicitReturnType>;
    privateGetAccountSubAccountV1TransferHistory (params?: {}): Promise<implicitReturnType>;
    privateGetAccountSubAccountMainV1Wallet (params?: {}): Promise<implicitReturnType>;
    privateGetAccountSubAccountMainV1SubaccountList (params?: {}): Promise<implicitReturnType>;
    privateGetAccountContractSubAccountMainV1Wallet (params?: {}): Promise<implicitReturnType>;
    privateGetAccountContractSubAccountMainV1TransferList (params?: {}): Promise<implicitReturnType>;
    privateGetAccountContractSubAccountV1TransferHistory (params?: {}): Promise<implicitReturnType>;
    privateGetAccountV1Wallet (params?: {}): Promise<implicitReturnType>;
    privateGetAccountV1Currencies (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1Wallet (params?: {}): Promise<implicitReturnType>;
    privateGetAccountV1DepositAddress (params?: {}): Promise<implicitReturnType>;
    privateGetAccountV1WithdrawCharge (params?: {}): Promise<implicitReturnType>;
    privateGetAccountV2DepositWithdrawHistory (params?: {}): Promise<implicitReturnType>;
    privateGetAccountV1DepositWithdrawDetail (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1OrderDetail (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV2Orders (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1Trades (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV2Trades (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV3Orders (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV2OrderDetail (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1MarginIsolatedBorrowRecord (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1MarginIsolatedRepayRecord (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1MarginIsolatedPairs (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1MarginIsolatedAccount (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1TradeFee (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1UserFee (params?: {}): Promise<implicitReturnType>;
    privateGetSpotV1BrokerRebate (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivateAssetsDetail (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivateOrder (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivateOrderHistory (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivatePosition (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivateGetOpenOrders (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivateCurrentPlanOrder (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivateTrades (params?: {}): Promise<implicitReturnType>;
    privateGetContractPrivatePositionRisk (params?: {}): Promise<implicitReturnType>;
    privatePostAccountSubAccountMainV1SubToMain (params?: {}): Promise<implicitReturnType>;
    privatePostAccountSubAccountSubV1SubToMain (params?: {}): Promise<implicitReturnType>;
    privatePostAccountSubAccountMainV1MainToSub (params?: {}): Promise<implicitReturnType>;
    privatePostAccountSubAccountSubV1SubToSub (params?: {}): Promise<implicitReturnType>;
    privatePostAccountSubAccountMainV1SubToSub (params?: {}): Promise<implicitReturnType>;
    privatePostAccountContractSubAccountMainV1SubToMain (params?: {}): Promise<implicitReturnType>;
    privatePostAccountContractSubAccountMainV1MainToSub (params?: {}): Promise<implicitReturnType>;
    privatePostAccountContractSubAccountSubV1SubToMain (params?: {}): Promise<implicitReturnType>;
    privatePostAccountV1WithdrawApply (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV1SubmitOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV1BatchOrders (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV2CancelOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV1CancelOrders (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4QueryOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4QueryClientOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4QueryOpenOrders (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4QueryHistoryOrders (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4QueryTrades (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4QueryOrderTrades (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4CancelOrders (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV4BatchOrders (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV3CancelOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV2BatchOrders (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV2SubmitOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV1MarginSubmitOrder (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV1MarginIsolatedBorrow (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV1MarginIsolatedRepay (params?: {}): Promise<implicitReturnType>;
    privatePostSpotV1MarginIsolatedTransfer (params?: {}): Promise<implicitReturnType>;
    privatePostAccountV1TransferContractList (params?: {}): Promise<implicitReturnType>;
    privatePostAccountV1TransferContract (params?: {}): Promise<implicitReturnType>;
    privatePostContractPrivateSubmitOrder (params?: {}): Promise<implicitReturnType>;
    privatePostContractPrivateCancelOrder (params?: {}): Promise<implicitReturnType>;
    privatePostContractPrivateCancelOrders (params?: {}): Promise<implicitReturnType>;
    privatePostContractPrivateSubmitPlanOrder (params?: {}): Promise<implicitReturnType>;
    privatePostContractPrivateCancelPlanOrder (params?: {}): Promise<implicitReturnType>;
    privatePostContractPrivateSubmitLeverage (params?: {}): Promise<implicitReturnType>;
}
abstract class Exchange extends _Exchange {}

export default Exchange
