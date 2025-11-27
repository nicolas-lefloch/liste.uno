import LocalStorageInterface from './LocalStorageInterface';
import { child, get, getDatabase, ref, set } from 'firebase/database';

const getListRef = (listID: string) => ref(getDatabase(), `/lists/${listID}/`);

const generateListName = () => `Liste du ${new Date().toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
})}`;

export default class ListIndexService {
    static setListName = (id :string, name: string) => {
        LocalStorageInterface.setListName(id, name);
        set(child(getListRef(id), "name"), name)
    };

    static async getListName(id: string) : Promise<string> {
        const value = await get(child(getListRef(id), "name")) 
        if (value.val()) {
            LocalStorageInterface.setListName(id, value.val());
            return value.val();
        }
        const generatedListName = generateListName();
        ListIndexService.setListName(id, generatedListName);
        return generatedListName;
    }
}
