// Iniciamos variables, i, contador para moverse entre cajitas,
// cuantos, cuantas cajitas hay, -1 porque empieza en 0 y termina

var i,
	cuantos,
	empieza,
	termina,
	ultimaactualizacion,
	loop;
			
////////////// SLIDEMiMuevetepacaypalláelporculoquemedas ////////////////////
		
// función que inicia el slide, hay un css que pone display none, todos los .slideme,
// enmarcha() visibiliza la primera
// se toman valores para las flechitas movedizas y en flechitas también, 
// para que se recoloquen con el cambio de slide
// y se posiciona el tema para arriba en caso de que estés un poco abajo

function enmarcha() {
	i = 0;
	cuantos = $('.slideme').size() - 1;
	$($('.slideme')[0]).fadeIn();
	// tomamos la medida top de col2 y la medida donde termina col2
	empieza = $('.col2').offset();
	termina = $('.col2').height() + empieza.top - 20;
}

// función que se ejecuta cuando se pulsa sobre una flecha palante
// se esconden todos
// si i es igual a cuantos se ha llegado al final y se empieza por el principio
// en caso contrario se suma una, y se pasa a la siguiente

function pasitopalante() {
	$('.slideme').hide();
	if ( i == cuantos ) {
		i = 0;
	}
	else {
		i = ++i;
	}
	$($('.slideme')[i]).fadeIn();
	empieza = $('.col2').offset();
	termina = $('.col2').height() + empieza.top - 20;
	$("html, body").animate({
		scrollTop: $('.col').offset().top  
	}, 1500);   
}

// función que se ejecuta cuando se pulsa sobre una flecha para atrás
// si i vale 0 sólo se puede retroceder a la última, i vale cuantos
// en caso contrario se resta uno a i y se muestra la anterior.

function pasitopatras() {
	$('.slideme').hide();
	if ( i == 0 ) {
		i = cuantos;
	}
	else {
		i = --i;
	}
	$($('.slideme')[i]).fadeIn();
	empieza = $('.col2').offset();
	termina = $('.col2').height() + empieza.top - 20;
	$("html, body").animate({
		scrollTop: $('.col').offset().top  
	}, 1500);   
}
			
////// FIN SLIDEMi ///////////////////////
			

/////////////// FLECHITAS MOVEDIZAS //////////////////////

// en caso de que el navegador sufre cambios en sus medidas en caliente,
// se toman de nuevo medidas y se recoloca flechita en caso
// de que ya estuviera moviéndose y que no quede en la conchinchina.	

$(window).resize(function() {
	empieza = $('.col2').offset();
	termina = $('.col2').height() + empieza.top - 20;
	muevebienelfollete();
});
			

// Escuchando el scroll, si top llega a col2, flechitas fixed, si pasas col2, flechitas normales

$(window).scroll(function() {
	muevebienelfollete();
});
			
function muevebienelfollete() {
	if($(this).scrollTop() > (empieza.top) && $(this).scrollTop() < (termina)) {
		$('.col2').css('margin-left', '5%');
		$('.flechita1').css({'position': 'fixed', 'top': 0});
		$('.flechita2').css({'position': 'fixed', 'top': 0, 'right': 0});
	}
	else {
		$('.col2').css('margin-left', 0);
		$('.flechita1, .flechita2').css({'position': 'static', 'top': empieza.top });
	}
					
}

////////////////////// FIN FLECHITAS MOVEDIZAS ///////////////////////////////////////



////////////////// FUNCIÓN AJAX QUE COMPRUEBA ACTUALIZACIONES ///////////////////////

function actualizaMisiones(coneltiempodentro){
	$.ajax({
		dataType: 'json',
		type: 'POST',
		cache: false,
		url: 'AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII',
		data: { f: coneltiempodentro }
	}).done( function(queviene) {
		if (queviene != 1) {
			$('#contador').text(queviene.length).fadeIn();
			var laurtima = queviene.length - 1;
			$.each( queviene, function(i,item) {
				if (i == laurtima) {
					ultimaactualizacion = item.f.replace(/-/g, '');
					ultimaactualizacion = ultimaactualizacion.replace(' ', '');
					ultimaactualizacion = ultimaactualizacion.replace(/:/g, '');
				}
				var s1 = item.f.split(' ');
				var s2 = s1[0].split('-');
				var cuando = s2[2] +'.'+ s2[1] +'.'+ s2[0];
				var mision = '<div class="slideme"><div class="titular">'+ item.t +'</div><div class="cuerpo">'+ item.p +'<div class="rowg"></div><div class="derecha margenbot2"><div class="fecha">'+ cuando +'</div></div></div></div>';
				$('.col2').prepend(mision);
			});
			$('.slideme').hide();
			enmarcha();
			
			var notification = cordova.require("cordova/plugin/localNotification")
			notification.add({
				id: 1,
				date: new Date(),
				message: "Cuelgame",
				subtitle: "nueva misión",
				ticker: "Cuelgame · nueva misión",
				repeatDaily: false
			});
		}
	});
}


