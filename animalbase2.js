"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredArray = [];
// The prototype for all animals:
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
};

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
    displayList(allAnimals);
}

function prepareObject(jsonObject) {
    const animal = Object.create(Animal);

    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    filterList(animal.type);
    return animal;
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`user selected ${filter}`);
    filterList(filter);
}

function filterList(category) {
    if (category != "*") {
        const filteredList = allAnimals.filter(isAnimalType);
        filteredArray = filteredList;
        displayList(filteredList);
    } else {

        filteredArray = allAnimals;
        displayList(allAnimals);
    }

    function isAnimalType(animal) {
        console.log(category);
        if (animal.type === category) {
            return true;
        } else {
            return false;
        }
    }
}

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    sortList(sortBy);
}

function sortList(sortBy) {
    console.log(`user is trying to sort by ${sortBy}`);
    let currentList = filteredArray;
    let sortedList = currentList.sort(compare);
    console.log(currentList);

    function compare(a, b) {
        if (a[sortBy] < b[sortBy]) {
            console.log("compare returns true, a[sortby] is", a[sortBy]);
            return -1;
        } else {
            console.log("compare returns false, b[sortby] is", b[sortBy])
            return 1;
        }
    }
    console.log(sortedList);
    displayList(currentList);
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