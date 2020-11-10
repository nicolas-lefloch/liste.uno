import { Item } from '../datatypes/Item';

export default class QuantityComputingService {
    // public static regroupByName(existingItems: Item[], newItems: Item[]): Item[] {
    //     return newItems.reduce(
    //         (regroupedItem, newItem) => this.regroupOneItem(regroupedItem, newItem),
    //         existingItems,
    //     );
    // }

    public static transcriptToItems(transcript: string) : Item[] {
        const res = transcript.split(/ (?=[0-9])| et | des | du | de la |(?= une? )|(?= de )|\n/i)
            .map((s) => s.trim())
            .filter((s) => !!s)
            .map((item) => item.replace(/^des |^du |^de la /i, ''))
            .map((item) => item.replace(/^une |^un /i, '1 '))
        // The speech recognition mistakes "deux" for "de"
        // Except for the expression "de la" (e.g. "de la creme") which is handled before
            .map((item) => item.replace(/^de /, '2 '))
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .map(
                (item) => ({
                    name: item, lastUpdate: new Date().getTime(), bought: false, category: null,
                }),
            );
        return res;
    }

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
            ? matchingItem.additionExplanation.replace(')', `+ ${newQuantity} )`)
            : `( ${existingQuantity} + ${newQuantity} )`;
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
