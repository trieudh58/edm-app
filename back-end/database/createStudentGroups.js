var models = require('../models');

models.StudentGroup.create({
    name: 'All'
}, function (err) {
    if (err) {
        throw err;
    }
});

for (var i = 0; i < 50; i++) {
    models.StudentGroup.create({
        name: 'QH-' + (1995 + i).toString() + '-I'
    }, function (err) {
        if (err) {
            throw err;
        }
    });
}
console.log('Student groups created.');