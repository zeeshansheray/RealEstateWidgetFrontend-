import { enums } from "../enums"

const getProductAvailibility = () => {

    const types = [
        {
            label : 'In-stock',
            value : enums.ProductAvailibility.IN_STOCK,
        },
        {
            label : 'Out of Stock',
            value : enums.ProductAvailibility.OUTOFSTOCK,
        },
        {
            label : 'Limited',
            value : enums.ProductAvailibility.LIMITED,
        },
    ]

    return(
        <>
        {types.map((element, idx)=>
            <option value={element.value}>{element.label}</option>
        )}
        </>
    )
}

const getProductCategory = () => {

    const types = [
        {
            label : 'Shoes and Accessories',
            value : enums.ProductCategories.SHOESANDACCESSORIES,
        },
        {
            label : 'Tops',
            value : enums.ProductCategories.TOPS,
        },
        {
            label : 'Pants',
            value : enums.ProductCategories.PANTS,
        },
        {
            label : 'Dresses',
            value : enums.ProductCategories.DRESSES,
        },
        {
            label : 'Activewear(Sports Wear)',
            value : enums.ProductCategories.ACTIVEWEAR,
        },
        {
            label : 'Bottoms',
            value : enums.ProductCategories.BOTTOMS,
        },
        {
            label : 'Denim',
            value : enums.ProductCategories.DENIMS,
        },
        {
            label : 'Dresses',
            value : enums.ProductCategories.DRESSES,
        },
        {
            label : 'Seasonal Clothings',
            value : enums.ProductCategories.SEASONALCLOTHINGS,
        },
        {
            label : 'Winter Wear',
            value : enums.ProductCategories.WINTERWEAR,
        },
        {
            label : 'Private Collection',
            value : enums.ProductCategories.PRIVATECOLLECTION,
        },
        {
            label : 'Home Wear',
            value : enums.ProductCategories.HOMEWEAR,
        },
        {
            label : 'Suits',
            value : enums.ProductAvailibility.SUITS,
        },
        
    ]

    return(
        <>
        {types.map((element, idx)=>
            <option value={element.value}>{element.label}</option>
        )}
        </>
    )
}

export {
    getProductAvailibility,
    getProductCategory,
}
