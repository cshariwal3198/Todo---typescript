var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TodoItem } from '../utils/todo-item.js';
const todoApiURL = 'https://mk-todo-web-api.azurewebsites.net/api/ChethanTodoItems';
const deleteApiURL = 'https://mk-todo-web-api.azurewebsites.net/ChethanTodoItems/deleteAll';
const optionHeader = {
    "Content-type": "application/json",
};
class OptionObject {
    constructor(method, body, header) {
        this.method = method;
        this.body = JSON.stringify(body);
        this.headers = header;
    }
}
function cloudStore() {
    return {
        getTodoCloud: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield fetch(todoApiURL)).json();
            });
        },
        postMethod: function (value) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield setTodoCloud(todoApiURL, new OptionObject('POST', new TodoItem(value), optionHeader))).json();
            });
        },
        putMethod: function (index, editedValue, isCompleted = false) {
            return setTodoCloud(`${todoApiURL}/${index}`, new OptionObject('PUT', new TodoItem(editedValue, isCompleted, index), optionHeader));
        },
        deleteMethodCloud: function (index) {
            return __awaiter(this, void 0, void 0, function* () {
                index++;
                return yield setTodoCloud(`${todoApiURL}/${index}`, new OptionObject('DELETE'));
            });
        },
        deleteAllCloud: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield setTodoCloud(deleteApiURL, new OptionObject('DELETE'));
            });
        },
    };
}
function setTodoCloud(apiURL, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fetch(apiURL, options);
        }
        catch (error) {
            console.log('Something went wrong...!!!');
        }
    });
}
export { cloudStore };
