import { view } from '../view/view.js';
import { cloudStore } from '../model/cloud-store-service.js';
import { localStore, getTodoLocal } from '../model/local-store-service.js';
import { TodoItem, IvalueObjectType } from '../utils/todo-item.js';

const taskInput = document.querySelector('.form-input') as HTMLInputElement
const taskContainer = document.querySelector('.div-to-display') as HTMLDivElement
const store = document.querySelector('.storage') as HTMLButtonElement
let previousSpanValue : string ;
 
let lsGet : string;
localStorage.setItem('storage', localStorage.getItem('storage') || 'CloudStorage')

const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore()
const { createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore()
const { showEmptyInputError, prepareTask } = view()

handlePageRefresh()

function appController() {
    return {
        deleteSingleTask: function (parentElement: HTMLElement, {id,name}: IvalueObjectType) {
            const deleteFromCloud = async () => {
                if(id){
                    const result = await deleteMethodCloud(id)
                    result.status === 204 && taskContainer.removeChild(parentElement)  
                } 
            }
            const deleteFromLocal = () => { deleteTodoLocal(name), taskContainer.removeChild(parentElement) }
            actualExecutionFunction(deleteFromCloud, deleteFromLocal)
        },

        editSelectedTask: function (editButton: HTMLButtonElement, span: HTMLSpanElement, index: number) {
            if (editButton.innerText === 'Edit') {
                previousSpanValue = span.innerText
                span.contentEditable = `${true}`
                span.focus()
                editButton.innerText = 'Save'
            } else {
                editButton.innerText = 'Edit'
                span.contentEditable = `${false}`
                // const put = () => { putMethod(index, span.innerText) }
                // const edit = () => { editTodoLocal(previousSpanValue, span.innerText) }
                actualExecutionFunction(putMethod.prototype.bind(index, span.innerText), editTodoLocal.bind(previousSpanValue, span.innerText))
            }
        },

        adjustCheckValue: function (check: HTMLInputElement, {id, name}: IvalueObjectType) {
            if (check.checked) {
                actualExecutionFunction(putMethod.prototype.bind(id, name, true), editTodoLocal.prototype.bind(name, name, true));
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'line-through';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = true
            } else {
                actualExecutionFunction(putMethod.prototype.bind(id, name, false), editTodoLocal.prototype.bind(name, name, false));
                (check.parentElement?.firstChild as HTMLSpanElement).style.textDecoration = 'none';
                (check.parentElement?.children[3] as HTMLButtonElement).disabled = false
            }
        }
    }
}

function setTaskToList(event: Event) {
    event.preventDefault()
    const inputValue: string = taskInput.value;
    const addToCloud = async () => {
        const postResult = await postMethod(inputValue)
        postResult && prepareTask(postResult)
    }
    const addToLocal = () => { createTodoLocal(inputValue), prepareTask(new TodoItem(inputValue)) }
    showEmptyInputError() && actualExecutionFunction(addToCloud, addToLocal)
}

async function handlePageRefresh() {
    lsGet = localStorage.getItem('storage') as string;
    const tasks: IvalueObjectType[] = (lsGet === 'CloudStorage') ? await getTodoCloud() : getTodoLocal()
    tasks.map((task) => prepareTask(task))
    store.innerText = lsGet
}

function switchBetweenStorage() {
    if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
        actualExecutionFunction(() => { localStorage.setItem('storage', 'LocalStorage') },
            () => { localStorage.setItem('storage', 'CloudStorage') })
        taskContainer.innerHTML = ''
        handlePageRefresh();
        store.innerText = lsGet;
    }
}  

function clearAllTasks() {
    const eraseFromCloud = async () => {
        let deleteResponse = await deleteAllCloud()
        deleteResponse.status === 200 && (taskContainer.innerHTML = '')
    }
    const eraseFromeLocal = () => { deleteAllLocal(), taskContainer.innerHTML = '' }
    confirm('Your all tasks will be erased, Continue ?') &&
        actualExecutionFunction(eraseFromCloud, eraseFromeLocal)
}

function actualExecutionFunction(callback1: Function, callback2: Function): void {
    localStorage.getItem('storage') === 'CloudStorage' ? callback1() : callback2()
}

(document.querySelector('form') as HTMLFormElement).addEventListener('submit', setTaskToList);
store.addEventListener('click', switchBetweenStorage);
(document.querySelector('.all-clear') as HTMLButtonElement).addEventListener('click', clearAllTasks)

export { appController, IvalueObjectType }