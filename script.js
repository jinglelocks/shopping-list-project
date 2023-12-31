const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
// const items = itemList.querySelectorAll('li'); // defining this in the global scope is wrong, it fixes the length of the item list
let isEditMode = false;


function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemToDOM(item));

  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault(); // since using a form we don't want the form to submit to a file

  const newItem = itemInput.value;
  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  };

    // Check for edit mode
    if (isEditMode) { // take the item we are editing, remove it from localStorage and the DOM then add the newItem
      // not editing the item in localStorage, you can't, you can only get and set.
      const itemToEdit = itemList.querySelector('.edit-mode'); // many ways can do this

      removeItemFromStorage(itemToEdit.textContent); // remove from localStorage
      itemToEdit.classList.remove('edit-mode'); // remove the edit-mode class
      itemToEdit.remove(); // remove from DOM
      isEditMode = false;
    } else {
      if(checkIfItemExists(newItem)) {
        alert('That item already exists!');
        return; // make sure we return from that
      };
    };

    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
};


function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  
  // Add li to the DOM
  itemList.appendChild(li);
};

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

function getItemsFromStorage() {
  let itemsFromStorage; // represents array of items in local storage

  if (localStorage.getItem('items') === null) { // if there's nothing in there, set an empty array
    itemsFromStorage = [];
  } else { // if there is something in there, then add the item to the array
    itemsFromStorage = JSON.parse(localStorage.getItem('items')); // getItem will give a string, so parsing with JSON.parse to get an array
  };

  return(itemsFromStorage);
};

function onClickItem(e) { // This is a handler, depending on what we're clicking on it's gonna run a specific function
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  // } else { // this will cause all list items to be selected if clicking in the ul area, so need to use the following instead:
  } else if (e.target.closest('li')) {
    setItemToEdit(e.target);
  };
};

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return (itemsFromStorage.includes(item));
  // if (itemsFromStorage.includes(item)) { // use includes method which can be run on an array to see if something is in it
  //   return true;
  // } else {
  //   return false;
  // };
};

function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
  // item.style.color = '#ccc' // can set the style in JS or can use a CSS class (better)
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228822';
  itemInput.value = item.textContent;
};

function removeItem(item) {
  console.log(item);
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  };
  // if (e.target.parentElement.classList.contains('remove-item')) {
  //   // console.log('click');
  //   if (confirm('Are you sure?')) {
  //     e.target.parentElement.parentElement.remove();

  //     checkUI();
  //   };
  // };
};

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));

  checkUI();
};

function clearItems(e) {
  if (confirm('Are you sure?')) {
    // itemList.innerHTML = ''; // one method, but better to clear while the itemList has atleast one child:
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    };
  };

  // Clear from localStorage
  localStorage.removeItem('items');
  // localStorage.clear(); // not advised because it will clear everything, not just items key

  checkUI();
};

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  console.log(text);

  // get all of the list items
  const items = itemList.querySelectorAll('li');

  items.forEach(item => { // can use an array method here because querySelectorAll returns a node list
    //console.log(item);
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    };
    }); 
};

function checkUI() {
  // Clear the input
  itemInput.value = '';

  // get all of the list items
  const items = itemList.querySelectorAll('li'); // node list, similar to an array

  if (items.length === 0) {
    clearBtn.style.display = 'none'; // or you could have a class in your css set to display
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  };

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;

};

// Initialise app
function init() {
  // Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();
};

init();

