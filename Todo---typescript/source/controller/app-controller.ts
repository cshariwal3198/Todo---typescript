import { view } from '../view/view.js';
import { cloudStore } from '../model/cloud-store-service.js';
import { localStore, getTodoLocal } from '../model/local-store-service.js';
import { TodoItem, IValueObjectType } from '../utils/todo-item.js';

const taskInput = document.querySelector('.form-input') as HTMLInputElement
const taskContainer = document.querySelector('.div-to-display') as HTMLDivElement
const store = document.querySelector('.storage') as HTMLButtonElement
let previousSpanValue: string;

let defaultStorageLocation: string;
localStorage.setItem('storage', localStorage.getItem('storage') || 'CloudStorage')

const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore()
const { createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore()
const { showEmptyInputError, prepareTask } = view()

handlePageRefresh()

function appController() {
    return {
        deleteSingleTask: async function (parentElement: HTMLElement, { id, name }: IValueObjectType) {
            if (id) {
                const result = await deleteMethodCloud(id)
                result.status === 204 && taskContainer.removeChild(parentElement)
            } else {
                deleteTodoLocal(name),
                    taskContainer.removeChild(parentElement)
            }
        },

        editSelectedTask: function (editButton: HTMLButtonElement, span: HTMLSpanElement, index?: number) {
            if (editButton.innerText === 'Edit') {
                previousSpanValue = span.innerText
                span.contentEditable = `${true}`
                span.focus()
                editButton.innerText = 'Save'
            } else {
                editButton.innerText = 'Edit'
                span.contentEditable = `${false}`
                const _putCloud = () => {
                    index && putMethod(index, span.innerText)
                }
                actualExecutionFunction(_putCloud, editInLocal(previousSpanValue, span))
            }
        },

        adjustCheckValue: function (check: HTMLInputElement, { id, name }: IValueObjectType) {
            if (check.checked) {
                (defaultStorageLocation === 'CloudStorage' && id) ? putMethod(id, name, true) : editTodoLocal(name, name, true);
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'line-through';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = true
            } else {
                (defaultStorageLocation === 'CloudStorage' && id) ? putMethod(id, name, false) : editTodoLocal(name, name, false);
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'none';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = false
            }
        }
    }
}

function setTaskToList(event: Event) {
    event.preventDefault()
    const inputValue: string = taskInput.value;
    showEmptyInputError() && actualExecutionFunction(addToCloud(inputValue), addToLocal(inputValue))
}

async function handlePageRefresh() {
    defaultStorageLocation = localStorage.getItem('storage') as string;
    const tasks = (defaultStorageLocation === 'CloudStorage') ? await getTodoCloud() : getTodoLocal()
    tasks.map((task: IValueObjectType) => prepareTask(task))
    store.innerText = defaultStorageLocation
}

function clearAllTasks() {
    confirm('Your all tasks will be erased, Continue ?') &&
        actualExecutionFunction(eraseAllCloud, eraseAllLocal)
}

function switchBetweenStorage() {
    if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
        actualExecutionFunction(() => { localStorage.setItem('storage', 'LocalStorage') },
            () => { localStorage.setItem('storage', 'CloudStorage') })
        taskContainer.innerHTML = ''
        handlePageRefresh();
        store.innerText = defaultStorageLocation;
    }
}

function actualExecutionFunction(callback1: Function, callback2: Function): void {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2()
}

const privateFunctionObject = {
    addToCloud: (inputValue: string) => async function () {
        const postResult = await postMethod(inputValue)
        postResult && prepareTask(postResult)
    },

    addToLocal: (inputValue: string) => function () {
        createTodoLocal(inputValue),
            prepareTask(new TodoItem(inputValue))
    },

    editInLocal: (previousSpanValue: string, span: HTMLSpanElement) => function () {
        editTodoLocal(previousSpanValue, span.innerText)
    },

    eraseAllCloud: async function () {
        const deleteResponse = await deleteAllCloud()
        deleteResponse.status === 200 && (taskContainer.innerHTML = '')
    },

    eraseAllLocal: function () {
        deleteAllLocal(), taskContainer.innerHTML = ''
    },
};
const { addToCloud, addToLocal, editInLocal, eraseAllCloud, eraseAllLocal } = privateFunctionObject;

(document.querySelector('form') as HTMLFormElement).addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
(document.querySelector('.all-clear') as HTMLButtonElement).addEventListener('click', clearAllTasks)

export { appController, IValueObjectType }