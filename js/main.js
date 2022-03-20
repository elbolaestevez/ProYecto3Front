
const firebaseConfig = {
  apiKey: "AIzaSyCfB41QVgMdlyejkgdK9R6xa66_5LPmgx4",
  authDomain: "prueba-web-3b003.firebaseapp.com",
  projectId: "prueba-web-3b003",
  storageBucket: "prueba-web-3b003.appspot.com",
  messagingSenderId: "28225104166",
  appId: "1:28225104166:web:ae07176f88fba92ec3b9e7"
}


////////////Firebase///////////////////////////////
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // db representa mi BBDD
const auth = firebase.auth();
const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

////crear usuario///////
document.getElementById("linkfavoritos").style.display = "none";
const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`);
      alert(`se ha registrado ${user.email} ID:${user.uid}`);
      // ...
      // Guarda El usuario en Firestore
      createUser({
        id: user.uid,
        email: user.email,
      });

      document.getElementById("form1").style.display = "none";
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("Error en el sistema" + errorMessage);
    });
};
//Cuando creas usuario hace esta comprobacion//
document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.pass.value;
  let pass2 = event.target.elements.pass2.value;
  function check(emailtxt, passtxt) {
    let reEmail = /[0-9a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+/;
    let rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (
      reEmail.test(emailtxt) === true &&
      rePass.test(passtxt) === true &&
      pass === pass2
    ) {
      signUpUser(email, pass);
    } else if (pass == 0 || pass2 == 0 || email == 0) {
      alert("No pueden quedar campos vacios");
    } else if (reEmail.test(emailtxt) === false) {
      alert("Email no válido. Debe contener un @ y un .");
    } else if (pass != pass2) {
      alert("Las contraseñas no coinciden");
    } else if (rePass.test(passtxt) === false) {
      alert(
        "la contraseña es demasiado débil. Debe contener un carácter minúsculo, otro mayúsculo, uno alfanumérico y un símbolo especial(*#$%&)"
      );
    }
  }
  check(email, pass);
  sessionStorage.setItem("usuario", email)


});
//Loguearse//
const signInUser = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`);
      sessionStorage.setItem("usuario", email)
      alert(`se ha logado ${user.email} ID:${user.uid}`);

    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
};

document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email2.value;
  let pass = event.target.elements.pass3.value;
  signInUser(email, pass);

})

///Cuando estas loguiado hace esto///
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("form1").style.display = "none";
    document.getElementById("form2").style.display = "none";
    document.getElementById("linkfavoritos").style.display = "block";
  }
})
// Desloguearse
const signOut = () => {
  let user = firebase.auth().currentUser;
  firebase.auth().signOut().then(() => {
    console.log("Sale del sistema: " + user.email)
    document.getElementById("linkfavoritos").style.display = "none";
    document.getElementById("form1").style.display = "block";
    document.getElementById("form2").style.display = "block";
  }).catch((error) => {
    console.log("hubo un error: " + error);
  });
}
document.getElementById("salir").addEventListener("click", signOut);

//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////





//declaro algunas variables globales//
let TodaslasCategorias = document.getElementById("categorias");
let TodoslosLibros = document.getElementById("libros");

