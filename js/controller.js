'use strict';

const todoList = document.querySelector('.todo__list');
const btnSubmit = document.querySelector('.btn__submit');
const todoInput = document.querySelector('.todo__input');
const state = {
    todoStorage: [],
    dateArr: []
};
let displayDate;

document.addEventListener('DOMContentLoaded', getTask);
todoList.addEventListener('click', deleteOrCheck);
btnSubmit.addEventListener('click', renderTask);

function fomratedDate(date) {
    function calcDate(date1, date2) {
        return Math.abs(Math.round((date2 - date1) / (1000 * 60 * 60 * 24)));
    }
    const daysPassed = calcDate(date, new Date());

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yestarday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    return new Intl.DateTimeFormat('sr-SP').format(date);
}

function createTask(inputText) {
    const item = document.createElement('li');
    item.classList.add('todo__item');

    state.dateArr.forEach(d => {
        const date = new Date(d);
        displayDate = fomratedDate(date);
    })

    item.innerHTML = `
        <div>
            <p class="todo__task">${inputText}</p>
            <span class="todo__date">${displayDate}</span>
        </div>
        <div class="todo__right">
            <button class="btn btn__check">
                <i class="icon__check fas fa-check"></i>
            </button>
            <button class="btn btn__trash">
                <i class="icon__trash far fa-trash-alt"></i>
            </button>
        </div>
        `;
    todoList.append(item);
}

function renderTask(e) {
    e.preventDefault();
    const inputValue = todoInput.value;

    state.dateArr.push(new Date().toISOString());
    createTask(inputValue);
    state.todoStorage.push(inputValue);
    saveTask();
    saveDate();

    todoInput.value = '';
}

function deleteOrCheck(e) {
    const item = e.target.closest('.btn');
    if (!item) return;

    if (item.classList.contains('btn__check')) {
        const todoTask = item.parentElement.closest('.todo__item').querySelector('.todo__task');
        const btnCheck = item.parentElement.closest('.todo__item').querySelector('.btn__check');
        const iconCheck = item.parentElement.closest('.todo__item').querySelector('.icon__check');
        todoTask.classList.toggle('todo__task--check');
        btnCheck.classList.toggle('btn__check--active');
        iconCheck.classList.toggle('icon__check--active');
    }

    if (item.classList.contains('btn__trash')) {
        const todoTask = item.parentElement.closest('.todo__item');
        todoTask.classList.add('todo__item--delete');
        todoTask.addEventListener('transitionend', () => {
            todoTask.remove();
        })
        removeTaskFromStorage(todoTask);
    }
}

function saveTask() {
    localStorage.setItem('todoStorage', JSON.stringify(state.todoStorage));
}

function saveDate() {
    localStorage.setItem('dateArr', JSON.stringify(state.dateArr));
}

function getTask() {
    state.todoStorage.forEach(task => {
        createTask(task);
    })
}

function removeTaskFromStorage(todoTask) {
    const task = todoTask.querySelector('.todo__task').innerText;
    const index = state.todoStorage.findIndex(todo => todo === task);
    state.todoStorage.splice(index, 1);
    localStorage.setItem('todoStorage', JSON.stringify(state.todoStorage))
    removeDateFromStorage(index);
}

function removeDateFromStorage(index) {
    state.dateArr.splice(index, 1);
    localStorage.setItem('dateArr', JSON.stringify(state.dateArr));
}

function init() {
    const tasks = localStorage.getItem('todoStorage');
    if (tasks) state.todoStorage = JSON.parse(tasks);
    const date = localStorage.getItem('dateArr');
    if (date) state.dateArr = JSON.parse(date);
}
init();