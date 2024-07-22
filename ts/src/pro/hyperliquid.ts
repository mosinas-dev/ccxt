//  ---------------------------------------------------------------------------

import hyperliquidRest from '../hyperliquid.js';
import { ExchangeError } from '../base/errors.js';
import Client from '../base/ws/Client.js';
import { Int, Str, Market, OrderBook, Trade, OHLCV, Order, Dict, Strings, Ticker, Tickers } from '../base/types.js';
import { ArrayCache, ArrayCacheByTimestamp, ArrayCacheBySymbolById } from '../base/ws/Cache.js';

//  ---------------------------------------------------------------------------

export default class hyperliquid extends hyperliquidRest {
    describe () {
        return this.deepExtend (super.describe (), {
            'has': {
                'ws': true,
                'watchBalance': false,
                'watchMyTrades': true,
                'watchOHLCV': true,
                'watchOrderBook': true,
                'watchOrders': true,
                'watchTicker': false,
                'watchTickers': true,
                'watchTrades': true,
                'watchPosition': false,
            },
            'urls': {
                'api': {
                    'ws': {
                        'public': 'wss://api.hyperliquid.xyz/ws',
                    },
                },
                'test': {
                    'ws': {
                        'public': 'wss://api.hyperliquid-testnet.xyz/ws',
                    },
                },
            },
            'options': {
            },
            'streaming': {
                'ping': this.ping,
                'keepAlive': 20000,
            },
            'exceptions': {
                'ws': {
                    'exact': {
                    },
                },
            },
        });
    }

