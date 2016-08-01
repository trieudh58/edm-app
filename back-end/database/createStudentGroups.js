var models = require('../models');

models.StudentGroup.create({
    name: 'All'
}, function (err) {
    if (err) {
        throw err;
    }
});

for (var i = 0; i < 25; i++) {
    models.StudentGroup.create({
        name: 'K' + (40 + i).toString()
    }, function (err) {
        if (err) {
            throw err;
        }
    });
}
console.log('Student groups created.');