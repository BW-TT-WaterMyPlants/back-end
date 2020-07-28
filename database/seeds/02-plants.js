exports.seed = function(knex) {
  return knex('plants').insert([
    { nickname: "Spidey", species: "Spider Plant", h2oFrequency: 2, lastWatered: (Date(2020, 6, 25, 13, 0, 0)), userId: 1 }, // 1
    { nickname: "Prickley", species: "Cactus", h2oFrequency: 7, lastWatered: (Date(2020, 6, 24, 12, 0, 0)), userId: 1 }, // 2
    { nickname: "Thirsty", species: "Pitcher Plant", h2oFrequency: 1, lastWatered: (Date(2020, 6, 27, 7, 30, 0)), userId: 1 }, // 3
    { nickname: "Beauregard", species: "Orchid", h2oFrequency: 3, lastWatered: (Date(2020, 6, 21, 9, 0, 0)), userId: 2 }, // 4
    { nickname: "Jaws", species: "Venus Fly Trap", h2oFrequency: 1, lastWatered: (Date(2020, 6, 23, 13, 15, 0)), userId: 2 }, // 5
    { nickname: "Jayde", species: "Jade Plant", h2oFrequency: 4, lastWatered: (Date(2020, 6, 25, 12, 0, 0)), userId: 2 }, // 6
  ]);
};
