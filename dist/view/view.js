const form = document.querySelector(".form");
const taskContainer = document.querySelector(".div-to-display");
const taskInputBlock = document.querySelector(".form-input");
const inputError = document.querySelector("#error-div");
const allClear = document.querySelector(".all-clear");
function view() {
    return {
        prepareTask: function (value) {
            let paraBlock = createNewElement("p");
            let span = createNewElement("span", value.name);
            appendElementToParent(paraBlock, span);
            appendElementToParent(paraBlock, createDeleteButton());
            appendElementToParent(paraBlock, createEditButton());
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
function createEditButton() {
    const editButton = createNewElement("button", "Edit");
    editButton.addEventListener("click", () => console.log("edit"));
    return editButton;
}
function createDeleteButton() {
    const deleteButton = createNewElement("button", "X");
    deleteButton.addEventListener("click", () => console.log("delete"));
    return deleteButton;
}
export { view };
