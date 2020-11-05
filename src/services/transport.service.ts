import { Item } from '../datatypes/Item';

export default class TransportService {
    public static saveList(list: Item[]) {
        localStorage.setItem('list', JSON.stringify(list));
    }

    public static updateItem(item: Item) {
        const list = this.getList();
        const newList = [];
        list.forEach((elem) => {
            if (elem.id === item.id) {
                newList.push({ id: item.id, value: item.value });
            } else {
                newList.push(elem);
            }
        });
        this.saveList(newList);
    }

    public static getList() : Item[] {
        const json = localStorage.getItem('list');
        if (json === null || json === undefined) {
            return [];
        }
        return JSON.parse(json) as Item[];
    }
}
