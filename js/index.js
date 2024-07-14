/// <reference types="../@types/jquery"/>





let rowData=document.getElementById('rowData');
const Categories=document.getElementById('Categories');
const Area=document.getElementById('Area');
const Ingredients=document.getElementById('Ingredients');
const Search=document.getElementById('Search');
const searchContainer=document.getElementById('searchContainer');
const ContactUs=document.getElementById('ContactUs')
const contact=document.getElementById('contact')




function openSideNav() {
    $(".side-nav").animate({left: 0 }, 500)


    $(".open").removeClass("fa-align-justify");
    $(".open").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({top: 0}, (i + 5) * 100)
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav .nav-tab").outerWidth()
    $(".side-nav").animate({ left: -boxWidth }, 500)

    $(".open").addClass("fa-align-justify");
    $(".open").removeClass("fa-x");


    $(".links li").animate({ top: 300 }, 500)
}

   

closeSideNav()
$(".side-nav .open").on('click',() => {
    if ($(".side-nav").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})



$(function () {
    
    getMeals("").then(() => {
        $(".loading-screen").fadeOut(500);
        $("body").css("overflow", "visible");

    });

});


///////////////////////////////////////////////////////
async function getMeals(meal) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    let data = await response.json();
    // console.log(data);
    displayMeals(data.meals);
  };

  
  async function displayMeals(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona;
}
async function getMealDetails(index) {
    closeSideNav()
   
    $(".loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${index}`);
    let data = await respone.json();
    console.log(data);

    displayMealDetails(data.meals[0])
    $(".loading-screen").fadeOut(300)

}

function displayMealDetails(meal) {
    searchContainer.innerHTML = "";
    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = cartoona
}
///////////////////////////////////////////////////////


  async function categories() {
        $(".loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let data = await response.json();
    DisplayCategories(data.categories);
    $(".loading-screen").fadeOut(300);
  };
  function DisplayCategories(arr) {
    let DisplayContainer = ``;
    for (let i = 0; i < arr.length; i++) {
      DisplayContainer += `
              <div class="col-md-3 g-4 py-2  cursor-ag "">
                <div onclick="categoriesMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-4">
                <img src="${arr[i].strCategoryThumb}" alt="item" clss="w-100"/>
                    <div  class="layer d-flex text-black flex-column justify-content-center align-items-center text-center position-absolute">
                    <h3>${arr[i].strCategory}</h3>
                    <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20) .join(" ")}</p>
                    </div>
                </div>
                </div>
                `;
    }
    rowData.innerHTML = DisplayContainer;
    searchContainer.innerHTML=''
    closeSideNav()
  }
  Categories.addEventListener("click", categories);

 async function categoriesMeals (category) {
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await response.json();
    displayMeals(data.meals.slice(0, 20));
    $(".loading-screen").fadeOut(300);
    closeSideNav();

  };

  //////////
  async function getIngredients() {
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)

    rowData.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let data = await respone.json()
    console.log(data.meals);

    displayIngredients(data.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)

  }
  function displayIngredients(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        
        cartoona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
        searchContainer.innerHTML=''
    }

    rowData.innerHTML = cartoona;
    closeSideNav();
}
////////////////////////////////////////
async function getIngredientsMeals (Ingredients) {
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredients}`);
    let data = await response.json();
    displayMeals(data.meals.slice(0, 20));
    $(".loading-screen").fadeOut(300);
    closeSideNav();

  };



Ingredients.addEventListener('click',getIngredients)



// ////////////////////////////////////////////////////////////

     async function getArea() {
        $(".loading-screen").fadeIn(300);
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    data = await respone.json();
    displayArea(data.meals);
    $(".loading-screen").fadeOut(300);

}



function displayArea(arr) {
    let cartoona = "";
  

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
    <div class="col-md-3">
                <div onclick="categoriesAera('${arr[i].strArea}')" class="meal position-relative overflow-hidden rounded-4">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>  
    </div>  
        `
        searchContainer.innerHTML=''
    };

 rowData.innerHTML=cartoona;
 closeSideNav();
};

Area.addEventListener('click',getArea);



async function categoriesAera(area) {
    $(".loading-screen").fadeIn(300)
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await response.json();
      displayMeals(data.meals);
    $(".loading-screen").fadeOut(300);
    closeSideNav();
};
////////////////////////////////////////////////



