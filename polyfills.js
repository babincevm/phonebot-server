module.exports = function () {
    /**
     * проверка объекта на пустоту
     */
    if (!Object.prototype.isEmpty) {
        Object.defineProperty(Object.prototype, 'isEmpty', {
            value: object => Object.keys(object).length === 0,
        });
    }
};
