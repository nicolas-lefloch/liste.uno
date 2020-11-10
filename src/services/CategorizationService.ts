import firebase from 'firebase';
import { Category } from '../datatypes/Category';
import { Item } from '../datatypes/Item';
import QuantityComputingService from './QuantityComputing.service';

interface CategoryRankingForItem{
    [categoryName : string] : {
        assignments : number
    }
}

export default class CategorizationService {
    static appCategories : Category[] = [
        { name: 'Fruits et légumes', image: 'apple' },
        { name: 'Boulangerie', image: 'bread' },
        { name: 'Crèmerie', image: 'egg' },
    ];

    static categoriesAssignmentsRef = firebase.database().ref('/categoriesAssignments')

    static listsRef = firebase.database().ref('/lists')

    static registerCategoryWasAssigned(
        newCategory : Category,
        forItem : Item,
        concernedListID : string,
    ) {
        const listSpecificCategoryAssignmentsRef = CategorizationService.listsRef.child(`${concernedListID}/categoriesAssignments`);

        const categoryToIncrementPath = `${QuantityComputingService.itemNameWithoutQuantity(forItem).toLocaleLowerCase()}/${newCategory.name}/assignments`;

        this.categoriesAssignmentsRef
            .child(categoryToIncrementPath)
            .set(firebase.database.ServerValue.increment(1));
        listSpecificCategoryAssignmentsRef
            .child(categoryToIncrementPath)
            .set(firebase.database.ServerValue.increment(1));
    }

    static getPreferredCategory(forItem : Item, concernedListID : string) : Promise<Category> {
        const listSpecificCategoryAssignmentsRef = CategorizationService.listsRef.child(`${concernedListID}/categoriesAssignments`);
        const itemNameNoQuantity = QuantityComputingService.itemNameWithoutQuantity(forItem)
            .toLocaleLowerCase();

        return new Promise((resolve) => {
            listSpecificCategoryAssignmentsRef.child(itemNameNoQuantity).once('value',
                (listCategoryRanking) => {
                    const preferredCategoryOnList = CategorizationService
                        .getMostUsedCategory(listCategoryRanking.val() as CategoryRankingForItem);
                    if (preferredCategoryOnList) {
                        resolve(preferredCategoryOnList);
                    } else {
                        CategorizationService.categoriesAssignmentsRef.child(itemNameNoQuantity).once('value',
                            (appCategoryRanking) => resolve(
                                this.getMostUsedCategory(
                                    appCategoryRanking.val() as CategoryRankingForItem,
                                ),
                            ));
                    }
                });
        });
    }

    private static getMostUsedCategory(snapshotValue : CategoryRankingForItem) : Category {
        if (!snapshotValue) {
            return null;
        }
        const categoryRanking = Object.keys(snapshotValue).map(
            (category) => ({
                category,
                assignments: snapshotValue[category].assignments,
            }),
        );
        categoryRanking.sort((a, b) => (a.assignments < b.assignments ? 1 : -1));
        return this.appCategories.find(
            (c) => c.name === categoryRanking[0].category,
        );
    }
}
