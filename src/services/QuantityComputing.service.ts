import { Item } from '../datatypes/Item';

export default class QuantityComputingService {
    public static handleQuantities(existingItems: Item[], newItem: Item): {
        itemToRemove? : Item,
        itemToAdd : Item
    } {
        const newItemName = this.itemNameWithoutQuantity(newItem);
        const matchingItem = existingItems.find(
            (i) => QuantityComputingService.itemNameWithoutQuantity(i) === newItemName,
        );
        /*
         No matching item : the new item is not a duplicate
         and the existing list shall not be altered
         */
        if (!matchingItem) {
            return { itemToAdd: newItem };
        }
        const existingQuantity = this.getQuantity(matchingItem);

        /*
        * A matching item, but with no quantity specified
        * The matching item shall be removed but no quantity computing will be performed
        */
        if (!existingQuantity) {
            return {
                itemToRemove: matchingItem,
                itemToAdd: { ...newItem, category: matchingItem.category },
            };
        }

        const newQuantity = this.getQuantity(newItem);
        const computedQuantity = String(existingQuantity + newQuantity).replace('.', ',');
        const computedItemName = `${computedQuantity} ${newItemName}`;
        const explanation = matchingItem.additionExplanation
            ? matchingItem.additionExplanation.replace(')', `+ ${newQuantity})`)
            : `(${existingQuantity} + ${newQuantity})`;
        const computedItem: Item = {
            key: String(Math.random()),
            name: computedItemName,
            additionExplanation: explanation.replace('.', ','),
            lastUpdate: new Date().getTime(),
            bought: false,
            category: matchingItem.category || null,
        };
        return {
            itemToRemove: matchingItem,
            itemToAdd: computedItem,
        };
    }

    public static itemNameWithoutQuantity(item: Item):string {
        const quantity = this.getQuantity(item);
        if (!quantity) {
            return item.name;
        }
        const quantityPointDecimal = String(quantity);
        const quantityCommaDecimal = quantityPointDecimal.replace('.', ',');
        const toRemove = new RegExp(`(${quantityPointDecimal}|${quantityCommaDecimal})`);
        const itemNameWithoutQuantity = item.name.replace(toRemove, '').trim();
        if (quantity === 1 && !itemNameWithoutQuantity.endsWith('s')) {
            return `${itemNameWithoutQuantity}s`;
        }
        return itemNameWithoutQuantity;
    }

    private static getQuantity(item: Item) {
        const quantity = item.name.match(/^[0-9|,]+/);
        if (!quantity) {
            return undefined;
        }
        return +(quantity[0].replace(',', '.'));
    }
}
