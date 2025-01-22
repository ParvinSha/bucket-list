// Håller aktiviteter
let bucketList = JSON.parse(localStorage.getItem('bucketList')) || [];

// Referenser till DOM-element
const bucketForm = document.getElementById('bucketForm');
const activityNameInput = document.getElementById('activityName');
const activityCategorySelect = document.getElementById('activityCategory');
const bucketListsContainer = document.getElementById('bucketLists');

// Funktion för att spara till localStorage
function saveToLocalStorage() {
  localStorage.setItem('bucketList', JSON.stringify(bucketList));
}

// Funktion för att rita upp listan
function renderBucketList() {
  // Rensa container innan vi ritar upp igen
  bucketListsContainer.innerHTML = '';

  // Gruppera aktiviteter efter kategori
  const categories = bucketList.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {});

  // Skapa listor för varje kategori
  for (const [category, activities] of Object.entries(categories)) {
    const categoryDiv = document.createElement('div');
    const categoryHeading = document.createElement('h2');
    categoryHeading.textContent = category;

    // Sortera aktiviteter alfabetiskt
    activities.sort((a, b) => a.name.localeCompare(b.name));

    const activityList = document.createElement('ul');
    activities.forEach((activity) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span style="text-decoration: ${activity.completed ? 'line-through' : 'none'};">
          ${activity.name}
        </span>
        <div>
          <button onclick="toggleComplete('${activity.id}')">${activity.completed ? 'Ångra' : 'Klar'}</button>
          <button onclick="editActivity('${activity.id}')">Redigera</button>
          <button onclick="removeActivity('${activity.id}')">Ta bort</button>
        </div>
      `;
      activityList.appendChild(listItem);
    });

    categoryDiv.appendChild(categoryHeading);
    categoryDiv.appendChild(activityList);
    bucketListsContainer.appendChild(categoryDiv);
  }
}

// Funktion för att markera aktivitet som klar/ångra
function toggleComplete(id) {
  const activity = bucketList.find(activity => activity.id === id);
  if (activity) {
    activity.completed = !activity.completed;
    saveToLocalStorage();
    renderBucketList();
  }
}

// Funktion för att redigera en aktivitet
function editActivity(id) {
  const activity = bucketList.find(activity => activity.id === id);
  if (activity) {
    const newName = prompt('Ange nytt namn för aktiviteten:', activity.name);
    if (newName && newName.trim()) {
      activity.name = newName.trim();
      saveToLocalStorage();
      renderBucketList();
    }
  }
}

// Funktion för att ta bort en aktivitet
function removeActivity(id) {
  bucketList = bucketList.filter(activity => activity.id !== id);
  saveToLocalStorage();
  renderBucketList();
}

// Eventlyssnare för att lägga till nya aktiviteter
bucketForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = activityNameInput.value.trim();
  const category = activityCategorySelect.value;

  if (name) {
    bucketList.push({
      id: Date.now().toString(), // Unikt ID för varje aktivitet
      name,
      category,
      completed: false
    });
    activityNameInput.value = '';
    saveToLocalStorage();
    renderBucketList();
  }
});

// Rendera initial lista
renderBucketList();
