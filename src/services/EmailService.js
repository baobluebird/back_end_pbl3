const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email,orderItems,orderData,paymentMethod, delivery, isPaid, Payment) => {

  const phuongThuc = orderData.shippingMethod === 'nhan tai cua hang' ? "Nhận tại cửa hàng" : "Giao hàng tận nơi"
  const noteU = orderData.noteUser === null ? orderData.noteUser : ""

  const diachi = orderData.shippingMethod === 'nhan tai cua hang' ? orderData.shopAddress.addressShop : orderData.shippingAddress.addressShipping
  const city = orderData.shippingMethod === 'nhan tai cua hang' ? orderData.shopAddress.cityShop : orderData.shippingAddress.cityShipping
  const noteship = orderData.shippingMethod === 'nhan tai cua hang' ? orderData.shopAddress.noteShipping : orderData.shippingAddress.noteShipping
  const ghichu = noteship === null ? noteship : "Không có"
  const paid = isPaid === true ? "Đã thanh toán" : "Chưa thanh toán"
  const donvivanchuyen = orderData.shippingMethod === 'nhan tai cua hang' ? null : delivery
  const cachnhanhang = paymentMethod === 'thanh toan khi nhan hang' ? "Thanh toán khi nhận hàng" : "Thanh toán qua Paypal"

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
    <div><b>Thông tin người đặt hàng:</b> ${orderData.name}, ${orderData.addressUser}, ${orderData.phone}, ${noteU}</div>
    <div><b>Phương thức nhận hàng: ${phuongThuc}</b></div>
    <div><b>Địa chỉ nhận hàng: ${diachi} , ${city}</b></div>
    <div><b>Ghi chú nhận hàng: ${ghichu}</b></div>
    <div><b>Mã giảm giá (nếu có): ${Payment.coupon.couponPrice}%</b></div>
    <div><b>Phí vận chuyển (nếu có): ${Payment.shippingPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
    <div><b>Đơn vị vận chuyển (nếu có): ${donvivanchuyen}</b></div>
    ${listItem}
    <div><b>Tổng tiền: ${(Payment.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
    <div><b>Phương thức thanh toán: ${cachnhanhang}</b></div>
    <div><b>Trạng thái thanh toán: ${paid}</b></div>
     <div>Bên dưới là hình ảnh của sản phẩm</div>
     `,
    attachments: attachImage, 
  });
}

module.exports = {
  sendEmailCreateOrder
}