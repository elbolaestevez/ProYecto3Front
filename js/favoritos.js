const firebaseConfig = {
    apiKey: "AIzaSyCfB41QVgMdlyejkgdK9R6xa66_5LPmgx4",
    authDomain: "prueba-web-3b003.firebaseapp.com",
    projectId: "prueba-web-3b003",
    storageBucket: "prueba-web-3b003.appspot.com",
    messagingSenderId: "28225104166",
    appId: "1:28225104166:web:ae07176f88fba92ec3b9e7"
}
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();// db representa mi BBDD
let emailusuario = sessionStorage.getItem("usuario")
linkamazon = [];
imagenlibro = [];
titulolibro = []

async function recuperarDatos() {
    await db.collection("favoritos")
        .where("usuario", "==", emailusuario)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                linkamazon.push(doc.data().amazon);
                imagenlibro.push(doc.data().imagen);
                titulolibro.push(doc.data().titulo);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}
recuperarDatos().then(() => {
    let favoritosdiv = document.getElementById("fav");
    for (let i = 0; i < linkamazon.length; i++) {
        let h2 = document.createElement("h2");
        let img = document.createElement("img");
        let button = document.createElement("button");
        //let button_eliminarFav = document.createElement("button");

        h2.innerHTML = `${titulolibro[i]}`;
        img.setAttribute('src', `${imagenlibro[i]}`);
        button.innerHTML = "BUY AT AMAZON";
        //button_eliminarFav.innerHTML = "Eliminar de Favoritos";
        button.onclick = () => { window.location.href = linkamazon[i] };
        //button_eliminarFav.onclick = borrarfavorito(titulolibro[i])
        favoritosdiv.appendChild(h2);
        favoritosdiv.appendChild(img);
        favoritosdiv.appendChild(button);
        //favoritosdiv.appendChild(button_eliminarFav)



    }
});

    
 //intentos para borrar favoritos
// async function borrarfavorito(titulolibro) {
//     console.log(titulolibro);
//     let query = await db.collection('favoritos')
//         .where("titulo", "==", titulolibro);
//     query.get().then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//             doc.ref.delete();
//         })
// }).catch(function (error) {
//         console.log("ERROR", error);
//     })
// };