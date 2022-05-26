const { body } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'machine': {
            return [
                body('serialNumber', 'Serial Number doesn\'t exists').exists(),
                body('machineType', 'Machine Type doesn\'t exists').exists(),
                body('rentPrice', 'Invalid Rent Price').exists().isInt(),
                body('availableQty', 'Invalid Available Qty').exists().isInt(),
                body('description', 'Description Number doesn\'t exists').exists()


            ]
        }
        case 'machineUpdate': {
            return [

                body('rentPrice', 'Invalid Rent Price').optional().isInt(),
                body('availableQty', 'Invalid Available Qty').optional().isInt()


            ]
        }
    }
}