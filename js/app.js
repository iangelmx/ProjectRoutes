/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    // Cerrar Sesion 
    firebase.auth().signOut();
    location.reload();
  } else {
    var email = document.getElementById('emailLogin').value;
    var password = document.getElementById('passwordLogin').value;
    console.log(email);
    console.log(password);
    if (email.length < 4) {
      alert('Inserte un correo válido');
      return;
    }
    if (password.length < 4) {

        alert('Inserte una contraseña válida (mayor de 3 caracteres)')
      return;
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Contraseña incorrecta.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }
}
/*
 * Registrarse
 */
function handleSignUp() {
  var email = document.getElementById('emailRegistrar').value;
  var nombre = document.getElementById('nombreRegistrar').value;
  var password = document.getElementById('passwordRegistrar').value;
  if (email.length < 4) {
      alert('Inserte un correo válido');
      return;
    }
    if (nombre.length < 4) {
      alert('Inserte un nombre válido');
      return;
    }
    if (password.length < 4) {
      if(password.length == 0){
        alert('Inserte una contraseña');
      }else{
        alert('Inserte una contraseña válida (mayor de 3 caracteres)')
      }
      return;
    }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('Contraseña muy simple :C');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]
}

function sendPasswordReset() {
  var email = document.getElementById('emailReset').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Revisa tu correo!');
    location.reload();
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {

  $( "#formLogin" ).submit(function( event ) {
    console.log("IniciarSesion");
    event.preventDefault();
    toggleSignIn();
  });
  $( "#formReset" ).submit(function( event ) {
    console.log("RecuperarContraseña");
    event.preventDefault();
    sendPasswordReset();
  });
  $( "#formPerfil" ).submit(function( event ) {
    console.log("Salir");
    event.preventDefault();
    toggleSignIn();
  });
  $( "#formRegistrar" ).submit(function( event ) {
    console.log("Salir");
    event.preventDefault();
    handleSignUp();
  });

  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {

    
    if (user) {
      // User is signed in.
      if(document.getElementById('emailLogin').value == user.email)
        location.reload();
      var uid = user.uid;
      var correo = "";
      var level = 0;
      var nombre = "";
      console.log(JSON.stringify(user, null, '  '));

      var ref = firebase.database().ref("Users/"+uid);
      ref.once("value")
      .then(function(snapshot) {
    	var a = snapshot.exists();
      	if(a){
      		console.log("Esta en la base");
          nombre = snapshot.val().nombre;
          correo = snapshot.val().email;
          level = snapshot.val().tipo;
          var parts = location.pathname.split('/');
          if(level==1){
            if(parts[parts.length - 1] != 'operador.html'){
              document.location.href = '/operador.html'
            }
          }else{
            if(level==0){
              if(parts[parts.length - 1] != 'bus.html'){
                document.location.href = '/bus.html'
              }
            }
          }
      	}else{

          console.log("no esta en la base");
          var e = document.getElementById('selTipoUsuario');
          level = e.selectedIndex;
          nombre = document.getElementById('nombreRegistrar').value;
          if (nombre.length < 4) {
            nombre = "Default Name";
          }
          var email = user.email;
            firebase.database().ref('Users/' + uid).set({
              email: email,
              nombre: nombre,
              tipo: level
            });
           location.reload();
      	}  
        document.getElementById('modal-open').href = '#user-dialog';
        document.getElementById('user-nombre').innerHTML =nombre;
        document.getElementById('user-correo').innerHTML =correo;
      });

      
      
      // [END_EXCLUDE]
    }else{
      var parts = location.pathname.split('/');
      if(parts[parts.length - 1] == 'bus.html' || parts[parts.length - 1] == 'operador.html'){
        document.location.href = '/index.html'
      }
    } 
  });
}
window.onload = function() {
  initApp();
};