var form = document.querySelector(".form");
var taskContainer = document.querySelector(".div-to-display");
var taskInputBlock = document.querySelector(".form-input");
var inputError = document.querySelector("#error-div");
var allClear = document.querySelector(".all-clear");
function view() {
    return {
        createNewElement: function (elementName, text) {
            var newElement = document.createElement(elementName);
            text && (newElement.innerText = text);
            return newElement;
        },
        appendElementToParent: function (parent, child) {
            parent.appendChild(child);
        },
        createEditButton: function () {
            var editButton = this.createNewElement("button", "Edit");
            editButton.addEventListener("click", function () { return ""; });
            return editButton;
        },
        createDeleteButton: function () {
            var deleteButton = this.createNewElement("button", "X");
            deleteButton.addEventListener("click", function () { return ""; });
            return deleteButton;
        },
        prepareTask: function (value) {
            var paraBlock = this.createNewElement("p");
            var span = this.createNewElement("span", value.name);
            this.appendElementToParent(paraBlock, span);
            this.appendElementToParent(paraBlock, this.createDeleteButton());
            this.appendElementToParent(paraBlock, this.createEditButton());
            this.appendElementToParent(taskContainer, paraBlock);
        }
    };
}
console.log("first program in typescript");
view().prepareTask({ id: 1, name: "peter", isCompleted: false });
