const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Method not allowed. Use POST.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        },
      )
    }

    const requestBody = await req.json()
    const { to, subject, html, reservationData } = requestBody

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: to, subject, and html are required' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Get Resend API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured. Please contact support.',
          details: 'RESEND_API_KEY environment variable is not set'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // In testing mode, Resend only allows sending to verified email addresses
    // For now, we'll send all emails to the business email and include customer info in the email
    const isTestingMode = true; // Set to false once you verify a domain
    const businessEmail = '888rentalcars@gmail.com';
    
    let finalRecipient = to;
    let finalSubject = subject;
    let finalHtml = html;
    
    if (isTestingMode) {
      // Send to business email instead, but include customer details in the email
      finalRecipient = businessEmail;
      finalSubject = `[CUSTOMER COPY] ${subject} - For: ${to}`;
      
      // Add a header to the email explaining this is a copy
      const testingHeader = `
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
          <h3 style="color: #92400e; margin: 0 0 10px 0;">📧 Testing Mode - Customer Copy</h3>
          <p style="margin: 0; color: #92400e;">
            <strong>This email was intended for:</strong> ${to}<br>
            <strong>Reason:</strong> Resend is in testing mode. Once domain is verified, emails will be sent directly to customers.
          </p>
        </div>
      `;
      
      finalHtml = testingHeader + html;
    }

    // Prepare email data for Resend API
    const emailData = {
      from: '888Rent <onboarding@resend.dev>',
      to: [finalRecipient],
      subject: finalSubject,
      html: finalHtml
    }

    console.log('Sending email to:', finalRecipient)
    console.log('Original recipient:', to)
    console.log('Email subject:', finalSubject)
    console.log('Testing mode:', isTestingMode)

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', JSON.stringify(result, null, 2))
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Email service error: ${result.message || 'Unknown error'}`,
          details: result
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        },
      )
    }

    console.log('Email sent successfully via Resend:', {
      emailId: result.id,
      originalRecipient: to,
      actualRecipient: finalRecipient,
      testingMode: isTestingMode
    })
    
    if (reservationData) {
      console.log('Reservation details:', {
        reservationId: reservationData.reservationId,
        customerName: reservationData.customerName,
        carName: reservationData.carName,
        totalAmount: reservationData.totalAmount
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isTestingMode 
          ? `Email sent to business email (${businessEmail}) - Testing mode active`
          : 'Email sent successfully to customer',
        emailId: result.id,
        emailSent: true,
        testingMode: isTestingMode,
        actualRecipient: finalRecipient
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        details: 'An unexpected error occurred while sending the email'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})