//Primer Fetch
async function generarLibros() {
  let fetchlibros = await fetch(
    "https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=w45qEYAPypLD4KjKe3pgLxZN8pkvz1t2");
  let dataApi = await fetchlibros.json();
  return dataApi;
}
//Guardo la informacion en un array nuevo y luego los recorro para ir pintando
generarLibros().then(function (dataApi) {
  let results = dataApi.results;
  console.log(results);
  let categorias = results.map((categoria) => categoria.list_name);
  let olddates = results.map((olddate) => olddate.oldest_published_date);
  let newdates = results.map((newdate) => newdate.newest_published_date);
  let updates = results.map((update) => update.updated);
  let lists = results.map((list) => list.list_name_encoded);

  for (let i = 0; i < categorias.length; i++) {
    let h2 = document.createElement("h2");
    let p = document.createElement("p");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let boton = document.createElement("button");
    let divcaja = document.createElement("div");
    let article = document.createElement("article");
    //le asigno al boton el list con el array con los list_name_encoded//
    boton.categoriaencoded = lists[i];
    /// los innerHtml
    h2.innerHTML = `${categorias[i]}`;
    p.innerHTML = `Oldest:${olddates[i]}`;
    p1.innerHTML = `Newest:${newdates[i]}`;
    p2.innerHTML = `Updated:${updates[i]}`;
    boton.innerHTML = "read more";
    //los append
    divcaja.appendChild(h2);
    divcaja.appendChild(p);
    divcaja.appendChild(p1);
    divcaja.appendChild(p2);
    divcaja.appendChild(boton);
    divcaja.appendChild(article);
    TodaslasCategorias.appendChild(divcaja);
    //crear id para las distintas cajas//
    divcaja.id = "hijos";
    article.id = `some${i}`;
    boton.id = `btn${i}`;
    //blockiar el div//
     document.querySelector(`#some${i}`).style.display = "none";
    // Un addEvenlistener que al tocar el boton aparezca el div todos los libros y invoca a eventoclick
    document.getElementById(`btn${i}`).addEventListener("click", function (e) {
      document.getElementById(`some${i}`).style.display = "flex";
      TodoslosLibros.style.display = "flex"
      eventoClick(this.categoriaencoded, i);
    });
  }
});
//Segundo Fetch donde list tiene el valor de la categoria
async function generarbooks(categoriaencoded) {
  let fetchbooks = await fetch(`https://api.nytimes.com/svc/books/v3/lists/${categoriaencoded}.json?api-key=w45qEYAPypLD4KjKe3pgLxZN8pkvz1t2`);
  let dataApibook = await fetchbooks.json();
  console.log(dataApibook);
  return dataApibook;
}

function eventoClick(categoriaencoded, indice) {
  TodaslasCategorias.style.display = "none"
  generarbooks(categoriaencoded).then((resultado) => addBooksToPage(resultado, indice));

}

function addBooksToPage(resultado, indice) {
  let results = resultado.results.books;
  //crear boton para volver//
  let button_volver = document.createElement("button");
  button_volver.id = "volver"
  button_volver.innerHTML = "Volver atras";
  button_volver.onclick = () => {
    window.location.href = "./"

  }
  TodoslosLibros.appendChild(button_volver)

  for (let i = 0; i < results.length; i++) {
    let h2 = document.createElement("h2");
    let img = document.createElement("img");
    let p = document.createElement("p");
    let p1 = document.createElement("p");
    let button = document.createElement("button");
    let button_favoritos = document.createElement("button")
    let divcaja2 = document.createElement("div");
    button_favoritos.innerHTML = "favoritos"
    button_favoritos.onclick = () => {
      let emailusuario = sessionStorage.getItem("usuario")
      //let usuarioid=sessionStorage.getItem("id")
      //Creo un objeto con los datos a guardar
      let datos = {//id:usuarioid,
        usuario: emailusuario,
        titulo: results[i].title,
        imagen: results[i].book_image,
        amazon: results[i].amazon_product_url
      }
      guardarfavoritos(datos)
    }
    h2.innerHTML = ` ${results[i].rank}:${results[i].title}`
    img.setAttribute('src', `${results[i].book_image}`);
    p.innerHTML = results[i].description;
    p1.innerHTML = `Weeks on the list: ${results[i].weeks_on_list}`;
    button.innerHTML = "BUY AT AMAZON";
    button.onclick = () => { window.location.href = "results.html"; };
    // id para divcaja2//
    divcaja2.id = "nietos";
    //
    //button go back//


    ///

    divcaja2.appendChild(h2);
    divcaja2.appendChild(img)
    divcaja2.appendChild(p1)
    divcaja2.appendChild(p)
    divcaja2.appendChild(button)
    divcaja2.appendChild(button_favoritos)

    TodoslosLibros.appendChild(divcaja2)
  }
}
//esto guarda en una coleccion nueva llamada favoritos en firebase//
function guardarfavoritos(datoslibro) {
  db.collection("favoritos")
    .add(datoslibro)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));

}









