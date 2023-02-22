"use strict";
// export function TodoItem(name: string, isCompleted: boolean = false, index: number)
//     : { name: string, isCompleted: boolean, id: number } {
//     return {
//         name: name,
//         isCompleted: isCompleted,
//         id: index,
//     }
// }
exports.__esModule = true;
exports.TodoItem = void 0;
var TodoItem = /** @class */ (function () {
    function TodoItem(name, isCompleted, index) {
        if (isCompleted === void 0) { isCompleted = false; }
        this.name = name;
        this.isCompleted = isCompleted;
        this.id = index;
    }
    return TodoItem;
}());
exports.TodoItem = TodoItem;
