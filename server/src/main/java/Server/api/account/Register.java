package Server.api.account;

import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import Server.Server;
import Server.db.Database;
import Server.db.Hash;
import Server.mail.Mail;

@Path(Account.BASE_PATH + "/" + Account.REGISTER_PATH)
public class Register {

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response post(@HeaderParam(Account.EMAIL_HEADER) String email,
			@HeaderParam(Account.PASSWORD_HEADER) String password) {
		if (!Database.hasConnection()) {
			return Response.status(Status.SERVICE_UNAVAILABLE).build();
		}
		AccountObject acc = Account.getAccount(email);
		if (acc != null) {
			Account.clearUserTokens(acc.id);
			return Response.status(Status.CONFLICT).build();
		}
		if (!validEmail(email)) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if (!Account.validPassword(password)) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		if (!createUser(email, password)) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		return Response.ok().build();
	}

	private static boolean createUser(String email, String password) {
		String token = Hash.randomToken();
		String hash = Hash.createHash(password);
		if (Database.insertAccount(email, hash, false) == null) {
			return false;
		}
		AccountObject acc = Account.getAccount(email);
		boolean success = Database.insertToken("verify_token", acc.id, token, "DATE_ADD(NOW(), INTERVAL "
				+ Account.VERIFY_TOKEN_TIMEOUT_AMOUNT + " " + Account.VERIFY_TOKEN_TIMEOUT_INTERVAL + ")") != null;
		return success && sendVerifyEmail(email, token);
	}

	private static boolean sendVerifyEmail(String email, String token) {
		String url = Server.PROTOCOL + "://" + Server.HOST + ":" + Server.PORT_FRONTEND + "/"
				+ Server.VERIFY_PATH_FRONTEND + "/" + token;
		return Mail.sendVerifyMail(email, url);
	}

	private boolean validEmail(String email) {
		return email.length() < 255; // apache commons for regex?
	}
}
