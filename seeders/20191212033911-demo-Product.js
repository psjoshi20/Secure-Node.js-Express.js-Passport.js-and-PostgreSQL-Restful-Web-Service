'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [{
      prod_name: 'monitor',
      prod_desc: '42 inch dell',
      prod_price: '670',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};

// 'use strict';

// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     /*
//       Add altering commands here.
//       Return a promise to correctly handle asynchronicity.

//       Example:
//       return queryInterface.bulkInsert('People', [{
//         name: 'John Doe',
//         isBetaMember: false
//       }], {});
//     */
//   },

//   down: (queryInterface, Sequelize) => {
//     /*
//       Add reverting commands here.
//       Return a promise to correctly handle asynchronicity.

//       Example:
//       return queryInterface.bulkDelete('People', null, {});
//     */
//   }
// };
