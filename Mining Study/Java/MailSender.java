package com.example.partyplanner.fireBaseServices;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * Written by our good friend chatGPT
 */
public class MailSender {

    private static final String FROM_EMAIL = "partyplannerdk@gmail.com";
    private static final String APP_SPECIFIC_PASSWORD = "isznshvcwlewebov";

    public static void sendEmail(String toEmail, String subject, String body) {
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(FROM_EMAIL, APP_SPECIFIC_PASSWORD);
                    }
                });


        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(FROM_EMAIL));
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(toEmail));
            message.setSubject(subject);
            message.setText(body);

            Transport.send(message);

            System.out.println("Mail succesfuldt sendt");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}

//Unit test


