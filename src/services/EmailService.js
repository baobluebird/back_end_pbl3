const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email,orderItems,createdOrder, newOrder) => {
  const {fullName , addressUser, phone, noteUser, shippingMethod, addressShipping, cityShipping,addressShop,cityShop, noteShipping} = newOrder
  const phuongThuc = shippingMethod === 'nhan tai cua hang' ? "Nhận tại cửa hàng" : "Giao hàng tận nơi"
  const noteU = noteUser === null ? noteUser : "Không có"
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));

  let listItem = '';
  
  const attachImage = []
  orderItems.forEach((order) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá là: <b>${order.new_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </b></div>
      <div><b>Phiếu giảm giá: ${order.discount}%</b></div>
    </div>`
    attachImage.push({path: order.image})
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Bạn đã đặt hàng tại shop PBL3", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công tại shop PBL3</b></div>
    <div><b>Thông tin người đặt hàng:</b> ${fullName}, ${addressUser}, ${phone}, ${noteU}</div>
    <div><b>Phương thức nhận hàng: ${phuongThuc}</b></div>
    <div><b>Phí vận chuyển (nếu có): ${createdOrder.shippingPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
    <div><b>Tổng tiền: ${(createdOrder.totalPrice + createdOrder.shippingPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
     ${listItem}
     <div>Bên dưới là hình ảnh của sản phẩm</div>
     `,
    attachments: attachImage, 
  });
}

module.exports = {
  sendEmailCreateOrder
}