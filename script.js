// // tom array för mina aktiviteter
// let activities = [];
// const activityNameEl = document.getElementById('activityName');
// // hantering av när vi trycker på submit
// const bucketForm = document.getElementById('bucketForm');
// const activityCategorySelectEl = document.getElementById('activityCategory');
// bucketForm.addEventListener('submit', (event) => {
//     event.preventDefault(); // förhindrar att sidan laddas om
//     const activity = {
//         activityName: activityNameEl.value,
//         activityCategory: activityCategorySelectEl.value,
//     };
//     activities.push(activity);
//     console.log(activities);
//     // återståller formuläret
//     activityNameEl.value = "";
//     activityCategorySelectEl.value = "Resor";
// });








// Håller aktiviteter
let bucketList = [];

// Referenser till DOM-element
const bucketForm = document.getElementById('bucketForm');
const activityNameInput = document.getElementById('activityName');
const activityCategorySelect = document.getElementById('activityCategory');
const bucketListsContainer = document.getElementById('bucketLists');

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

    const activityList = document.createElement('ul');
    activities.forEach((activity, localIndex) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span style="text-decoration: ${activity.completed ? 'line-through' : 'none'};">
          ${activity.name}
        </span>
        <div>
          <button onclick="toggleComplete('${category}', ${localIndex})">${activity.completed ? 'Ångra' : 'Klar'}</button>
          <button onclick="removeActivity('${category}', ${localIndex})">Ta bort</button>
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
function toggleComplete(category, localIndex) {
  const activitiesInCategory = bucketList.filter(activity => activity.category === category);
  const globalIndex = bucketList.indexOf(activitiesInCategory[localIndex]);
  bucketList[globalIndex].completed = !bucketList[globalIndex].completed;
  renderBucketList();
}

// Funktion för att ta bort en aktivitet
function removeActivity(category, localIndex) {
  const activitiesInCategory = bucketList.filter(activity => activity.category === category);
  const globalIndex = bucketList.indexOf(activitiesInCategory[localIndex]);
  bucketList.splice(globalIndex, 1);
  renderBucketList();
}

// Eventlyssnare för att lägga till nya aktiviteter
bucketForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = activityNameInput.value.trim();
  const category = activityCategorySelect.value;

  if (name) {
    bucketList.push({ name, category, completed: false });
    activityNameInput.value = '';
    renderBucketList();
  }
});

// Rendera initial lista
renderBucketList();

