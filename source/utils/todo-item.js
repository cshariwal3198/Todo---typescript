"use strict";
exports.__esModule = true;
exports.TodoItem = void 0;
var TodoItem = /** @class */ (function () {
    function TodoItem(name, isCompleted, index) {
        this.id = index;
        this.name = name;
        this.isCompleted = isCompleted || false;
    }
    return TodoItem;
}());
exports.TodoItem = TodoItem;
