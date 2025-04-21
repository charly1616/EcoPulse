import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // o 587
    secure: true, // true para 465, false para 587
    auth: {
      user: "dummycharlyb@gmail.com",
      pass: "agicuhgbovgjfhdd",
    },
  });

export const sendConfirmationEmail = async (recipients, endpoint, companame) => {
    const toList = Array.isArray(recipients) ? recipients.join(',') : recipients;
    const mailOptions = {
      from: 'dummycharlyb@gmail.com',
      to: toList,
      subject: 'Confirmación de CharlyRegistro para ' + companame,
      text: '¡Gracias por registrarte! Tu cuenta al proyecto de charly ha sido creada con éxito.',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto;">
              <h2 style="color: #333;">¡Confirma tu cuenta!</h2>
              <p>Gracias por registrarte a EcoPulse. Para activar tu cuenta, haz clic en el botón de abajo:</p>
              <a href="${endpoint}"
                style="display: inline-block; padding: 12px 24px; background-color:rgb(255, 87, 65); color: white; 
                text-decoration: none; border-radius: 5px; font-weight: bold;">
                Confirmar cuenta
              </a>
              <p style="margin-top: 20px; font-size: 12px; color: #777;">
                Si no fuiste tú quien solicitó esta cuenta, puedes ignorar este mensaje.
              </p>
            </div>
          </body>
        </html>`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado exitosamente:', info.response);
      return info;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
};