// TODO: users collection for graph
const COLLECTIONS = [
  {
    name: "BooksTable",
    data: [
      {
        category: "Cookbooks",
        author: "Ina Garten",
        cover: "url-here",
        _key: "b1",
        name: "Modern Comfort Food: A Barefoot Contessa Cookbook",
        price: 21,
        rating: 4.5,
      },
      {
        category: "Cookbooks",
        author: "Steve Doocy",
        cover: "url-here",
        _key: "b2",
        name:
          "The Happy in a Hurry Cookbook: 100-Plus Fast and Easy New Recipes That Taste Like Home",
        price: 17.99,
        rating: 4.6,
      },
      {
        category: "Cookbooks",
        author: "Kristin Cavallari",
        cover: "url-here",
        _key: "b3",
        name:
          "True Comfort: More Than 100 Cozy Recipes Free of Gluten and Refined Sugar: A Gluten Free Cookbook",
        price: 17.52,
        rating: 4.8,
      },
      {
        category: "Cookbooks",
        author: "Gina Homolka",
        cover: "url-here",
        _key: "b4",
        name:
          "Skinnytaste Meal Prep: Healthy Make-Ahead Meals and Freezer Recipes to Simplify Your Life: A Cookbook",
        price: 19.5,
        rating: 4.7,
      },

      {
        category: "Database",
        author: "Michael Hernandez",
        cover: "url-here",
        _key: "b5",
        name:
          "Database Design for Mere Mortals: A Hands-On Guide to Relational Database Design",
        price: 43.98,
        rating: 4.4,
      },
      {
        category: "Database",
        author: "Alex Petrov",
        cover: "url-here",
        _key: "b6",
        name:
          "Database Internals: A Deep Dive into How Distributed Data Systems Work",
        price: 30.49,
        rating: 4.6,
      },
      {
        category: "Database",
        author: "Abraham Silberschatz",
        cover: "url-here",
        _key: "b7",
        name: "Database System Concepts",
        price: 98.49,
        rating: 4.2,
      },
      {
        category: "Database",
        author: "Martin Kleppmann",
        cover: "url-here",
        _key: "b8",
        name:
          "Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems",
        price: 34.28,
        rating: 4.7,
      },

      {
        category: "Fairy Tales",
        author: "Maria Tatar",
        cover: "url-here",
        _key: "b9",
        name: "The Classic Fairy Tales",
        price: 26.99,
        rating: 4.5,
      },
      {
        category: "Fairy Tales",
        author: "Parragon Books",
        cover: "url-here",
        _key: "b10",
        name: "Fairy Tales: A Beautiful Collection of Favorite Fairy Tales",
        price: 9.81,
        rating: 4.7,
      },
      {
        category: "Fairy Tales",
        author: "Sara Gianassi",
        cover: "url-here",
        _key: "b11",
        name: "365 Stories and Rhymes: Tales of Magic and Wonder",
        price: 9.99,
        rating: 4.7,
      },
      {
        category: "Fairy Tales",
        author: "Jacob and Wilhelm Grimm",
        cover: "url-here",
        _key: "b12",
        name: "Grimm's Complete Fairy Tales",
        price: 8.25,
        rating: 4.8,
      },

      {
        category: "Science Fiction",
        author: "Blake Crouch",
        cover: "url-here",
        _key: "b13",
        name: "Recursion",
        price: 12.99,
        rating: 4.5,
      },
      {
        category: "Science Fiction",
        author: "Frank Herbert",
        cover: "url-here",
        _key: "b14",
        name: "Dune",
        price: 4.58,
        rating: 4.7,
      },
      {
        category: "Science Fiction",
        author: "Stuart Ritchhie",
        cover: "url-here",
        _key: "b15",
        name:
          "Science Fictions: How Fraud, Bias, Negligence, and Hype Undermine the Search for Truth",
        price: 14.99,
        rating: 4.4,
      },
      {
        category: "Science Fiction",
        author: "John Birmingham",
        cover: "url-here",
        _key: "b16",
        name: "The Cruel Stars (The Cruel Stars Trilogy Book 1)",
        price: 9.99,
        rating: 4.5,
      },

      {
        category: "Home Improvement",
        author: "Michael Litchfieldm",
        cover: "url-here",
        _key: "b17",
        name: "Renovation 5th Edition: Completely Revised and Updated",
        price: 33.99,
        rating: 4.8,
      },
      {
        category: "Home Improvement",
        author: "Charlie Wing",
        cover: "url-here",
        _key: "b18",
        name:
          "How Your House Works: A Visual Guide to Understanding and Maintaining Your Home",
        price: 19.63,
        rating: 4.8,
      },
      {
        category: "Home Improvement",
        author: "Ray F Hicks",
        cover: "url-here",
        _key: "b19",
        name: "2020 National Home Improvement Estimator",
        price: 79.33,
        rating: 5,
      },
      {
        category: "Home Improvement",
        author: "Better Homes & Gardens",
        cover: "url-here",
        _key: "b20",
        name: "Home Improvement 1-2-3",
        price: 13.97,
        rating: 4.5,
      },

      {
        category: "Cars",
        author: "Matt Hranek",
        cover: "url-here",
        _key: "b21",
        name:
          "A Man & His Car: Iconic Cars and Stories from the Men Who Love Them",
        price: 40.0,
        rating: 4.5,
      },
      {
        category: "Cars",
        author: "Quentin Willson",
        cover: "url-here",
        _key: "b22",
        name: "Cool Cars",
        price: 6.09,
        rating: 4.6,
      },
      {
        category: "Cars",
        author: "Collin Brantmeyer",
        cover: "url-here",
        _key: "b23",
        name: "Death of a Car Salesman",
        price: 18.99,
        rating: 4.7,
      },
      {
        category: "Cars",
        author: "DK",
        cover: "url-here",
        _key: "b24",
        name: "Classic Car: The Definitive Visual History",
        price: 27.24,
        rating: 4.8,
      },

      {
        category: "Woodwork",
        author: "Albert Jackson",
        cover: "url-here",
        _key: "b25",
        name:
          "The Complete Manual of Woodworking: A Detailed Guide to Design, Techniques, and Tools for the Beginner and Expert",
        price: 10.07,
        rating: 4.7,
      },
      {
        category: "Woodwork",
        author: "Phillip Gardner",
        cover: "url-here",
        _key: "b26",
        name:
          "Practical Weekend Projects for Woodworkers: 35 Projects to Make for Every Room of Your Home (IMM Lifestyle Books) Easy Step-by-Step Instructions with Exploded Diagrams, Templates, & How-To Photographs",
        price: 17.99,
        rating: 4.4,
      },
      {
        category: "Woodwork",
        author: "Bob Flexner",
        cover: "url-here",
        _key: "b27",
        name:
          "Understanding Wood Finishing: How to Select and Apply the Right Finish",
        price: 36.67,
        rating: 4.8,
      },
      {
        category: "Woodwork",
        author: "DK Publishing",
        cover: "url-here",
        _key: "b28",
        name:
          "Woodwork: A Step-by-Step Photographic Guide to Successful Woodworking",
        price: 32.74,
        rating: 4.7,
      },
    ],
  },
  { name: "OrdersTable", data: [] },
  { name: "CartTable", data: [] },
  { name: "UsersTable", data: [] },
];

async function init(client) {
  for (collection of COLLECTIONS) {
    const { name, data } = collection;
    const coll = client.collection(name);

    // TODO: remove once fixed from jsc8
    let exists = true;
    try {
      const exists = await coll.exists();
    } catch (e) {
      exists = false;
    }

    if (!exists) {
      await client.createCollection(name);
      console.log(`Collection ${name} created`);
      if (Array.isArray(data) && data.length)
        await client.insertDocumentMany(name, data);
      console.log(`Data inserted in ${name}`);
    } else {
      console.log(`Collection ${name} already exists. Skipping creation.`);
    }
  }
}

module.exports = init;
