import { TodoItem } from "../utils/todo-item";
export function localStore() {
    return {
        createTodoLocal: function (value) {
            const existingList = getTodoLocal();
            existingList.push(new TodoItem(value));
            setTodoLocal(existingList);
        },
        editTodoLocal: function (previousValue, newValue, isComplete = false) {
            const existingList = getTodoLocal();
            existingList.splice(existingList.indexOf(returnRequireObject(previousValue, existingList)), 1, new TodoItem(newValue, isComplete));
            setTodoLocal(existingList);
        },
        deleteTodoLocal: function (value) {
            const existingList = getTodoLocal();
            existingList.splice(existingList.indexOf(returnRequireObject(value, existingList)), 1);
            setTodoLocal(existingList);
        },
        deleteAllLocal: function () {
            setTodoLocal([]);
        }
    };
}
export function getTodoLocal() {
    return JSON.parse(`${localStorage.getItem("todo") || []}`);
}
function setTodoLocal(taskValue) {
    localStorage.setItem("todo", JSON.stringify(taskValue));
}
function returnRequireObject(value, existingList) {
    for (let elem of existingList) {
        if (elem.name === value) {
            return elem;
        }
    }
}
getTodoLocal();
