import firebase from 'firebase/app';
import 'firebase/database';
import { Category, CategoryImage } from '../datatypes/Category';
import { Item } from '../datatypes/Item';
import QuantityComputingService from './QuantityComputing.service';
import { ReactComponent as BeerIcon } from '../ressources/svg/beer-icon.svg';
import { ReactComponent as BeverageIcon } from '../ressources/svg/beverage-icon.svg';
import { ReactComponent as BreadIcon } from '../ressources/svg/bread-icon.svg';
import { ReactComponent as ClothesIcon } from '../ressources/svg/clothes-icon.svg';
import { ReactComponent as CreamIcon } from '../ressources/svg/cream-icon.svg';
import { ReactComponent as DessertIcon } from '../ressources/svg/dessert-icon.svg';
import { ReactComponent as FishIcon } from '../ressources/svg/fish-icon.svg';
import { ReactComponent as FruitIcon } from '../ressources/svg/fruit-icon.svg';
import { ReactComponent as HygieneIcon } from '../ressources/svg/hygiene-icon.svg';
import { ReactComponent as HomeCleaningIcon } from '../ressources/svg/home-cleaning-icon.svg';
import { ReactComponent as MeatIcon } from '../ressources/svg/meat-icon.svg';
import { ReactComponent as WineIcon } from '../ressources/svg/wine-icon.svg';
import { ReactComponent as GroceryIcon } from '../ressources/svg/grocery-icon.svg';
import { ReactComponent as CannedFoodIcon } from '../ressources/svg/canned-food-icon.svg';
import { ReactComponent as FrozenIcon } from '../ressources/svg/frozen-icon.svg';

interface CategoryRankingForItem{
    [categoryName : string] : {
        assignments : number
    }
}

export default class CategorizationService {
    private static appCategoriesImage : {category : Category, icon : CategoryImage}[] = [
        { category: { name: 'Bières' }, icon: { type: 'SVGAsComponent', image: BeerIcon } },
        { category: { name: 'Boissons' }, icon: { type: 'SVGAsComponent', image: BeverageIcon } },
        { category: { name: 'Boulangerie' }, icon: { type: 'SVGAsComponent', image: BreadIcon } },
        { category: { name: 'Vêtements' }, icon: { type: 'SVGAsComponent', image: ClothesIcon } },
        { category: { name: 'Crèmerie' }, icon: { type: 'SVGAsComponent', image: CreamIcon } },
        { category: { name: 'Desserts' }, icon: { type: 'SVGAsComponent', image: DessertIcon } },
        { category: { name: 'Poissons' }, icon: { type: 'SVGAsComponent', image: FishIcon } },
        { category: { name: 'Fruits et Légumes' }, icon: { type: 'SVGAsComponent', image: FruitIcon } },
        { category: { name: 'Hygiène' }, icon: { type: 'SVGAsComponent', image: HygieneIcon } },
        { category: { name: 'Produits ménager' }, icon: { type: 'SVGAsComponent', image: HomeCleaningIcon } },
        { category: { name: 'Viande' }, icon: { type: 'SVGAsComponent', image: MeatIcon } },
        { category: { name: 'Vin' }, icon: { type: 'SVGAsComponent', image: WineIcon } },
        { category: { name: 'Epicerie' }, icon: { type: 'SVGAsComponent', image: GroceryIcon } },
        { category: { name: 'Conserves' }, icon: { type: 'SVGAsComponent', image: CannedFoodIcon } },
        { category: { name: 'Surgelé' }, icon: { type: 'SVGAsComponent', image: FrozenIcon } },
    ];

    public static getCategoryImage(category : Category) : CategoryImage {
        return CategorizationService.appCategoriesImage.find(
            (c) => c.category.name === category.name,
        )?.icon;
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
