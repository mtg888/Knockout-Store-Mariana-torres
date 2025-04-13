function filtrarProductos() {
    var categoriaSeleccionada = document.getElementById('filtro-categoria').value;
    var productos = document.querySelectorAll('.producto');

    productos.forEach(function(producto) {
        var categoriaProducto = producto.getAttribute('data-categoria');
        
        if (categoriaSeleccionada === 'todos' || categoriaProducto === categoriaSeleccionada) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

function agregarAlCarrito(nombre, precio) {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    var productoExistente = carrito.find(function(item) {
        return item.nombre === nombre;
    });

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    var contador = 0;
    var total = 0;

    carrito.forEach(function(item) {
        contador += item.cantidad;
        total += item.precio * item.cantidad;
    });

    document.getElementById('contador-carrito').textContent = contador;
    document.getElementById('total-carrito').textContent = total;

    var listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';

    carrito.forEach(function(item) {
        var li = document.createElement('li');
        li.textContent = item.nombre + ' - $' + item.precio + ' x ' + item.cantidad;
        listaCarrito.appendChild(li);
    });

    if (total > 0) {
        document.getElementById('boton-comprar').style.display = 'inline';
    } else {
        document.getElementById('boton-comprar').style.display = 'none';
    }
}

function mostrarCarrito() {
    document.getElementById('carrito-popup').style.display = 'block';
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    actualizarCarrito();
}

function cerrarCarrito() {
    document.getElementById('carrito-popup').style.display = 'none';
}

function finalizarCompra() {
    alert('Gracias por tu compra!');
    vaciarCarrito();
}

// Inicialización de PayPal
function cargarPayPal() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: document.getElementById('total-carrito').textContent
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Gracias por tu compra, ' + details.payer.name.given_name + '!');
                vaciarCarrito();
                cerrarCarrito();
            });
        }
    }).render('#paypal-button-container');
}

// Cargar el SDK de PayPal
const paypalScript = document.createElement('script');
paypalScript.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=USD";
paypalScript.onload = cargarPayPal;
document.body.appendChild(paypalScript);

// Inicializar carrito al cargar la página
actualizarCarrito();
