define([], function () {
    return {
        rannumber() {
            var randnumber = '';
            for (ranNum = 1; ranNum <= 6; ranNum++) {
                randnumber += Math.floor(Math.random() * 10).toString();
            }
            return randnumber;
        },
        serializeObject(obj) {
            console.log(obj);
            var newObj = [];
            _.forEach(obj, function(value, key) {
                var tempVal = {};
                tempVal.name = key;
                tempVal.value = value;
                newObj.push(tempVal);
            });
            return newObj;
        }
    }
});


