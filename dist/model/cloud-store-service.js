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
        getTodoCloud: async function () {
            return (await fetch(todoApiURL)).json();
        },
        postMethod: async function (value) {
            // let postResult = await setTodoCloud(todoApiURL, new OptionObject('POST',  new TodoItem(value),optionHeader))
            // return postResult?.json()
            return (await setTodoCloud(todoApiURL, new OptionObject('POST', new TodoItem(value), optionHeader))).json();
        },
        putMethod: async function (index, editedValue, isCompleted = false) {
            return await setTodoCloud(`${todoApiURL}/${index}`, new OptionObject('PUT', new TodoItem(editedValue, isCompleted, index), optionHeader));
        },
        deleteMethodCloud: async function (index) {
            return setTodoCloud(`${todoApiURL}/${index}`, new OptionObject('DELETE'));
        },
        deleteAllCloud: async function () {
            return await setTodoCloud(deleteApiURL, new OptionObject('DELETE'));
        },
    };
}
async function setTodoCloud(apiURL, options) {
    // try {
    //     return await fetch(apiURL, options)
    // } catch (error) {
    //     console.log('Something went wrong...!!!')
    // }
    return await fetch(apiURL, options);
}
export { cloudStore };
