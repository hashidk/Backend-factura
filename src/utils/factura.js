const fs = require('fs');
const PDFDocument = require('pdfkit');


function generateHeader(doc, invoice) {
	doc.image("logos/"+invoice.empresa.image, 30, 15, { width: 100 })
		.fillColor('#444444')
		.fontSize(20)
		.text(invoice.empresa.empresa_nombre, 130, 57)
		.fontSize(10)
		.text(invoice.empresa.empresa_dir, 200, 55, { align: 'right' });

    doc.text(`${invoice.empresa.empresa_ciudad}, ${invoice.empresa.empresa_provincia}, ${invoice.empresa.empresa_pais}`, 200, 70, { align: 'right' }).moveDown();

    return 60
}

function generateFooter(doc, _y, margin_top = 80) {
    var x = 150
    var y = _y + margin_top
	doc.fontSize(30).text('Gracias',x,y+10)
    .fillColor('red').fontSize(12.5).text('CONDICIONES Y FORMAS DE PAGO',x+110,y)
    .fillColor('black').fontSize(10).text('El pago se realizará en un plazo de 15 días',x+110,y+20)
    .text('Banco de Mitad',x+110,y+31)
    .text('IBAN: ES12 3456 7891',x+110,y+42)
    .text('SWIFT/BIC: ABCDESM1XXX',x+110,y+53)
    .moveTo(x+105, y-10)                               // set the current point
    .lineTo(x+105, y+73)
    .stroke();
}

function generateCustomerInformation(doc, invoice, _y, margin_top = 80) {
    var y = margin_top + _y

	doc.fillColor('red').fontSize(12.5).text(`CAJER@`, 50, y)
        .fillColor('black').fontSize(10).text(invoice.vendedor.nombre+" "+invoice.vendedor.apellido, 50, y+15)

    doc.fillColor('red').fontSize(12.5).text(`ENVIAR A`, 200, y)
        .fillColor('black').fontSize(10).text(invoice.cliente.nombre+ " "+invoice.cliente.apellido, 200, y+15)
        .text(invoice.cliente.dir, 200, y+30, {width: 100})

	doc.fillColor('red').fontSize(10).text(`N° DE FACTURA: `, 350, y)
        .text(`FECHA:`, 350, y+15)
        .text(`FECHA VENCIMIENTO:`, 350, y+30)

    doc.fillColor('black').fontSize(10).text(`${invoice.invoicer_nr.slice(0, 8)}`, 350, y, {align: 'right'})
        .text(`${invoice.fecha.toLocaleDateString()}`, 350, y+15, {align: 'right'})
        .text(`${invoice.fecha.toLocaleDateString()}`, 350, y+30, {align: 'right'})
    return y+45
}

function generateTableRow(doc, y, c1, c2, c3, c4, c5, x1 = 45, x2= 555) {
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 150, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' })
        .moveTo(x1, y+15)                               // set the current point
        .lineTo(x2, y+15)
        .stroke() ;
}

function generateInvoiceTable(doc, invoice, _y, margin_top = 80) {
	let i;
    var position = 0, subtotal = 0, iva, total;
    var y = _y + margin_top

    generateTableRow(doc, y, "Item", "Descripción", "Costo unitario", "Cantidad", "Costo total")

	for (i = 0; i < invoice.productos.length; i++) {
		const item = invoice.productos[i];
		position = y + (i + 1) * 25;
        subtotal += item.precio * item.cantidad
		generateTableRow(
			doc,
			position,
			i+1,
			item.descripcion,
			parseFloat(item.precio).toFixed(2)+'$',
			item.cantidad,
			parseFloat(item.precio * item.cantidad).toFixed(2)+'$',
		);
	}

    iva = subtotal * 0.12
    total = subtotal * 1.12
    generateTableRow(doc, position + 30, "", "", "Subtotal", "", parseFloat(subtotal).toFixed(2)+'$', 300)
    generateTableRow(doc, position + 60, "", "", "IVA (12%)", "", parseFloat(iva).toFixed(2)+'$', 300)
    generateTableRow(doc, position + 90, "", "", "Total", "", parseFloat(total).toFixed(2)+'$', 300)

    return position + 90;
}

const invoice = {
    empresa: {
        name: "Wamyf Inc.",
        address: "O7-684, Av. 6 de Diciembre y Dávalos",
        city: "Quito",
        state: "Pichincha",
        country: "Ecuador",
        firma: "3221792fc09b9ad1bbf8700dea712ada1e6eba9d9958a18c4c4ee2da8c8304442a9c5abd54b42eb963405beed2d95338ec185eee5aa52135e63ed8f568eb38a0"
    },
    cliente: {
        firstname: "Roberto",
        lastname: "Pastaza",
        address: "N54-577, San Martín y Av. San Bartolo",
        city: "Quito",
        state: "Pichincha"
    },
    vendedor: {
        firstname: "Juan",
        lastname: "Salazar"
    },
    invoice_nr: "2315486",
    subtotal: 15.30,
    paid: 45,
    items: [
        {
            item: 1,
            descripcion: "Combo Pizza hat 2x1",
            precio: 10.50,
            cantidad: 2,
        },
        {
            item: 2,
            descripcion: "Gaseosa Coca cola",
            precio: 1.20,
            cantidad: 5,
        },
        {
            item: 3,
            descripcion: "Gaseosa Coca cola",
            precio: 1.20,
            cantidad: 5,
        },
        {
            item: 4,
            descripcion: "Gaseosa Coca cola",
            precio: 1.20,
            cantidad: 5,
        },
        {
            item: 1,
            descripcion: "Combo Pizza hat 2x1",
            precio: 10.50,
            cantidad: 2,
        }
    ],
    date: new Date()
}

function firma(doc, invoice, _y, margin_top = 80) {
    var y = margin_top + _y

	doc.fillColor('red').fontSize(12.5).text(`FIRMA DIGITAL`, 150, y)
        .fillColor('black').fontSize(10).text(invoice.empresa.firma, 150, y+20)

    return y + 20;
}

function crearFactura(invoice, path) {
	let doc = new PDFDocument({ margin: 50, size: 'A4' });
    var y = 0
	y = generateHeader(doc, invoice); // Invoke `generateHeader` function.
    y = generateCustomerInformation(doc, invoice, y)
    y = generateInvoiceTable(doc, invoice, y)
    y = firma(doc,invoice, y)
	generateFooter(doc, y, 120); // Invoke `generateFooter` function.
    
	doc.end();
	doc.pipe(fs.createWriteStream(path));
}

// createInvoice(invoice, "facturas/"+invoice.cliente.lastname + invoice.cliente.firstname + "_" +  invoice.date.toLocaleDateString().split("/").join("-")  + '_factura.pdf');

module.exports = crearFactura