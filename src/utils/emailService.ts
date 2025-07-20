import { supabase } from '../lib/supabase';
import { Reservation, Car } from '../types';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  reservationData?: any;
}

export const sendReservationConfirmation = async (
  reservation: Reservation,
  car: Car
): Promise<boolean> => {
  try {
    const emailHtml = generateReservationEmailHTML(reservation, car);
    
    const emailData: EmailData = {
      to: reservation.email,
      subject: `Reservation Submission - 888Rent (${car.name})`,
      html: emailHtml,
      reservationData: {
        reservationId: reservation.id,
        carName: car.name,
        customerName: reservation.fullName,
        pickupDate: reservation.pickupDate,
        pickupTime: reservation.pickupTime,
        pickupLocation: reservation.pickupLocation,
        dropoffDate: reservation.dropoffDate,
        dropoffTime: reservation.dropoffTime,
        dropoffLocation: reservation.dropoffLocation,
        totalAmount: reservation.totalPrice
      }
    };

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('Error in sendReservationConfirmation:', error);
    return false;
  }
};

const baseUrl = 'https://888rentcar.com'; 

const generateReservationEmailHTML = (reservation: Reservation, car: Car): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reservation Submission - 888Rent</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #ef4444;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #000;
                margin-bottom: 10px;
            }
            .logo .red {
                color: #ef4444;
            }
            .confirmation-number {
                background-color: #ef4444;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                margin: 20px 0;
            }
            .details-section {
                margin: 25px 0;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 8px;
            }
            .details-section h3 {
                color: #ef4444;
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 18px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-bottom: 8px;
                border-bottom: 1px solid #eee;
            }
            .detail-row:last-child {
                border-bottom: none;
                font-weight: bold;
                font-size: 18px;
                color: #ef4444;
            }
            .car-image {
                width: 100%;
                max-width: 400px;
                height: 200px;
                object-fit: cover;
                border-radius: 8px;
                margin: 15px 0;
            }
            .important-info {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .contact-info {
                background-color: #e5f3ff;
                padding: 20px;
                border-radius: 8px;
                margin-top: 30px;
                text-align: center;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <span class="red">888</span>Rent
                </div>
                <h2>Reservation Submission</h2>
                <div class="confirmation-number">
                    Confirmation #: ${reservation.id.slice(-8).toUpperCase()}
                </div>
            </div>

            <p>Dear ${reservation.fullName},</p>
            
            <p>Thank you for choosing 888Rent! Your car reservation has been sent. You will receive another email for confirmation. Below are the details of your booking:</p>

            <div class="details-section">
                <h3>🚗 Vehicle Information</h3>
                <div class="detail-row">
                    <span>Vehicle:</span>
                    <span><strong>${car.name}</strong></span>
                </div>
                <div class="detail-row">
                    <span>Year:</span>
                    <span>${car.year}</span>
                </div>
                <div class="detail-row">
                    <span>Engine:</span>
                    <span>${car.engine}</span>
                </div>
                <div class="detail-row">
                    <span>Transmission:</span>
                    <span>${car.transmission}</span>
                </div>
                <div class="detail-row">
                    <span>Fuel Type:</span>
                    <span>${car.fuel}</span>
                </div>
            </div>

            <div class="details-section">
                <h3>📅 Rental Period</h3>
                <div class="detail-row">
                    <span>Pickup Date:</span>
                    <span><strong>${new Date(reservation.pickupDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</strong></span>
                </div>
                <div class="detail-row">
                    <span>Pickup Time:</span>
                    <span><strong>${reservation.pickupTime}</strong></span>
                </div>
                <div class="detail-row">
                    <span>Dropoff Date:</span>
                    <span><strong>${new Date(reservation.dropoffDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</strong></span>
                </div>
                <div class="detail-row">
                    <span>Dropoff Time:</span>
                    <span><strong>${reservation.dropoffTime}</strong></span>
                </div>
            </div>

            <div class="details-section">
                <h3>📍 Location Details</h3>
                <div class="detail-row">
                    <span>Pickup Location:</span>
                    <span><strong>${reservation.pickupLocation}</strong></span>
                </div>
                <div class="detail-row">
                    <span>Dropoff Location:</span>
                    <span><strong>${reservation.dropoffLocation}</strong></span>
                </div>
            </div>

            <div class="details-section">
                <h3>💰 Payment Summary</h3>
                <div class="detail-row">
                    <span>Daily Rate:</span>
                    <span>€${car.price}</span>
                </div>
                <div class="detail-row">
                    <span>Total Amount:</span>
                    <span>€${reservation.totalPrice}</span>
                </div>
            </div>

            <div class="important-info">
                <h4>📋 Important Information:</h4>
                <ul>
                    <li>Please bring a valid driver's license and ID</li>
                    <li>Arrive 15 minutes before your pickup time</li>
                    <li>Vehicle inspection will be conducted at pickup and return</li>
                    <li>Full insurance coverage is included</li>
                    <li>24/7 roadside assistance available</li>
                </ul>
            </div>

            <div class="contact-info">
                <h3>📞 Contact Information</h3>
                <p><strong>Phone:</strong> +355 69 386 1363</p>
                <p><strong>Email:</strong> 888rentalcars@gmail.com</p>
                <p><strong>Emergency:</strong> Available 24/7</p>
            </div>

            <p>We look forward to serving you and hope you have an excellent experience with 888Rent!</p>

            <div class="footer">
                <p>This is an automated confirmation email from 888Rent.</p>
                <p>If you have any questions, please contact us at 888rentalcars@gmail.com</p>
                <p>&copy; 2024 888Rent - Premium Car Rental Services in Albania</p>
            </div>
        </div>
    </body>
    </html>
  `;
};