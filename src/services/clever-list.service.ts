import { Item } from '../datatypes/Item';

export default class CleverListService {
    public static regroupByName(existingItems: Item[], newItems: Item[]): Item[] {
        return newItems.reduce(
            (regroupedItem, newItem) => this.regroupOneItem(regroupedItem, newItem),
            existingItems,
        );
    }

    private static regroupOneItem(existingItems: Item[], newItem: Item): Item[] {
        const newItemName = this.itemNameWithoutQuantity(newItem);
        const matchingItem = existingItems.find(
            (i) => this.itemNameWithoutQuantity(i) === newItemName,
        );
        if (!matchingItem) {
            return [...existingItems, newItem];
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
        };
        return [
            ...existingItems.filter((i) => i !== matchingItem),
            computedItem,
        ];
    }

    private static itemNameWithoutQuantity(item: Item) {
        const quantity = this.getQuantity(item);
        if (!quantity) {
            return item.name;
        }
        const quantityPointDecimal = String(quantity);
        const quantityCommaDecimal = quantityPointDecimal.replace('.', ',');
        const toRemove = new RegExp(`(${quantityPointDecimal}|${quantityCommaDecimal})`);
        return item.name.replace(toRemove, '').trim();
    }

    private static getQuantity(item: Item) {
        const quantity = item.name.match(/^[0-9|,]+/);
        if (!quantity) {
            return undefined;
        }
        return +(quantity[0].replace(',', '.'));
    }
}
