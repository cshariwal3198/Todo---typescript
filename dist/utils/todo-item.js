export class TodoItem {
    constructor(name, isCompleted, index) {
        this.id = index;
        this.name = name;
        this.isCompleted = isCompleted || false;
    }
}
