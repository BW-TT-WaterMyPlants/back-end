exports.seed = function(knex, Promise) {
  return knex('plants').insert([
    { nickname: "Spidey", species: "Spider Plant", h2oFrequency: 2, h2oTime: "13:00", user_id: 1 }, // 1
    { nickname: "Prickley", species: "Cactus", h2oFrequency: 7, h2oTime: "12:00", user_id: 1 }, // 2
    { nickname: "Thirsty", species: "Pitcher Plant", h2oFrequency: 1, h2oTime: "10:00", user_id: 1 }, // 3
    { nickname: "Beauregard", species: "Orchid", h2oFrequency: 3, h2oTime: "15:30", user_id: 2 }, // 4
    { nickname: "Jaws", species: "Venus Fly Trap", h2oFrequency: 1, h2oTime: "11:15", user_id: 2 }, // 5
    { nickname: "Jayde", species: "Jade Plant", h2oFrequency: 4, h2oTime: "16:00", user_id: 2 }, // 6
  ]);
};
