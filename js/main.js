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
    const db = firebase.firestore();// db representa mi BBDD
    const createUser = (user) => {
        db.collection("users")
            .add(user)
            .then((docRef) => console.log("Document written with ID: ", docRef.id))
            .catch((error) => console.error("Error adding document: ", error));
        };

////crear usuario///////
const signUpUser = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        console.log(`se ha registrado ${user.email} ID:${user.uid}`)
        alert(`se ha registrado ${user.email} ID:${user.uid}`)
        // ...
        // Guarda El usuario en Firestore
        createUser({
          id:user.uid,
          email:user.email
        });

        document.getElementById("form1").style.display = "none";
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("Error en el sistema"+errorMessage);
      });
  };
  //"alex@demo.com","123456"
  document.getElementById("form1").addEventListener("submit",function(event){
      event.preventDefault();
      let email = event.target.elements.email.value;
      let pass = event.target.elements.pass.value;
      let pass2 = event.target.elements.pass2.value;
      function check(emailtxt,passtxt){
        let reEmail = /[0-9a-zA-Z]/
        let rePass = /[0-9a-zA-Z]/
        
        if(reEmail.test(emailtxt) === true && rePass.test(passtxt) === true && pass===pass2){
          signUpUser(email,pass)
        } else if (pass == 0 || pass2 == 0 || email == 0) {
          alert("No pueden quedar campos vacios");
        }else if(reEmail.test(emailtxt) === false){
          alert("Email no válido. Debe contener un @ y un .")
        } else if(pass != pass2){
          alert("Las contraseñas no coinciden")
        } else if(rePass.test(passtxt) === false){
          alert("la contraseña es demasiado débil. Debe contener un carácter minúsculo, otro mayúsculo, uno alfanumérico y un símbolo especial(*#$%&)")
        }
      }
      check(email,pass);
    })
//////////////////////////////////////////////////////////////
async function generarLibros() {
    let fetchlibros = await fetch("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=w45qEYAPypLD4KjKe3pgLxZN8pkvz1t2")
    let dataApi = await fetchlibros.json()
    return dataApi
}
generarLibros().then(function(dataApi) {
    let results = dataApi.results;
    let categorias = results.map(categoria => categoria.list_name);
    let olddates = results.map(olddate => olddate.oldest_published_date);
    let newdates = results.map(newdate => newdate.newest_published_date);
    let updates = results.map(update => update.updated);
    let botondiv = document.getElementById("categorias");
    for (let i = 0; i < categorias.length; i++) {
        let h2 = document.createElement("h2");
        let p = document.createElement("p");
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        let boton = document.createElement("button");
        boton.categoria = categorias[i]
        let dives = document.createElement("article")
        h2.innerHTML = categorias[i];
        p.innerHTML = olddates[i];
        p1.innerHTML = newdates[i];
        p2.innerHTML = updates[i]
        boton.innerHTML = "read more"
        //dives.innerHTML = "hola"
        botondiv.appendChild(h2)
        botondiv.appendChild(p)
        botondiv.appendChild(p1)
        botondiv.appendChild(p2)
        botondiv.appendChild(boton)
        botondiv.appendChild(dives)
            //crear id//
        dives.id = `some${i}`
        boton.id = `btn${i}`
            //blockiar el div//
        document.querySelector(`#some${i}`).style.display = "none";
        //categorias.push(categorias1[i])
        //let button = document.getElementById(`label${i}`);
        //button.innerHTML =categorias1[i] ;
        ///hacer aparecer un div por cada boton clickeado///
        document.getElementById(`btn${i}`).addEventListener("click", function(e) {
            document.getElementById(`some${i}`).style.display = "flex"
            eventoClick(this.categoria);
         })
    }
})
async function generarbooks() {
    let fetchbooks = await fetch("https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=w45qEYAPypLD4KjKe3pgLxZN8pkvz1t2")
    let dataApibook = await fetchbooks.json()
    return dataApibook
}
function eventoClick(categoria) {
    generarbooks().then(function (dataApibook) {
      let results = dataApibook.results;
      let lista = results.lists;
      lista.forEach((element, i) => {
        if (element.list_name == categoria) {
          let books = element.books;
          books.forEach((book) => {
              console.log(book)
              let h2 = document.createElement("h2");
              let img = document.createElement("img");
              let p = document.createElement("p");
              let p1 = document.createElement("p");
              let button=document.createElement("button");
              //innerhtml///
              h2.innerHTML = book.title
              img.setAttribute('src', `${book.book_image}`);
              p.innerHTML = book.description;
              p1.innerHTML = book.weeks_on_list;
              button.innerHTML = "BUY AT AMAZON";
              button.onclick = () => { window.location.href = book.amazon_product_url };
              //let text = document.createTextNode(`${book.title}`);
              //divs.appendChild(text);
              let divs = document.getElementById(`some${i}`);
              divs.appendChild(h2)
              divs.appendChild(img)
              divs.appendChild(p1)
              divs.appendChild(p)
              divs.appendChild(button)
          });
        }
      });
    });
  }
