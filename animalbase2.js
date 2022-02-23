"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
// let filteredArray = [];
// The prototype for all animals:
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
};

const settings = {
    filterBy: "all",
    sortBy: "name",
    sortDir: "asc"
}

function start() {
    console.log("ready");
    loadJSON();
    armButtons();
}

function armButtons() {
    const filterButtons = document.querySelectorAll(".filter");
    const sortingButtons = document.querySelectorAll("#sorting th");

    filterButtons.forEach((category) => {
        category.addEventListener("click", selectFilter);
    });

    sortingButtons.forEach((category) => {
        category.addEventListener("click", selectSort);
    });
}

async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();

    // when loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    allAnimals = jsonData.map(prepareObject);
    // TODO: This might not be the function we want to call first
    // displayList(allAnimals);
}

function prepareObject(jsonObject) {
    const animal = Object.create(Animal);

    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`user selected ${filter}`);
    // filterList(filter);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {
    if (settings.filterBy != "*") {
        filteredList = allAnimals.filter(isAnimalType);
        // displayList(filteredList);
    } else {
        filteredList = allAnimals;
        // displayList(allAnimals);
    }

    function isAnimalType(animal) {
        console.log(settings.filterBy);
        if (animal.type === settings.filterBy) {
            return true;
        } else {
            return false;
        }
    }
    return filteredList;
}

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    // find old sortBy elelment
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sortby");
    // indicate active sort
    event.target.classList.add("sortby");
    // toggle direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }
    console.log(`User selected ${settings.sortBy} - ${settings.sortDir}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortList(sortedList) {
    let direction = 1;

    if (settings.sortDir === "desc") {
        direction = -1;
    } else {
        direction = 1;
    }

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(animalA, animalB) {
        if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    console.log(sortedList);
    return sortedList;
}

function buildList() {
    const currentList = filterList(allAnimals);
    const sortedList = sortList(currentList);
    displayList(sortedList);
}

function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document
        .querySelector("template#animal")
        .content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}