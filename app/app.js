(function () {
	'use strict'
	  var config = {
	    apiKey: "AIzaSyCZQ3tqY-Paf75tPT1HCw9dkXbPBqXXBWU",
	    authDomain: "proyectoejemplo-3af46.firebaseapp.com",
	    databaseURL: "https://proyectoejemplo-3af46.firebaseio.com",
	    projectId: "proyectoejemplo-3af46",
	    storageBucket: "proyectoejemplo-3af46.appspot.com",
	    messagingSenderId: "1097242752836"
	  };

	firebase.initializeApp(config);


	var app = firebase.database();
	var app = angular.module("sistramint", ["firebase"]);

	var nickname = "";  //Variable de caracter global con el username del cliente
	var correoe = ""; // Variable de caracter global con el e-mail del cliente

	var controladorRappier = function($scope, $firebaseArray){
		var referencia = firebase.database().ref().child('Pedidos');
		$scope.pedidosEnTransito = $firebaseArray(referencia);

		var refe = firebase.database().ref().child('PedidosEntregados');
		$scope.productosEntregados = $firebaseArray(refe);

		$scope.entregar = function(auxiliar){

			console.log(auxiliar);
			referencia.child(auxiliar.$id).set({
				email : auxiliar.email,
				direccion : auxiliar.direccion,
				nombre_cliente : auxiliar.nombre_cliente,
				num_pedido : $scope.pedidosEnTransito.length + 1,
				fecha : auxiliar.fecha,
				total : auxiliar.total,
			    status : "Entregado al Cliente.",
			    descripcion : auxiliar.descripcion,
			    cantidad : auxiliar.cantidad
		  	});
		
			var newPedidoEntregado = refe.push();
			newPedidoEntregado.set({
				email : auxiliar.email,
				direccion : auxiliar.direccion,
				nombre_cliente : auxiliar.nombre_cliente,
				num_pedido : $scope.productosEntregados.length + 1,
				fecha : auxiliar.fecha,
				total : auxiliar.total,
			    status : "Entregado al Cliente.",
			    descripcion : auxiliar.descripcion,
			    cantidad : auxiliar.cantidad
		  	});
		  	firebase.database().ref().child('Pedidos').child(auxiliar.$id).remove();
    	};
    	

    	$scope.validaTransito = function(auxiliar){
    		if(auxiliar.status=="En vía a su destino..."){
    			return true;
    		}
    		else{
    			return false;
    		}
    	}

	};

	app.controller("controladorRappier",controladorRappier);


	var misPedidos = function($scope, $firebaseArray){
		var refe=firebase.database().ref().child('Pedidos');
		$scope.misprods = $firebaseArray(refe);

		var otroref = firebase.database().ref().child('PedidosEntregados');
		$scope.misprodsEntregados = $firebaseArray(otroref);

		$scope.mispedidosEnTransito = $firebaseArray(refe);

		$scope.muestraStatus=function(){
			console.log("El usuario iniciado es: ", correoe);
		}

		$scope.getMisPedidosRecibidos = function(auxiliar){
			if(auxiliar.email == correoe && auxiliar.status == "Recibido"){
				return true;
			}
			else{
				return false;
			}
		}
		$scope.getMisPedidosEnTransito = function(auxiliar){
			if(auxiliar.email == correoe && auxiliar.status == "En vía a su destino..."){
				return true;
			}
			else{
				return false;
			}
		}
		$scope.getMisPedidosEntregados = function(auxiliar){
			if(auxiliar.email == correoe){
				return true;
			}
			else{
				return false;
			}
		}

	}

	app.controller("misPedidos",misPedidos);


	var sesiones = function($scope){
		var bandera=0;

		console.log("Inició sesión");
		$scope.estado="Inicia Sesión";
		$scope.signInWithGoogle=function(){
		if(bandera==0){
		    var provider = new firebase.auth.GoogleAuthProvider();
		        provider.addScope('https://www.googleapis.com/auth/plus.login');
		        provider.addScope('profile');
		        provider.addScope('email');
		        firebase.auth().signInWithPopup(provider).then(function(result) {
		      // This gives you a Google Access Token. You can use it to access the Google API.
		      var token = result.credential.accessToken;
		      // The signed-in user info.
		      var user = result.user;
		      console.log("Usuario -> ", user.displayName);
		      console.log("Correo -> ", user.email);

		      document.getElementById('status').innerHTML =
		        'Hola <b>' + user.displayName + '</b>!';

		        $scope.estado = user.displayName;
				nickname = user.displayName;
				correoe=user.email;
				bandera=1;	        

				alert("Has iniciado sesión correctamente "+ user.displayName);

		        //document.getElementById('status').disabled=true;
		      // ...
		    }).catch(function(error) {
		      // Handle Errors here.
		      var errorCode = error.code;
		      var errorMessage = error.message;
		      // The email of the user's account used.
		      var email = error.email;
		      // The firebase.auth.AuthCredential type that was used.
		      var credential = error.credential;
		      // ...
		    });
		}

		/*var app = angular.module('MyApp', ["ngStorage"])
        app.controller('MyController', function ($scope, $localStorage, $sessionStorage, $window) {
            $scope.Save = function () {
                $localStorage.LocalMessage = $scope.save;
                $sessionStorage.SessionMessage = "mi nombre es sesion";
            }
            $scope.Get = function () {
                $window.alert($localStorage.LocalMessage + "\n" + $sessionStorage.SessionMessage);
            }
        });*/

		//document.getElementById('ocultoMisPedidos').style.display = 'block';
	  }
	

	  $scope.logoutGoogle=function(){
		    firebase.auth().signOut().then(function() {
		      document.getElementById('status').innerHTML = '<b>Inicia sesión</b>';
		      $scope.usernameG="Inicia sesión";
		      console.log("Se ha cerrado la sesión");// Sign-out successful.
		      bandera=0;
		      nickname="";
		      alert("Se ha cerrado tu sesión de Google");
		  }, function(error) {
		    console.log(error);
		    // An error happened.
		  });
		  //document.getElementById('ocultoMisPedidos').style.display = 'none';
	   }

	   $scope.loginFB = function(){
		var provider = new firebase.auth.FacebookAuthProvider();
		//firebase.auth().signInWithRedirect(provider);
		provider.addScope('user_birthday');
		firebase.auth().signInWithPopup(provider).then(function(result) {
		  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
		  var token = result.credential.accessToken;
		  // The signed-in user info.
		  var user = result.user;
		  console.log(result.user);
		  // ...
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  // ...
		});
	}

	$scope.logoutFB = function(){
			firebase.auth().signOut().then(function() {
				console.log("Desconectado de FB");
		  // Sign-out successful.
				},function(error) {
				console.log(error);
		  // An error happened.
				}
			);
		};

	}
	app.controller("sesiones", sesiones);

	
	var controllPedidos = function($scope, $firebaseArray){
		var refe = firebase.database().ref().child('Pedidos');
		$scope.pedidos = $firebaseArray(refe);

		/*$scope.despachar = function() {

			var newProduct = refe.push();
			newProduct.set({
		    Nombre: $scope.NombreProduc,
		    descrp: $scope.DescripProduc,
		    existencias: $scope.existenciasProduc,
		    id: $scope.productos.length + 300,
		    img: $scope.urlProduc,
		    precio: $scope.precioProduc
		  });
    	};*/

    	$scope.cambiaStatus = function(auxiliar){

			console.log(auxiliar);
			refe.child(auxiliar.$id).set({
			email : auxiliar.email,
			direccion : auxiliar.direccion,
			nombre_cliente : auxiliar.nombre_cliente,
			num_pedido : $scope.pedidos.length + 1,
			fecha : auxiliar.fecha,
			total : auxiliar.total,
		    status : "En vía a su destino...",
		    descripcion : auxiliar.descripcion
		  	});
			
			//var referencia = firebase.database().ref().child('Boda').child(auxiliar.$id).remove();
    	};
	}
	app.controller("controlPedidos", controllPedidos);



	var controlladorBoda = function($scope, $firebaseArray){
		var refe = firebase.database().ref().child('Boda');
		$scope.productos = $firebaseArray(refe);

		var refp = firebase.database().ref().child('Pedidos');
		$scope.pedidos = $firebaseArray(refp);
		$scope.addPedido = function(auxiliar){
			//console.log($scope.Nombre);
			var newpedido = refp.push();
			newpedido.set({
			email : correoe,
			direccion : "Pago por entrega.",
			nombre_cliente : nickname,
			num_pedido : $scope.pedidos.length + 1,
			fecha : "16/06/17",
			total : auxiliar.precio,
		    status : "Recibido",
		    descripcion : auxiliar.Nombre,
		  	});
		  	alert("Recuerda que debes haber iniciado sesión para comprar, sino, no se hará el pedido.");
		};

		$scope.eliminarProducto = function(auxiliar){
			//console.log($scope.Nombre);
			console.log(auxiliar);
			var referencia = firebase.database().ref().child('Boda').child(auxiliar.$id).remove();
		};

		$scope.editaProducto = function(auxiliar){
			//var refer = 
			refe.child(auxiliar.$id).set({
		    Nombre: $scope.NombreProduc1,
		    descrp: $scope.DescripProduc1,
		    existencias: $scope.existenciasProduc1,
		    id: $scope.productos.length + 100,
		    img: $scope.urlProduc1,
		    precio: $scope.precioProduc1
		  });
		}


	};
	
	app.controller("testCtrl", controlladorBoda);

	var controlladorPushBoda = function($scope, $firebaseArray){
		var refe = firebase.database().ref().child('Boda');
		$scope.productos = $firebaseArray(refe);
		$scope.myFunc = function() {

			var newProduct = refe.push();
			newProduct.set({
		    Nombre: $scope.NombreProduc,
		    descrp: $scope.DescripProduc,
		    existencias: $scope.existenciasProduc,
		    id: $scope.productos.length + 100,
		    img: $scope.urlProduc,
		    precio: $scope.precioProduc
		  });
    	};
	};
	
	app.controller("pushPrueba", controlladorPushBoda);

	var ControlladorQuinceAnios = function($scope, $firebaseArray){
        var ref = firebase.database().ref().child('Quinceaños');
        $scope.productos = $firebaseArray(ref);
        console.log($scope.productos);

        $scope.eliminarProducto = function(auxiliar){
			//console.log($scope.Nombre);
			console.log(auxiliar);
			var referencia = firebase.database().ref().child('Quinceaños').child(auxiliar.$id).remove();
		};

		$scope.editaProducto = function(auxiliar){
			//var refer = 
			refe.child(auxiliar.$id).set({
		    Nombre: $scope.NombreProduc1,
		    descrp: $scope.DescripProduc1,
		    existencias: $scope.existenciasProduc1,
		    id: $scope.productos.length + 100,
		    img: $scope.urlProduc1,
		    precio: $scope.precioProduc1
		  });
		}

		var refp = firebase.database().ref().child('Pedidos');
		$scope.pedidos = $firebaseArray(refp);
		$scope.addPedido = function(auxiliar){
			//console.log($scope.Nombre);
			var newpedido = refp.push();
			newpedido.set({
			email : correoe,
			direccion : "Pago por entrega.",
			nombre_cliente : nickname,
			num_pedido : $scope.pedidos.length + 1,
			fecha : "16/06/17",
			total : auxiliar.precio,
		    status : "Recibido",
		    descripcion : auxiliar.Nombre
		  	});
		};


      };

    app.controller("ControlladorQuinceAnios", ControlladorQuinceAnios);

    var controlladorPushQuineAnios = function($scope, $firebaseArray){
		var refe = firebase.database().ref().child('Quinceaños');
		$scope.productos = $firebaseArray(refe);
		$scope.myFunc = function() {

			var newProduct = refe.push();
			newProduct.set({
		    Nombre: $scope.NombreProduc,
		    descrp: $scope.DescripProduc,
		    existencias: $scope.existenciasProduc,
		    id: $scope.productos.length + 200,
		    img: $scope.urlProduc,
		    precio: $scope.precioProduc
		  });
    	};
	};
	
	app.controller("pushQuinceAnios", controlladorPushQuineAnios);



    var ControlladorGraduación = function($scope, $firebaseArray){
        var ref = firebase.database().ref().child('Graduación');
        $scope.productos = $firebaseArray(ref);
        console.log($scope.productos);

        $scope.eliminarProducto = function(auxiliar){
			//console.log($scope.Nombre);
			console.log(auxiliar);
			var referencia = firebase.database().ref().child('Graduación').child(auxiliar.$id).remove();
		};

		var refp = firebase.database().ref().child('Pedidos');
		$scope.pedidos = $firebaseArray(refp);
		$scope.addPedido = function(auxiliar){
			//console.log($scope.Nombre);
			var newpedido = refp.push();
			newpedido.set({
			email : correoe,
			direccion : "Pago por entrega.",
			nombre_cliente : nickname,
			num_pedido : $scope.pedidos.length + 1,
			fecha : "16/06/17",
			total : auxiliar.precio,
		    status : "Recibido",
		    descripcion : auxiliar.Nombre
		  	});
		};

		$scope.editaProducto = function(auxiliar){
			//var refer = 
			refe.child(auxiliar.$id).set({
		    Nombre: $scope.NombreProduc1,
		    descrp: $scope.DescripProduc1,
		    existencias: $scope.existenciasProduc1,
		    id: $scope.productos.length + 100,
		    img: $scope.urlProduc1,
		    precio: $scope.precioProduc1
		  });
		}

      };

    app.controller("ControlladorGraduación", ControlladorGraduación);

    var controlladorPushGraduacion = function($scope, $firebaseArray){
		var refe = firebase.database().ref().child('Graduación');
		$scope.productos = $firebaseArray(refe);
		$scope.myFunc = function() {

			var newProduct = refe.push();
			newProduct.set({
		    Nombre: $scope.NombreProduc,
		    descrp: $scope.DescripProduc,
		    existencias: $scope.existenciasProduc,
		    id: $scope.productos.length + 300,
		    img: $scope.urlProduc,
		    precio: $scope.precioProduc
		  });
    	};

    	
	};
	
	app.controller("pushGraduacion", controlladorPushQuineAnios);




    var ControlladorCumple = function($scope, $firebaseArray){
        var ref = firebase.database().ref().child('Cumpleaños');
        $scope.productos = $firebaseArray(ref);
        console.log($scope.productos);

        $scope.eliminarProducto = function(auxiliar){
			//console.log($scope.Nombre);
			console.log(auxiliar);
			var referencia = firebase.database().ref().child('Cumpleaños').child(auxiliar.$id).remove();
		};

		$scope.editaProducto = function(auxiliar){
			//var refer = 
			refe.child(auxiliar.$id).set({
		    Nombre: $scope.NombreProduc1,
		    descrp: $scope.DescripProduc1,
		    existencias: $scope.existenciasProduc1,
		    id: $scope.productos.length + 100,
		    img: $scope.urlProduc1,
		    precio: $scope.precioProduc1
		  });
		}

		var refp = firebase.database().ref().child('Pedidos');
		$scope.pedidos = $firebaseArray(refp);
		$scope.addPedido = function(auxiliar){
			//console.log($scope.Nombre);
			var newpedido = refp.push();
			newpedido.set({
			email : correoe,
			direccion : "Pago por entrega.",
			nombre_cliente : nickname,
			num_pedido : $scope.pedidos.length + 1,
			fecha : "16/06/17",
			total : auxiliar.precio,
		    status : "Recibido",
		    descripcion : auxiliar.Nombre
		  	});
		};

      };



    app.controller("ControlladorCumple", ControlladorCumple);

    var controlladorPushCumple = function($scope, $firebaseArray){
		var refe = firebase.database().ref().child('Cumpleaños');
		$scope.productos = $firebaseArray(refe);
		$scope.myFunc = function() {

			var newProduct = refe.push();
			newProduct.set({
		    Nombre: $scope.NombreProduc,
		    descrp: $scope.DescripProduc,
		    existencias: $scope.existenciasProduc,
		    id: $scope.productos.length + 300,
		    img: $scope.urlProduc,
		    precio: $scope.precioProduc
		  });
    	};
	};
	
	app.controller("pushCumple", controlladorPushCumple);





    var SampleCtrl= function($scope, $firebaseAuth) {
	  var auth = $firebaseAuth();

	  // login with Facebook
	  auth.$signInWithPopup("facebook").then(function(firebaseUser) {
	    console.log("Signed in as:", firebaseUser.uid);
	  }).catch(function(error) {
	    console.log("Authentication failed:", error);
	  });
	}

	app.controller("SampleCtrl", SampleCtrl);

	

/*
	var database = firebase.database();
	var ref = database.ref('Categoria');

	ref.on('value', function(ss){
		var valor = ss.val()
		/*document.getElementById('Nombre').innerHTML*/
		/*document.getElementById('NombreProducto').innerHTML = valor.Boda.Gatito.Nombre;
		document.getElementById('descripcion').innerHTML = valor.Boda.Gatito.descrp;

	});
*/



}());