function showSearchInputs() {
  searchContainer.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`

  rowData.innerHTML = ""
  closeSideNav()
}
Search.addEventListener('click',showSearchInputs)


async function searchByName(term) {
  rowData.innerHTML=''
  $(".loading-screen").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
  let data = await response.json()

  data.meals ? displayMeals(data.meals) : displayMeals([])
  $(".loading-screen").fadeOut(300)
  closeSideNav()
}

async function searchByFLetter(term) {
  rowData.innerHTML=''
  $(".loading-screen").fadeIn(300)

  term == "" ? term = "a" : "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
  let data = await response.json()

  data.meals ? displayMeals(data.meals) : displayMeals([])
  $(".loading-screen").fadeOut(300)
  closeSideNav()
}



function clickContactUs() {
    let ContactUsContainer = `
   
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="NameContact" onkeyup =" nameValidation()"  type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="NameContactId" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="EmailContact" onkeyup =" emailValidation()"  type="email" class="form-control " placeholder="Enter Your Email">
                    <div id="EmailContactId" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid *exemple@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="NumberContact" onkeyup =" numberValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="NumberContactId" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageContact"  onkeyup =" ageValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                    <div id="ageContactId" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="PasswordContact" onkeyup =" passwordValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="PasswordContactId" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="RePasswordContact"    onkeyup =" repassedValidation()" onkeyup =" passwordValidation()" type="password" class="form-control " placeholder="Repassword">
                    <div id="RePasswordContactId" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid repassword 
                    </div>
                </div>
            </div>
            <button id="btnContact" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>

        </div>
    </div> 
    
  `;
    rowData.innerHTML = ContactUsContainer;
    closeSideNav();
  let NameContact =document.getElementById('NameContact')
  let NameContactId = document.getElementById("NameContactId");
  
  let EmailContactId = document.getElementById("EmailContactId");
  let EmailContact = document.getElementById("EmailContact");

  let NumberContactId = document.getElementById("NumberContactId");
  let NumberContact = document.getElementById("NumberContact");

  let ageContactId = document.getElementById("ageContactId");
  let ageContact = document.getElementById("ageContact");

  let PasswordContactId = document.getElementById("PasswordContactId");
  let PasswordContact = document.getElementById("PasswordContact");


  let RePasswordContact = document.getElementById("RePasswordContact");
  let RePasswordContactId = document.getElementById("RePasswordContactId");

  let btnContact = document.getElementById("btnContact");
 
}
ContactUs.addEventListener("click", clickContactUs);


  
  ContactUs.addEventListener("click", clickContactUs);
  

  function nameValidation() {
    if (/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/.test(document.getElementById("NameContact").value)) {
     
      NameContact.classList.add("is-valid");
      NameContact.classList.remove("is-invalid");
            NameContactId.classList.replace("d-block", "d-none")
    } else {
      NameContact.classList.add("is-invalid");
      NameContact.classList.remove("is-valid");
      NameContactId.classList.replace("d-none", "d-block")
    }
  }
  
  function emailValidation() {
    if (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test( document.getElementById("EmailContact").value )
    ) {
    
      EmailContact.classList.add("is-valid");
      EmailContact.classList.remove("is-invalid");

      EmailContactId.classList.replace("d-block", "d-none")
    } else {
      EmailContact.classList.add("is-invalid");
      EmailContact.classList.remove("is-valid");
      EmailContactId.classList.replace("d-none", "d-block")
    }
    return;
  }
  
  function numberValidation() {
    if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test( document.getElementById("NumberContact").value )

        
    ) {
       NumberContact.classList.add("is-valid");
      NumberContact.classList.remove("is-invalid");
      NumberContactId.classList.replace("d-block", "d-none")
    } else {
    
      NumberContact.classList.add("is-invalid");
      NumberContact.classList.remove("is-valid");     
      NumberContactId.classList.replace("d-none", "d-block")
    }
    return;
  }
  
  function ageValidation() {
    if (
        /^(1[89]|[2-9]\d)$/.test(
        document.getElementById("ageContact").value
      )
    ) {
     
      ageContact.classList.add("is-valid");
      ageContact.classList.remove("is-invalid");

      ageContactId.classList.replace("d-block", "d-none")
    } else {

      
      ageContact.classList.add("is-invalid");
      ageContact.classList.remove("is-valid");
  
      ageContactId.classList.replace("d-none", "d-block")
    }
  }

  function passwordValidation() {
    if (
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
        document.getElementById("PasswordContact").value
      )
    ) {
   


      PasswordContact.classList.add("is-valid");
      PasswordContact.classList.remove("is-invalid");
      PasswordContactId.classList.replace("d-block", "d-none")
    } else {
      PasswordContact.classList.add("is-invalid");
      PasswordContact.classList.remove("is-valid");
      PasswordContactId.classList.replace("d-none", "d-block")
    }
  }
  
  function repassedValidation() {
    if (
      document.getElementById("PasswordContact").value ==
      document.getElementById("RePasswordContact").value
    ) {
      RePasswordContact.classList.add("is-valid");
      RePasswordContact.classList.remove("is-invalid");

        RePasswordContactId.classList.replace("d-block", "d-none")

    } else {
        RePasswordContactId.classList.replace("d-none", "d-block")
        RePasswordContact.classList.add("is-invalid");
        RePasswordContact.classList.remove("is-valid");
  
    }
    mainContactUs();
  }
  function mainContactUs() {
    if (
      NameContact.classList.contains("is-valid") &&
      EmailContact.classList.contains("is-valid") &&
      NumberContact.classList.contains("is-valid") &&
      ageContact.classList.contains("is-valid") &&
      PasswordContact.classList.contains("is-valid") &&
      RePasswordContact.classList.contains("is-valid")
    ) {
      btnContact.classList.remove("disabled");
    } else {
      btnContact.classList.add("disabled");
    }
  }
