var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { view } from '../view/view.js';
import { cloudStore } from '../model/cloud-store-service.js';
import { localStore, getTodoLocal } from '../model/local-store-service.js';
import { TodoItem } from '../utils/todo-item.js';
const taskInput = document.querySelector('.form-input');
const taskContainer = document.querySelector('.div-to-display');
const store = document.querySelector('.storage');
let previousSpanValue;
let defaultStorageLocation;
localStorage.setItem('storage', localStorage.getItem('storage') || 'CloudStorage');
const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore();
const { createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore();
const { showEmptyInputError, prepareTask } = view();
// testline to check changes in master
handlePageRefresh();
function appController() {
    return {
        deleteSingleTask: function (parentElement, value) {
            actualExecutionFunction(() => __awaiter(this, void 0, void 0, function* () {
                const result = yield deleteMethodCloud(value.id);
                result.status === 204 && taskContainer.removeChild(parentElement);
            }), () => { deleteTodoLocal(value.name), taskContainer.removeChild(parentElement); });
        },
        editSelectedTask: function (editButton, span, index) {
            if (editButton.innerText === 'Edit') {
                previousSpanValue = span.innerText;
                span.contentEditable = `${true}`;
                span.focus();
                editButton.innerText = 'Save';
            }
            else {
                editButton.innerText = 'Edit';
                span.contentEditable = `${false}`;
                actualExecutionFunction(() => { putMethod(index, span.innerText); }, () => { editTodoLocal(previousSpanValue, span.innerText); });
            }
        },
        adjustCheckValue: function (check, value) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function* () {
                if (check.checked) {
                    actualExecutionFunction(() => { putMethod(value.id, value.name, true); }, () => { editTodoLocal(value.name, value.name, true); });
                    ((_a = check.parentElement) === null || _a === void 0 ? void 0 : _a.firstChild).style.textDecoration = 'line-through';
                    ((_b = check.parentElement) === null || _b === void 0 ? void 0 : _b.children[3]).disabled = true;
                }
                else {
                    actualExecutionFunction(() => { putMethod(value.id, value.name, false); }, () => { editTodoLocal(value.name, value.name, false); });
                    ((_c = check.parentElement) === null || _c === void 0 ? void 0 : _c.firstChild).style.textDecoration = 'none';
                    ((_d = check.parentElement) === null || _d === void 0 ? void 0 : _d.children[3]).disabled = false;
                }
            });
        }
    };
}
function setTaskToList(event) {
    event.preventDefault();
    const inputValue = taskInput.value;
    showEmptyInputError() && actualExecutionFunction(() => __awaiter(this, void 0, void 0, function* () {
        const postResult = yield postMethod(inputValue);
        postResult && prepareTask(postResult);
    }), () => { createTodoLocal(inputValue), prepareTask(new TodoItem(inputValue)); });
}
function handlePageRefresh() {
    return __awaiter(this, void 0, void 0, function* () {
        defaultStorageLocation = localStorage.getItem('storage');
        const tasks = (defaultStorageLocation === 'CloudStorage') ? yield getTodoCloud() : getTodoLocal();
        tasks.map((task) => prepareTask(task));
        store.innerText = defaultStorageLocation;
    });
}
function switchBetweenStorage() {
    if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
        actualExecutionFunction(() => { localStorage.setItem('storage', 'LocalStorage'); }, () => { localStorage.setItem('storage', 'CloudStorage'); });
        taskContainer.innerHTML = '';
        handlePageRefresh();
        store.innerText = defaultStorageLocation;
    }
}
function clearAllTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        confirm('Your all tasks will be erased, Continue ?') &&
            actualExecutionFunction(() => __awaiter(this, void 0, void 0, function* () {
                let deleteResponse = yield deleteAllCloud();
                deleteResponse.status === 200 && (taskContainer.innerHTML = '');
            }), () => { deleteAllLocal(), taskContainer.innerHTML = ''; });
    });
}
function actualExecutionFunction(callback1, callback2) {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2();
}
document.querySelector('form').addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
document.querySelector('.all-clear').addEventListener('click', clearAllTasks);
export { appController };
