
const Environment = {
    DEVELOPMENT     : 'development',
    STAGING         : 'staging',
    PRODUCTION      : 'production'
}

const Server = {
    DEV_URL     : 'v2dev.walletly.ai',
    PROD_URL    : 'api.walletly.ai'
}

const ApiVersions = {
    V3 : 'v3',
    V4 : 'v4'
}

const ResponseStatus = {
    SUCCESS         : 200,
    BAD_REQUEST     : 400,
    UNAUTHORIZED    : 401,
    FORBIDDEN       : 403,
    NOT_FOUND       : 404,
    INTERNAL_ERROR  : 500,
}

const Months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const Images = {
    LOGO_FILE_SIZE        : 5 * 1024 * 1024,
    LOGO_SUPPORTED_FORMAT : ['image/jpg', 'image/jpeg', 'image/png'],
    ICON_FILE_SIZE        : 2 * 1024 * 1024
}

const TOASTER_DELAY = 4 * 1000

const Operands = {
    GREATER   : 'greater',
    LESSER    : 'lesser',
    EQUAL     : 'equal',
    NOT_EQUAL : 'not_equal'
}


const ProductAvailibility = {
    IN_STOCK  : 'in',
    OUTOFSTOCK: 'out',
    LIMITED   : 'limited'
}

const OrderStatus = {
   RECIEVED    : "recieved",
   PAID        : "paid",
   COMPLETE    : "complete",
   CANCELLED   : "cancelled"
}

const ProductCategoriesMain = {
    SHOESANDACCESSORIES: 'shoes & accessories',
    TOPS               : 'tops',
    PANTS              : 'pants',
    ACTIVEWEAR         : 'activewear',
    DRESSES            : 'dresses',
    BOTTOMS            : 'bottoms',
    DENIMS             : 'denims',
    SEASONALCLOTHINGS  : 'seasonalclothings',
    WINTERWEAR         : 'winterwear',
    PRIVATECOLLECTION  : 'privatecollection',
    HOMEWEAR           : 'homewear',
    SUITS              : 'suits'
}