    async watchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        /**
         * @method
         * @name hyperliquid#watchOrderBook
         * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the maximum amount of order book entries to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        symbol = market['symbol'];
        const messageHash = 'orderbook:' + symbol;
        const url = this.urls['api']['ws']['public'];
        const request: Dict = {
            'method': 'subscribe',
            'subscription': {
                'type': 'l2Book',
                'coin': market['swap'] ? market['base'] : market['id'],
            },
        };
        const message = this.extend (request, params);
        const orderbook = await this.watch (url, messageHash, message, messageHash);
        return orderbook.limit ();
    }

    handleOrderBook (client, message) {
        //
        //     {
        //         "channel": "l2Book",
        //         "data": {
        //             "coin": "BTC",
        //             "time": 1710131872708,
        //             "levels": [
        //                 [
        //                     {
        //                         "px": "68674.0",
        //                         "sz": "0.97139",
        //                         "n": 4
        //                     }
        //                 ],
        //                 [
        //                     {
        //                         "px": "68675.0",
        //                         "sz": "0.04396",
        //                         "n": 1
        //                     }
        //                 ]
        //             ]
        //         }
        //     }
        //
        const entry = this.safeDict (message, 'data', {});
        const coin = this.safeString (entry, 'coin');
        const marketId = this.coinToMarketId (coin);
        const market = this.market (marketId);
        const symbol = market['symbol'];
        const rawData = this.safeList (entry, 'levels', []);
        const data: Dict = {
            'bids': this.safeList (rawData, 0, []),
            'asks': this.safeList (rawData, 1, []),
        };
        const timestamp = this.safeInteger (entry, 'time');
        const snapshot = this.parseOrderBook (data, symbol, timestamp, 'bids', 'asks', 'px', 'sz');
        if (!(symbol in this.orderbooks)) {
            const ob = this.orderBook (snapshot);
            this.orderbooks[symbol] = ob;
        }
        const orderbook = this.orderbooks[symbol];
        orderbook.reset (snapshot);
        const messageHash = 'orderbook:' + symbol;
        client.resolve (orderbook, messageHash);
    }

    async watchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name hyperliquid#watchTickers
         * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for all markets of a specific list
         * @param {string[]} symbols unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols, undefined, true);
        const messageHash = 'tickers';
        const url = this.urls['api']['ws']['public'];
        const request: Dict = {
            'method': 'subscribe',
            'subscription': {
                'type': 'webData2', // allMids
                'user': '0x0000000000000000000000000000000000000000',
            },
        };
        const tickers = await this.watch (url, messageHash, this.extend (request, params), messageHash);
        if (this.newUpdates) {
            return this.filterByArrayTickers (tickers, 'symbol', symbols);
        }
        return this.tickers;
    }

    async watchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        /**
         * @method
         * @name hyperliquid#watchMyTrades
         * @description watches information on multiple trades made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.user] user address, will default to this.walletAddress if not provided
         * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        let userAddress = undefined;
        [ userAddress, params ] = this.handlePublicAddress ('watchMyTrades', params);
        await this.loadMarkets ();
        let messageHash = 'myTrades';
        if (symbol !== undefined) {
            symbol = this.symbol (symbol);
            messageHash += ':' + symbol;
        }
        const url = this.urls['api']['ws']['public'];
        const request: Dict = {
            'method': 'subscribe',
            'subscription': {
                'type': 'userFills',
                'user': userAddress,
            },
        };
        const message = this.extend (request, params);
        const trades = await this.watch (url, messageHash, message, messageHash);
        if (this.newUpdates) {
            limit = trades.getLimit (symbol, limit);
        }
        return this.filterBySymbolSinceLimit (trades, symbol, since, limit, true);
    }

    handleWsTickers (client: Client, message) {
        //
        //     {
        //         "channel": "webData2",
        //         "data": {
        //             "meta": {
        //                 "universe": [
        //                     {
        //                         "szDecimals": 5,
        //                         "name": "BTC",
        //                         "maxLeverage": 50,
        //                         "onlyIsolated": false
        //                     },
        //                     ...
        //                 ],
        //             },
        //             "assetCtxs": [
        //                 {
        //                     "funding": "0.00003005",
        //                     "openInterest": "2311.50778",
        //                     "prevDayPx": "63475.0",
        //                     "dayNtlVlm": "468043329.64289033",
        //                     "premium": "0.00094264",
        //                     "oraclePx": "64712.0",
        //                     "markPx": "64774.0",
        //                     "midPx": "64773.5",
        //                     "impactPxs": [
        //                         "64773.0",
        //                         "64774.0"
        //                     ]
        //                 },
        //                 ...
        //             ],
        //             "spotAssetCtxs": [
        //                 {
        //                     "prevDayPx": "0.20937",
        //                     "dayNtlVlm": "11188888.61984999",
        //                     "markPx": "0.19722",
        //                     "midPx": "0.197145",
        //                     "circulatingSupply": "598760557.12072003",
        //                     "coin": "PURR/USDC"
        //                 },
        //                 ...
        //             ],
        //         }
        //     }
        //
        // spot
        const rawData = this.safeDict (message, 'data', {});
        const spotAssets = this.safeList (rawData, 'spotAssetCtxs', []);
        const parsedTickers = [];
        for (let i = 0; i < spotAssets.length; i++) {
            const assetObject = spotAssets[i];
            const marketId = this.safeString (assetObject, 'coin');
            const market = this.safeMarket (marketId, undefined, undefined, 'spot');
            const ticker = this.parseWsTicker (assetObject, market);
            parsedTickers.push (ticker);
        }
        // perpetuals
        const meta = this.safeDict (rawData, 'meta', {});
        const universe = this.safeList (meta, 'universe', []);
        const assetCtxs = this.safeList (rawData, 'assetCtxs', []);
        for (let i = 0; i < universe.length; i++) {
            const data = this.extend (
                this.safeDict (universe, i, {}),
                this.safeDict (assetCtxs, i, {})
            );
            const id = data['name'] + '/USDC:USDC';
            const market = this.safeMarket (id, undefined, undefined, 'swap');
            const ticker = this.parseWsTicker (data, market);
            parsedTickers.push (ticker);
        }
        const tickers = this.indexBy (parsedTickers, 'symbol');
        client.resolve (tickers, 'tickers');
    }

    parseWsTicker (rawTicker, market: Market = undefined): Ticker {
        return this.parseTicker (rawTicker, market);
    }

    handleMyTrades (client: Client, message) {
        //
        //     {
        //         "channel": "userFills",
        //         "data": {
        //             "isSnapshot": true,
        //             "user": "0x15f43d1f2dee81424afd891943262aa90f22cc2a",
        //             "fills": [
        //                 {
        //                     "coin": "BTC",
        //                     "px": "72528.0",
        //                     "sz": "0.11693",
        //                     "side": "A",
        //                     "time": 1710208712815,
        //                     "startPosition": "0.11693",
        //                     "dir": "Close Long",
        //                     "closedPnl": "-0.81851",
        //                     "hash": "0xc5adaf35f8402750c218040b0a7bc301130051521273b6f398b3caad3e1f3f5f",
        //                     "oid": 7484888874,
        //                     "crossed": true,
        //                     "fee": "2.968244",
        //                     "liquidationMarkPx": null,
        //                     "tid": 567547935839686,
        //                     "cloid": null
        //                 }
        //             ]
        //         }
        //     }
        //
        const entry = this.safeDict (message, 'data', {});
        if (this.myTrades === undefined) {
            const limit = this.safeInteger (this.options, 'tradesLimit', 1000);
            this.myTrades = new ArrayCacheBySymbolById (limit);
        }
        const trades = this.myTrades;
        const symbols: Dict = {};
        const data = this.safeList (entry, 'fills', []);
        const dataLength = data.length;
        if (dataLength === 0) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            const rawTrade = data[i];
            const parsed = this.parseWsTrade (rawTrade);
            const symbol = parsed['symbol'];
            symbols[symbol] = true;
            trades.append (parsed);
        }
        const keys = Object.keys (symbols);
        for (let i = 0; i < keys.length; i++) {
            const currentMessageHash = 'myTrades:' + keys[i];
            client.resolve (trades, currentMessageHash);
        }
        // non-symbol specific
        const messageHash = 'myTrades';
        client.resolve (trades, messageHash);
    }

    async watchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        /**
         * @method
         * @name hyperliquid#watchTrades
         * @description watches information on multiple trades made in a market
         * @param {string} symbol unified market symbol of the market trades were made in
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trade structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        symbol = market['symbol'];
        const messageHash = 'trade:' + symbol;
        const url = this.urls['api']['ws']['public'];
        const request: Dict = {
            'method': 'subscribe',
            'subscription': {
                'type': 'trades',
                'coin': market['swap'] ? market['base'] : market['id'],
            },
        };
        const message = this.extend (request, params);
        const trades = await this.watch (url, messageHash, message, messageHash);
        if (this.newUpdates) {
            limit = trades.getLimit (symbol, limit);
        }
        return this.filterBySinceLimit (trades, since, limit, 'timestamp', true);
    }

    handleTrades (client: Client, message) {
        //
        //     {
        //         "channel": "trades",
        //         "data": [
        //             {
        //                 "coin": "BTC",
        //                 "side": "A",
        //                 "px": "68517.0",
        //                 "sz": "0.005",
        //                 "time": 1710125266669,
        //                 "hash": "0xc872699f116e012186620407fc08a802015e0097c5cce74710697f7272e6e959",
        //                 "tid": 981894269203506
        //             }
        //         ]
        //     }
        //
        const entry = this.safeList (message, 'data', []);
        const first = this.safeDict (entry, 0, {});
        const coin = this.safeString (first, 'coin');
        const marketId = this.coinToMarketId (coin);
        const market = this.market (marketId);
        const symbol = market['symbol'];
        if (!(symbol in this.trades)) {
            const limit = this.safeInteger (this.options, 'tradesLimit', 1000);
            const stored = new ArrayCache (limit);
            this.trades[symbol] = stored;
        }
        const trades = this.trades[symbol];
        for (let i = 0; i < entry.length; i++) {
            const data = this.safeDict (entry, i);
            const trade = this.parseWsTrade (data);
            trades.append (trade);
        }
        const messageHash = 'trade:' + symbol;
        client.resolve (trades, messageHash);
    }

    parseWsTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // fetchMyTrades
        //
        //     {
        //         "coin": "BTC",
        //         "px": "72528.0",
        //         "sz": "0.11693",
        //         "side": "A",
        //         "time": 1710208712815,
        //         "startPosition": "0.11693",
        //         "dir": "Close Long",
        //         "closedPnl": "-0.81851",
        //         "hash": "0xc5adaf35f8402750c218040b0a7bc301130051521273b6f398b3caad3e1f3f5f",
        //         "oid": 7484888874,
        //         "crossed": true,
        //         "fee": "2.968244",
        //         "liquidationMarkPx": null,
        //         "tid": 567547935839686,
        //         "cloid": null
        //     }
        //
        // fetchTrades
        //
        //     {
        //         "coin": "BTC",
        //         "side": "A",
        //         "px": "68517.0",
        //         "sz": "0.005",
        //         "time": 1710125266669,
        //         "hash": "0xc872699f116e012186620407fc08a802015e0097c5cce74710697f7272e6e959",
        //         "tid": 981894269203506
        //     }
        //
        const timestamp = this.safeInteger (trade, 'time');
        const price = this.safeString (trade, 'px');
        const amount = this.safeString (trade, 'sz');
        const coin = this.safeString (trade, 'coin');
        const marketId = this.coinToMarketId (coin);
        market = this.safeMarket (marketId, undefined);
        const symbol = market['symbol'];
        const id = this.safeString (trade, 'tid');
        let side = this.safeString (trade, 'side');
        if (side !== undefined) {
            side = (side === 'A') ? 'sell' : 'buy';
        }
        const fee = this.safeString (trade, 'fee');
        return this.safeTrade ({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'id': id,
            'order': undefined,
            'type': undefined,
            'side': side,
            'takerOrMaker': undefined,
            'price': price,
            'amount': amount,
            'cost': undefined,
            'fee': { 'cost': fee, 'currency': 'USDC' },
        }, market);
    }

    async watchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name hyperliquid#watchOHLCV
         * @description watches historical candlestick data containing the open, high, low, close price, and the volume of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        symbol = market['symbol'];
        const url = this.urls['api']['ws']['public'];
        const request: Dict = {
            'method': 'subscribe',
            'subscription': {
                'type': 'candle',
                'coin': market['swap'] ? market['base'] : market['id'],
                'interval': timeframe,
            },
        };
        const messageHash = 'candles:' + timeframe + ':' + symbol;
        const message = this.extend (request, params);
        const ohlcv = await this.watch (url, messageHash, message, messageHash);
        if (this.newUpdates) {
            limit = ohlcv.getLimit (symbol, limit);
        }
        return this.filterBySinceLimit (ohlcv, since, limit, 0, true);
    }

    handleOHLCV (client: Client, message) {
        //
        //     {
        //         channel: 'candle',
        //         data: {
        //             t: 1710146280000,
        //             T: 1710146339999,
        //             s: 'BTC',
        //             i: '1m',
        //             o: '71400.0',
        //             c: '71411.0',
        //             h: '71422.0',
        //             l: '71389.0',
        //             v: '1.20407',
        //             n: 20
        //         }
        //     }
        //
        const data = this.safeDict (message, 'data', {});
        const base = this.safeString (data, 's');
        const marketId = this.coinToMarketId (base);
        const symbol = this.safeSymbol (marketId);
        const timeframe = this.safeString (data, 'i');
        if (!(symbol in this.ohlcvs)) {
            this.ohlcvs[symbol] = {};
        }
        if (!(timeframe in this.ohlcvs[symbol])) {
            const limit = this.safeInteger (this.options, 'OHLCVLimit', 1000);
            const stored = new ArrayCacheByTimestamp (limit);
            this.ohlcvs[symbol][timeframe] = stored;
        }
        const ohlcv = this.ohlcvs[symbol][timeframe];
        const parsed = this.parseOHLCV (data);
        ohlcv.append (parsed);
        const messageHash = 'candles:' + timeframe + ':' + symbol;
        client.resolve (ohlcv, messageHash);
    }

    async watchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        /**
         * @method
         * @name hyperliquid#watchOrders
         * @description watches information on multiple orders made by the user
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.user] user address, will default to this.walletAddress if not provided
         * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        let userAddress = undefined;
        [ userAddress, params ] = this.handlePublicAddress ('watchOrders', params);
        let market = undefined;
        let messageHash = 'order';
        if (symbol !== undefined) {
            market = this.market (symbol);
            symbol = market['symbol'];
            messageHash = messageHash + ':' + symbol;
        }
        const url = this.urls['api']['ws']['public'];
        const request: Dict = {
            'method': 'subscribe',
            'subscription': {
                'type': 'orderUpdates',
                'user': userAddress,
            },
        };
        const message = this.extend (request, params);
        const orders = await this.watch (url, messageHash, message, messageHash);
        if (this.newUpdates) {
            limit = orders.getLimit (symbol, limit);
        }
        return this.filterBySymbolSinceLimit (orders, symbol, since, limit, true);
    }

    handleOrder (client: Client, message) {
        //
        //     {
        //         channel: 'orderUpdates',
        //         data: [
        //             {
        //                 order: {
        //                     coin: 'BTC',
        //                     side: 'B',
        //                     limitPx: '30000.0',
        //                     sz: '0.001',
        //                     oid: 7456484275,
        //                     timestamp: 1710163596492,
        //                     origSz: '0.001'
        //                 },
        //                 status: 'open',
        //                 statusTimestamp: 1710163596492
        //             }
        //         ]
        //     }
        //
        const data = this.safeList (message, 'data', []);
        if (this.orders === undefined) {
            const limit = this.safeInteger (this.options, 'ordersLimit', 1000);
            this.orders = new ArrayCacheBySymbolById (limit);
        }
        const dataLength = data.length;
        if (dataLength === 0) {
            return;
        }
        const stored = this.orders;
        const messageHash = 'order';
        const marketSymbols: Dict = {};
        for (let i = 0; i < data.length; i++) {
            const rawOrder = data[i];
            const order = this.parseOrder (rawOrder);
            stored.append (order);
            const symbol = this.safeString (order, 'symbol');
            marketSymbols[symbol] = true;
        }
        const keys = Object.keys (marketSymbols);
        for (let i = 0; i < keys.length; i++) {
            const symbol = keys[i];
            const innerMessageHash = messageHash + ':' + symbol;
            client.resolve (stored, innerMessageHash);
        }
        client.resolve (stored, messageHash);
    }

    handleErrorMessage (client: Client, message) {
        //
        //     {
        //         "channel": "error",
        //         "data": "Error parsing JSON into valid websocket request: { \"type\": \"allMids\" }"
        //     }
        //
        const channel = this.safeString (message, 'channel', '');
        const ret_msg = this.safeString (message, 'data', '');
        if (channel === 'error') {
            throw new ExchangeError (this.id + ' ' + ret_msg);
        } else {
            return false;
        }
    }

    handleMessage (client: Client, message) {
        if (this.handleErrorMessage (client, message)) {
            return;
        }
        const topic = this.safeString (message, 'channel', '');
        const methods: Dict = {
            'pong': this.handlePong,
            'trades': this.handleTrades,
            'l2Book': this.handleOrderBook,
            'candle': this.handleOHLCV,
            'orderUpdates': this.handleOrder,
            'userFills': this.handleMyTrades,
            'webData2': this.handleWsTickers,
        };
        const exacMethod = this.safeValue (methods, topic);
        if (exacMethod !== undefined) {
            exacMethod.call (this, client, message);
            return;
        }
        const keys = Object.keys (methods);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (topic.indexOf (keys[i]) >= 0) {
                const method = methods[key];
                method.call (this, client, message);
                return;
            }
        }
    }

    ping (client) {
        return {
            'method': 'ping',
        };
    }

    handlePong (client: Client, message) {
        //
        //   {
        //       "channel": "pong"
        //   }
        //
        client.lastPong = this.safeInteger (message, 'pong');
        return message;
    }
}
