import firebase from 'firebase';
import LocalStorageInterface from './LocalStorageInterface';

const getListRef = (listID: string) => firebase.database().ref(`/lists/${listID}/`);

const generateListName = () => `Liste du ${new Date().toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
})}`;

export default class ListIndexService {
    static setListName = (id :string, name: string) => {
        console.log(`setting ${id} name to ${name}`);
        LocalStorageInterface.setListName(id, name);
        getListRef(id).child('name').set(name);
    };

    static async getListName(id: string) : Promise<string> {
        const value = await getListRef(id).child('name').once('value');

        if (value.val()) {
            LocalStorageInterface.setListName(id, value.val());
            return value.val();
        }
        const generatedListName = generateListName();
        ListIndexService.setListName(id, generatedListName);
        return generatedListName;
    }
}
