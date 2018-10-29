import faker from "faker";
import _ from 'lodash';
import utils from "./core/utils";

faker.locale = "id_ID";

export default {
    default_times: 30,
    entities: {
        Unit: {
            name: () => _.sample(['Meter', 'Liter', 'Kilogram', 'Gram', 'Unit', 'Karung', 'Sachet', 'Pcs'])
        },
        Item: {
            name: faker.commerce.productName,
            quantity: faker.random.number,
            price: () => Math.ceil(faker.finance.amount()),
            unit_id: {
                table: 'Unit'
            }
        }
    }
};