////////////////// FUNCIÓN AJAX QUE TRAE MISIONES ///////////////////////////////////			

function traerMisiones() {
	$.ajax({
		dataType: 'json',
		url: 'AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII',
		cache: false,
		beforeSend: function() {
			$('#cargando').html('<div class="titular"><div class="blink">Buscando misiones</div></div><div class="cuerpo"><img src="img/cargando.gif" /></div>').show();
		}
	}).done( function(devuelta) {
		$('#cargando').hide();
		if (devuelta == 1) {
			$('#cargando').html('<div class="titular">Oiga ¿es ahí la misión?</div><div class="cuerpo"><img src="img/db.png" /> No se pudo conectar a la bd<div class="margenbot"><button class="recarga" onclick="traerMisiones();">Recargar <i class="reload"></i></button></div></div>').fadeIn();
		}
		else if (devuelta == 2) {
			$('#cargando').html('<div class="titular">Oiga ¿es ahí la misión?</div><div class="cuerpo"><img src="img/db.png" /> No se pudo ejecutar SQL<div class="margenbot"><button class="recarga" onclick="traerMisiones();">Recargar <i class="reload"></i></button></div></div>').fadeIn();
		}
		else if ( devuelta == 3) {
			$('#cargando').html('<div class="titular">Oiga ¿es ahí la misión?</div><div class="cuerpo"><img src="img/comet.png" /> Aún no hay<div class="margenbot"><button class="recarga" onclick="traerMisiones();">Recargar <i class="reload"></i></button></div></div>').fadeIn();
		}
		else {
			$.each( devuelta, function(i,item) {
				if (i == 0) {
					ultimaactualizacion = item.f.replace(/-/g, '');
					ultimaactualizacion = ultimaactualizacion.replace(' ', '');
					ultimaactualizacion = ultimaactualizacion.replace(/:/g, '');
				}
				var s1 = item.f.split(' ');
				var s2 = s1[0].split('-');
				var cuando = s2[2] +'.'+ s2[1] +'.'+ s2[0];
				var mision = '<div class="slideme"><div class="titular">'+ item.t +'</div><div class="cuerpo">'+ item.p +'<div class="rowg"></div><div class="derecha margenbot2"><div class="fecha">'+ cuando +'</div></div></div></div>';
				$('.col2').append(mision);
			});
			enmarcha();
			loop = setInterval(function(){ actualizaMisiones(ultimaactualizacion); }, 18000000);

			
			
		}
	}).fail( function() {
		$('#cargando').hide();
		$('#cargando').html('<div class="titular">Oiga ¿es ahí el internet?</div><div class="cuerpo"><img src="img/wifi.png" /> No está<div class="margenbot"><button class="recarga" onclick="traerMisiones();">Recargar <i class="reload"></i></button></div></div>').fadeIn();
	});
}	


////////////// Función que carga secciones de la agenda ////

function traerNumeros(url) {
	$('#numeritos').hide();
	$('#numeritos').load(url);
	$('#numeritos').fadeIn();
	$('#numeritosatras').fadeIn();
	$("html, body").animate({
		scrollTop: $('.rowg').offset().top  
	}, 1500);
}

/////////// Función para cargar una agenda desde una misión //////

function agendanum() {
	laurl = $('#agendanum').attr('rel');
	$('#numeritos').hide();
	$('#numeritos').load(laurl);
	$('#numeritos').fadeIn();
	$('#numeritosatras').fadeIn();
	$("html, body").animate({
		scrollTop: $('.rowg').offset().top  
	}, 1500);
}



///////////// EVENTOS CON EL DEDO ///////////////
			
			
$('.flechita1').on('click',function(){
	pasitopatras();
});
			
$('.flechita2').on('click',function(){
	pasitopalante();
});
$('#numeritosatras, #ga').on('click',function(){
	$('#numeritos').load('n/numeratis.html');
	$('#numeritosatras').fadeOut();
	$("html, body").animate({
		scrollTop: $('.rowg').offset().top  
	}, 1500);
});
$('#contador').on('click',function(){
	$(this).fadeOut();
});
		

$('.col2').touchSwipe(suaIp, true);
function suaIp(direccion) {
	if (direccion == 'right') {
		pasitopatras();
	}
	if (direccion == 'left') {
		pasitopalante();
	}
}


// EMPIEZA EL BAILE

document.addEventListener("deviceready", nosPonemosseriasempiezaelbaile, false);

function nosPonemosseriasempiezaelbaile() {
	var sonidito = new Media("/android_asset/www/s/gila.mp3");
	sonidito.play();
	traerMisiones();
	$('#numeritos').load('n/numeratis.html');
}
