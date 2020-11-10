import firebase from 'firebase';
import { Category, CategoryImage } from '../datatypes/Category';
import { Item } from '../datatypes/Item';
import QuantityComputingService from './QuantityComputing.service';
import { ReactComponent as MilkIcon } from '../category-icons/milk.svg';
import { ReactComponent as FruitsVegetableIcon } from '../category-icons/fruits-and-vegetables.svg';
import { ReactComponent as BreadIcon } from '../category-icons/bread.svg';

interface CategoryRankingForItem{
    [categoryName : string] : {
        assignments : number
    }
}

export default class CategorizationService {
    private static appCategoriesImage : {category : Category, icon : CategoryImage}[] = [
        {
            category: { name: 'Fruits et légumes' },
            icon: {
                image: FruitsVegetableIcon,
                type: 'SVGAsComponent',
            },
        },
        {
            category: { name: 'Boulangerie' },
            icon: {
                image: BreadIcon,
                type: 'SVGAsComponent',
            },
        },
        {
            category: { name: 'Crèmerie' },
            icon: {
                image: MilkIcon,
                type: 'SVGAsComponent',
            },
        },
    ];

    public static getCategoryImage(category : Category) : CategoryImage {
        return CategorizationService.appCategoriesImage.find(
            (c) => c.category.name === category.name,
        ).icon;
    }

    public static getAppCategories() : Category[] {
        return this.appCategoriesImage.map((c) => ({ name: c.category.name }));
    }

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
        return CategorizationService.getAppCategories().find(
            (c) => c.name === categoryRanking[0].category,
        );
    }
}
