import { Item } from '../datatypes/Item';

export default class CleverListService {
    // public static regroupByName(existingItems: Item[], newItems: Item[]): Item[] {
    //     return newItems.reduce(
    //         (regroupedItem, newItem) => this.regroupOneItem(regroupedItem, newItem),
    //         existingItems,
    //     );
    // }

    public static handleQuantities(existingItems: Item[], newItem: Item): {
        itemToRemove? : Item,
        itemToAdd : Item
    } {
        const newItemName = this.itemNameWithoutQuantity(newItem);
        const matchingItem = existingItems.find(
            (i) => this.itemNameWithoutQuantity(i) === newItemName,
        );
        if (!matchingItem) {
            return { itemToAdd: newItem };
        }
        const existingQuantity = this.getQuantity(matchingItem);
        const newQuantity = this.getQuantity(newItem);
        const computedQuantity = String(existingQuantity + newQuantity).replace('.', ',');
        const computedItemName = `${computedQuantity} ${newItemName}`;
        const explanation = matchingItem.additionExplanation
            ? matchingItem.additionExplanation.replace(')', `+ ${newQuantity} )`)
            : `( ${existingQuantity} + ${newQuantity} )`;
        const computedItem: Item = {
            key: String(Math.random()),
            name: computedItemName,
            additionExplanation: explanation.replace('.', ','),
            lastUpdate: new Date().getTime(),
            bought: false,
        };
        return {
            itemToRemove: matchingItem,
            itemToAdd: computedItem,
        };
    }

    private static itemNameWithoutQuantity(item: Item):string {
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
