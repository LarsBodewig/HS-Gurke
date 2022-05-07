package Server.mail;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;

import Server.Server;

public abstract class Mail {

	private static final String SMTP_HOST = "localhost";
	private static final int SMTP_PORT = 25;
	private static final String USER = "java@server.pp";
	private static final String PASSWORD = "java";
	private static final String FROM = "java@server.pp";

	public static void log(Exception exception) {
		exception.printStackTrace(Server.getLogStream());
	}
	
	public static boolean sendMail(String to, String subject, String htmlMsg) {
		HtmlEmail email = new HtmlEmail();
		email.setHostName(SMTP_HOST);
		email.setSmtpPort(SMTP_PORT);
		email.setAuthentication(USER, PASSWORD);
		try {
			email.setFrom(FROM);
			email.addTo(to);
			email.setSubject(subject);
			email.setHtmlMsg(htmlMsg);
			email.send();
		} catch (EmailException e) {
			log(e);
			return false;
		}
		return true;
	}

	public static boolean sendVerifyMail(String email, String url) {
		String subject = "Account verification";
		String html = "<html>"
						+ "<body>"
							+ "<a href=\"" + url + "\">Verify your account now.</a>"
						+ "</body>"
					+ "</html>";
		return sendMail(email, subject, html);
	}

	public static boolean sendSecurityMail(String email, String code) {
		String subject = "Your security code";
		String html = "<html>"
						+ "<body>"
							+ "<p>" + code + "</p>"
							+ "<p>Use this code to recover or terminate your account.</p>"
						+ "</body>"
					+ "</html>";
		return sendMail(email, subject, html);
	}

	public static boolean sendRecoverMail(String email, String code) {
		String subject = "Your password was set back";
		String html = "<html>"
						+ "<head>"
							+ "<style> blink { animation: blinker 0.6s linear infinite; color: #1c87c9; } @keyframes blinker {   50% { opacity: 0; } } .blink-one { animation: blinker-one 1s linear infinite; }  @keyframes blinker-one {    0% { opacity: 0; }  }  .blink-two { animation: blinker-two 1.4s linear infinite;  }  @keyframes blinker-two {   100% { opacity: 0; }  } </style>"
						+ "</head>"
						+ "<body>"
							+ "<p>" + code + "</p>"
							+ "<p>Use this <span class=\"blink-one\">new</span> code to recover or terminate your account.</p>"
						+ "</body>"
					+ "</html>";
		return sendMail(email, subject, html);
	}

	public static boolean sendTerminateMail(String email) {
		String subject = "Farewell";
		String html = "<html>"
						+ "<body>"
							+ "Your data was deleted."
						+ "</body>"
					+ "</html>";
		return sendMail(email, subject, html);
	}
}
