
import assert from 'assert';
import testOrder from './base/test.order.js';
import testSharedMethods from './base/test.sharedMethods.js';

async function testFetchClosedOrders (exchange, skippedProperties, symbol) {
    const method = 'fetchClosedOrders';
    const orders = await exchange.fetchClosedOrders (symbol);
    assert (Array.isArray (orders), exchange.id + ' ' + method + ' must return an array, returned ' + exchange.json (orders));
    const now = exchange.milliseconds ();
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        testOrder (exchange, skippedProperties, method, order, symbol, now);
        assert (exchange.inArray (order['status'], [ 'closed', 'canceled' ]), exchange.id + ' ' + method + ' ' + symbol + ' returned an order with status ' + order['status'] + ' (expected "closed" or "canceled")');
    }
    testSharedMethods.assertTimestampOrder (exchange, method, symbol, orders);
}

export default testFetchClosedOrders;
