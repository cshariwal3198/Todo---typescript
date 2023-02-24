import { appController } from "../controller/app-controller.js";
const form = document.querySelector(".form");
const taskContainer = document.querySelector(".div-to-display");
const taskInputBlock = document.querySelector(".form-input");
const inputError = document.querySelector("#error-div");
const allClear = document.querySelector(".all-clear");
let { deleteSingleTask, editSelectedTask, varifyCheck } = appController();
function view() {
    return {
        prepareTask: function (value) {
            let paraBlock = createNewElement("p");
            let span = createNewElement("span", value.name);
            appendElementToParent(paraBlock, span);
            appendElementToParent(paraBlock, createCheckBoxElement("change", value));
            appendElementToParent(paraBlock, createDeleteButton("click", value));
            appendElementToParent(paraBlock, createEditButton("click", span, value));
            appendElementToParent(taskContainer, paraBlock);
            taskInputBlock.value = "";
        },
        showEmptyInputError: function () {
            if (!taskInputBlock.value) {
                inputError.innerHTML = "** please enter a task";
                return false;
            }
            else {
                inputError.innerHTML = "";
                return true;
            }
        }
    };
}
function createNewElement(elementName, text) {
    const newElement = document.createElement(elementName);
    text && (newElement.innerText = text);
    return newElement;
}
function appendElementToParent(parent, child) {
    parent.appendChild(child);
}
function createEditButton(event, span, value) {
    const editButton = createNewElement("button", "Edit");
    editButton.addEventListener("click", () => editSelectedTask(editButton, span, value.id));
    return editButton;
}
function createDeleteButton(event, value) {
    const deleteButton = createNewElement("button", "X");
    deleteButton.addEventListener(event, () => deleteSingleTask(deleteButton.parentNode, value));
    return deleteButton;
}
function createCheckBoxElement(event, value) {
    const check = createNewElement("input");
    check.type = "checkbox";
    check.addEventListener(event, () => varifyCheck(check, value));
    return check;
}
export { view };
