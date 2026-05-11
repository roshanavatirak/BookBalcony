/**
 * Invoice PDF Generator using jsPDF
 * Generates professional invoices for BookBalcony orders
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate and download invoice PDF for an order
 * @param {Object} order - The order object with all details
 */
export const generateInvoicePDF = (order) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Color scheme matching the theme
    const primaryColor = [250, 204, 21]; // Yellow-400
    const darkBg = [24, 24, 27]; // Zinc-900
    const textColor = [244, 244, 245]; // Zinc-100
    const accentColor = [161, 161, 170]; // Zinc-400

    // Add background (light version for printing)
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // ========================================
    // HEADER SECTION
    // ========================================
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Company Logo/Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text('BookBalcony', 15, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Your Literary Haven', 15, 27);

    // Invoice Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', pageWidth - 15, 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice #: ${order._id.substring(0, 12).toUpperCase()}`, pageWidth - 15, 27, { align: 'right' });

    // ========================================
    // COMPANY & ORDER INFO SECTION
    // ========================================
    let yPos = 50;
    
    // Company Information (Left)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('From:', 15, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text('BookBalcony Pvt. Ltd.', 15, yPos + 6);
    doc.text('123 Literary Lane, Book District', 15, yPos + 12);
    doc.text('Nagpur, Maharashtra - 440001', 15, yPos + 18);
    doc.text('India', 15, yPos + 24);
    doc.text('GSTIN: 27AABCU9603R1ZX', 15, yPos + 30);
    doc.text('Email: support@bookbalcony.com', 15, yPos + 36);
    doc.text('Phone: 1800-XXX-XXXX', 15, yPos + 42);

    // Order Information (Right)
    const rightCol = pageWidth - 75;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    // Order Date
    doc.text('Order Date:', rightCol, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(formatDate(order.createdAt), rightCol + 25, yPos);
    
    // Payment Method
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Payment:', rightCol, yPos + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(order.paymentMethod, rightCol + 25, yPos + 8);
    
    // Payment Status
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Status:', rightCol, yPos + 16);
    doc.setFont('helvetica', 'normal');
    const statusColor = order.paymentStatus === 'Success' ? [34, 197, 94] : 
                        order.paymentStatus === 'Pending' ? [234, 179, 8] : [239, 68, 68];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(order.paymentStatus, rightCol + 25, yPos + 16);
    
    // Expected Delivery
    if (order.expectedDeliveryDate || order.deliveryDate) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Expected:', rightCol, yPos + 24);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(formatDate(order.expectedDeliveryDate || order.deliveryDate), rightCol + 25, yPos + 24);
    }

    // ========================================
    // SHIPPING ADDRESS SECTION
    // ========================================
    yPos += 55;
    
    // Draw box around shipping address
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(15, yPos - 5, pageWidth - 30, 45, 'S');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Ship To:', 20, yPos + 2);
    
    if (order.shippingAddress) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      
      let shipY = yPos + 9;
      doc.setFont('helvetica', 'bold');
      doc.text(order.shippingAddress.fullName, 20, shipY);
      
      doc.setFont('helvetica', 'normal');
      doc.text(order.shippingAddress.addressLine1, 20, shipY + 6);
      
      if (order.shippingAddress.addressLine2) {
        doc.text(order.shippingAddress.addressLine2, 20, shipY + 12);
        shipY += 6;
      }
      
      doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`, 20, shipY + 12);
      doc.text(order.shippingAddress.country || 'India', 20, shipY + 18);
      doc.text(`Phone: ${order.shippingAddress.phone}`, 20, shipY + 24);
    }

    // ========================================
    // ITEMS TABLE
    // ========================================
    yPos += 55;
    
    const tableData = [];
    
    if (order.book) {
      tableData.push([
        '1',
        order.book.title || 'Book',
        order.book.author || 'N/A',
        `₹${(order.book.price || order.amountPayable).toFixed(2)}`,
        '1',
        `₹${(order.book.price || order.amountPayable).toFixed(2)}`
      ]);
    }

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Book Title', 'Author', 'Price', 'Qty', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [250, 204, 21],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [60, 60, 60]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { halign: 'right', cellWidth: 25 },
        4: { halign: 'center', cellWidth: 20 },
        5: { halign: 'right', cellWidth: 25 }
      },
      margin: { left: 15, right: 15 }
    });

    // ========================================
    // PRICING SUMMARY
    // ========================================
    yPos = doc.lastAutoTable.finalY + 15;
    
    const summaryX = pageWidth - 80;
    const summaryLabelX = summaryX;
    const summaryValueX = pageWidth - 20;
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    
    // Subtotal
    doc.text('Subtotal:', summaryLabelX, yPos);
    doc.text(`₹${(order.book?.price || order.amountPayable).toFixed(2)}`, summaryValueX, yPos, { align: 'right' });
    
    // Discount
    if (order.discount && order.discount > 0) {
      yPos += 7;
      doc.setTextColor(34, 197, 94); // Green for discount
      doc.text('Discount:', summaryLabelX, yPos);
      doc.text(`-₹${order.discount.toFixed(2)}`, summaryValueX, yPos, { align: 'right' });
      doc.setTextColor(60, 60, 60);
    }
    
    // Handling Fee
    if (order.handlingFee && order.handlingFee > 0) {
      yPos += 7;
      doc.text('Handling Fee:', summaryLabelX, yPos);
      doc.text(`₹${order.handlingFee.toFixed(2)}`, summaryValueX, yPos, { align: 'right' });
    }
    
    // Delivery Charges
    yPos += 7;
    doc.setTextColor(34, 197, 94); // Green for free delivery
    doc.text('Delivery Charges:', summaryLabelX, yPos);
    doc.text('FREE', summaryValueX, yPos, { align: 'right' });
    
    // Draw line before total
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(summaryLabelX, yPos, summaryValueX, yPos);
    
    // Total
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Total Amount:', summaryLabelX, yPos);
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94);
    doc.text(`₹${order.amountPayable.toFixed(2)}`, summaryValueX, yPos, { align: 'right' });

    // ========================================
    // ORDER STATUS SECTION
    // ========================================
    yPos += 15;
    
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos, pageWidth - 30, 25, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Order Status:', 20, yPos + 8);
    
    doc.setFont('helvetica', 'normal');
    const orderStatusColor = order.orderStatus === 'Delivered' ? [34, 197, 94] :
                             order.orderStatus === 'Cancelled' ? [239, 68, 68] :
                             [250, 204, 21];
    doc.setTextColor(orderStatusColor[0], orderStatusColor[1], orderStatusColor[2]);
    doc.text(order.orderStatus, 60, yPos + 8);
    
    if (order.currentLocation && order.orderStatus !== 'Cancelled') {
      doc.setTextColor(60, 60, 60);
      doc.text(`Location: ${order.currentLocation}`, 20, yPos + 16);
    }

    // ========================================
    // TRACKING HISTORY (if available)
    // ========================================
    if (order.trackingHistory && order.trackingHistory.length > 0) {
      yPos += 35;
      
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Tracking History:', 15, yPos);
      
      yPos += 8;
      
      // Create tracking history table
      const trackingData = order.trackingHistory.slice().reverse().slice(0, 5).map((track, index) => [
        formatDate(track.date),
        track.status,
        track.location,
        track.notes || '-'
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Date', 'Status', 'Location', 'Notes']],
        body: trackingData,
        theme: 'striped',
        headStyles: {
          fillColor: [250, 204, 21],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [60, 60, 60]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 75 }
        },
        margin: { left: 15, right: 15 }
      });
      
      yPos = doc.lastAutoTable.finalY + 10;
    }

    // ========================================
    // FOOTER SECTION
    // ========================================
    const footerY = pageHeight - 30;
    
    // Footer background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, footerY - 5, pageWidth, 35, 'F');
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);
    
    // Terms and conditions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('Terms & Conditions:', 15, footerY + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('1. This is a computer-generated invoice and does not require a signature.', 15, footerY + 13);
    doc.text('2. All disputes are subject to jurisdiction of Nagpur courts only.', 15, footerY + 17);
    doc.text('3. For support, contact us at support@bookbalcony.com or call 1800-XXX-XXXX', 15, footerY + 21);
    
    // Thank you message
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(10);
    doc.setTextColor(250, 204, 21);
    doc.text('Thank you for shopping with BookBalcony!', pageWidth / 2, footerY + 28, { align: 'center' });

    // ========================================
    // SAVE PDF
    // ========================================
    const fileName = `BookBalcony_Invoice_${order._id.substring(0, 8)}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };
    
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if invoice is available for download
 * Invoice is available after payment is successful
 */
export const isInvoiceAvailable = (order) => {
  if (!order) return false;
  
  // Invoice is available if:
  // 1. Payment status is Success (for online payments)
  // 2. Order is placed (for COD orders)
  // 3. Order is not cancelled
  
  const validStatuses = ['Success', 'Pending']; // Pending for COD
  const notCancelled = order.orderStatus !== 'Cancelled';
  
  return validStatuses.includes(order.paymentStatus) && notCancelled;
};

/**
 * Format date to readable string
 */
const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};