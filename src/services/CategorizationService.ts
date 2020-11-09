import firebase from 'firebase';
import { Category } from '../datatypes/Category';
import { Item } from '../datatypes/Item';
import QuantityComputingService from './QuantityComputing.service';

export default class CategorizationService {
    static appCategories : Category[] = [
        { name: 'Fruits et légumes', image: 'apple' },
        { name: 'Boulangerie', image: 'bread' },
        { name: 'Crèmerie', image: 'egg' },
    ];

    static categoriesAssignmentsRef = firebase.database().ref('/categoriesAssignments')

    static registerCategoryWasAssigned(newCategory : Category, forItem : Item) {
        this.categoriesAssignmentsRef
            .child(`${QuantityComputingService.itemNameWithoutQuantity(forItem).toLocaleLowerCase()}/${newCategory.name}/assignments`)
            .set(firebase.database.ServerValue.increment(1));
    }

    static getPreferredCategory(forItem : Item) : Promise<Category> {
        return new Promise((resolve) => {
            const itemNameNoQuantity = QuantityComputingService.itemNameWithoutQuantity(forItem)
                .toLocaleLowerCase();
            this.categoriesAssignmentsRef.child(itemNameNoQuantity).once('value',
                (snapshot) => {
                    const snapshotValue = snapshot.val();
                    if (!snapshotValue) {
                        resolve(undefined);
                    } else {
                        const categoryRanking = Object.keys(snapshotValue).map(
                            (category) => ({
                                category,
                                assignments: snapshotValue[category].assignments,
                            }),
                        );
                        categoryRanking.sort((a, b) => (a.assignments < b.assignments ? 1 : -1));
                        resolve(this.appCategories.find(
                            (c) => c.name === categoryRanking[0].category,
                        ));
                    }
                });
        });
    }
}
