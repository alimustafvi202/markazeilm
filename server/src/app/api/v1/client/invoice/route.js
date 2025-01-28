import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import Client from "@/models/client";
import Income from "@/models/income";
import Invoice from "@/models/invoice";
import Product from "@/models/gig";
import SaleProduct from "@/models/sale_gig";
import resError from "@/utils/resError";
import { sendMail } from "@/utils/sendMail";
import { NextResponse } from "next/server";

const support_email = process.env.SUPPORT_EMAIL;

// 47.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Invoice.find({
      companyId: authData?.data?.companyId?._id,
    })
      .populate({
        path: "invoiceBy",
        select: "-password",
        populate: {
          path: "personalInfo",
          model: "PersonalInfo",
        },
      })
      .populate({
        path: "items",
        model: "SaleProduct",
        populate: {
          path: "productId",
          model: "Product",
        },
      })
      .populate({
        path: "clientId",
        populate: [
          {
            path: "personalInfo",
            model: "PersonalInfo",
          },
        ],
      });

    if (data.length == 0) {
      return resError(`No invoice was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 48.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const {
      clientId,
      issueDate,
      items,
      dueDate,
      status,
      tax,
      discount,
      paidAmount,
      notes,
    } = await req.json();

    if (
      !issueDate ||
      !dueDate ||
      !clientId ||
      !status ||
      !tax ||
      !discount ||
      items.length === 0
    ) {
      return resError("One or more required fields are missing.");
    }

    let client = await Client.findById(clientId)
      .populate({
        path: "personalInfo",
      });
    if (!client) {
      return resError("Client was not found against id: " + clientId);
    }
    const companyId = authData?.data?.companyId?._id;

    const invoices = await Invoice.find({ companyId });
    let invoiceNo = 1000 + invoices.length;
    let invoiceDup = await Invoice.findOne({ invoiceNo });
    do {
      invoiceDup = await Invoice.findOne({ invoiceNo: `${++invoiceNo}` });
    } while (invoiceDup);



    let invoice = await Invoice.create({
      companyId,
      invoiceBy: authData?.data?._id,
      clientId,
      issueDate,
      dueDate,
      status,
      tax,
      discount,
      invoiceNo,
      notes,
    });

    invoice = await Invoice.findById(invoice?._id);
    let itemsIds = [];

    itemsIds = await Promise.all(
      items.map(async (item) => {
        let product = await Product.findById(item?.productId);
        if (!product) {
          return resError(
            `Product was not found against id: `,
            item?.productId
          );
        }
        const sale_product = await SaleProduct.create({
          invoiceId: invoice?._id,
          productId: product?._id,
          companyId,
          quantity: item?.quantity,
          salePrice: product?.price,
        });
        return sale_product._id; 
      })
    );

    invoice.items = itemsIds;
    const soldItems = await SaleProduct.find({
      _id: { $in: itemsIds }
    });

    const calculateSubtotal = () => {
      return soldItems.reduce(
        (total, item) => total + item.salePrice * item.quantity, 0
      );
    };

    const subtotal = calculateSubtotal();
    const taxAmount = subtotal * (tax / 100);
    const discountAmount = subtotal * (discount / 100);
    const totalAmount = subtotal + taxAmount - discountAmount;
    invoice.totalAmount = totalAmount;
    invoice.paidAmount = paidAmount;
    await invoice.save();

    const income = await Income.create({
      invoiceId: invoice?._id,
      companyId,
      addedBy: authData?.data?._id,
      notes: `From Invoice`,
      type: "invoice",
      totalAmount,
      status,
      date: Date.now(),
    });
    const updatedData = await Invoice.findById(invoice?._id)
    .populate({
      path: "invoiceBy",
      select: "-password",
      populate: {
        path: "personalInfo",
        model: "PersonalInfo",
      },
    })
    .populate({
      path: "clientId",
      populate: [
        {
          path: "personalInfo",
          model: "PersonalInfo",
        },
      ],
    }).populate({
      path: "items",
      model: "SaleProduct",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    let mailData = {
      email: client?.email,
      about: client?.about,
      firstName: client?.personalInfo?.firstName,
      lastName: client?.personalInfo?.lastName,
      items: updatedData?.items,
      invoice,
      taxAmount,
      discountAmount,
      subtotal,
      subject: `Invoive Generated | Company Name | Nigotis`,
    };

    await sendMailToCustomer(mailData);
   
    return NextResponse.json(
      {
        success: true,
        message: "Invoice has been generated.",
        data: updatedData,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 49.
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }
    console.log(subscriptionCheckData);

    const {
      invoiceId,
      issueDate,
      dueDate,
      status,
      tax,
      discount,
      totalAmount,
      paidAmount,
    } = await req.json();

    let invoice = await Invoice.findById(invoiceId).populate({
      path: "items",
      model: "SaleProduct",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!invoice) {
      return resError(`Invoice was not found against id: `, invoiceId);
    }

    let client = await Client.findById(invoice?.clientId)
      .populate({
        path: "personalInfo",
      });
    if (!client) {
      return resError("Client was not found against id: " + invoice?.clientId);
    }

    invoice.issueDate = issueDate || invoice.issueDate;
    invoice.dueDate = dueDate || invoice.dueDate;
    invoice.status = status || invoice.status;
    invoice.tax = tax || invoice.tax;
    invoice.discount = discount || invoice.discount;
    invoice.totalAmount = totalAmount || invoice.totalAmount;
    invoice.paidAmount = paidAmount || invoice.paidAmount;

    let income = await Income.findOne({ invoiceId });
    if (!income) {
      return resError("no income was found.");
    }
    if (status === "paid" && invoice.status === "paid") {
      income.status = status;
    } else {
      invoice.status = "pending";
    }
    income.totalAmount = invoice.totalAmount;
    await income.save();
    await invoice.save();

    let mailData = {
      email: client?.email,
      about: client?.about,
      firstName: client?.personalInfo?.firstName,
      lastName: client?.personalInfo?.lastName,
      items: invoice?.items,
      invoice,
      subject: `Invoive Updated | Company Name | Nigotis`,
    };

    await sendMailToCustomer(mailData);

    return NextResponse.json(
      {
        success: true,
        message: "Invoice has been updated.",
        data: invoice,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 50.
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }
  


    const { invoiceId } = await req.json();

    let invoice = await Invoice.findByIdAndDelete(invoiceId).populate({
      path: "items",
      model: "SaleProduct",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!invoice) {
      return resError(`Invoice was not found against id: ` + invoiceId);
    }

    const deletedIncome = await Income.findOneAndDelete({
      invoiceId,
    });

    if (deletedIncome) {
      console.log(
        `Income with clientId ${invoice?.clientId} was successfully deleted.`
      );
    } else {
      console.log(`No Income found with invoice id ${invoiceId}.`);
    }
    
    invoice?.items.map(async (item) => {
      await SaleProduct.findByIdAndDelete(item._id);
    });

    return NextResponse.json({
      success: true,
      message: "Invoice has been deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}

async function sendMailToCustomer(data) {
  try {
    const mailBody = `
  <br>Hi <b>${data?.firstName}!</b>
  
  <br><br>Thank you for your order. Below are the details of your invoice:
  <br>Invoice #: ${data?.invoice?.invoiceNo}
  <br>Additional Notes: ${data?.invoice?.notes}
  <br>
  <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantity</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Unit Price</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total Price</th>
    </tr>
    ${data?.items
      .map(
        (item) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            item.productId.name
          }</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            item.productId.desc
          }</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
            item.quantity
          }</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${Number(
            item.salePrice
          ).toFixed(2)}</td>
           <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${(
             Number(item.salePrice) * Number(item.quantity)
           ).toFixed(2)}</td>
        </tr>`
      )
      .join("")}
    <tr style="background-color: #f9f9f9; font-weight: bold;">
      <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Subtotal</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${data?.subtotal.toFixed(
        2
      )}</td>
    </tr>
    <tr style="background-color: #f9f9f9; font-weight: bold;">
      <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tax (${
        data?.invoice?.tax
      }%)</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${data?.taxAmount.toFixed(
        2
      )}</td>
    </tr>
    <tr style="background-color: #f9f9f9; font-weight: bold;">
      <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Discount (${
        data?.invoice?.discount
      }%)</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">-$${data?.discountAmount.toFixed(
        2
      )}</td>
    </tr>
    <tr style="background-color: #f2f2f2; font-weight: bold;">
      <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${Number(
        data?.invoice?.totalAmount
      ).toFixed(2)}</td>
    </tr>
  </table>
  <br>
  <strong>Invoice Details:</strong>
  <ul>
    <li><b>Issue Date:</b> ${new Date(
      data?.invoice?.issueDate
    ).toLocaleDateString()}</li>
    <li><b>Due Date:</b> ${new Date(
      data?.invoice?.dueDate
    ).toLocaleDateString()}</li>
    <li><b>Status:</b> ${data?.invoice?.status}</li>
  </ul>
  <br>If you need any further information, feel free to reach out to us at <a href="mailto:${support_email}">${support_email}</a>.
<br><br>Best Regards, <br>Nigotis
`;

    const result = await sendMail(data?.email, data.subject, mailBody);
    return result;
  } catch (error) {
    console.error(error);
  }
}