const ProductCategories = 
[
   { category: 'tops', subcategory: 't-shirts' },
   { category: 'tops', subcategory: 'polo shirts' },
   { category: 'tops', subcategory: 'button-down shirts' },
   { category: 'tops', subcategory: 'sweatshirts' },
   { category: 'tops', subcategory: 'sleeveless shirts' },
   { category: 'tops', subcategory: 'blouses' },
   { category: 'bottoms', subcategory: 'jeans' },
   { category: 'bottoms', subcategory: 'pants' },
   { category: 'bottoms', subcategory: 'shorts' },
   { category: 'bottoms', subcategory: 'skirts' },
   { category: 'bottoms', subcategory: 'leggings' },
   { category: 'bottoms', subcategory: 'joggers' },
   { category: 'dresses', subcategory: 'cocktail dresses' },
   { category: 'dresses', subcategory: 'maxi dresses' },
   { category: 'dresses', subcategory: 'summer dresses' },
   { category: 'outerwear', subcategory: 'jackets' },
   { category: 'outerwear', subcategory: 'coats' },
   { category: 'outerwear', subcategory: 'blazers' },
   { category: 'outerwear', subcategory: 'sweaters' },
   { category: 'outerwear', subcategory: 'cardigans' },
   { category: 'activewear', subcategory: 'sports bras' },
   { category: 'activewear', subcategory: 'leggings' },
   { category: 'activewear', subcategory: 'yoga pants' },
   { category: 'activewear', subcategory: 'tank tops' },
   { category: 'activewear', subcategory: 'athletic shorts' },
   { category: 'activewear', subcategory: 'sports hoodies' },
   { category: 'swimwear', subcategory: 'bikinis' },
   { category: 'swimwear', subcategory: 'one-piece swimsuits' },
   { category: 'swimwear', subcategory: 'board shorts' },
   { category: 'intimates', subcategory: 'bras' },
   { category: 'intimates', subcategory: 'panties' },
   { category: 'intimates', subcategory: 'lingerie sets' },
   { category: 'intimates', subcategory: 'shapewear' },
   { category: 'intimates', subcategory: 'sleepwear' },
   { category: 'accessories', subcategory: 'scarves' },
   { category: 'accessories', subcategory: 'hats' },
   { category: 'accessories', subcategory: 'belts' },
   { category: 'accessories', subcategory: 'rings' },
   { category: 'accessories', subcategory: 'sunglasses' },
   { category: 'shoes', subcategory: 'sneaker' },
   { category: 'shoes', subcategory: 'high heels' },
   { category: 'shoes', subcategory: 'slippers' },
   { category: 'shoes', subcategory: 'sandals' },
   { category: 'shoes', subcategory: 'loafers' },
   { category: 'shoes', subcategory: 'boots' },
   { category: 'shoes', subcategory: 'topsiders' },
   { category: 'shoes', subcategory: 'running shoes' },
   { category: 'shoes', subcategory: 'uggs' }
 ]

 const AllProductsList = [
   {
   "category": "Tops",
   "subcategories": [{
         "name": "T-Shirts",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Polo Shirts",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Button-Down Shirts",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Sweatshirts",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Sleeveless Shirts",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Blouses",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      }
   ]
},
{
   "category": "Bottoms",
   "subcategories": [
      {
         "name": "Jeans",
         "sizes": ["30", "32", "34", "36", "38", "40","42","44", "46"]
      },
      {
         "name": "Pants",
         "sizes": ["30", "32", "34", "36", "38", "40","42","44", "46"]
      },
      {
         "name": "Shorts",
         "sizes": ["30", "32", "34", "36", "38", "40","42","44", "46"]
      },
      {
         "name": "Skirts",
         "sizes": ["30", "32", "34", "36", "38", "40","42","44", "46"]
      },
      {
         "name": "Leggings",
         "sizes": ["30", "32", "34", "36", "38", "40","42","44", "46"]
      },
      {
         "name": "Joggers",
         "sizes": ["30", "32", "34", "36", "38", "40","42","44", "46"]
      }
      
   ]
},
{
   "category": "Dresses",
   "subcategories": [{
         "name": "Cocktail Dresses",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Maxi Dresses",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Summer Dresses",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      
   ]
},
{
   "category": "Outerwear",
   "subcategories": [{
         "name": "Jackets",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Coats",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Blazers",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Sweaters",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Cardigans",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      }
      
      
   ]
},
{
   "category": "Activewear",
   "subcategories": [{
         "name": "Sports Bras",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Leggings",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Yoga Pants",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Tank Tops",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Athletic Shorts",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Sports Hoodies",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      }
      
   ]
},
{
   "category": "Swimwear",
   "subcategories": [
      {
         "name": "Bikinis",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "One-Piece Swimsuits",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Board Shorts",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      }
      
   ]
},
{
   "category": "Intimates",
   "subcategories": [{
         "name": "Bras",
         "sizes": ["28", "30", "32", "34", "36", "38", "40", "42", "44"]
      },
      {
         "name": "Panties",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Lingerie Sets",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Shapewear",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
         "name": "Sleepwear",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
      }
      
   ]
},
{
   "category": "Accessories",
   "subcategories": [
      {
         "name": "Scarves",
         "sizes": [ "S", "M", "L"]
      },
      {
         "name": "Hats",
         "sizes": [ "S", "M", "L"]
      },
      {
         "name": "Belts",
         "sizes": ["28", "30", "32", "34", "36", "38", "40", "42", "44"]
      },
      {
         "name": "Rings",
         "sizes": [ "3", "4","5","6","7","8","9","10","11", "12","13","14","15","16","17","18","19","20","21","22"]
      },
      {
         "name": "Sunglasses",
         "sizes": [ "S", "M", "L"]
      },
   ]
},
{
   "category": "Shoes",
   "subcategories": [{
         "name" : "Sneaker",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name" : "High Heels",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name" : "Slippers",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name" : "Sandals",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name" : "Loafers",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name" : "Boots",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name" : "Topsiders",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name" : "Running Shoes",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]

      },
      {
         "name": "Uggs",
         "sizes": ["37","38",  "39",  "40",  "41",  "42", "43",  "44", "45",  "46",  "47"]
      }

   ]
}
]

const Roles = {
    ADMIN     : 1,
    MARKETER  : 3,
    CUSTOMER  : 2,
}

export {
  
    Environment,
    Server,
    ApiVersions,
    ResponseStatus,
    Months,
    Images,
    TOASTER_DELAY,
    Roles,
    Operands,
    ProductAvailibility,
    ProductCategories,
    ProductCategoriesMain,
    AllProductsList,
    OrderStatus
}